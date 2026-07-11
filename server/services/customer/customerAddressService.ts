import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class CustomerAddressService {
  static getAddresses = catchServiceAsync(async (customerId: number) => {
    return prisma.customerAddress.findMany({
      where: { customerId },
      orderBy: { isDefault: 'desc' },
    });
  });

  static getAddressById = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.customerAddress.findFirst({
      where: { id, customerId },
    });
  });

  static createAddress = catchServiceAsync(async (customerId: number, data: {
    label?: string;
    receiverName: string;
    phone: string;
    countryId: number;
    divisionId?: number;
    districtId?: number;
    cityId?: number;
    areaId?: number;
    zoneId?: number;
    address: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  }) => {
    return prisma.$transaction(async (tx) => {
      // If setting this one to default, clear previous default addresses
      if (data.isDefault) {
        await tx.customerAddress.updateMany({
          where: { customerId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Check if this is the first address. If so, make it default regardless
      const count = await tx.customerAddress.count({ where: { customerId } });
      const isDefault = count === 0 ? true : !!data.isDefault;

      return tx.customerAddress.create({
        data: {
          ...data,
          customerId,
          isDefault,
        },
      });
    });
  });

  static updateAddress = catchServiceAsync(async (id: number, customerId: number, data: {
    label?: string;
    receiverName?: string;
    phone?: string;
    countryId?: number;
    divisionId?: number;
    districtId?: number;
    cityId?: number;
    areaId?: number;
    zoneId?: number;
    address?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  }) => {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.customerAddress.updateMany({
          where: { customerId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.customerAddress.update({
        where: { id, customerId },
        data,
      });
    });
  });

  static deleteAddress = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.$transaction(async (tx) => {
      const address = await tx.customerAddress.findFirst({
        where: { id, customerId },
      });

      if (!address) throw new Error('Address not found');

      await tx.customerAddress.delete({
        where: { id },
      });

      // If we deleted the default address, nominate a new default if possible
      if (address.isDefault) {
        const nextAddress = await tx.customerAddress.findFirst({
          where: { customerId },
          orderBy: { createdAt: 'desc' },
        });

        if (nextAddress) {
          await tx.customerAddress.update({
            where: { id: nextAddress.id },
            data: { isDefault: true },
          });
        }
      }

      return true;
    });
  });

  static setDefaultAddress = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.$transaction(async (tx) => {
      // Clear default status of existing default addresses
      await tx.customerAddress.updateMany({
        where: { customerId, isDefault: true },
        data: { isDefault: false },
      });

      // Set default status on selected address
      return tx.customerAddress.update({
        where: { id, customerId },
        data: { isDefault: true },
      });
    });
  });
}
