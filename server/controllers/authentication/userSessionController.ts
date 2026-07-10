import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { UserSessionService } from '../../services/authentication/userSessionService';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class UserSessionController {
  static getSessions = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const sessions = await UserSessionService.getSessions(userId);
    sendResponse(res, { statusCode: 200, data: sessions });
  });

  static revokeSession = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const session = await UserSessionService.revokeSession(id, userId);
    sendResponse(res, { statusCode: 200, message: 'Session revoked', data: session });
  });

  static revokeAllSessions = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const result = await UserSessionService.revokeAllSessions(userId);
    sendResponse(res, { statusCode: 200, message: result.message });
  });
}
