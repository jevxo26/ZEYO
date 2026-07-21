import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { AnalyticsController } from '../../controllers/analytics/analyticsController';

const router = Router();

router.use(verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'));

// Dashboards & Metrics
router.get('/dashboards', AnalyticsController.getDashboardMetrics);
router.get('/bookings', AnalyticsController.getBookingMetrics);
router.get('/revenue', AnalyticsController.getRevenueMetrics);

// Reporting
router.get('/reports', AnalyticsController.getReports);
router.post('/reports/generate', AnalyticsController.generateReport);

// KPIs
router.get('/kpis', AnalyticsController.getKPIs);

export default router;
