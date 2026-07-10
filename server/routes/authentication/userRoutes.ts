import { Router } from 'express';
import { UserController } from '../../controllers/authentication/userController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// ─── Own Profile Routes (any authenticated user) ───────────────────────────
router.get('/profile/me', verifyToken, UserController.getUserProfile);
router.put('/profile/me', verifyToken, UserController.updateUserProfile);

// ─── Admin User Management Routes (protected) ──────────────────────────────
// These routes should only be accessible by admins/managers.
// requireRole checks the `role` claim in the JWT payload.
router.get('/', verifyToken, requireRole('admin', 'manager'), UserController.getAllUsers);
router.get('/:id', verifyToken, requireRole('admin', 'manager'), UserController.getUserById);
router.post('/', verifyToken, requireRole('admin'), UserController.createUser);
router.put('/:id', verifyToken, requireRole('admin', 'manager'), UserController.updateUser);
router.delete('/:id', verifyToken, requireRole('admin'), UserController.deleteUser);

export default router;
