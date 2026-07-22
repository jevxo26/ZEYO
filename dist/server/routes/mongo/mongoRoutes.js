"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const mongoController_1 = require("../../controllers/mongo/mongoController");
const router = (0, express_1.Router)();
// ─── Logs (Admin only) ────────────────────────────────────────────────────────
router.get('/logs/activity', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'), mongoController_1.MongoController.getActivityLogs);
router.get('/logs/audit', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'), mongoController_1.MongoController.getAuditLogs);
router.get('/logs/errors', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'), mongoController_1.MongoController.getErrorLogs);
// ─── Analytics Events ─────────────────────────────────────────────────────────
router.get('/events', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'), mongoController_1.MongoController.getAnalyticsEvents);
router.post('/events/track', authMiddleware_1.verifyToken, mongoController_1.MongoController.trackEvent);
// ─── Realtime Dashboard Cache ─────────────────────────────────────────────────
router.get('/dashboard/cache', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'), mongoController_1.MongoController.getDashboardCache);
router.put('/dashboard/cache', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'), mongoController_1.MongoController.updateDashboardCache);
// ─── Search History ───────────────────────────────────────────────────────────
router.post('/search/track', authMiddleware_1.verifyToken, mongoController_1.MongoController.trackSearch);
router.get('/search/history/:customerId', authMiddleware_1.verifyToken, mongoController_1.MongoController.getSearchHistory);
// ─── Chat Messages ────────────────────────────────────────────────────────────
router.get('/chat/:conversationId/messages', authMiddleware_1.verifyToken, mongoController_1.MongoController.getChatMessages);
router.post('/chat/:conversationId/messages', authMiddleware_1.verifyToken, mongoController_1.MongoController.sendChatMessage);
// ─── Notification Queue ───────────────────────────────────────────────────────
router.get('/queue/pending', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'), mongoController_1.MongoController.getPendingQueue);
exports.default = router;
