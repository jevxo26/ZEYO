"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const analyticsController_1 = require("../../controllers/analytics/analyticsController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'));
// Dashboards & Metrics
router.get('/dashboards', analyticsController_1.AnalyticsController.getDashboardMetrics);
router.get('/bookings', analyticsController_1.AnalyticsController.getBookingMetrics);
router.get('/revenue', analyticsController_1.AnalyticsController.getRevenueMetrics);
// Reporting
router.get('/reports', analyticsController_1.AnalyticsController.getReports);
router.post('/reports/generate', analyticsController_1.AnalyticsController.generateReport);
// KPIs
router.get('/kpis', analyticsController_1.AnalyticsController.getKPIs);
exports.default = router;
