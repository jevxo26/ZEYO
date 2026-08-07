import { prisma } from '../../config/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



const defaults = {
  pushNotification: true,
  emailNotification: true,
  smsNotification: false,
  marketingNotification: false,
  bookingNotification: true,
  paymentNotification: true,
  systemNotification: true,
};

export class UserNotificationSettingService {
  static getSettings = catchServiceAsync(async (userId: number) => {
    return prisma.userNotificationSetting.upsert({
      where: { userId },
      update: {},
      create: { userId, ...defaults },
    });
  });

  static updateSettings = catchServiceAsync(async (userId: number, data: Prisma.UserNotificationSettingUpdateInput) => {
    return prisma.userNotificationSetting.upsert({
      where: { userId },
      update: data,
      create: { userId, ...defaults, ...(data as any) },
    });
  });
}
