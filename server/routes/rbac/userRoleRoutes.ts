import { Router } from 'express';
import { UserRoleController } from '../../controllers/rbac/userRoleController';

const router = Router();

// Assign a role to a user
router.post('/assign',              UserRoleController.assign);

// Revoke a role from a user
router.delete('/revoke',            UserRoleController.revoke);

// Get all active roles for a specific user
router.get('/:userId',              UserRoleController.getByUser);

// Get all users assigned to a specific role
router.get('/role/:roleId/users',   UserRoleController.getUsersByRole);

export default router;
