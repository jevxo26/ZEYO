"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const prisma_1 = require("../../config/prisma");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const bookingService_1 = require("../../services/booking/bookingService");
class BookingController {
}
exports.BookingController = BookingController;
_a = BookingController;
// ── Booking ──────────────────────────────────────────────────────────────────
BookingController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    let customerId = req.body.customerId;
    // Auto-resolve customerId from auth token if not provided
    if (!customerId) {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (userId) {
            let customer = await prisma_1.prisma.customer.findFirst({ where: { userId } });
            if (!customer) {
                customer = await prisma_1.prisma.customer.create({
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
    const { eventName, eventDate, eventTime, guestCount, budget, subtotal, discount, tax, grandTotal, bookingStatus, status, remarks, notes, location, eventType, calculatorId, packageId, zoneId, eventId, bookingType, bookingSource, } = req.body;
    const finalEventName = eventName || (typeof notes === 'string' ? notes : 'New Event');
    const finalGrandTotal = budget !== undefined ? Number(budget) : (grandTotal !== undefined ? Number(grandTotal) : 0);
    const finalSubtotal = subtotal !== undefined ? Number(subtotal) : finalGrandTotal;
    const finalStatus = (bookingStatus || status || 'pending').toLowerCase();
    const finalRemarks = remarks || (typeof notes === 'string' ? notes : undefined);
    const bookingPayload = {
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
    const data = await bookingService_1.BookingService.create(bookingPayload);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Booking created', data });
});
BookingController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    let { bookingStatus, paymentStatus, customerId, page, limit } = req.query;
    if (!customerId) {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (userId) {
            const customer = await prisma_1.prisma.customer.findFirst({ where: { userId } });
            if (customer)
                customerId = String(customer.id);
        }
    }
    const data = await bookingService_1.BookingService.getAll({
        bookingStatus: bookingStatus,
        paymentStatus: paymentStatus,
        customerId: customerId ? Number(customerId) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
BookingController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.getById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Booking not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
BookingController.getByNumber = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.getByNumber(String(req.params.bookingNumber));
    if (!data)
        return res.status(404).json({ success: false, message: 'Booking not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
BookingController.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.update(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Booking updated', data });
});
BookingController.softDelete = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await bookingService_1.BookingService.softDelete(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Booking deleted', data: null });
});
BookingController.getStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await bookingService_1.BookingService.getStats();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── Items ─────────────────────────────────────────────────────────────────────
BookingController.addItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.addItem(Object.assign({ bookingId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Item added', data });
});
// ── Booking Service ────────────────────────────────────────────────────────────
BookingController.addBookingService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.addBookingService(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Service added', data });
});
BookingController.addConfiguration = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.addConfiguration(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Configuration added', data });
});
BookingController.addAddon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.addAddon(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Addon added', data });
});
// ── Guest / Schedule / Venue ──────────────────────────────────────────────────
BookingController.upsertGuest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.upsertGuest(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Guest info saved', data });
});
BookingController.upsertSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.upsertSchedule(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Schedule saved', data });
});
BookingController.upsertVenue = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.upsertVenue(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Venue saved', data });
});
// ── Pricing / Tax / Discount ──────────────────────────────────────────────────
BookingController.upsertPricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.upsertPricing(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Pricing saved', data });
});
BookingController.addDiscount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.addDiscount(Object.assign({ bookingId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Discount applied', data });
});
BookingController.addTax = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.addTax(Object.assign({ bookingId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Tax applied', data });
});
// ── Status ────────────────────────────────────────────────────────────────────
BookingController.updateStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const { currentStatus, statusReason } = req.body;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const data = await bookingService_1.BookingService.updateStatus(Number(req.params.id), currentStatus, userId, statusReason);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `Status updated to ${currentStatus}`, data });
});
// ── Timeline ──────────────────────────────────────────────────────────────────
BookingController.addTimeline = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const data = await bookingService_1.BookingService.addTimeline(Object.assign({ bookingId: Number(req.params.id), createdBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Timeline entry added', data });
});
// ── Invoice / Payment ─────────────────────────────────────────────────────────
BookingController.generateInvoice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.generateInvoice(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Invoice generated', data });
});
BookingController.addPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.addPayment(Object.assign({ bookingId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Payment recorded', data });
});
// ── Cancellation / Reschedule ─────────────────────────────────────────────────
BookingController.cancel = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.cancel(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Booking cancelled', data });
});
BookingController.requestReschedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await bookingService_1.BookingService.requestReschedule(Object.assign({ bookingId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Reschedule requested', data });
});
BookingController.approveReschedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b, _c;
    const userId = (_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 0;
    const data = await bookingService_1.BookingService.approveReschedule(Number(req.params.rescheduleId), userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Reschedule approved', data });
});
// ── Notes / Attachments / History / Logs ─────────────────────────────────────
BookingController.addNote = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const data = await bookingService_1.BookingService.addNote(Object.assign({ bookingId: Number(req.params.id), createdBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Note added', data });
});
BookingController.addAttachment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const data = await bookingService_1.BookingService.addAttachment(Object.assign({ bookingId: Number(req.params.id), uploadedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Attachment added', data });
});
BookingController.getHistory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const booking = await bookingService_1.BookingService.getById(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: (_b = booking === null || booking === void 0 ? void 0 : booking.history) !== null && _b !== void 0 ? _b : [] });
});
