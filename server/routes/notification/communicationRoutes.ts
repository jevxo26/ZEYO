import { Router } from 'express';
import { verifyToken } from '../../middlewares/authMiddleware';
import { CommunicationController } from '../../controllers/notification/communicationController';

const router = Router();

// Customer facing chat/communication routes
router.use(verifyToken);

router.get('/conversations', CommunicationController.getMyConversations);
router.post('/conversations', CommunicationController.startConversation);

router.get('/conversations/:id', CommunicationController.getConversationThread);
router.post('/messages', CommunicationController.sendMessage);

export default router;
