import { Router } from 'express';
import { RbacRoleController } from '../../controllers/rbac/roleController';

const router = Router();

// List & create
router.get('/',              RbacRoleController.getAll);
router.post('/',             RbacRoleController.create);

// Lookup by code (must be before /:id to avoid conflict)
router.get('/code/:code',    RbacRoleController.getByCode);

// Detail, update, delete
router.get('/:id',           RbacRoleController.getById);
router.put('/:id',           RbacRoleController.update);
router.delete('/:id',        RbacRoleController.delete);

// Permissions for a role
router.get('/:id/permissions', RbacRoleController.getPermissions);

export default router;
