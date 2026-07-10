import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserLoginHistoryService {
  static getHistory = catchServiceAsync(async (userId: number, limit = 20, skip = 0) => {
    const [total, records] = await Promise.all([
      prisma.userLoginHistory.count({ where: { userId } }),
      prisma.userLoginHistory.findMany({
        where: { userId },
        include: { device: { select: { deviceName: true, deviceType: true } } },
        orderBy: { loginAt: 'desc' },
        take: limit,
        skip,
      }),
    ]);
    return { total, records };
  });

  static createEntry = catchServiceAsync(async (data: {
    userId: number;
    deviceId?: number;
    ipAddress?: string;
    browser?: string;
    operatingSystem?: string;
    country?: string;
    city?: string;
    loginMethod?: string;
    loginStatus: string;
  }) => {
    return prisma.userLoginHistory.create({ data });
  });
}
