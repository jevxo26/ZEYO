"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
// ─────────────────────────────────────────────────────────────────────────────
// BookingService — Core service for the Booking & Order Module
// ─────────────────────────────────────────────────────────────────────────────
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
// ── Booking Number Generator ──────────────────────────────────────────────────
async function generateBookingNumber() {
    const count = await prisma.booking.count();
    const year = new Date().getFullYear();
    return `BKG-${year}-${String(count + 1).padStart(5, '0')}`;
}
exports.BookingService = {
    // ── Booking CRUD ─────────────────────────────────────────────────────────────
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const bookingNumber = await generateBookingNumber();
        return prisma.booking.create({ data: Object.assign({ bookingNumber }, data) });
    }),
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        const { bookingStatus, paymentStatus, customerId, page = 1, limit = 20 } = filters;
        const where = { deletedAt: null };
        if (bookingStatus)
            where.bookingStatus = bookingStatus;
        if (paymentStatus)
            where.paymentStatus = paymentStatus;
        if (customerId)
            where.customerId = customerId;
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
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.booking.findUnique({
        where: { id },
        include: {
            customer: { include: { user: { select: { name: true, email: true, phone: true } } } },
            items: { include: { bookingServices: { include: { configurations: true, addons: true } } } },
            guest: true,
            schedule: true,
            venue: true,
            pricing: true,
            discounts: true,
            taxes: true,
            statuses: { orderBy: { createdAt: 'desc' } },
            timeline: { orderBy: { createdAt: 'asc' } },
            invoices: true,
            payments: true,
            cancellation: true,
            reschedules: true,
            attachments: true,
            notes: { orderBy: { createdAt: 'desc' } },
        },
    })),
    getByNumber: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingNumber) => prisma.booking.findUnique({ where: { bookingNumber }, include: { customer: true, items: true, pricing: true } })),
    update: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.booking.update({ where: { id }, data })),
    softDelete: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.booking.update({ where: { id }, data: { deletedAt: new Date() } })),
    // ── Items ─────────────────────────────────────────────────────────────────────
    addItem: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingItem.create({ data })),
    // ── Booking Service ────────────────────────────────────────────────────────────
    addBookingService: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingService.create({ data })),
    addConfiguration: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingServiceConfiguration.create({ data })),
    addAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingAddon.create({ data })),
    // ── Guest ────────────────────────────────────────────────────────────────────
    upsertGuest: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingId, data) => prisma.bookingGuest.upsert({
        where: { bookingId }, create: Object.assign({ bookingId }, data), update: data,
    })),
    // ── Schedule ──────────────────────────────────────────────────────────────────
    upsertSchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingId, data) => prisma.bookingSchedule.upsert({
        where: { bookingId }, create: Object.assign({ bookingId }, data), update: data,
    })),
    // ── Venue ─────────────────────────────────────────────────────────────────────
    upsertVenue: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingId, data) => prisma.bookingVenue.upsert({
        where: { bookingId }, create: Object.assign({ bookingId }, data), update: data,
    })),
    // ── Pricing ───────────────────────────────────────────────────────────────────
    upsertPricing: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingId, data) => prisma.bookingPricing.upsert({
        where: { bookingId }, create: Object.assign({ bookingId }, data), update: data,
    })),
    addDiscount: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingDiscount.create({ data })),
    addTax: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingTax.create({ data })),
    // ── Status ────────────────────────────────────────────────────────────────────
    updateStatus: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingId, currentStatus, updatedBy, statusReason) => Promise.all([
        prisma.booking.update({ where: { id: bookingId }, data: { bookingStatus: currentStatus } }),
        prisma.bookingStatus.create({ data: { bookingId, currentStatus, updatedBy, statusReason } }),
    ])),
    // ── Timeline ──────────────────────────────────────────────────────────────────
    addTimeline: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingTimeline.create({ data })),
    // ── Invoice ───────────────────────────────────────────────────────────────────
    generateInvoice: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingId, data) => {
        const count = await prisma.bookingInvoice.count();
        const year = new Date().getFullYear();
        const invNum = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
        return prisma.bookingInvoice.create({ data: Object.assign({ bookingId, invoiceNumber: invNum }, data) });
    }),
    // ── Payment ───────────────────────────────────────────────────────────────────
    addPayment: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingPayment.create({ data })),
    // ── Cancellation ──────────────────────────────────────────────────────────────
    cancel: (0, catchServiceAsync_1.catchServiceAsync)(async (bookingId, data) => Promise.all([
        prisma.booking.update({ where: { id: bookingId }, data: { bookingStatus: 'cancelled' } }),
        prisma.bookingCancellation.create({ data: Object.assign({ bookingId }, data) }),
    ])),
    // ── Reschedule ────────────────────────────────────────────────────────────────
    requestReschedule: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingReschedule.create({ data })),
    approveReschedule: (0, catchServiceAsync_1.catchServiceAsync)(async (id, approvedBy) => prisma.bookingReschedule.update({ where: { id }, data: { status: 'approved', approvedBy } })),
    // ── Notes / Attachments ───────────────────────────────────────────────────────
    addNote: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingNote.create({ data })),
    addAttachment: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingAttachment.create({ data })),
    // ── History / Log ─────────────────────────────────────────────────────────────
    addHistory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingHistory.create({ data })),
    addLog: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.bookingLog.create({ data })),
    // ── Stats ─────────────────────────────────────────────────────────────────────
    getStats: (0, catchServiceAsync_1.catchServiceAsync)(async () => {
        const [total, pending, confirmed, completed, cancelled] = await Promise.all([
            prisma.booking.count({ where: { deletedAt: null } }),
            prisma.booking.count({ where: { bookingStatus: 'pending', deletedAt: null } }),
            prisma.booking.count({ where: { bookingStatus: 'confirmed', deletedAt: null } }),
            prisma.booking.count({ where: { bookingStatus: 'completed', deletedAt: null } }),
            prisma.booking.count({ where: { bookingStatus: 'cancelled', deletedAt: null } }),
        ]);
        return { total, pending, confirmed, completed, cancelled };
    }),
};
