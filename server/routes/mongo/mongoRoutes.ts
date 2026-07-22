import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { MongoController } from '../../controllers/mongo/mongoController';

const router = Router();

// ─── Logs (Admin only) ────────────────────────────────────────────────────────
router.get('/logs/activity',  verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), MongoController.getActivityLogs);
router.get('/logs/audit',     verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), MongoController.getAuditLogs);
router.get('/logs/errors',    verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), MongoController.getErrorLogs);

// ─── Analytics Events ─────────────────────────────────────────────────────────
router.get('/events',         verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), MongoController.getAnalyticsEvents);
router.post('/events/track',  verifyToken, MongoController.trackEvent);

// ─── Realtime Dashboard Cache ─────────────────────────────────────────────────
router.get('/dashboard/cache',    verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), MongoController.getDashboardCache);
router.put('/dashboard/cache',    verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), MongoController.updateDashboardCache);

// ─── Search History ───────────────────────────────────────────────────────────
router.post('/search/track',                 verifyToken, MongoController.trackSearch);
router.get('/search/history/:customerId',    verifyToken, MongoController.getSearchHistory);

// ─── Chat Messages ────────────────────────────────────────────────────────────
router.get('/chat/:conversationId/messages',  verifyToken, MongoController.getChatMessages);
router.post('/chat/:conversationId/messages', verifyToken, MongoController.sendChatMessage);

// ─── Notification Queue ───────────────────────────────────────────────────────
router.get('/queue/pending', verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'), MongoController.getPendingQueue);

export default router;
