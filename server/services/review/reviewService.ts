import { prisma } from '../../config/prisma';
// ─────────────────────────────────────────────────────────────────────────────
// ReviewService — Part 13: Review, Rating & Feedback Module
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export const ReviewService = {

  // ── Review CRUD ───────────────────────────────────────────────────────────
  create: catchServiceAsync(async (data: {
    bookingId: number; customerId: number; overallRating: number;
    title?: string; review?: string;
  }) => {
    const rev = await prisma.review.create({ data });
    // Auto-create analytics record
    await prisma.reviewAnalytics.create({ data: { reviewId: rev.id } });
    // Auto-create history entry
    await prisma.reviewLog.create({ data: { reviewId: rev.id, logType: 'created', description: 'Review submitted' } });
    return rev;
  }),

  getAll: catchServiceAsync(async (filters: {
    status?: string; isPublished?: boolean; customerId?: number; page?: number; limit?: number;
  } = {}) => {
    const { status, isPublished, customerId, page = 1, limit = 20 } = filters;
    const where: Record<string, unknown> = {};
    if (status)      where.status      = status;
    if (isPublished !== undefined) where.isPublished = isPublished;
    if (customerId)  where.customerId  = customerId;
    const [data, total] = await Promise.all([
      prisma.review.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { verification: true, analytics: true, replies: true },
      }),
      prisma.review.count({ where }),
    ]);
    return { data, total, page, limit };
  }),

  getById: catchServiceAsync(async (id: number) =>
    prisma.review.findUnique({
      where: { id },
      include: {
        serviceReviews: true,
        packageFeedbacks: true,
        bookingReview: true,
        criteria: true,
        rating: true,
        media: true,
        reactions: true,
        replies: true,
        reports: true,
        moderation: true,
        verification: true,
        analytics: true,
        history: { orderBy: { createdAt: 'desc' } },
        logs: { orderBy: { createdAt: 'desc' } },
        testimonial: true,
      },
    })),

  updateStatus: catchServiceAsync(async (id: number, status: string, performedBy?: number) => {
    const rev = await prisma.review.update({ where: { id }, data: { status, isPublished: status === 'approved' } });
    await prisma.reviewHistory.create({ data: { reviewId: id, action: 'status_update', performedBy, newValue: status } });
    await prisma.reviewLog.create({ data: { reviewId: id, logType: 'updated', description: `Status changed to ${status}` } });
    return rev;
  }),

  getStats: catchServiceAsync(async () => {
    const [total, pending, approved, hidden, removed] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({ where: { status: 'pending' } }),
      prisma.review.count({ where: { status: 'approved' } }),
      prisma.review.count({ where: { status: 'hidden' } }),
      prisma.review.count({ where: { status: 'removed' } }),
    ]);
    const avgRating = await prisma.review.aggregate({ _avg: { overallRating: true } });
    return { total, pending, approved, hidden, removed, averageRating: avgRating._avg.overallRating ?? 0 };
  }),

  // ── ServiceReview ─────────────────────────────────────────────────────────
  addServiceReview: catchServiceAsync(async (data: {
    reviewId: number; serviceId?: number; rating: number; reviewText?: string;
  }) => prisma.serviceReview.create({ data })),

  // ── ReviewPackageFeedback ─────────────────────────────────────────────────
  addPackageFeedback: catchServiceAsync(async (data: {
    reviewId: number; packageId?: number; rating: number; reviewText?: string;
  }) => prisma.reviewPackageFeedback.create({ data })),

  // ── BookingReview ─────────────────────────────────────────────────────────
  addBookingReview: catchServiceAsync(async (data: {
    reviewId: number; bookingId: number; eventExperience?: string; recommendation?: boolean;
  }) => prisma.bookingReview.create({ data })),

  // ── CustomerFeedback ──────────────────────────────────────────────────────
  submitFeedback: catchServiceAsync(async (data: {
    customerId: number; bookingId?: number; feedbackType?: string; subject?: string; message: string;
  }) => prisma.customerFeedback.create({ data })),

  getFeedbacks: catchServiceAsync(async (filters: { status?: string; feedbackType?: string } = {}) => {
    const where: Record<string, unknown> = {};
    if (filters.status)       where.status       = filters.status;
    if (filters.feedbackType) where.feedbackType = filters.feedbackType;
    return prisma.customerFeedback.findMany({ where, orderBy: { createdAt: 'desc' } });
  }),

  updateFeedbackStatus: catchServiceAsync(async (id: number, status: string) =>
    prisma.customerFeedback.update({ where: { id }, data: { status } })),

  // ── ReviewCriteria ────────────────────────────────────────────────────────
  addCriteria: catchServiceAsync(async (reviewId: number, criteria: Array<{ criteriaName: string; rating: number }>) =>
    prisma.reviewCriteria.createMany({ data: criteria.map(c => ({ reviewId, ...c })) })),

  // ── ReviewRating ──────────────────────────────────────────────────────────
  upsertRating: catchServiceAsync(async (reviewId: number, averageRating: number, totalRating: number) =>
    prisma.reviewRating.upsert({
      where: { reviewId },
      create: { reviewId, averageRating, totalRating },
      update: { averageRating, totalRating },
    })),

  // ── ReviewMedia ───────────────────────────────────────────────────────────
  addMedia: catchServiceAsync(async (data: {
    reviewId: number; fileType?: string; fileUrl: string; thumbnail?: string;
  }) => prisma.reviewMedia.create({ data })),

  // ── ReviewReaction ────────────────────────────────────────────────────────
  react: catchServiceAsync(async (reviewId: number, customerId: number, reactionType: string) => {
    const reaction = await prisma.reviewReaction.upsert({
      where: { reviewId_customerId_reactionType: { reviewId, customerId, reactionType } },
      create: { reviewId, customerId, reactionType },
      update: {},
    });
    // Update analytics
    const helpfulCount = await prisma.reviewReaction.count({ where: { reviewId, reactionType: 'helpful' } });
    const likes = await prisma.reviewReaction.count({ where: { reviewId, reactionType: 'like' } });
    await prisma.reviewAnalytics.upsert({
      where: { reviewId },
      create: { reviewId, helpfulCount, likes },
      update: { helpfulCount, likes },
    });
    return reaction;
  }),

  // ── ReviewReply ───────────────────────────────────────────────────────────
  reply: catchServiceAsync(async (reviewId: number, adminId: number, reply: string) =>
    prisma.reviewReply.create({ data: { reviewId, adminId, reply } })),

  // ── ReviewReport ──────────────────────────────────────────────────────────
  report: catchServiceAsync(async (reviewId: number, reportedBy: number, reason: string) =>
    prisma.reviewReport.create({ data: { reviewId, reportedBy, reason } })),

  resolveReport: catchServiceAsync(async (reportId: number, status: string) =>
    prisma.reviewReport.update({ where: { id: reportId }, data: { status } })),

  // ── ReviewModeration ──────────────────────────────────────────────────────
  moderate: catchServiceAsync(async (reviewId: number, moderatedBy: number, action: string, remarks?: string) => {
    const mod = await prisma.reviewModeration.create({ data: { reviewId, moderatedBy, action, remarks } });
    // Sync review status
    const statusMap: Record<string, string> = { approved: 'approved', hidden: 'hidden', removed: 'removed' };
    if (statusMap[action]) {
      await prisma.review.update({ where: { id: reviewId }, data: { status: statusMap[action], isPublished: action === 'approved' } });
    }
    return mod;
  }),

  // ── ReviewVerification ────────────────────────────────────────────────────
  verify: catchServiceAsync(async (reviewId: number, verifiedBy: number) =>
    prisma.reviewVerification.upsert({
      where: { reviewId },
      create: { reviewId, isVerifiedBooking: true, verifiedBy, verifiedAt: new Date() },
      update: { isVerifiedBooking: true, verifiedBy, verifiedAt: new Date() },
    })),

  // ── CustomerTestimonial ───────────────────────────────────────────────────
  featureTestimonial: catchServiceAsync(async (reviewId: number, title?: string, displayOrder?: number) =>
    prisma.customerTestimonial.upsert({
      where: { reviewId },
      create: { reviewId, title, displayOrder: displayOrder ?? 0, isFeatured: true },
      update: { title, displayOrder: displayOrder ?? 0, isFeatured: true },
    })),

  getFeaturedTestimonials: catchServiceAsync(async () =>
    prisma.customerTestimonial.findMany({
      where: { isFeatured: true },
      orderBy: { displayOrder: 'asc' },
      include: { review: { include: { verification: true, analytics: true } } },
    })),

  // ── SatisfactionSurvey ────────────────────────────────────────────────────
  submitSurvey: catchServiceAsync(async (data: {
    bookingId: number; customerId: number; overallExperience: number;
    serviceQuality: number; supportExperience: number; wouldRecommend?: string;
    npsScore?: number;
  }) => {
    const { npsScore, ...surveyData } = data;
    const survey = await prisma.satisfactionSurvey.create({ data: surveyData });
    // Auto-create NPS score
    if (npsScore !== undefined) {
      const category = npsScore >= 9 ? 'promoter' : npsScore >= 7 ? 'passive' : 'detractor';
      await prisma.nPSScore.create({ data: { surveyId: survey.id, score: npsScore, category } });
    }
    return survey;
  }),

  getSurveys: catchServiceAsync(async () =>
    prisma.satisfactionSurvey.findMany({
      orderBy: { createdAt: 'desc' },
      include: { npsScore: true },
    })),

  getNPSStats: catchServiceAsync(async () => {
    const [total, promoters, passives, detractors] = await Promise.all([
      prisma.nPSScore.count(),
      prisma.nPSScore.count({ where: { category: 'promoter' } }),
      prisma.nPSScore.count({ where: { category: 'passive' } }),
      prisma.nPSScore.count({ where: { category: 'detractor' } }),
    ]);
    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
    return { total, promoters, passives, detractors, npsScore };
  }),

  // ── ReviewSetting ─────────────────────────────────────────────────────────
  getSetting: catchServiceAsync(async () => prisma.reviewSetting.findFirst()),

  upsertSetting: catchServiceAsync(async (data: Partial<{
    allowReview: boolean; allowPhotoUpload: boolean; allowVideoUpload: boolean;
    allowReply: boolean; allowEdit: boolean; requireBookingVerification: boolean; status: string;
  }>) => {
    const existing = await prisma.reviewSetting.findFirst();
    if (existing) return prisma.reviewSetting.update({ where: { id: existing.id }, data });
    return prisma.reviewSetting.create({ data: { ...data } });
  }),
};
