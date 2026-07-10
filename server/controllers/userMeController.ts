import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserPreferenceService } from '../services/userPreferenceService';
import { UserFavoriteZoneService } from '../services/userFavoriteZoneService';
import { UserSavedEventService } from '../services/userSavedEventService';
import { UserActivityService } from '../services/userActivityService';
import { UserAgreementService } from '../services/userAgreementService';
import { UserConsentService } from '../services/userConsentService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// ── Preferences ──────────────────────────────────────────────────────────────
export class UserPreferenceController {
  static getPreferences = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    sendResponse(res, { statusCode: 200, data: await UserPreferenceService.getPreferences(userId) });
  });

  static updatePreferences = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const result = await UserPreferenceService.updatePreferences(userId, req.body);
    sendResponse(res, { statusCode: 200, message: 'Preferences updated', data: result });
  });
}

// ── Favorite Zones ────────────────────────────────────────────────────────────
export class UserFavoriteZoneController {
  static getFavorites = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    sendResponse(res, { statusCode: 200, data: await UserFavoriteZoneService.getFavorites(userId) });
  });

  static addFavorite = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const { zoneId } = req.body as { zoneId: number };
    if (!zoneId) return sendResponse(res, { statusCode: 400, message: '`zoneId` is required' });
    const result = await UserFavoriteZoneService.addFavorite(userId, zoneId);
    sendResponse(res, { statusCode: 201, message: 'Zone added to favorites', data: result });
  });

  static removeFavorite = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const zoneId = parseInt(req.params['zoneId'] as string, 10);
    const result = await UserFavoriteZoneService.removeFavorite(userId, zoneId);
    sendResponse(res, { statusCode: 200, message: result.message });
  });
}

// ── Saved Events ──────────────────────────────────────────────────────────────
export class UserSavedEventController {
  static getSavedEvents = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    sendResponse(res, { statusCode: 200, data: await UserSavedEventService.getSavedEvents(userId) });
  });

  static getSavedEventById = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const event = await UserSavedEventService.getSavedEventById(id, userId);
    if (!event) return sendResponse(res, { statusCode: 404, message: 'Saved event not found' });
    sendResponse(res, { statusCode: 200, data: event });
  });

  static createSavedEvent = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    if (!req.body?.title) return sendResponse(res, { statusCode: 400, message: '`title` is required' });
    const result = await UserSavedEventService.createSavedEvent(userId, req.body);
    sendResponse(res, { statusCode: 201, message: 'Saved event created', data: result });
  });

  static updateSavedEvent = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const result = await UserSavedEventService.updateSavedEvent(id, userId, req.body);
    sendResponse(res, { statusCode: 200, message: 'Saved event updated', data: result });
  });

  static deleteSavedEvent = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const result = await UserSavedEventService.deleteSavedEvent(id, userId);
    sendResponse(res, { statusCode: 200, message: result.message });
  });
}

// ── Activity ──────────────────────────────────────────────────────────────────
export class UserActivityController {
  static getActivity = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const limit = Math.min(parseInt(String(req.query['limit'] || '30'), 10), 100);
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    sendResponse(res, { statusCode: 200, data: await UserActivityService.getActivity(userId, limit, skip) });
  });
}

// ── Agreements ────────────────────────────────────────────────────────────────
export class UserAgreementController {
  static getAgreements = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    sendResponse(res, { statusCode: 200, data: await UserAgreementService.getAgreements(userId) });
  });

  static acceptAgreement = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const { agreementType, version } = req.body as { agreementType: string; version: string };
    if (!agreementType || !version) {
      return sendResponse(res, { statusCode: 400, message: '`agreementType` and `version` are required' });
    }
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await UserAgreementService.acceptAgreement(userId, { agreementType, version, ipAddress });
    sendResponse(res, { statusCode: 201, message: 'Agreement accepted', data: result });
  });
}

// ── Consents ──────────────────────────────────────────────────────────────────
export class UserConsentController {
  static getConsents = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    sendResponse(res, { statusCode: 200, data: await UserConsentService.getConsents(userId) });
  });

  static acceptConsent = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const { consentType } = req.body as { consentType: string };
    if (!consentType) return sendResponse(res, { statusCode: 400, message: '`consentType` is required' });
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await UserConsentService.acceptConsent(userId, consentType, ipAddress);
    sendResponse(res, { statusCode: 200, message: 'Consent accepted', data: result });
  });

  static withdrawConsent = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const consentType = req.params['type'] as string;
    const result = await UserConsentService.withdrawConsent(userId, consentType);
    sendResponse(res, { statusCode: 200, message: 'Consent withdrawn', data: result });
  });
}
