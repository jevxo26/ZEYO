"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const notificationController_1 = require("../../controllers/notification/notificationController");
const router = (0, express_1.Router)();
// Customer facing routes for their notifications
router.use(authMiddleware_1.verifyToken);
router.get('/in-app', notificationController_1.NotificationController.getMyNotifications);
router.put('/in-app/:id/read', notificationController_1.NotificationController.markAsRead);
router.get('/preferences', notificationController_1.NotificationController.getMyPreferences);
router.put('/preferences', notificationController_1.NotificationController.updateMyPreferences);
exports.default = router;
