import { Response } from 'express';
import { AuthRequest } from '../../middlewares/authMiddleware';
import { UserSecurityService } from '../../services/authentication/userSecurityService';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class UserSecurityController {
  static getSecurity = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const security = await UserSecurityService.getSecurity(userId);
    sendResponse(res, { statusCode: 200, data: security });
  });

  static toggle2FA = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const { enabled, method } = req.body as { enabled: boolean; method?: string };
    if (typeof enabled !== 'boolean') {
      return sendResponse(res, { statusCode: 400, message: '`enabled` (boolean) is required' });
    }
    const security = await UserSecurityService.toggle2FA(userId, enabled, method);
    sendResponse(res, { statusCode: 200, message: `2FA ${enabled ? 'enabled' : 'disabled'}`, data: security });
  });

  static setSecurityQuestion = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const { question, answer } = req.body as { question: string; answer: string };
    if (!question || !answer) {
      return sendResponse(res, { statusCode: 400, message: '`question` and `answer` are required' });
    }
    const security = await UserSecurityService.setSecurityQuestion(userId, question, answer);
    sendResponse(res, { statusCode: 200, message: 'Security question updated', data: { id: security.id } });
  });
}
