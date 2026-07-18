import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class CustomerBookingService {
  // ─── Favorite Packages ────────────────────────────────────────────────────
  static getFavorites = catchServiceAsync(async (customerId: number) => {
    return prisma.customerFavoritePackage.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static addFavorite = catchServiceAsync(async (customerId: number, packageId: number) => {
    const existing = await prisma.customerFavoritePackage.findFirst({
      where: { customerId, packageId },
    });
    if (existing) return existing;

    return prisma.customerFavoritePackage.create({
      data: { customerId, packageId },
    });
  });

  static removeFavorite = catchServiceAsync(async (customerId: number, packageId: number) => {
    const favorite = await prisma.customerFavoritePackage.findFirst({
      where: { customerId, packageId },
    });
    if (!favorite) throw new Error('Favorite package not found');

    await prisma.customerFavoritePackage.delete({
      where: { id: favorite.id },
    });
    return true;
  });

  // ─── Saved Calculator Calculations ────────────────────────────────────────
  static getCalculations = catchServiceAsync(async (customerId: number) => {
    return prisma.customerSavedCalculation.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static saveCalculation = catchServiceAsync(async (customerId: number, data: {
    calculatorId: number;
    title: string;
    estimatedPrice?: number;
    selectedServices?: any;
    status?: string;
  }) => {
    return prisma.customerSavedCalculation.create({
      data: {
        ...data,
        customerId,
      },
    });
  });

  static deleteCalculation = catchServiceAsync(async (id: number, customerId: number) => {
    const calc = await prisma.customerSavedCalculation.findFirst({
      where: { id, customerId },
    });
    if (!calc) throw new Error('Saved calculation not found');

    await prisma.customerSavedCalculation.delete({
      where: { id },
    });
    return true;
  });

  // ─── Quotations ───────────────────────────────────────────────────────────
  static getQuotations = catchServiceAsync(async (customerId: number) => {
    return prisma.customerQuotation.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static getQuotationById = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.customerQuotation.findFirst({
      where: { id, customerId },
    });
  });

  static createQuotation = catchServiceAsync(async (customerId: number, data: {
    calculatorId?: number;
    bookingId?: number;
    totalAmount: number;
    discount?: number;
    finalAmount: number;
    validUntil?: string | Date;
    status?: string;
  }) => {
    const num = `QT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return prisma.customerQuotation.create({
      data: {
        ...data,
        customerId,
        quotationNumber: num,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
      },
    });
  });

  static updateQuotationStatus = catchServiceAsync(async (id: number, customerId: number, status: string) => {
    return prisma.customerQuotation.update({
      where: { id, customerId },
      data: { status },
    });
  });

  // ─── Booking History ──────────────────────────────────────────────────────
  static getBookings = catchServiceAsync(async (customerId: number) => {
    return prisma.customerBookingHistory.findMany({
      where: { customerId },
      orderBy: { bookingDate: 'desc' },
    });
  });

  static addBookingRecord = catchServiceAsync(async (customerId: number, data: {
    bookingId: number;
    eventTypeId?: number;
    bookingDate: string | Date;
    bookingStatus: string;
    paymentStatus: string;
    totalAmount: number;
  }) => {
    const existing = await prisma.customerBookingHistory.findUnique({
      where: { bookingId: data.bookingId },
    });
    if (existing) {
      return prisma.customerBookingHistory.update({
        where: { bookingId: data.bookingId },
        data: {
          bookingStatus: data.bookingStatus,
          paymentStatus: data.paymentStatus,
          totalAmount: data.totalAmount,
        },
      });
    }

    return prisma.customerBookingHistory.create({
      data: {
        ...data,
        customerId,
        bookingDate: new Date(data.bookingDate),
      },
    });
  });

  // ─── Saved Payment Methods ────────────────────────────────────────────────
  static getPaymentMethods = catchServiceAsync(async (customerId: number) => {
    return prisma.customerPaymentMethod.findMany({
      where: { customerId },
      orderBy: { isDefault: 'desc' },
    });
  });

  static addPaymentMethod = catchServiceAsync(async (customerId: number, data: {
    paymentType: string;
    accountName: string;
    accountNumber: string;
    provider?: string;
    isDefault?: boolean;
  }) => {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.customerPaymentMethod.updateMany({
          where: { customerId, isDefault: true },
          data: { isDefault: false },
        });
      }

      const count = await tx.customerPaymentMethod.count({ where: { customerId } });
      const isDefault = count === 0 ? true : !!data.isDefault;

      return tx.customerPaymentMethod.create({
        data: {
          ...data,
          customerId,
          isDefault,
        },
      });
    });
  });

  static deletePaymentMethod = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.$transaction(async (tx) => {
      const pm = await tx.customerPaymentMethod.findFirst({
        where: { id, customerId },
      });
      if (!pm) throw new Error('Payment method not found');

      await tx.customerPaymentMethod.delete({
        where: { id },
      });

      if (pm.isDefault) {
        const nextPm = await tx.customerPaymentMethod.findFirst({
          where: { customerId },
          orderBy: { createdAt: 'desc' },
        });
        if (nextPm) {
          await tx.customerPaymentMethod.update({
            where: { id: nextPm.id },
            data: { isDefault: true },
          });
        }
      }

      return true;
    });
  });
}
