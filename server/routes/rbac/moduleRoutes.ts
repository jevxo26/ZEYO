import { Router } from 'express';
import { ModuleController } from '../../controllers/rbac/moduleController';

const router = Router();

// Special endpoint (must be before /:id)
router.get('/with-permissions', ModuleController.getAllWithPermissions);

// List & create
router.get('/',       ModuleController.getAll);
router.post('/',      ModuleController.create);

// Detail, update, delete
router.get('/:id',    ModuleController.getById);
router.put('/:id',    ModuleController.update);
router.delete('/:id', ModuleController.delete);

export default router;
