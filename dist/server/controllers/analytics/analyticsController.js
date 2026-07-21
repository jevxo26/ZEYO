"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analyticsService_1 = require("../../services/analytics/analyticsService");
const reportingService_1 = require("../../services/analytics/reportingService");
class AnalyticsController {
    // ─── Analytics ─────────────────────────────────────────────────────────────
    static async getDashboardMetrics(req, res) {
        try {
            const data = await analyticsService_1.AnalyticsService.getDashboardAnalytics();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getBookingMetrics(req, res) {
        try {
            const data = await analyticsService_1.AnalyticsService.getBookingAnalytics();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getRevenueMetrics(req, res) {
        try {
            const data = await analyticsService_1.AnalyticsService.getRevenueAnalytics();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // ─── Reporting ─────────────────────────────────────────────────────────────
    static async getReports(req, res) {
        try {
            const data = await reportingService_1.ReportingService.getReports();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async generateReport(req, res) {
        try {
            const userId = req.user.userId;
            const { reportName, reportType } = req.body;
            const data = await reportingService_1.ReportingService.generateReport(reportName, reportType, userId);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // ─── KPIs ──────────────────────────────────────────────────────────────────
    static async getKPIs(req, res) {
        try {
            const data = await reportingService_1.ReportingService.getKPIs();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
