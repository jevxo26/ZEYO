"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../../controllers/review/reviewController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// ── Public routes (featured testimonials) ──────────────────────────────────
router.get('/testimonials/featured', reviewController_1.ReviewController.getFeaturedTestimonials);
// ── Auth required ──────────────────────────────────────────────────────────
router.use(authMiddleware_1.verifyToken);
// Feedback (customer & admin)
router.post('/feedback', reviewController_1.ReviewController.submitFeedback);
router.get('/feedback', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.getFeedbacks);
router.put('/feedback/:feedbackId/status', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.updateFeedbackStatus);
// Survey & NPS
router.post('/surveys', reviewController_1.ReviewController.submitSurvey);
router.get('/surveys', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.getSurveys);
router.get('/nps/stats', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.getNPSStats);
// Settings
router.get('/settings', reviewController_1.ReviewController.getSetting);
router.post('/settings', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.upsertSetting);
// Stats
router.get('/stats', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.getStats);
// Reports admin
router.put('/reports/:reportId/resolve', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.resolveReport);
// Review list + create
router.get('/', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.getAll);
router.post('/', reviewController_1.ReviewController.create);
// Per-review operations — specific paths BEFORE /:id
router.get('/:id', reviewController_1.ReviewController.getById);
router.put('/:id/status', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.updateStatus);
router.post('/:id/services', reviewController_1.ReviewController.addServiceReview);
router.post('/:id/packages', reviewController_1.ReviewController.addPackageFeedback);
router.post('/:id/booking', reviewController_1.ReviewController.addBookingReview);
router.post('/:id/criteria', reviewController_1.ReviewController.addCriteria);
router.post('/:id/rating', reviewController_1.ReviewController.upsertRating);
router.post('/:id/media', reviewController_1.ReviewController.addMedia);
router.post('/:id/react', reviewController_1.ReviewController.react);
router.post('/:id/reply', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.reply);
router.post('/:id/report', reviewController_1.ReviewController.report);
router.post('/:id/moderate', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.moderate);
router.post('/:id/verify', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.verify);
router.post('/:id/feature', (0, authMiddleware_1.requireRole)('admin', 'manager'), reviewController_1.ReviewController.featureTestimonial);
exports.default = router;
