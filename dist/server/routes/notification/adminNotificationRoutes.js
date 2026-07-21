"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const adminNotificationController_1 = require("../../controllers/notification/adminNotificationController");
const router = (0, express_1.Router)();
// All routes require Admin role
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'));
// Templates
router.get('/templates', adminNotificationController_1.AdminNotificationController.getTemplates);
router.post('/templates', adminNotificationController_1.AdminNotificationController.createTemplate);
// Broadcasts
router.get('/broadcasts', adminNotificationController_1.AdminNotificationController.getBroadcasts);
router.post('/broadcasts', adminNotificationController_1.AdminNotificationController.createBroadcast);
// Conversations
router.get('/conversations', adminNotificationController_1.AdminNotificationController.getAllConversations);
router.post('/conversations/:id/reply', adminNotificationController_1.AdminNotificationController.replyToConversation);
exports.default = router;
