"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSService = void 0;
const prisma_1 = require("../../config/prisma");
class CMSService {
    // ─── Banners ──────────────────────────────────────────────────────────────
    static async getBanners() {
        return prisma_1.prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
    }
    static async createBanner(data) {
        return prisma_1.prisma.banner.create({ data });
    }
    // ─── FAQs ─────────────────────────────────────────────────────────────────
    static async getFAQs() {
        return prisma_1.prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } });
    }
    static async createFAQ(data) {
        return prisma_1.prisma.fAQ.create({ data });
    }
    // ─── Blogs ────────────────────────────────────────────────────────────────
    static async getBlogs() {
        return prisma_1.prisma.blog.findMany({
            include: { author: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async createBlog(authorId, data) {
        return prisma_1.prisma.blog.create({
            data: Object.assign(Object.assign({}, data), { authorId })
        });
    }
    // ─── Static Pages ─────────────────────────────────────────────────────────
    static async getStaticPages() {
        return prisma_1.prisma.staticPage.findMany();
    }
    static async createStaticPage(data) {
        return prisma_1.prisma.staticPage.create({ data });
    }
    // ─── Terms & Privacy ──────────────────────────────────────────────────────
    static async getTerms() {
        return prisma_1.prisma.termsAndCondition.findMany({ orderBy: { effectiveDate: 'desc' } });
    }
    static async getPrivacyPolicies() {
        return prisma_1.prisma.privacyPolicy.findMany({ orderBy: { effectiveDate: 'desc' } });
    }
}
exports.CMSService = CMSService;
