import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class UserSecurityService {
  static getSecurity = catchServiceAsync(async (userId: number) => {
    const sec = await prisma.userSecurity.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: {
        id: true,
        userId: true,
        twoFactorEnabled: true,
        twoFactorMethod: true,
        passwordChangedAt: true,
        failedLoginAttempts: true,
        accountLockedUntil: true,
        securityQuestion: true,
        // Never expose: backupCode, securityAnswer
        createdAt: true,
        updatedAt: true,
      },
    });
    return sec;
  });

  static toggle2FA = catchServiceAsync(async (userId: number, enabled: boolean, method?: string) => {
    return prisma.userSecurity.upsert({
      where: { userId },
      update: { twoFactorEnabled: enabled, twoFactorMethod: enabled ? (method || 'totp') : null },
      create: { userId, twoFactorEnabled: enabled, twoFactorMethod: enabled ? (method || 'totp') : null },
    });
  });

  static setSecurityQuestion = catchServiceAsync(async (userId: number, question: string, answer: string) => {
    const hashedAnswer = await bcrypt.hash(answer.toLowerCase().trim(), 10);
    return prisma.userSecurity.upsert({
      where: { userId },
      update: { securityQuestion: question, securityAnswer: hashedAnswer },
      create: { userId, securityQuestion: question, securityAnswer: hashedAnswer },
    });
  });

  static recordFailedLogin = catchServiceAsync(async (userId: number) => {
    const sec = await prisma.userSecurity.upsert({
      where: { userId },
      update: { failedLoginAttempts: { increment: 1 } },
      create: { userId, failedLoginAttempts: 1 },
    });
    // Lock account after 5 failed attempts for 30 minutes
    if (sec.failedLoginAttempts >= 5) {
      await prisma.userSecurity.update({
        where: { userId },
        data: { accountLockedUntil: new Date(Date.now() + 30 * 60 * 1000) },
      });
    }
    return sec;
  });

  static resetFailedLogins = catchServiceAsync(async (userId: number) => {
    return prisma.userSecurity.upsert({
      where: { userId },
      update: { failedLoginAttempts: 0, accountLockedUntil: null },
      create: { userId },
    });
  });
}
