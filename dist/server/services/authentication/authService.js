"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const emailService_1 = require("../emailService");
const smsService_1 = require("../smsService");
// Single source of truth for JWT secrets — consistent across sign & verify
const JWT_SECRET = process.env.JWT_SECRET || 'ZEYO_access_secret_2026_please_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ZEYO_refresh_secret_2026_please_change_in_production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d');
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d');
const LOGIN_LOG_MAX_ENTRIES = 50;
class AuthService {
}
exports.AuthService = AuthService;
_a = AuthService;
AuthService.registerUser = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }
    const dataToSave = Object.assign({}, data);
    if (data.password) {
        dataToSave.password = await bcrypt_1.default.hash(data.password, 10);
    }
    if (dataToSave.dateOfBirth) {
        dataToSave.dateOfBirth = new Date(dataToSave.dateOfBirth);
    }
    const user = await prisma_1.prisma.user.create({
        data: dataToSave,
    });
    // Auto-create an empty UserProfile for new users
    await prisma_1.prisma.userProfile.create({
        data: { userId: user.id },
    });
    const { password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
AuthService.sendEmailVerification = (0, catchServiceAsync_1.catchServiceAsync)(async (email) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.emailVerified) {
        return { message: 'Email already verified' };
    }
    const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto_1.default.createHash('sha256').update(verificationToken).digest('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerificationToken: hashedVerificationToken,
            emailVerificationExpires,
        },
    });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    await (0, emailService_1.sendTemplateEmail)(user.email, 'Verify Your Email', 'emailVerification', {
        name: user.name,
        appName: process.env.FROM_NAME || 'ZEYO',
        verificationLink,
        year: new Date().getFullYear(),
    });
    return { message: 'Verification email sent' };
});
AuthService.verifyEmail = (0, catchServiceAsync_1.catchServiceAsync)(async (token) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new Error('Token is invalid or has expired');
    }
    await prisma_1.prisma.user.update({
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
AuthService.sendPhoneVerification = (0, catchServiceAsync_1.catchServiceAsync)(async (phone) => {
    const user = await prisma_1.prisma.user.findFirst({ where: { phone } });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.phoneVerified) {
        return { message: 'Phone already verified' };
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedVerificationCode = crypto_1.default.createHash('sha256').update(verificationCode).digest('hex');
    const phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            phoneVerificationToken: hashedVerificationCode,
            phoneVerificationExpires,
        },
    });
    await (0, smsService_1.sendSMS)(phone, `Your ${process.env.FROM_NAME || 'ZEYO'} verification code is ${verificationCode}. It expires in 10 minutes.`);
    return { message: 'Verification code sent to phone' };
});
AuthService.verifyPhone = (0, catchServiceAsync_1.catchServiceAsync)(async (token) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            phoneVerificationToken: hashedToken,
            phoneVerificationExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new Error('Token is invalid or has expired');
    }
    await prisma_1.prisma.user.update({
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
AuthService.getMe = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
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
AuthService.loginUser = (0, catchServiceAsync_1.catchServiceAsync)(async (email, passwordInput) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    if (!user.password) {
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt_1.default.compare(passwordInput, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Sign access token — userId is Int
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    // Cap login log to last LOGIN_LOG_MAX_ENTRIES entries
    let loginLog = [];
    if (user.loginLog) {
        if (Array.isArray(user.loginLog)) {
            loginLog = user.loginLog;
        }
        else if (typeof user.loginLog === 'string') {
            try {
                loginLog = JSON.parse(user.loginLog);
            }
            catch (e) {
                // Ignore parse errors — start fresh
                loginLog = [];
            }
        }
    }
    loginLog.push(new Date().toISOString());
    if (loginLog.length > LOGIN_LOG_MAX_ENTRIES) {
        loginLog = loginLog.slice(-LOGIN_LOG_MAX_ENTRIES);
    }
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { loginLog, refreshToken, lastLoginAt: new Date(), lastActiveAt: new Date() },
    });
    const { password, resetPasswordToken, resetPasswordExpires } = user, userWithoutPassword = __rest(user, ["password", "resetPasswordToken", "resetPasswordExpires"]);
    return {
        user: userWithoutPassword,
        token,
        refreshToken,
    };
});
AuthService.forgotPassword = (0, catchServiceAsync_1.catchServiceAsync)(async (email) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    // Security: always return success to avoid leaking whether the email exists
    if (!user) {
        return { message: 'If this email is registered, you will receive a reset link.' };
    }
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken, resetPasswordExpires },
    });
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    await (0, emailService_1.sendTemplateEmail)(user.email, 'Password Reset Request', 'passwordReset', {
        name: user.name,
        appName: process.env.FROM_NAME || 'ZEYO',
        resetLink: resetUrl,
        year: new Date().getFullYear(),
    });
    return { message: 'If this email is registered, you will receive a reset link.' };
});
AuthService.resetPassword = (0, catchServiceAsync_1.catchServiceAsync)(async (token, newPassword) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new Error('Token is invalid or has expired');
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        },
    });
    return { message: 'Password has been reset successfully' };
});
AuthService.refreshToken = (0, catchServiceAsync_1.catchServiceAsync)(async (refreshToken) => {
    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: decoded.userId, refreshToken },
        });
        if (!user) {
            throw new Error('Invalid refresh token');
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return { token: newAccessToken };
    }
    catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
});
// userId is Int (matches User.id SERIAL in DB)
AuthService.logoutUser = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
});
