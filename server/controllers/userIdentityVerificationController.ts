import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserIdentityVerificationService } from '../services/userIdentityVerificationService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class UserIdentityVerificationController {
  static getVerification = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const verification = await UserIdentityVerificationService.getVerification(userId);
    sendResponse(res, { statusCode: 200, data: verification || null });
  });

  static submitVerification = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const { documentType, documentNumber, documentFront, documentBack, selfieImage } = req.body;
    if (!documentType) {
      return sendResponse(res, { statusCode: 400, message: '`documentType` is required' });
    }
    const result = await UserIdentityVerificationService.submitVerification(userId, {
      documentType, documentNumber, documentFront, documentBack, selfieImage,
    });
    sendResponse(res, { statusCode: 201, message: 'Verification submitted — under review', data: result });
  });

  // Admin
  static getPendingVerifications = catchAsync(async (req: AuthRequest, res: Response) => {
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    const take = parseInt(String(req.query['take'] || '20'), 10);
    const result = await UserIdentityVerificationService.getPendingVerifications(skip, take);
    sendResponse(res, { statusCode: 200, data: result });
  });

  static reviewVerification = catchAsync(async (req: AuthRequest, res: Response) => {
    const adminId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const { status, reason } = req.body as { status: 'approved' | 'rejected'; reason?: string };
    if (!['approved', 'rejected'].includes(status)) {
      return sendResponse(res, { statusCode: 400, message: '`status` must be approved or rejected' });
    }
    const result = await UserIdentityVerificationService.reviewVerification(id, adminId, status, reason);
    sendResponse(res, { statusCode: 200, message: `Verification ${status}`, data: result });
  });
}
