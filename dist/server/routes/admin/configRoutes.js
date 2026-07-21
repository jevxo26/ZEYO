"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const configController_1 = require("../../controllers/admin/configController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'));
// Settings
router.get('/settings', configController_1.ConfigController.getSettings);
router.put('/settings', configController_1.ConfigController.updateSetting);
// Feature Flags
router.get('/features', configController_1.ConfigController.getFeatureFlags);
router.put('/features/toggle', configController_1.ConfigController.toggleFeature);
// Logs
router.get('/logs/audit', configController_1.ConfigController.getAuditLogs);
router.get('/logs/system', configController_1.ConfigController.getSystemLogs);
exports.default = router;
