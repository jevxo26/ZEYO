"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../controllers/authentication/userController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// ─── Own Profile Routes (any authenticated user) ───────────────────────────
router.get('/profile/me', authMiddleware_1.verifyToken, userController_1.UserController.getUserProfile);
router.put('/profile/me', authMiddleware_1.verifyToken, userController_1.UserController.updateUserProfile);
// ─── Admin User Management Routes (protected) ──────────────────────────────
// These routes should only be accessible by admins/managers.
// requireRole checks the `role` claim in the JWT payload.
router.get('/', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), userController_1.UserController.getAllUsers);
router.get('/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), userController_1.UserController.getUserById);
router.post('/', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), userController_1.UserController.createUser);
router.put('/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), userController_1.UserController.updateUser);
router.delete('/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), userController_1.UserController.deleteUser);
exports.default = router;
