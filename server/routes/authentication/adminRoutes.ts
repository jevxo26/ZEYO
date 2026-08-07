import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { UserIdentityVerificationController } from '../../controllers/authentication/userIdentityVerificationController';
import { UserSupportTicketController } from '../../controllers/authentication/userSupportTicketController';

const router = Router();

// All admin routes require authentication + admin role
router.use(verifyToken, requireRole('admin', 'manager'));

// ─── Identity Verification Management ───────────────────────────────────────
router.get('/verifications', UserIdentityVerificationController.getPendingVerifications);
router.put('/verifications/:id/review', UserIdentityVerificationController.reviewVerification);

// ─── Support Ticket Management ───────────────────────────────────────────────
router.get('/tickets', UserSupportTicketController.getAllTickets);
router.patch('/tickets/:id/assign', UserSupportTicketController.assignTicket);
router.patch('/tickets/:id/resolve', UserSupportTicketController.resolveTicket);

export default router;
