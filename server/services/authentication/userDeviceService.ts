import { prisma } from '../../config/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class UserDeviceService {
  static getDevices = catchServiceAsync(async (userId: number) => {
    return prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastLoginAt: 'desc' },
    });
  });

  static getDeviceById = catchServiceAsync(async (id: number, userId: number) => {
    return prisma.userDevice.findFirst({ where: { id, userId } });
  });

  static registerDevice = catchServiceAsync(async (userId: number, data: Prisma.UserDeviceUncheckedCreateInput) => {
    // Upsert by deviceToken if provided, otherwise create
    if (data.deviceToken) {
      return prisma.userDevice.upsert({
        where: { id: 0 }, // no unique on deviceToken in schema yet — use create
        update: { ...data, userId, lastLoginAt: new Date() },
        create: { ...data, userId, lastLoginAt: new Date() },
      });
    }
    return prisma.userDevice.create({ data: { ...data, userId, lastLoginAt: new Date() } });
  });

  static updateDevice = catchServiceAsync(async (id: number, userId: number, data: Partial<{ deviceName: string; status: string }>) => {
    const device = await prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device) throw new Error('Device not found');
    return prisma.userDevice.update({ where: { id }, data });
  });

  static blockDevice = catchServiceAsync(async (id: number, userId: number) => {
    const device = await prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device) throw new Error('Device not found');
    return prisma.userDevice.update({ where: { id }, data: { status: 'blocked' } });
  });

  static removeDevice = catchServiceAsync(async (id: number, userId: number) => {
    const device = await prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device) throw new Error('Device not found');
    await prisma.userDevice.delete({ where: { id } });
    return { message: 'Device removed' };
  });
}
