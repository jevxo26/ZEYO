import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { DashboardController } from '../../controllers/admin/dashboardController';

const router = Router();

router.use(verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/', DashboardController.getDashboards);
router.post('/', DashboardController.createDashboard);
router.post('/:dashboardId/widgets', DashboardController.addWidget);

export default router;
