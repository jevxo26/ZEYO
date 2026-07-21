import { prisma } from '../../config/prisma';

export class AnalyticsService {
  // Dashboards
  static async getDashboardAnalytics() {
    return prisma.dashboardAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
  }

  // Bookings
  static async getBookingAnalytics() {
    return prisma.bookingAnalytics.findMany({ orderBy: { bookingDate: 'desc' }, take: 30 });
  }

  // Revenue
  static async getRevenueAnalytics() {
    return prisma.revenueAnalytics.findMany({ orderBy: { date: 'desc' }, take: 30 });
  }

  // Customers
  static async getCustomerAnalytics() {
    return prisma.customerAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 30 });
  }

  // Performance & Conversions
  static async getPerformanceAnalytics() {
    return prisma.performanceAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
  }
  
  static async getConversionAnalytics() {
    return prisma.conversionAnalytics.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
  }

  // Entities
  static async getVendorAnalytics() {
    return prisma.vendorAnalytics.findMany({ include: { vendor: true } });
  }
  
  static async getServiceAnalytics() {
    return prisma.serviceAnalytics.findMany({ include: { service: true } });
  }

  static async getPackageAnalytics() {
    return prisma.packageAnalytics.findMany({ include: { package: true } });
  }

  static async getEventAnalytics() {
    return prisma.eventAnalytics.findMany({ include: { event: true } });
  }
}
