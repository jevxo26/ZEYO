"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../../controllers/booking/bookingController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// All admin routes require auth + admin/manager role
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'));
// ── Booking Management ────────────────────────────────────────────────────────
router.get('/', bookingController_1.BookingController.getAll);
router.get('/stats', bookingController_1.BookingController.getStats);
router.get('/:id', bookingController_1.BookingController.getById);
router.put('/:id', bookingController_1.BookingController.update);
router.delete('/:id', bookingController_1.BookingController.softDelete);
// ── Status & Timeline ─────────────────────────────────────────────────────────
router.post('/:id/status', bookingController_1.BookingController.updateStatus);
router.post('/:id/timeline', bookingController_1.BookingController.addTimeline);
// ── Invoice / Payment ─────────────────────────────────────────────────────────
router.post('/:id/invoice', bookingController_1.BookingController.generateInvoice);
router.post('/:id/payment', bookingController_1.BookingController.addPayment);
// ── Reschedule Approval ────────────────────────────────────────────────────────
router.put('/:id/reschedule/:rescheduleId/approve', bookingController_1.BookingController.approveReschedule);
exports.default = router;
