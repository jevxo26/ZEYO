import { prisma } from '../../config/prisma';
// ─────────────────────────────────────────────────────────────────────────────
// BookingService — Core service for the Booking & Order Module
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



// ── Booking Number Generator ──────────────────────────────────────────────────
async function generateBookingNumber(): Promise<string> {
  const count = await prisma.booking.count();
  const year  = new Date().getFullYear();
  return `BKG-${year}-${String(count + 1).padStart(5, '0')}`;
}

export const BookingService = {

  // ── Booking CRUD ─────────────────────────────────────────────────────────────
  create: catchServiceAsync(async (data: {
    customerId: number; calculatorId?: number; packageId?: number;
    zoneId?: number; eventId?: number; bookingType?: string; bookingSource?: string;
    eventName: string; eventDate?: Date; eventTime?: string; guestCount?: number;
    subtotal?: number; discount?: number; tax?: number; grandTotal?: number; remarks?: string;
  }) => {
    const bookingNumber = await generateBookingNumber();
    return prisma.booking.create({ data: { bookingNumber, ...data } });
  }),

  getAll: catchServiceAsync(async (filters: {
    bookingStatus?: string; paymentStatus?: string; customerId?: number;
    page?: number; limit?: number;
  } = {}) => {
    const { bookingStatus, paymentStatus, customerId, page = 1, limit = 20 } = filters;
    const where: Record<string, unknown> = { deletedAt: null };
    if (bookingStatus) where.bookingStatus = bookingStatus;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (customerId)    where.customerId    = customerId;

    const [data, total] = await Promise.all([
      prisma.booking.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { customer: { include: { user: { select: { name: true, email: true } } } }, venue: true, schedule: true },
      }),
      prisma.booking.count({ where }),
    ]);
    return { data, total, page, limit };
  }),

  getById: catchServiceAsync(async (id: number) =>
    prisma.booking.findUnique({
      where: { id },
      include: {
        customer:    { include: { user: { select: { name: true, email: true, phone: true } } } },
        items:       { include: { bookingServices: { include: { configurations: true, addons: true } } } },
        guest:       true,
        schedule:    true,
        venue:       true,
        pricing:     true,
        discounts:   true,
        taxes:       true,
        statuses:    { orderBy: { createdAt: 'desc' } },
        timeline:    { orderBy: { createdAt: 'asc' } },
        invoices:    true,
        payments:    true,
        cancellation: true,
        reschedules: true,
        attachments: true,
        notes:       { orderBy: { createdAt: 'desc' } },
      },
    })),

  getByNumber: catchServiceAsync(async (bookingNumber: string) =>
    prisma.booking.findUnique({ where: { bookingNumber }, include: { customer: true, items: true, pricing: true } })),

  update: catchServiceAsync(async (id: number, data: Partial<{
    eventName: string; eventDate: Date; eventTime: string; guestCount: number;
    subtotal: number; discount: number; tax: number; grandTotal: number;
    bookingStatus: string; paymentStatus: string; remarks: string;
  }>) => prisma.booking.update({ where: { id }, data })),

  softDelete: catchServiceAsync(async (id: number) =>
    prisma.booking.update({ where: { id }, data: { deletedAt: new Date() } })),

  // ── Items ─────────────────────────────────────────────────────────────────────
  addItem: catchServiceAsync(async (data: {
    bookingId: number; serviceId: number; quantity?: number;
    unitPrice: number; totalPrice: number;
  }) => prisma.bookingItem.create({ data })),

  // ── Booking Service ────────────────────────────────────────────────────────────
  addBookingService: catchServiceAsync(async (data: {
    bookingItemId: number; serviceId: number; serviceName: string;
    serviceType?: string; coverage?: string; duration?: string;
    quantity?: number; price: number;
  }) => prisma.bookingService.create({ data })),

  addConfiguration: catchServiceAsync(async (data: {
    bookingServiceId: number; configurationName: string;
    configurationValue: string; additionalPrice?: number;
  }) => prisma.bookingServiceConfiguration.create({ data })),

  addAddon: catchServiceAsync(async (data: {
    bookingServiceId: number; addonId?: number; addonName: string;
    quantity?: number; unitPrice: number; totalPrice: number;
  }) => prisma.bookingAddon.create({ data })),

  // ── Guest ────────────────────────────────────────────────────────────────────
  upsertGuest: catchServiceAsync(async (bookingId: number, data: {
    adultGuest: number; childGuest?: number; vipGuest?: number; totalGuest: number;
  }) => prisma.bookingGuest.upsert({
    where: { bookingId }, create: { bookingId, ...data }, update: data,
  })),

  // ── Schedule ──────────────────────────────────────────────────────────────────
  upsertSchedule: catchServiceAsync(async (bookingId: number, data: {
    startDate?: Date; endDate?: Date; startTime?: string; endTime?: string; eventDuration?: string;
  }) => prisma.bookingSchedule.upsert({
    where: { bookingId }, create: { bookingId, ...data }, update: data,
  })),

  // ── Venue ─────────────────────────────────────────────────────────────────────
  upsertVenue: catchServiceAsync(async (bookingId: number, data: {
    venueName?: string; venueType?: string; address?: string;
    divisionId?: number; districtId?: number; cityId?: number;
    zoneId?: number; latitude?: number; longitude?: number;
  }) => prisma.bookingVenue.upsert({
    where: { bookingId }, create: { bookingId, ...data }, update: data,
  })),

  // ── Pricing ───────────────────────────────────────────────────────────────────
  upsertPricing: catchServiceAsync(async (bookingId: number, data: {
    subtotal: number; serviceCharge?: number; transportCharge?: number;
    discount?: number; tax?: number; grandTotal: number; currency?: string;
  }) => prisma.bookingPricing.upsert({
    where: { bookingId }, create: { bookingId, ...data }, update: data,
  })),

  addDiscount: catchServiceAsync(async (data: {
    bookingId: number; discountName: string; discountType?: string;
    discountValue: number; discountAmount: number; couponId?: number;
  }) => prisma.bookingDiscount.create({ data })),

  addTax: catchServiceAsync(async (data: {
    bookingId: number; taxName: string; taxRate: number; taxAmount: number;
  }) => prisma.bookingTax.create({ data })),

  // ── Status ────────────────────────────────────────────────────────────────────
  updateStatus: catchServiceAsync(async (bookingId: number, currentStatus: string, updatedBy?: number, statusReason?: string) =>
    Promise.all([
      prisma.booking.update({ where: { id: bookingId }, data: { bookingStatus: currentStatus } }),
      prisma.bookingStatus.create({ data: { bookingId, currentStatus, updatedBy, statusReason } }),
    ])),

  // ── Timeline ──────────────────────────────────────────────────────────────────
  addTimeline: catchServiceAsync(async (data: {
    bookingId: number; title: string; description?: string; status?: string; createdBy?: number;
  }) => prisma.bookingTimeline.create({ data })),

  // ── Invoice ───────────────────────────────────────────────────────────────────
  generateInvoice: catchServiceAsync(async (bookingId: number, data: {
    subtotal: number; tax?: number; discount?: number; grandTotal: number;
  }) => {
    const count  = await prisma.bookingInvoice.count();
    const year   = new Date().getFullYear();
    const invNum = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
    return prisma.bookingInvoice.create({ data: { bookingId, invoiceNumber: invNum, ...data } });
  }),

  // ── Payment ───────────────────────────────────────────────────────────────────
  addPayment: catchServiceAsync(async (data: {
    bookingId: number; paymentId?: string; paymentMethod?: string;
    paidAmount: number; dueAmount?: number; paymentStatus?: string; paidAt?: Date;
  }) => prisma.bookingPayment.create({ data })),

  // ── Cancellation ──────────────────────────────────────────────────────────────
  cancel: catchServiceAsync(async (bookingId: number, data: {
    cancelledBy?: string; reason?: string; refundAmount?: number;
  }) => Promise.all([
    prisma.booking.update({ where: { id: bookingId }, data: { bookingStatus: 'cancelled' } }),
    prisma.bookingCancellation.create({ data: { bookingId, ...data } }),
  ])),

  // ── Reschedule ────────────────────────────────────────────────────────────────
  requestReschedule: catchServiceAsync(async (data: {
    bookingId: number; oldEventDate?: Date; newEventDate?: Date; reason?: string;
  }) => prisma.bookingReschedule.create({ data })),

  approveReschedule: catchServiceAsync(async (id: number, approvedBy: number) =>
    prisma.bookingReschedule.update({ where: { id }, data: { status: 'approved', approvedBy } })),

  // ── Notes / Attachments ───────────────────────────────────────────────────────
  addNote: catchServiceAsync(async (data: {
    bookingId: number; note: string; noteType?: string; createdBy?: number;
  }) => prisma.bookingNote.create({ data })),

  addAttachment: catchServiceAsync(async (data: {
    bookingId: number; fileName: string; fileType?: string; fileUrl: string; uploadedBy?: number;
  }) => prisma.bookingAttachment.create({ data })),

  // ── History / Log ─────────────────────────────────────────────────────────────
  addHistory: catchServiceAsync(async (data: {
    bookingId: number; action: string; performedBy?: number;
    oldValue?: object; newValue?: object;
  }) => prisma.bookingHistory.create({ data })),

  addLog: catchServiceAsync(async (data: {
    bookingId: number; logType?: string; description?: string;
    ipAddress?: string; deviceInfo?: string;
  }) => prisma.bookingLog.create({ data })),

  // ── Stats ─────────────────────────────────────────────────────────────────────
  getStats: catchServiceAsync(async () => {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      prisma.booking.count({ where: { deletedAt: null } }),
      prisma.booking.count({ where: { bookingStatus: 'pending',   deletedAt: null } }),
      prisma.booking.count({ where: { bookingStatus: 'confirmed', deletedAt: null } }),
      prisma.booking.count({ where: { bookingStatus: 'completed', deletedAt: null } }),
      prisma.booking.count({ where: { bookingStatus: 'cancelled', deletedAt: null } }),
    ]);
    return { total, pending, confirmed, completed, cancelled };
  }),
};
