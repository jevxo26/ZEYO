import { Router } from 'express';
import { PermissionController } from '../../controllers/rbac/permissionController';

const router = Router();

// List & create  (supports ?moduleId=&action=&status= query filters)
router.get('/',       PermissionController.getAll);
router.post('/',      PermissionController.create);

// Detail, update, delete
router.get('/:id',    PermissionController.getById);
router.put('/:id',    PermissionController.update);
router.delete('/:id', PermissionController.delete);

export default router;
