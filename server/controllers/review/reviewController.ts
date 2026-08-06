import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ReviewService } from '../../services/review/reviewService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class ReviewController {

  // ── Review ─────────────────────────────────────────────────────────────────
  static create = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Review submitted', data });
  });

  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { status, isPublished, customerId, page, limit } = req.query;
    const data = await ReviewService.getAll({
      status: status as string,
      isPublished: isPublished !== undefined ? isPublished === 'true' : undefined,
      customerId: customerId ? Number(customerId) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    sendResponse(res, { statusCode: 200, data });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.getById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Review not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static getStats = catchAsync(async (_req: Request, res: Response) => {
    const data = await ReviewService.getStats();
    sendResponse(res, { statusCode: 200, data });
  });

  static updateStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await ReviewService.updateStatus(Number(req.params.id), req.body.status, userId);
    sendResponse(res, { statusCode: 200, message: `Status → ${req.body.status}`, data });
  });

  // ── Service Review ─────────────────────────────────────────────────────────
  static addServiceReview = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.addServiceReview({ reviewId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Service review added', data });
  });

  // ── Package Feedback ───────────────────────────────────────────────────────
  static addPackageFeedback = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.addPackageFeedback({ reviewId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Package feedback added', data });
  });

  // ── Booking Review ─────────────────────────────────────────────────────────
  static addBookingReview = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.addBookingReview({ reviewId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Booking review added', data });
  });

  // ── Criteria ───────────────────────────────────────────────────────────────
  static addCriteria = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.addCriteria(Number(req.params.id), req.body.criteria);
    sendResponse(res, { statusCode: 201, message: 'Criteria saved', data });
  });

  // ── Rating ─────────────────────────────────────────────────────────────────
  static upsertRating = catchAsync(async (req: Request, res: Response) => {
    const { averageRating, totalRating } = req.body;
    const data = await ReviewService.upsertRating(Number(req.params.id), averageRating, totalRating);
    sendResponse(res, { statusCode: 200, message: 'Rating updated', data });
  });

  // ── Media ──────────────────────────────────────────────────────────────────
  static addMedia = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.addMedia({ reviewId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Media uploaded', data });
  });

  // ── Reaction ───────────────────────────────────────────────────────────────
  static react = catchAsync(async (req: Request, res: Response) => {
    const { customerId, reactionType } = req.body;
    const data = await ReviewService.react(Number(req.params.id), customerId, reactionType);
    sendResponse(res, { statusCode: 200, message: 'Reaction recorded', data });
  });

  // ── Reply ──────────────────────────────────────────────────────────────────
  static reply = catchAsync(async (req: Request, res: Response) => {
    const adminId = (req as AuthRequest).user?.userId!;
    const data = await ReviewService.reply(Number(req.params.id), adminId, req.body.reply);
    sendResponse(res, { statusCode: 201, message: 'Reply posted', data });
  });

  // ── Report ─────────────────────────────────────────────────────────────────
  static report = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await ReviewService.report(Number(req.params.id), userId!, req.body.reason);
    sendResponse(res, { statusCode: 201, message: 'Review reported', data });
  });

  static resolveReport = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.resolveReport(Number(req.params.reportId), req.body.status);
    sendResponse(res, { statusCode: 200, message: 'Report resolved', data });
  });

  // ── Moderation ─────────────────────────────────────────────────────────────
  static moderate = catchAsync(async (req: Request, res: Response) => {
    const adminId = (req as AuthRequest).user?.userId!;
    const { action, remarks } = req.body;
    const data = await ReviewService.moderate(Number(req.params.id), adminId, action, remarks);
    sendResponse(res, { statusCode: 200, message: `Review ${action}`, data });
  });

  // ── Verification ───────────────────────────────────────────────────────────
  static verify = catchAsync(async (req: Request, res: Response) => {
    const adminId = (req as AuthRequest).user?.userId!;
    const data = await ReviewService.verify(Number(req.params.id), adminId);
    sendResponse(res, { statusCode: 200, message: 'Review verified', data });
  });

  // ── Testimonials ───────────────────────────────────────────────────────────
  static featureTestimonial = catchAsync(async (req: Request, res: Response) => {
    const { title, displayOrder } = req.body;
    const data = await ReviewService.featureTestimonial(Number(req.params.id), title, displayOrder);
    sendResponse(res, { statusCode: 200, message: 'Testimonial featured', data });
  });

  static getFeaturedTestimonials = catchAsync(async (_req: Request, res: Response) => {
    const data = await ReviewService.getFeaturedTestimonials();
    sendResponse(res, { statusCode: 200, data });
  });

  // ── Customer Feedback ──────────────────────────────────────────────────────
  static submitFeedback = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.submitFeedback(req.body);
    sendResponse(res, { statusCode: 201, message: 'Feedback submitted', data });
  });

  static getFeedbacks = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.getFeedbacks(req.query as { status?: string; feedbackType?: string });
    sendResponse(res, { statusCode: 200, data });
  });

  static updateFeedbackStatus = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.updateFeedbackStatus(Number(req.params.feedbackId), req.body.status);
    sendResponse(res, { statusCode: 200, message: 'Feedback status updated', data });
  });

  // ── Survey ─────────────────────────────────────────────────────────────────
  static submitSurvey = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.submitSurvey(req.body);
    sendResponse(res, { statusCode: 201, message: 'Survey submitted', data });
  });

  static getSurveys = catchAsync(async (_req: Request, res: Response) => {
    const data = await ReviewService.getSurveys();
    sendResponse(res, { statusCode: 200, data });
  });

  static getNPSStats = catchAsync(async (_req: Request, res: Response) => {
    const data = await ReviewService.getNPSStats();
    sendResponse(res, { statusCode: 200, data });
  });

  // ── Settings ───────────────────────────────────────────────────────────────
  static getSetting = catchAsync(async (_req: Request, res: Response) => {
    const data = await ReviewService.getSetting();
    sendResponse(res, { statusCode: 200, data });
  });

  static upsertSetting = catchAsync(async (req: Request, res: Response) => {
    const data = await ReviewService.upsertSetting(req.body);
    sendResponse(res, { statusCode: 200, message: 'Settings saved', data });
  });
}
