import { Router } from 'express';
import { ReviewController } from '../../controllers/review/reviewController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// ── Public routes (featured testimonials) ──────────────────────────────────
router.get('/testimonials/featured', ReviewController.getFeaturedTestimonials);

// ── Auth required ──────────────────────────────────────────────────────────
router.use(verifyToken);

// Feedback (customer & admin)
router.post('/feedback',                         ReviewController.submitFeedback);
router.get('/feedback',     requireRole('admin', 'manager'), ReviewController.getFeedbacks);
router.put('/feedback/:feedbackId/status', requireRole('admin', 'manager'), ReviewController.updateFeedbackStatus);

// Survey & NPS
router.post('/surveys',     ReviewController.submitSurvey);
router.get('/surveys',      requireRole('admin', 'manager'), ReviewController.getSurveys);
router.get('/nps/stats',    requireRole('admin', 'manager'), ReviewController.getNPSStats);

// Settings
router.get('/settings',     ReviewController.getSetting);
router.post('/settings',    requireRole('admin', 'manager'), ReviewController.upsertSetting);

// Stats
router.get('/stats',        requireRole('admin', 'manager'), ReviewController.getStats);

// Reports admin
router.put('/reports/:reportId/resolve', requireRole('admin', 'manager'), ReviewController.resolveReport);

// Review list + create
router.get('/',             requireRole('admin', 'manager'), ReviewController.getAll);
router.post('/',            ReviewController.create);

// Per-review operations — specific paths BEFORE /:id
router.get('/:id',          ReviewController.getById);
router.put('/:id/status',   requireRole('admin', 'manager'), ReviewController.updateStatus);
router.post('/:id/services',  ReviewController.addServiceReview);
router.post('/:id/packages',  ReviewController.addPackageFeedback);
router.post('/:id/booking',   ReviewController.addBookingReview);
router.post('/:id/criteria',  ReviewController.addCriteria);
router.post('/:id/rating',    ReviewController.upsertRating);
router.post('/:id/media',     ReviewController.addMedia);
router.post('/:id/react',     ReviewController.react);
router.post('/:id/reply',   requireRole('admin', 'manager'), ReviewController.reply);
router.post('/:id/report',    ReviewController.report);
router.post('/:id/moderate',  requireRole('admin', 'manager'), ReviewController.moderate);
router.post('/:id/verify',    requireRole('admin', 'manager'), ReviewController.verify);
router.post('/:id/feature',   requireRole('admin', 'manager'), ReviewController.featureTestimonial);

export default router;
