import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();
//user profile
router.get('/profile/me', verifyToken, UserController.getUserProfile);
router.put('/profile/me', verifyToken, UserController.updateUserProfile);

/// user address
router.get('/addresses', verifyToken, UserController.getUserAddresses);
router.get('/addresses/:addressId', verifyToken, UserController.getUserAddressById);
router.post('/addresses', verifyToken, UserController.createUserAddress);
router.put('/addresses/:addressId', verifyToken, UserController.updateUserAddress);
router.delete('/addresses/:addressId', verifyToken, UserController.deleteUserAddress);
router.patch('/addresses/:addressId/default', verifyToken, UserController.setDefaultAddress);
//user
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
