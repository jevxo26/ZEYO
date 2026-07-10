import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserAddressService {
  static getAddresses = catchServiceAsync(async (userId: number) => {
    return prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  });

  static getAddressById = catchServiceAsync(async (id: number, userId: number) => {
    return prisma.userAddress.findFirst({ where: { id, userId } });
  });

  static createAddress = catchServiceAsync(async (userId: number, data: Prisma.UserAddressUncheckedCreateInput) => {
    // If this is the first address or marked as default, unset others first
    if (data.isDefault) {
      await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const count = await prisma.userAddress.count({ where: { userId } });
    return prisma.userAddress.create({
      data: { ...data, userId, isDefault: count === 0 ? true : !!data.isDefault },
    });
  });

  static updateAddress = catchServiceAsync(async (id: number, userId: number, data: Prisma.UserAddressUpdateInput) => {
    const address = await prisma.userAddress.findFirst({ where: { id, userId } });
    if (!address) throw new Error('Address not found');
    if (data.isDefault) {
      await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma.userAddress.update({ where: { id }, data });
  });

  static deleteAddress = catchServiceAsync(async (id: number, userId: number) => {
    const address = await prisma.userAddress.findFirst({ where: { id, userId } });
    if (!address) throw new Error('Address not found');
    await prisma.userAddress.delete({ where: { id } });
    // If the deleted address was default, make the most recent one default
    if (address.isDefault) {
      const next = await prisma.userAddress.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
      if (next) await prisma.userAddress.update({ where: { id: next.id }, data: { isDefault: true } });
    }
    return { message: 'Address deleted' };
  });

  static setDefault = catchServiceAsync(async (id: number, userId: number) => {
    const address = await prisma.userAddress.findFirst({ where: { id, userId } });
    if (!address) throw new Error('Address not found');
    await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    return prisma.userAddress.update({ where: { id }, data: { isDefault: true } });
  });
}
