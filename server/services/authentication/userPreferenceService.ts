import { prisma } from '../../config/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class UserPreferenceService {
  static getPreferences = catchServiceAsync(async (userId: number) => {
    return prisma.userPreference.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  });

  static updatePreferences = catchServiceAsync(async (userId: number, data: Prisma.UserPreferenceUpdateInput) => {
    return prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...(data as any) },
    });
  });
}
