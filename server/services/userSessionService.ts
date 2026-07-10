import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserSessionService {
  static getSessions = catchServiceAsync(async (userId: number) => {
    return prisma.userSession.findMany({
      where: { userId, status: 'active' },
      include: { device: { select: { deviceName: true, deviceType: true, operatingSystem: true, browser: true } } },
      orderBy: { loginTime: 'desc' },
    });
  });

  static revokeSession = catchServiceAsync(async (id: number, userId: number) => {
    const session = await prisma.userSession.findFirst({ where: { id, userId } });
    if (!session) throw new Error('Session not found');
    return prisma.userSession.update({
      where: { id },
      data: { status: 'revoked', logoutTime: new Date() },
    });
  });

  static revokeAllSessions = catchServiceAsync(async (userId: number, excludeSessionId?: number) => {
    await prisma.userSession.updateMany({
      where: {
        userId,
        status: 'active',
        ...(excludeSessionId ? { NOT: { id: excludeSessionId } } : {}),
      },
      data: { status: 'revoked', logoutTime: new Date() },
    });
    return { message: 'All sessions revoked' };
  });
}
