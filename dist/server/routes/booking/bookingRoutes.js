"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../../controllers/booking/bookingController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// ── Public / Customer ─────────────────────────────────────────────────────────
router.post('/', authMiddleware_1.verifyToken, bookingController_1.BookingController.create);
router.get('/my', authMiddleware_1.verifyToken, bookingController_1.BookingController.getAll);
router.get('/number/:bookingNumber', authMiddleware_1.verifyToken, bookingController_1.BookingController.getByNumber);
router.get('/:id', authMiddleware_1.verifyToken, bookingController_1.BookingController.getById);
// ── Items / Services ──────────────────────────────────────────────────────────
router.post('/:id/items', authMiddleware_1.verifyToken, bookingController_1.BookingController.addItem);
router.post('/services', authMiddleware_1.verifyToken, bookingController_1.BookingController.addBookingService);
router.post('/services/configurations', authMiddleware_1.verifyToken, bookingController_1.BookingController.addConfiguration);
router.post('/services/addons', authMiddleware_1.verifyToken, bookingController_1.BookingController.addAddon);
// ── Guest / Schedule / Venue ──────────────────────────────────────────────────
router.post('/:id/guest', authMiddleware_1.verifyToken, bookingController_1.BookingController.upsertGuest);
router.post('/:id/schedule', authMiddleware_1.verifyToken, bookingController_1.BookingController.upsertSchedule);
router.post('/:id/venue', authMiddleware_1.verifyToken, bookingController_1.BookingController.upsertVenue);
// ── Pricing / Discount / Tax ──────────────────────────────────────────────────
router.post('/:id/pricing', authMiddleware_1.verifyToken, bookingController_1.BookingController.upsertPricing);
router.post('/:id/discounts', authMiddleware_1.verifyToken, bookingController_1.BookingController.addDiscount);
router.post('/:id/taxes', authMiddleware_1.verifyToken, bookingController_1.BookingController.addTax);
// ── Notes / Attachments ───────────────────────────────────────────────────────
router.post('/:id/notes', authMiddleware_1.verifyToken, bookingController_1.BookingController.addNote);
router.post('/:id/attachments', authMiddleware_1.verifyToken, bookingController_1.BookingController.addAttachment);
// ── Reschedule ────────────────────────────────────────────────────────────────
router.post('/:id/reschedule', authMiddleware_1.verifyToken, bookingController_1.BookingController.requestReschedule);
// ── Cancel ────────────────────────────────────────────────────────────────────
router.post('/:id/cancel', authMiddleware_1.verifyToken, bookingController_1.BookingController.cancel);
// ── History ───────────────────────────────────────────────────────────────────
router.get('/:id/history', authMiddleware_1.verifyToken, bookingController_1.BookingController.getHistory);
exports.default = router;
