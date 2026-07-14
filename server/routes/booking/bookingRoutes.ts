import { Router } from 'express';
import { BookingController } from '../../controllers/booking/bookingController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// ── Public / Customer ─────────────────────────────────────────────────────────
router.post('/',                               verifyToken, BookingController.create);
router.get('/my',                              verifyToken, BookingController.getAll);
router.get('/number/:bookingNumber',           verifyToken, BookingController.getByNumber);
router.get('/:id',                             verifyToken, BookingController.getById);

// ── Items / Services ──────────────────────────────────────────────────────────
router.post('/:id/items',                      verifyToken, BookingController.addItem);
router.post('/services',                       verifyToken, BookingController.addBookingService);
router.post('/services/configurations',        verifyToken, BookingController.addConfiguration);
router.post('/services/addons',                verifyToken, BookingController.addAddon);

// ── Guest / Schedule / Venue ──────────────────────────────────────────────────
router.post('/:id/guest',                      verifyToken, BookingController.upsertGuest);
router.post('/:id/schedule',                   verifyToken, BookingController.upsertSchedule);
router.post('/:id/venue',                      verifyToken, BookingController.upsertVenue);

// ── Pricing / Discount / Tax ──────────────────────────────────────────────────
router.post('/:id/pricing',                    verifyToken, BookingController.upsertPricing);
router.post('/:id/discounts',                  verifyToken, BookingController.addDiscount);
router.post('/:id/taxes',                      verifyToken, BookingController.addTax);

// ── Notes / Attachments ───────────────────────────────────────────────────────
router.post('/:id/notes',                      verifyToken, BookingController.addNote);
router.post('/:id/attachments',                verifyToken, BookingController.addAttachment);

// ── Reschedule ────────────────────────────────────────────────────────────────
router.post('/:id/reschedule',                 verifyToken, BookingController.requestReschedule);

// ── Cancel ────────────────────────────────────────────────────────────────────
router.post('/:id/cancel',                     verifyToken, BookingController.cancel);

// ── History ───────────────────────────────────────────────────────────────────
router.get('/:id/history',                     verifyToken, BookingController.getHistory);

export default router;
