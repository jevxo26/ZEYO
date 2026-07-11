import { Router } from 'express';
import { RolePermissionController } from '../../controllers/rbac/rolePermissionController';

const router = Router();

// Get all permissions for a role
router.get('/:roleId',             RolePermissionController.getByRole);

// Assign a permission (single)
router.post('/assign',             RolePermissionController.assign);

// Bulk assign permissions
router.post('/bulk-assign',        RolePermissionController.bulkAssign);

// Revoke a single permission
router.delete('/revoke',           RolePermissionController.revoke);

// Revoke all permissions from a role
router.delete('/revoke-all/:roleId', RolePermissionController.revokeAll);

export default router;
