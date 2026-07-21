"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
exports.ReviewService = {
    // ── Review CRUD ───────────────────────────────────────────────────────────
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const rev = await prisma_1.prisma.review.create({ data });
        // Auto-create analytics record
        await prisma_1.prisma.reviewAnalytics.create({ data: { reviewId: rev.id } });
        // Auto-create history entry
        await prisma_1.prisma.reviewLog.create({ data: { reviewId: rev.id, logType: 'created', description: 'Review submitted' } });
        return rev;
    }),
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        const { status, isPublished, customerId, page = 1, limit = 20 } = filters;
        const where = {};
        if (status)
            where.status = status;
        if (isPublished !== undefined)
            where.isPublished = isPublished;
        if (customerId)
            where.customerId = customerId;
        const [data, total] = await Promise.all([
            prisma_1.prisma.review.findMany({
                where, skip: (page - 1) * limit, take: limit,
                orderBy: { createdAt: 'desc' },
                include: { verification: true, analytics: true, replies: true },
            }),
            prisma_1.prisma.review.count({ where }),
        ]);
        return { data, total, page, limit };
    }),
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.review.findUnique({
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
    updateStatus: (0, catchServiceAsync_1.catchServiceAsync)(async (id, status, performedBy) => {
        const rev = await prisma_1.prisma.review.update({ where: { id }, data: { status, isPublished: status === 'approved' } });
        await prisma_1.prisma.reviewHistory.create({ data: { reviewId: id, action: 'status_update', performedBy, newValue: status } });
        await prisma_1.prisma.reviewLog.create({ data: { reviewId: id, logType: 'updated', description: `Status changed to ${status}` } });
        return rev;
    }),
    getStats: (0, catchServiceAsync_1.catchServiceAsync)(async () => {
        var _a;
        const [total, pending, approved, hidden, removed] = await Promise.all([
            prisma_1.prisma.review.count(),
            prisma_1.prisma.review.count({ where: { status: 'pending' } }),
            prisma_1.prisma.review.count({ where: { status: 'approved' } }),
            prisma_1.prisma.review.count({ where: { status: 'hidden' } }),
            prisma_1.prisma.review.count({ where: { status: 'removed' } }),
        ]);
        const avgRating = await prisma_1.prisma.review.aggregate({ _avg: { overallRating: true } });
        return { total, pending, approved, hidden, removed, averageRating: (_a = avgRating._avg.overallRating) !== null && _a !== void 0 ? _a : 0 };
    }),
    // ── ServiceReview ─────────────────────────────────────────────────────────
    addServiceReview: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.serviceReview.create({ data })),
    // ── ReviewPackageFeedback ─────────────────────────────────────────────────
    addPackageFeedback: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.reviewPackageFeedback.create({ data })),
    // ── BookingReview ─────────────────────────────────────────────────────────
    addBookingReview: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.bookingReview.create({ data })),
    // ── CustomerFeedback ──────────────────────────────────────────────────────
    submitFeedback: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.customerFeedback.create({ data })),
    getFeedbacks: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.feedbackType)
            where.feedbackType = filters.feedbackType;
        return prisma_1.prisma.customerFeedback.findMany({ where, orderBy: { createdAt: 'desc' } });
    }),
    updateFeedbackStatus: (0, catchServiceAsync_1.catchServiceAsync)(async (id, status) => prisma_1.prisma.customerFeedback.update({ where: { id }, data: { status } })),
    // ── ReviewCriteria ────────────────────────────────────────────────────────
    addCriteria: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, criteria) => prisma_1.prisma.reviewCriteria.createMany({ data: criteria.map(c => (Object.assign({ reviewId }, c))) })),
    // ── ReviewRating ──────────────────────────────────────────────────────────
    upsertRating: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, averageRating, totalRating) => prisma_1.prisma.reviewRating.upsert({
        where: { reviewId },
        create: { reviewId, averageRating, totalRating },
        update: { averageRating, totalRating },
    })),
    // ── ReviewMedia ───────────────────────────────────────────────────────────
    addMedia: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.reviewMedia.create({ data })),
    // ── ReviewReaction ────────────────────────────────────────────────────────
    react: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, customerId, reactionType) => {
        const reaction = await prisma_1.prisma.reviewReaction.upsert({
            where: { reviewId_customerId_reactionType: { reviewId, customerId, reactionType } },
            create: { reviewId, customerId, reactionType },
            update: {},
        });
        // Update analytics
        const helpfulCount = await prisma_1.prisma.reviewReaction.count({ where: { reviewId, reactionType: 'helpful' } });
        const likes = await prisma_1.prisma.reviewReaction.count({ where: { reviewId, reactionType: 'like' } });
        await prisma_1.prisma.reviewAnalytics.upsert({
            where: { reviewId },
            create: { reviewId, helpfulCount, likes },
            update: { helpfulCount, likes },
        });
        return reaction;
    }),
    // ── ReviewReply ───────────────────────────────────────────────────────────
    reply: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, adminId, reply) => prisma_1.prisma.reviewReply.create({ data: { reviewId, adminId, reply } })),
    // ── ReviewReport ──────────────────────────────────────────────────────────
    report: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, reportedBy, reason) => prisma_1.prisma.reviewReport.create({ data: { reviewId, reportedBy, reason } })),
    resolveReport: (0, catchServiceAsync_1.catchServiceAsync)(async (reportId, status) => prisma_1.prisma.reviewReport.update({ where: { id: reportId }, data: { status } })),
    // ── ReviewModeration ──────────────────────────────────────────────────────
    moderate: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, moderatedBy, action, remarks) => {
        const mod = await prisma_1.prisma.reviewModeration.create({ data: { reviewId, moderatedBy, action, remarks } });
        // Sync review status
        const statusMap = { approved: 'approved', hidden: 'hidden', removed: 'removed' };
        if (statusMap[action]) {
            await prisma_1.prisma.review.update({ where: { id: reviewId }, data: { status: statusMap[action], isPublished: action === 'approved' } });
        }
        return mod;
    }),
    // ── ReviewVerification ────────────────────────────────────────────────────
    verify: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, verifiedBy) => prisma_1.prisma.reviewVerification.upsert({
        where: { reviewId },
        create: { reviewId, isVerifiedBooking: true, verifiedBy, verifiedAt: new Date() },
        update: { isVerifiedBooking: true, verifiedBy, verifiedAt: new Date() },
    })),
    // ── CustomerTestimonial ───────────────────────────────────────────────────
    featureTestimonial: (0, catchServiceAsync_1.catchServiceAsync)(async (reviewId, title, displayOrder) => prisma_1.prisma.customerTestimonial.upsert({
        where: { reviewId },
        create: { reviewId, title, displayOrder: displayOrder !== null && displayOrder !== void 0 ? displayOrder : 0, isFeatured: true },
        update: { title, displayOrder: displayOrder !== null && displayOrder !== void 0 ? displayOrder : 0, isFeatured: true },
    })),
    getFeaturedTestimonials: (0, catchServiceAsync_1.catchServiceAsync)(async () => prisma_1.prisma.customerTestimonial.findMany({
        where: { isFeatured: true },
        orderBy: { displayOrder: 'asc' },
        include: { review: { include: { verification: true, analytics: true } } },
    })),
    // ── SatisfactionSurvey ────────────────────────────────────────────────────
    submitSurvey: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const { npsScore } = data, surveyData = __rest(data, ["npsScore"]);
        const survey = await prisma_1.prisma.satisfactionSurvey.create({ data: surveyData });
        // Auto-create NPS score
        if (npsScore !== undefined) {
            const category = npsScore >= 9 ? 'promoter' : npsScore >= 7 ? 'passive' : 'detractor';
            await prisma_1.prisma.nPSScore.create({ data: { surveyId: survey.id, score: npsScore, category } });
        }
        return survey;
    }),
    getSurveys: (0, catchServiceAsync_1.catchServiceAsync)(async () => prisma_1.prisma.satisfactionSurvey.findMany({
        orderBy: { createdAt: 'desc' },
        include: { npsScore: true },
    })),
    getNPSStats: (0, catchServiceAsync_1.catchServiceAsync)(async () => {
        const [total, promoters, passives, detractors] = await Promise.all([
            prisma_1.prisma.nPSScore.count(),
            prisma_1.prisma.nPSScore.count({ where: { category: 'promoter' } }),
            prisma_1.prisma.nPSScore.count({ where: { category: 'passive' } }),
            prisma_1.prisma.nPSScore.count({ where: { category: 'detractor' } }),
        ]);
        const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;
        return { total, promoters, passives, detractors, npsScore };
    }),
    // ── ReviewSetting ─────────────────────────────────────────────────────────
    getSetting: (0, catchServiceAsync_1.catchServiceAsync)(async () => prisma_1.prisma.reviewSetting.findFirst()),
    upsertSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const existing = await prisma_1.prisma.reviewSetting.findFirst();
        if (existing)
            return prisma_1.prisma.reviewSetting.update({ where: { id: existing.id }, data });
        return prisma_1.prisma.reviewSetting.create({ data: Object.assign({}, data) });
    }),
};
