import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserDeviceService } from '../services/userDeviceService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class UserDeviceController {
  static getDevices = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const devices = await UserDeviceService.getDevices(userId);
    sendResponse(res, { statusCode: 200, data: devices });
  });

  static getDeviceById = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const device = await UserDeviceService.getDeviceById(id, userId);
    if (!device) return sendResponse(res, { statusCode: 404, message: 'Device not found' });
    sendResponse(res, { statusCode: 200, data: device });
  });

  static blockDevice = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const device = await UserDeviceService.blockDevice(id, userId);
    sendResponse(res, { statusCode: 200, message: 'Device blocked', data: device });
  });

  static removeDevice = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const result = await UserDeviceService.removeDevice(id, userId);
    sendResponse(res, { statusCode: 200, message: result.message });
  });
}
