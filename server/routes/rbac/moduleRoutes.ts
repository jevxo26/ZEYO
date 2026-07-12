import { Router } from 'express';
import { ModuleController } from '../../controllers/rbac/moduleController';

const router = Router();

router.get('/', ModuleController.getAll);
router.get('/with-permissions', ModuleController.getAllWithPermissions);
router.get('/:id', ModuleController.getById);
router.post('/', ModuleController.create);
router.put('/:id', ModuleController.update);
router.delete('/:id', ModuleController.delete);

export default router;