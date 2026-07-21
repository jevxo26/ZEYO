"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const reviewService_1 = require("../../services/review/reviewService");
class ReviewController {
}
exports.ReviewController = ReviewController;
_a = ReviewController;
// ── Review ─────────────────────────────────────────────────────────────────
ReviewController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Review submitted', data });
});
ReviewController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, isPublished, customerId, page, limit } = req.query;
    const data = await reviewService_1.ReviewService.getAll({
        status: status,
        isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
        customerId: customerId ? Number(customerId) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ReviewController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.getById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Review not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ReviewController.getStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await reviewService_1.ReviewService.getStats();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ReviewController.updateStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await reviewService_1.ReviewService.updateStatus(Number(req.params.id), req.body.status, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `Status → ${req.body.status}`, data });
});
// ── Service Review ─────────────────────────────────────────────────────────
ReviewController.addServiceReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.addServiceReview(Object.assign({ reviewId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Service review added', data });
});
// ── Package Feedback ───────────────────────────────────────────────────────
ReviewController.addPackageFeedback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.addPackageFeedback(Object.assign({ reviewId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Package feedback added', data });
});
// ── Booking Review ─────────────────────────────────────────────────────────
ReviewController.addBookingReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.addBookingReview(Object.assign({ reviewId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Booking review added', data });
});
// ── Criteria ───────────────────────────────────────────────────────────────
ReviewController.addCriteria = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.addCriteria(Number(req.params.id), req.body.criteria);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Criteria saved', data });
});
// ── Rating ─────────────────────────────────────────────────────────────────
ReviewController.upsertRating = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { averageRating, totalRating } = req.body;
    const data = await reviewService_1.ReviewService.upsertRating(Number(req.params.id), averageRating, totalRating);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Rating updated', data });
});
// ── Media ──────────────────────────────────────────────────────────────────
ReviewController.addMedia = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.addMedia(Object.assign({ reviewId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Media uploaded', data });
});
// ── Reaction ───────────────────────────────────────────────────────────────
ReviewController.react = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { customerId, reactionType } = req.body;
    const data = await reviewService_1.ReviewService.react(Number(req.params.id), customerId, reactionType);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Reaction recorded', data });
});
// ── Reply ──────────────────────────────────────────────────────────────────
ReviewController.reply = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const adminId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await reviewService_1.ReviewService.reply(Number(req.params.id), adminId, req.body.reply);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Reply posted', data });
});
// ── Report ─────────────────────────────────────────────────────────────────
ReviewController.report = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await reviewService_1.ReviewService.report(Number(req.params.id), userId, req.body.reason);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Review reported', data });
});
ReviewController.resolveReport = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.resolveReport(Number(req.params.reportId), req.body.status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Report resolved', data });
});
// ── Moderation ─────────────────────────────────────────────────────────────
ReviewController.moderate = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const adminId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const { action, remarks } = req.body;
    const data = await reviewService_1.ReviewService.moderate(Number(req.params.id), adminId, action, remarks);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `Review ${action}`, data });
});
// ── Verification ───────────────────────────────────────────────────────────
ReviewController.verify = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const adminId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await reviewService_1.ReviewService.verify(Number(req.params.id), adminId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Review verified', data });
});
// ── Testimonials ───────────────────────────────────────────────────────────
ReviewController.featureTestimonial = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { title, displayOrder } = req.body;
    const data = await reviewService_1.ReviewService.featureTestimonial(Number(req.params.id), title, displayOrder);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Testimonial featured', data });
});
ReviewController.getFeaturedTestimonials = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await reviewService_1.ReviewService.getFeaturedTestimonials();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── Customer Feedback ──────────────────────────────────────────────────────
ReviewController.submitFeedback = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.submitFeedback(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Feedback submitted', data });
});
ReviewController.getFeedbacks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.getFeedbacks(req.query);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ReviewController.updateFeedbackStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.updateFeedbackStatus(Number(req.params.feedbackId), req.body.status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Feedback status updated', data });
});
// ── Survey ─────────────────────────────────────────────────────────────────
ReviewController.submitSurvey = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.submitSurvey(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Survey submitted', data });
});
ReviewController.getSurveys = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await reviewService_1.ReviewService.getSurveys();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ReviewController.getNPSStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await reviewService_1.ReviewService.getNPSStats();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── Settings ───────────────────────────────────────────────────────────────
ReviewController.getSetting = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await reviewService_1.ReviewService.getSetting();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ReviewController.upsertSetting = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await reviewService_1.ReviewService.upsertSetting(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Settings saved', data });
});
