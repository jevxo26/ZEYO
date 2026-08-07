import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { NotificationController } from '../../controllers/notification/notificationController';

const router = Router();

// Customer facing routes for their notifications
router.use(verifyToken);

router.get('/in-app', NotificationController.getMyNotifications);
router.put('/in-app/:id/read', NotificationController.markAsRead);

router.get('/preferences', NotificationController.getMyPreferences);
router.put('/preferences', NotificationController.updateMyPreferences);

export default router;
