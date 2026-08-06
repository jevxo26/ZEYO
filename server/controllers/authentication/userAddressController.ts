import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { UserAddressService } from '../../services/authentication/userAddressService';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class UserAddressController {
  static getAddresses = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const addresses = await UserAddressService.getAddresses(userId);
    sendResponse(res, { statusCode: 200, data: addresses });
  });

  static getAddressById = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const address = await UserAddressService.getAddressById(id, userId);
    if (!address) return sendResponse(res, { statusCode: 404, message: 'Address not found' });
    sendResponse(res, { statusCode: 200, data: address });
  });

  static createAddress = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const address = await UserAddressService.createAddress(userId, { ...req.body, userId });
    sendResponse(res, { statusCode: 201, message: 'Address created', data: address });
  });

  static updateAddress = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const address = await UserAddressService.updateAddress(id, userId, req.body);
    sendResponse(res, { statusCode: 200, message: 'Address updated', data: address });
  });

  static deleteAddress = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const result = await UserAddressService.deleteAddress(id, userId);
    sendResponse(res, { statusCode: 200, message: result.message });
  });

  static setDefault = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const address = await UserAddressService.setDefault(id, userId);
    sendResponse(res, { statusCode: 200, message: 'Default address updated', data: address });
  });
}
