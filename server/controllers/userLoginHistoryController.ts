import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserLoginHistoryService } from '../services/userLoginHistoryService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class UserLoginHistoryController {
  static getHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const limit = Math.min(parseInt(String(req.query['limit'] || '20'), 10), 100);
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    const result = await UserLoginHistoryService.getHistory(userId, limit, skip);
    sendResponse(res, { statusCode: 200, data: result });
  });
}
