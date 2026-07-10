import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

// Controllers
import { UserAddressController } from '../../controllers/authentication/userAddressController';
import { UserDeviceController } from '../../controllers/authentication/userDeviceController';
import { UserSessionController } from '../../controllers/authentication/userSessionController';
import { UserLoginHistoryController } from '../../controllers/authentication/userLoginHistoryController';
import { UserNotificationSettingController } from '../../controllers/authentication/userNotificationSettingController';
import { UserSecurityController } from '../../controllers/authentication/userSecurityController';
import { UserIdentityVerificationController } from '../../controllers/authentication/userIdentityVerificationController';
import { UserSupportTicketController } from '../../controllers/authentication/userSupportTicketController';
import {
  UserPreferenceController,
  UserFavoriteZoneController,
  UserSavedEventController,
  UserActivityController,
  UserAgreementController,
  UserConsentController,
} from '../../controllers/authentication/userMeController';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// ─── Addresses ──────────────────────────────────────────────────────────────
router.get('/addresses', UserAddressController.getAddresses);
router.post('/addresses', UserAddressController.createAddress);
router.get('/addresses/:id', UserAddressController.getAddressById);
router.put('/addresses/:id', UserAddressController.updateAddress);
router.delete('/addresses/:id', UserAddressController.deleteAddress);
router.patch('/addresses/:id/default', UserAddressController.setDefault);

// ─── Devices ────────────────────────────────────────────────────────────────
router.get('/devices', UserDeviceController.getDevices);
router.get('/devices/:id', UserDeviceController.getDeviceById);
router.patch('/devices/:id/block', UserDeviceController.blockDevice);
router.delete('/devices/:id', UserDeviceController.removeDevice);

// ─── Sessions ────────────────────────────────────────────────────────────────
router.get('/sessions', UserSessionController.getSessions);
router.delete('/sessions/all', UserSessionController.revokeAllSessions);
router.delete('/sessions/:id', UserSessionController.revokeSession);

// ─── Login History ───────────────────────────────────────────────────────────
router.get('/login-history', UserLoginHistoryController.getHistory);

// ─── Notification Settings ───────────────────────────────────────────────────
router.get('/notification-settings', UserNotificationSettingController.getSettings);
router.put('/notification-settings', UserNotificationSettingController.updateSettings);

// ─── Security ────────────────────────────────────────────────────────────────
router.get('/security', UserSecurityController.getSecurity);
router.put('/security/2fa', UserSecurityController.toggle2FA);
router.put('/security/question', UserSecurityController.setSecurityQuestion);

// ─── Identity Verification ───────────────────────────────────────────────────
router.get('/identity-verification', UserIdentityVerificationController.getVerification);
router.post('/identity-verification', UserIdentityVerificationController.submitVerification);

// ─── Preferences ─────────────────────────────────────────────────────────────
router.get('/preferences', UserPreferenceController.getPreferences);
router.put('/preferences', UserPreferenceController.updatePreferences);

// ─── Favorite Zones ───────────────────────────────────────────────────────────
router.get('/favorite-zones', UserFavoriteZoneController.getFavorites);
router.post('/favorite-zones', UserFavoriteZoneController.addFavorite);
router.delete('/favorite-zones/:zoneId', UserFavoriteZoneController.removeFavorite);

// ─── Saved Events ─────────────────────────────────────────────────────────────
router.get('/saved-events', UserSavedEventController.getSavedEvents);
router.post('/saved-events', UserSavedEventController.createSavedEvent);
router.get('/saved-events/:id', UserSavedEventController.getSavedEventById);
router.put('/saved-events/:id', UserSavedEventController.updateSavedEvent);
router.delete('/saved-events/:id', UserSavedEventController.deleteSavedEvent);

// ─── Activity Log ─────────────────────────────────────────────────────────────
router.get('/activity', UserActivityController.getActivity);

// ─── Support Tickets ──────────────────────────────────────────────────────────
router.get('/tickets', UserSupportTicketController.getMyTickets);
router.post('/tickets', UserSupportTicketController.createTicket);
router.get('/tickets/:id', UserSupportTicketController.getMyTicketById);
router.patch('/tickets/:id/cancel', UserSupportTicketController.cancelTicket);

// ─── Agreements ───────────────────────────────────────────────────────────────
router.get('/agreements', UserAgreementController.getAgreements);
router.post('/agreements', UserAgreementController.acceptAgreement);

// ─── Consents ─────────────────────────────────────────────────────────────────
router.get('/consents', UserConsentController.getConsents);
router.post('/consents', UserConsentController.acceptConsent);
router.delete('/consents/:type', UserConsentController.withdrawConsent);

export default router;
