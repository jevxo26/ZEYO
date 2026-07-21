"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSecurityService = void 0;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserSecurityService {
}
exports.UserSecurityService = UserSecurityService;
_a = UserSecurityService;
UserSecurityService.getSecurity = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    const sec = await prisma_1.prisma.userSecurity.upsert({
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
UserSecurityService.toggle2FA = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, enabled, method) => {
    return prisma_1.prisma.userSecurity.upsert({
        where: { userId },
        update: { twoFactorEnabled: enabled, twoFactorMethod: enabled ? (method || 'totp') : null },
        create: { userId, twoFactorEnabled: enabled, twoFactorMethod: enabled ? (method || 'totp') : null },
    });
});
UserSecurityService.setSecurityQuestion = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, question, answer) => {
    const hashedAnswer = await bcrypt_1.default.hash(answer.toLowerCase().trim(), 10);
    return prisma_1.prisma.userSecurity.upsert({
        where: { userId },
        update: { securityQuestion: question, securityAnswer: hashedAnswer },
        create: { userId, securityQuestion: question, securityAnswer: hashedAnswer },
    });
});
UserSecurityService.recordFailedLogin = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    const sec = await prisma_1.prisma.userSecurity.upsert({
        where: { userId },
        update: { failedLoginAttempts: { increment: 1 } },
        create: { userId, failedLoginAttempts: 1 },
    });
    // Lock account after 5 failed attempts for 30 minutes
    if (sec.failedLoginAttempts >= 5) {
        await prisma_1.prisma.userSecurity.update({
            where: { userId },
            data: { accountLockedUntil: new Date(Date.now() + 30 * 60 * 1000) },
        });
    }
    return sec;
});
UserSecurityService.resetFailedLogins = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userSecurity.upsert({
        where: { userId },
        update: { failedLoginAttempts: 0, accountLockedUntil: null },
        create: { userId },
    });
});
