import { Router } from 'express';
import { RoleController } from '../controllers/roleController';

const router = Router();

router.get('/', RoleController.getAllRoles);

export default router;