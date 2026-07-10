import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

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
