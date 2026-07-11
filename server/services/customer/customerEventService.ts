import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class CustomerEventService {
  static getEvents = catchServiceAsync(async (customerId: number) => {
    return prisma.customerEvent.findMany({
      where: { customerId },
      include: { guests: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  static getEventById = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.customerEvent.findFirst({
      where: { id, customerId },
      include: { guests: true },
    });
  });

  static createEvent = catchServiceAsync(async (customerId: number, data: {
    eventTypeId?: number;
    eventTitle: string;
    eventDate?: string | Date;
    guestCount?: number;
    zoneId?: number;
    estimatedBudget?: number;
    status?: string;
    guests?: Array<{ guestType: string; guestCount: number; remarks?: string }>;
  }) => {
    const { guests, eventDate, ...eventFields } = data;

    return prisma.$transaction(async (tx) => {
      const event = await tx.customerEvent.create({
        data: {
          ...eventFields,
          customerId,
          eventDate: eventDate ? new Date(eventDate) : null,
          guests: guests && guests.length > 0 ? {
            create: guests.map((g) => ({
              guestType: g.guestType,
              guestCount: g.guestCount,
              remarks: g.remarks,
            })),
          } : undefined,
        },
        include: { guests: true },
      });

      return event;
    });
  });

  static updateEvent = catchServiceAsync(async (id: number, customerId: number, data: {
    eventTypeId?: number;
    eventTitle?: string;
    eventDate?: string | Date;
    guestCount?: number;
    zoneId?: number;
    estimatedBudget?: number;
    status?: string;
    guests?: Array<{ guestType: string; guestCount: number; remarks?: string }>;
  }) => {
    const { guests, eventDate, ...eventFields } = data;

    return prisma.$transaction(async (tx) => {
      // Confirm ownership
      const existing = await tx.customerEvent.findFirst({
        where: { id, customerId },
      });
      if (!existing) throw new Error('Event not found');

      // Update basic fields
      await tx.customerEvent.update({
        where: { id },
        data: {
          ...eventFields,
          ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
        },
      });

      // Update guests if supplied (replaces old guests for simplicity)
      if (guests !== undefined) {
        await tx.customerGuest.deleteMany({
          where: { customerEventId: id },
        });

        if (guests.length > 0) {
          await tx.customerGuest.createMany({
            data: guests.map((g) => ({
              customerEventId: id,
              guestType: g.guestType,
              guestCount: g.guestCount,
              remarks: g.remarks,
            })),
          });
        }
      }

      return tx.customerEvent.findUnique({
        where: { id },
        include: { guests: true },
      });
    });
  });

  static deleteEvent = catchServiceAsync(async (id: number, customerId: number) => {
    // Confirm ownership and delete event (cascade deletion will delete the guests because of onDelete: Cascade in prisma schema)
    const existing = await prisma.customerEvent.findFirst({
      where: { id, customerId },
    });
    if (!existing) throw new Error('Event not found');

    await prisma.customerEvent.delete({
      where: { id },
    });

    return true;
  });

  // ─── Guest List Dedicated Actions ─────────────────────────────────────────
  static getGuests = catchServiceAsync(async (eventId: number, customerId: number) => {
    const event = await prisma.customerEvent.findFirst({
      where: { id: eventId, customerId },
    });
    if (!event) throw new Error('Event not found or access denied');

    return prisma.customerGuest.findMany({
      where: { customerEventId: eventId },
    });
  });

  static addGuest = catchServiceAsync(async (eventId: number, customerId: number, data: {
    guestType: string;
    guestCount: number;
    remarks?: string;
  }) => {
    const event = await prisma.customerEvent.findFirst({
      where: { id: eventId, customerId },
    });
    if (!event) throw new Error('Event not found or access denied');

    return prisma.customerGuest.create({
      data: {
        customerEventId: eventId,
        guestType: data.guestType,
        guestCount: data.guestCount,
        remarks: data.remarks,
      },
    });
  });

  static updateGuest = catchServiceAsync(async (guestId: number, eventId: number, customerId: number, data: {
    guestType?: string;
    guestCount?: number;
    remarks?: string;
  }) => {
    const event = await prisma.customerEvent.findFirst({
      where: { id: eventId, customerId },
    });
    if (!event) throw new Error('Event not found or access denied');

    return prisma.customerGuest.update({
      where: { id: guestId, customerEventId: eventId },
      data,
    });
  });

  static deleteGuest = catchServiceAsync(async (guestId: number, eventId: number, customerId: number) => {
    const event = await prisma.customerEvent.findFirst({
      where: { id: eventId, customerId },
    });
    if (!event) throw new Error('Event not found or access denied');

    await prisma.customerGuest.delete({
      where: { id: guestId, customerEventId: eventId },
    });

    return true;
  });
}
