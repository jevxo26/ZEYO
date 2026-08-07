import { prisma } from '../../config/prisma';

export class CMSService {
  // ─── Banners ──────────────────────────────────────────────────────────────
  static async getBanners() {
    return prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  static async createBanner(data: any) {
    return prisma.banner.create({ data });
  }

  // ─── FAQs ─────────────────────────────────────────────────────────────────
  static async getFAQs() {
    return prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  static async createFAQ(data: any) {
    return prisma.fAQ.create({ data });
  }

  // ─── Blogs ────────────────────────────────────────────────────────────────
  static async getBlogs() {
    return prisma.blog.findMany({
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createBlog(authorId: number, data: any) {
    return prisma.blog.create({
      data: { ...data, authorId }
    });
  }

  // ─── Static Pages ─────────────────────────────────────────────────────────
  static async getStaticPages() {
    return prisma.staticPage.findMany();
  }

  static async createStaticPage(data: any) {
    return prisma.staticPage.create({ data });
  }

  // ─── Terms & Privacy ──────────────────────────────────────────────────────
  static async getTerms() {
    return prisma.termsAndCondition.findMany({ orderBy: { effectiveDate: 'desc' } });
  }

  static async getPrivacyPolicies() {
    return prisma.privacyPolicy.findMany({ orderBy: { effectiveDate: 'desc' } });
  }
}
