import { Router } from 'express';
import { UserRoleController } from '../../controllers/rbac/userRoleController';

const router = Router();

router.get('/:userId', UserRoleController.getByUser);
router.get('/role/:roleId/users', UserRoleController.getUsersByRole);
router.post('/assign', UserRoleController.assign);
router.delete('/revoke', UserRoleController.revoke);

export default router;