import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { catchServiceAsync } from '../utils/catchServiceAsync';
import { sendTemplateEmail } from './emailService';
import { sendSMS } from './smsService';

const prisma = new PrismaClient();

// Single source of truth for JWT secrets — consistent across sign & verify
const JWT_SECRET = process.env.JWT_SECRET || 'ZEYO_access_secret_2026_please_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ZEYO_refresh_secret_2026_please_change_in_production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as string;
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string;
const LOGIN_LOG_MAX_ENTRIES = 50;

export class AuthService {
  static registerUser = catchServiceAsync(async (data: Prisma.UserCreateInput) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const dataToSave = { ...data };
    if (data.password) {
      dataToSave.password = await bcrypt.hash(data.password as string, 10);
    }

    if (dataToSave.dateOfBirth) {
      dataToSave.dateOfBirth = new Date(dataToSave.dateOfBirth as any);
    }

    const user = await prisma.user.create({
      data: dataToSave,
    });

    // Auto-create an empty UserProfile for new users
    await prisma.userProfile.create({
      data: { userId: user.id },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  static sendEmailVerification = catchServiceAsync(async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: hashedVerificationToken,
        emailVerificationExpires,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    await sendTemplateEmail(
      user.email,
      'Verify Your Email',
      'emailVerification',
      {
        name: user.name,
        appName: process.env.FROM_NAME || 'ZEYO',
        verificationLink,
        year: new Date().getFullYear(),
      }
    );

    return { message: 'Verification email sent' };
  });

  static verifyEmail = catchServiceAsync(async (token: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return { message: 'Email verified successfully' };
  });

  static sendPhoneVerification = catchServiceAsync(async (phone: string) => {
    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.phoneVerified) {
      return { message: 'Phone already verified' };
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedVerificationCode = crypto.createHash('sha256').update(verificationCode).digest('hex');
    const phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerificationToken: hashedVerificationCode,
        phoneVerificationExpires,
      },
    });

    await sendSMS(
      phone,
      `Your ${process.env.FROM_NAME || 'ZEYO'} verification code is ${verificationCode}. It expires in 10 minutes.`
    );

    return { message: 'Verification code sent to phone' };
  });

  static verifyPhone = catchServiceAsync(async (token: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        phoneVerificationToken: hashedToken,
        phoneVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerified: true,
        isVerified: true,
        phoneVerificationToken: null,
        phoneVerificationExpires: null,
      },
    });

    return { message: 'Phone verified successfully' };
  });

  // userId is Int (matches User.id SERIAL in DB)
  static getMe = catchServiceAsync(async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        fullName: true,
        email: true,
        phone: true,
        profileImage: true,
        role: true,
        roleId: true,
        userRole: {
          select: { id: true, name: true, description: true },
        },
        emailVerified: true,
        phoneVerified: true,
        isVerified: true,
        status: true,
        provider: true,
        issueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  });

  static loginUser = catchServiceAsync(async (email: string, passwordInput: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.password) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Sign access token — userId is Int
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );

    // Cap login log to last LOGIN_LOG_MAX_ENTRIES entries
    let loginLog: string[] = [];
    if (user.loginLog) {
      if (Array.isArray(user.loginLog)) {
        loginLog = user.loginLog as string[];
      } else if (typeof user.loginLog === 'string') {
        try {
          loginLog = JSON.parse(user.loginLog);
        } catch (e) {
          // Ignore parse errors — start fresh
          loginLog = [];
        }
      }
    }
    loginLog.push(new Date().toISOString());
    if (loginLog.length > LOGIN_LOG_MAX_ENTRIES) {
      loginLog = loginLog.slice(-LOGIN_LOG_MAX_ENTRIES);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { loginLog, refreshToken, lastLoginAt: new Date(), lastActiveAt: new Date() },
    });

    const { password, resetPasswordToken, resetPasswordExpires, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
      refreshToken,
    };
  });

  static forgotPassword = catchServiceAsync(async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    // Security: always return success to avoid leaking whether the email exists
    if (!user) {
      return { message: 'If this email is registered, you will receive a reset link.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken, resetPasswordExpires },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendTemplateEmail(
      user.email,
      'Password Reset Request',
      'passwordReset',
      {
        name: user.name,
        appName: process.env.FROM_NAME || 'ZEYO',
        resetLink: resetUrl,
        year: new Date().getFullYear(),
      }
    );

    return { message: 'If this email is registered, you will receive a reset link.' };
  });

  static resetPassword = catchServiceAsync(async (token: string, newPassword: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  });

  static refreshToken = catchServiceAsync(async (refreshToken: string) => {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      const decoded: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      const user = await prisma.user.findFirst({
        where: { id: decoded.userId, refreshToken },
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN as any }
      );

      return { token: newAccessToken };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  });

  // userId is Int (matches User.id SERIAL in DB)
  static logoutUser = catchServiceAsync(async (userId: number) => {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  });
}
