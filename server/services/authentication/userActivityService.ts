import { prisma } from '../../config/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class UserActivityService {
  static getActivity = catchServiceAsync(async (userId: number, limit = 30, skip = 0) => {
    const [total, records] = await Promise.all([
      prisma.userActivity.count({ where: { userId } }),
      prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
    ]);
    return { total, records };
  });

  static log = catchServiceAsync(async (data: {
    userId: number;
    activityType: string;
    description?: string;
    ipAddress?: string;
    deviceId?: number;
    metadata?: Record<string, unknown>;
  }) => {
    const { metadata, ...rest } = data;
    return prisma.userActivity.create({
      data: {
        ...rest,
        metadata: (metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });
  });
}
