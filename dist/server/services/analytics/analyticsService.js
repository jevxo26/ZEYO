"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../../config/prisma");
class AnalyticsService {
    // Dashboards
    static async getDashboardAnalytics() {
        return prisma_1.prisma.dashboardAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
    }
    // Bookings
    static async getBookingAnalytics() {
        return prisma_1.prisma.bookingAnalytics.findMany({ orderBy: { bookingDate: 'desc' }, take: 30 });
    }
    // Revenue
    static async getRevenueAnalytics() {
        return prisma_1.prisma.revenueAnalytics.findMany({ orderBy: { date: 'desc' }, take: 30 });
    }
    // Customers
    static async getCustomerAnalytics() {
        return prisma_1.prisma.customerAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 30 });
    }
    // Performance & Conversions
    static async getPerformanceAnalytics() {
        return prisma_1.prisma.performanceAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
    }
    static async getConversionAnalytics() {
        return prisma_1.prisma.conversionAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
    }
    // Entities
    static async getVendorAnalytics() {
        return prisma_1.prisma.vendorAnalytics.findMany({ include: { vendor: true } });
    }
    static async getServiceAnalytics() {
        return prisma_1.prisma.serviceAnalytics.findMany({ include: { service: true } });
    }
    static async getPackageAnalytics() {
        return prisma_1.prisma.packageAnalytics.findMany({ include: { package: true } });
    }
    static async getEventAnalytics() {
        return prisma_1.prisma.eventAnalytics.findMany({ include: { event: true } });
    }
}
exports.AnalyticsService = AnalyticsService;
