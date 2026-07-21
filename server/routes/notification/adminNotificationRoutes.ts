import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { AdminNotificationController } from '../../controllers/notification/adminNotificationController';

const router = Router();

// All routes require Admin role
router.use(verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'));

// Templates
router.get('/templates', AdminNotificationController.getTemplates);
router.post('/templates', AdminNotificationController.createTemplate);

// Broadcasts
router.get('/broadcasts', AdminNotificationController.getBroadcasts);
router.post('/broadcasts', AdminNotificationController.createBroadcast);

// Conversations
router.get('/conversations', AdminNotificationController.getAllConversations);
router.post('/conversations/:id/reply', AdminNotificationController.replyToConversation);

export default router;
