import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { UserNotificationSettingService } from '../../services/authentication/userNotificationSettingService';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class UserNotificationSettingController {
  static getSettings = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const settings = await UserNotificationSettingService.getSettings(userId);
    sendResponse(res, { statusCode: 200, data: settings });
  });

  static updateSettings = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const settings = await UserNotificationSettingService.updateSettings(userId, req.body);
    sendResponse(res, { statusCode: 200, message: 'Notification settings updated', data: settings });
  });
}
