import { prisma } from '../../config/prisma';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BookingService } from '../../services/booking/bookingService';
import { AuthRequest } from '../../middlewares/authMiddleware';



export class BookingController {

  // ── Booking ──────────────────────────────────────────────────────────────────
  static create = catchAsync(async (req: Request, res: Response) => {
    let customerId = req.body.customerId;
    // Auto-resolve customerId from auth token if not provided
    if (!customerId) {
      const userId = (req as AuthRequest).user?.userId;
      if (userId) {
        let customer = await prisma.customer.findFirst({ where: { userId } });
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              userId,
              customerCode: `CUST-${userId}-${Date.now()}`,
            },
          });
        }
        customerId = customer.id;
      }
    }
    if (!customerId) {
      return res.status(400).json({ success: false, message: 'customerId is required', data: null });
    }
    const {
      eventName,
      eventDate,
      eventTime,
      guestCount,
      budget,
      subtotal,
      discount,
      tax,
      grandTotal,
      bookingStatus,
      status,
      remarks,
      notes,
      location,
      eventType,
      calculatorId,
      packageId,
      zoneId,
      eventId,
      bookingType,
      bookingSource,
    } = req.body;

    const finalEventName = eventName || (typeof notes === 'string' ? notes : 'New Event');
    const finalGrandTotal = budget !== undefined ? Number(budget) : (grandTotal !== undefined ? Number(grandTotal) : 0);
    const finalSubtotal = subtotal !== undefined ? Number(subtotal) : finalGrandTotal;
    const finalStatus = (bookingStatus || status || 'pending').toLowerCase();
    const finalRemarks = remarks || (typeof notes === 'string' ? notes : undefined);

    const bookingPayload: any = {
      customerId,
      eventName: finalEventName,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      eventTime: eventTime || undefined,
      guestCount: guestCount ? Number(guestCount) : 0,
      subtotal: finalSubtotal,
      discount: discount ? Number(discount) : 0,
      tax: tax ? Number(tax) : 0,
      grandTotal: finalGrandTotal,
      bookingStatus: finalStatus,
      remarks: finalRemarks,
      calculatorId: calculatorId ? Number(calculatorId) : undefined,
      packageId: packageId ? Number(packageId) : undefined,
      zoneId: zoneId ? Number(zoneId) : undefined,
      eventId: eventId ? Number(eventId) : undefined,
      bookingType: bookingType || 'manual',
      bookingSource: bookingSource || 'web',
    };

    if (location) {
      bookingPayload.venue = {
        create: {
          address: location,
          venueName: location,
        },
      };
    }

    const data = await BookingService.create(bookingPayload);
    sendResponse(res, { statusCode: 201, message: 'Booking created', data });
  });

  static getAll = catchAsync(async (req: Request, res: Response) => {
    let { bookingStatus, paymentStatus, customerId, page, limit } = req.query;
    if (!customerId) {
      const userId = (req as AuthRequest).user?.userId;
      if (userId) {
        const customer = await prisma.customer.findFirst({ where: { userId } });
        if (customer) customerId = String(customer.id) as any;
      }
    }
    const data = await BookingService.getAll({
      bookingStatus: bookingStatus as string,
      paymentStatus: paymentStatus as string,
      customerId:    customerId ? Number(customerId) : undefined,
      page:  page  ? Number(page)  : 1,
      limit: limit ? Number(limit) : 20,
    });
    sendResponse(res, { statusCode: 200, data });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.getById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Booking not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static getByNumber = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.getByNumber(String(req.params.bookingNumber));
    if (!data) return res.status(404).json({ success: false, message: 'Booking not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static update = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.update(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Booking updated', data });
  });

  static softDelete = catchAsync(async (req: Request, res: Response) => {
    await BookingService.softDelete(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Booking deleted', data: null });
  });

  static getStats = catchAsync(async (_req: Request, res: Response) => {
    const data = await BookingService.getStats();
    sendResponse(res, { statusCode: 200, data });
  });

  // ── Items ─────────────────────────────────────────────────────────────────────
  static addItem = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.addItem({ bookingId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Item added', data });
  });

  // ── Booking Service ────────────────────────────────────────────────────────────
  static addBookingService = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.addBookingService(req.body);
    sendResponse(res, { statusCode: 201, message: 'Service added', data });
  });

  static addConfiguration = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.addConfiguration(req.body);
    sendResponse(res, { statusCode: 201, message: 'Configuration added', data });
  });

  static addAddon = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.addAddon(req.body);
    sendResponse(res, { statusCode: 201, message: 'Addon added', data });
  });

  // ── Guest / Schedule / Venue ──────────────────────────────────────────────────
  static upsertGuest = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.upsertGuest(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Guest info saved', data });
  });

  static upsertSchedule = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.upsertSchedule(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Schedule saved', data });
  });

  static upsertVenue = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.upsertVenue(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Venue saved', data });
  });

  // ── Pricing / Tax / Discount ──────────────────────────────────────────────────
  static upsertPricing = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.upsertPricing(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Pricing saved', data });
  });

  static addDiscount = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.addDiscount({ bookingId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Discount applied', data });
  });

  static addTax = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.addTax({ bookingId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Tax applied', data });
  });

  // ── Status ────────────────────────────────────────────────────────────────────
  static updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { currentStatus, statusReason } = req.body;
    const userId = (req as Request & { user?: { id: number } }).user?.id;
    const data = await BookingService.updateStatus(Number(req.params.id), currentStatus, userId, statusReason);
    sendResponse(res, { statusCode: 200, message: `Status updated to ${currentStatus}`, data });
  });

  // ── Timeline ──────────────────────────────────────────────────────────────────
  static addTimeline = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id: number } }).user?.id;
    const data = await BookingService.addTimeline({ bookingId: Number(req.params.id), createdBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Timeline entry added', data });
  });

  // ── Invoice / Payment ─────────────────────────────────────────────────────────
  static generateInvoice = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.generateInvoice(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 201, message: 'Invoice generated', data });
  });

  static addPayment = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.addPayment({ bookingId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Payment recorded', data });
  });

  // ── Cancellation / Reschedule ─────────────────────────────────────────────────
  static cancel = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.cancel(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Booking cancelled', data });
  });

  static requestReschedule = catchAsync(async (req: Request, res: Response) => {
    const data = await BookingService.requestReschedule({ bookingId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Reschedule requested', data });
  });

  static approveReschedule = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id: number } }).user?.id ?? 0;
    const data = await BookingService.approveReschedule(Number(req.params.rescheduleId), userId);
    sendResponse(res, { statusCode: 200, message: 'Reschedule approved', data });
  });

  // ── Notes / Attachments / History / Logs ─────────────────────────────────────
  static addNote = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id: number } }).user?.id;
    const data = await BookingService.addNote({ bookingId: Number(req.params.id), createdBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Note added', data });
  });

  static addAttachment = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { id: number } }).user?.id;
    const data = await BookingService.addAttachment({ bookingId: Number(req.params.id), uploadedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Attachment added', data });
  });

  static getHistory = catchAsync(async (req: Request, res: Response) => {
    const booking = await BookingService.getById(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data: (booking as { history?: unknown })?.history ?? [] });
  });
}
