import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Use same secret constants as authService for consistency
const JWT_SECRET = process.env.JWT_SECRET || 'ZEYO_access_secret_2026_please_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ZEYO_refresh_secret_2026_please_change_in_production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as string;
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string;

export class SocialAuthService {
  static loginWithGoogle = catchServiceAsync(async (credential: string) => {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token payload');
    }

    const { email, name, sub: googleId, picture } = payload;

    return await SocialAuthService.findOrCreateUser({
      email,
      name: name || 'Google User',
      provider: 'google',
      providerId: googleId,
      profileImage: picture,
    });
  });

  static loginWithFacebook = catchServiceAsync(async (accessToken: string) => {
    // Verify the Facebook access token and get user info
    const { data } = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        fields: 'id,name,email,picture',
        access_token: accessToken,
      },
    });

    if (!data || !data.email) {
      throw new Error('Invalid Facebook token payload or email not provided');
    }

    const { email, name, id: facebookId, picture } = data;

    return await SocialAuthService.findOrCreateUser({
      email,
      name: name || 'Facebook User',
      provider: 'facebook',
      providerId: facebookId,
      profileImage: picture?.data?.url,
    });
  });

  private static async findOrCreateUser(params: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
    profileImage?: string;
  }) {
    const { email, name, provider, providerId, profileImage } = params;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Update provider info if user is logging in via social for first time with existing email
      if (user.provider !== provider) {
        user = await prisma.user.update({
          where: { email },
          data: { provider, providerId, ...(profileImage ? { profileImage } : {}) },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          provider,
          providerId,
          role: 'employee',
          emailVerified: true, // Social auth emails are pre-verified
          isVerified: true,
          ...(profileImage ? { profileImage } : {}),
        },
      });

      // Auto-create UserProfile for social login users
      try {
        await prisma.userProfile.create({ data: { userId: user.id } });
      } catch {
        // Ignore if already exists
      }
    }

    // Sign access token with userId (Int) — consistent with authService
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Also generate and store a refresh token for social login users
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, lastLoginAt: new Date(), lastActiveAt: new Date() },
    });

    const { password, ...userWithoutPassword } = user;

    return {
      token,
      refreshToken,
      user: userWithoutPassword,
    };
  }
}
