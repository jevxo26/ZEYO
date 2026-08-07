import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { CustomerController } from '../../controllers/customer/customerController';

const router = Router();

// Admin customer management routes
router.use(verifyToken);
router.use(requireRole('admin', 'manager'));

router.get('/', CustomerController.adminGetAllCustomers);
router.get('/:id', CustomerController.adminGetCustomerById);
router.post('/', requireRole('admin'), CustomerController.adminCreateCustomer);
router.put('/:id', CustomerController.adminUpdateCustomer);
router.delete('/:id', requireRole('admin'), CustomerController.adminDeleteCustomer);

export default router;
