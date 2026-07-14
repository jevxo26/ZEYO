import { Router } from 'express';
import { BookingController } from '../../controllers/booking/bookingController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// All admin routes require auth + admin/manager role
router.use(verifyToken, requireRole('admin', 'manager'));

// ── Booking Management ────────────────────────────────────────────────────────
router.get('/',           BookingController.getAll);
router.get('/stats',      BookingController.getStats);
router.get('/:id',        BookingController.getById);
router.put('/:id',        BookingController.update);
router.delete('/:id',     BookingController.softDelete);

// ── Status & Timeline ─────────────────────────────────────────────────────────
router.post('/:id/status',   BookingController.updateStatus);
router.post('/:id/timeline', BookingController.addTimeline);

// ── Invoice / Payment ─────────────────────────────────────────────────────────
router.post('/:id/invoice',  BookingController.generateInvoice);
router.post('/:id/payment',  BookingController.addPayment);

// ── Reschedule Approval ────────────────────────────────────────────────────────
router.put('/:id/reschedule/:rescheduleId/approve', BookingController.approveReschedule);

export default router;
