"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const userIdentityVerificationController_1 = require("../../controllers/authentication/userIdentityVerificationController");
const userSupportTicketController_1 = require("../../controllers/authentication/userSupportTicketController");
const router = (0, express_1.Router)();
// All admin routes require authentication + admin role
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'));
// ─── Identity Verification Management ───────────────────────────────────────
router.get('/verifications', userIdentityVerificationController_1.UserIdentityVerificationController.getPendingVerifications);
router.put('/verifications/:id/review', userIdentityVerificationController_1.UserIdentityVerificationController.reviewVerification);
// ─── Support Ticket Management ───────────────────────────────────────────────
router.get('/tickets', userSupportTicketController_1.UserSupportTicketController.getAllTickets);
router.patch('/tickets/:id/assign', userSupportTicketController_1.UserSupportTicketController.assignTicket);
router.patch('/tickets/:id/resolve', userSupportTicketController_1.UserSupportTicketController.resolveTicket);
exports.default = router;
