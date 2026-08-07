import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { ConfigController } from '../../controllers/admin/configController';

const router = Router();

router.use(verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'));

// Settings
router.get('/settings', ConfigController.getSettings);
router.put('/settings', ConfigController.updateSetting);

// Feature Flags
router.get('/features', ConfigController.getFeatureFlags);
router.put('/features/toggle', ConfigController.toggleFeature);

// Logs
router.get('/logs/audit', ConfigController.getAuditLogs);
router.get('/logs/system', ConfigController.getSystemLogs);

export default router;
