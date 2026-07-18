import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class VendorScheduleService {
  // ─── Vendor Availability ──────────────────────────────────────────────────
  static setAvailability = catchServiceAsync(async (vendorId: number, data: {
    availableFrom: Date | string;
    availableTo: Date | string;
    status?: string;
    remarks?: string;
  }) => {
    return prisma.vendorAvailability.create({
      data: {
        vendorId,
        availableFrom: new Date(data.availableFrom),
        availableTo: new Date(data.availableTo),
        status: data.status || 'available',
        remarks: data.remarks || null,
      },
    });
  });

  static getAvailability = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorAvailability.findMany({
      where: { vendorId },
      orderBy: { availableFrom: 'asc' },
    });
  });

  static deleteAvailability = catchServiceAsync(async (id: number) => {
    return prisma.vendorAvailability.delete({
      where: { id },
    });
  });

  // ─── Vendor Calendar ─────────────────────────────────────────────────────
  static addCalendarBlock = catchServiceAsync(async (vendorId: number, data: {
    bookingDate: Date | string;
    startTime?: Date | string;
    endTime?: Date | string;
    availabilityStatus?: string; // busy | available
    bookingId?: number;
  }) => {
    return prisma.vendorCalendar.create({
      data: {
        vendorId,
        bookingDate: new Date(data.bookingDate),
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        availabilityStatus: data.availabilityStatus || 'busy',
        bookingId: data.bookingId || null,
      },
    });
  });

  static getCalendar = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorCalendar.findMany({
      where: { vendorId },
      orderBy: { bookingDate: 'asc' },
    });
  });

  static removeCalendarBlock = catchServiceAsync(async (id: number) => {
    return prisma.vendorCalendar.delete({
      where: { id },
    });
  });
}
