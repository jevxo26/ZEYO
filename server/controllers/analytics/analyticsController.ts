import { Request, Response } from 'express';
import { AnalyticsService } from '../../services/analytics/analyticsService';
import { ReportingService } from '../../services/analytics/reportingService';

export class AnalyticsController {
  // ─── Analytics ─────────────────────────────────────────────────────────────
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getDashboardAnalytics();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  static async getBookingMetrics(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getBookingAnalytics();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  static async getRevenueMetrics(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getRevenueAnalytics();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // ─── Reporting ─────────────────────────────────────────────────────────────
  static async getReports(req: Request, res: Response) {
    try {
      const data = await ReportingService.getReports();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  static async generateReport(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { reportName, reportType } = req.body;
      const data = await ReportingService.generateReport(reportName, reportType, userId);
      res.status(201).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // ─── KPIs ──────────────────────────────────────────────────────────────────
  static async getKPIs(req: Request, res: Response) {
    try {
      const data = await ReportingService.getKPIs();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}
