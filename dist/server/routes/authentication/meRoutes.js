"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
// Controllers
const userAddressController_1 = require("../../controllers/authentication/userAddressController");
const userDeviceController_1 = require("../../controllers/authentication/userDeviceController");
const userSessionController_1 = require("../../controllers/authentication/userSessionController");
const userLoginHistoryController_1 = require("../../controllers/authentication/userLoginHistoryController");
const userNotificationSettingController_1 = require("../../controllers/authentication/userNotificationSettingController");
const userSecurityController_1 = require("../../controllers/authentication/userSecurityController");
const userIdentityVerificationController_1 = require("../../controllers/authentication/userIdentityVerificationController");
const userSupportTicketController_1 = require("../../controllers/authentication/userSupportTicketController");
const userMeController_1 = require("../../controllers/authentication/userMeController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.verifyToken);
// ─── Addresses ──────────────────────────────────────────────────────────────
router.get('/addresses', userAddressController_1.UserAddressController.getAddresses);
router.post('/addresses', userAddressController_1.UserAddressController.createAddress);
router.get('/addresses/:id', userAddressController_1.UserAddressController.getAddressById);
router.put('/addresses/:id', userAddressController_1.UserAddressController.updateAddress);
router.delete('/addresses/:id', userAddressController_1.UserAddressController.deleteAddress);
router.patch('/addresses/:id/default', userAddressController_1.UserAddressController.setDefault);
// ─── Devices ────────────────────────────────────────────────────────────────
router.get('/devices', userDeviceController_1.UserDeviceController.getDevices);
router.get('/devices/:id', userDeviceController_1.UserDeviceController.getDeviceById);
router.patch('/devices/:id/block', userDeviceController_1.UserDeviceController.blockDevice);
router.delete('/devices/:id', userDeviceController_1.UserDeviceController.removeDevice);
// ─── Sessions ────────────────────────────────────────────────────────────────
router.get('/sessions', userSessionController_1.UserSessionController.getSessions);
router.delete('/sessions/all', userSessionController_1.UserSessionController.revokeAllSessions);
router.delete('/sessions/:id', userSessionController_1.UserSessionController.revokeSession);
// ─── Login History ───────────────────────────────────────────────────────────
router.get('/login-history', userLoginHistoryController_1.UserLoginHistoryController.getHistory);
// ─── Notification Settings ───────────────────────────────────────────────────
router.get('/notification-settings', userNotificationSettingController_1.UserNotificationSettingController.getSettings);
router.put('/notification-settings', userNotificationSettingController_1.UserNotificationSettingController.updateSettings);
// ─── Security ────────────────────────────────────────────────────────────────
router.get('/security', userSecurityController_1.UserSecurityController.getSecurity);
router.put('/security/2fa', userSecurityController_1.UserSecurityController.toggle2FA);
router.put('/security/question', userSecurityController_1.UserSecurityController.setSecurityQuestion);
// ─── Identity Verification ───────────────────────────────────────────────────
router.get('/identity-verification', userIdentityVerificationController_1.UserIdentityVerificationController.getVerification);
router.post('/identity-verification', userIdentityVerificationController_1.UserIdentityVerificationController.submitVerification);
// ─── Preferences ─────────────────────────────────────────────────────────────
router.get('/preferences', userMeController_1.UserPreferenceController.getPreferences);
router.put('/preferences', userMeController_1.UserPreferenceController.updatePreferences);
// ─── Favorite Zones ───────────────────────────────────────────────────────────
router.get('/favorite-zones', userMeController_1.UserFavoriteZoneController.getFavorites);
router.post('/favorite-zones', userMeController_1.UserFavoriteZoneController.addFavorite);
router.delete('/favorite-zones/:zoneId', userMeController_1.UserFavoriteZoneController.removeFavorite);
// ─── Saved Events ─────────────────────────────────────────────────────────────
router.get('/saved-events', userMeController_1.UserSavedEventController.getSavedEvents);
router.post('/saved-events', userMeController_1.UserSavedEventController.createSavedEvent);
router.get('/saved-events/:id', userMeController_1.UserSavedEventController.getSavedEventById);
router.put('/saved-events/:id', userMeController_1.UserSavedEventController.updateSavedEvent);
router.delete('/saved-events/:id', userMeController_1.UserSavedEventController.deleteSavedEvent);
// ─── Activity Log ─────────────────────────────────────────────────────────────
router.get('/activity', userMeController_1.UserActivityController.getActivity);
// ─── Support Tickets ──────────────────────────────────────────────────────────
router.get('/tickets', userSupportTicketController_1.UserSupportTicketController.getMyTickets);
router.post('/tickets', userSupportTicketController_1.UserSupportTicketController.createTicket);
router.get('/tickets/:id', userSupportTicketController_1.UserSupportTicketController.getMyTicketById);
router.patch('/tickets/:id/cancel', userSupportTicketController_1.UserSupportTicketController.cancelTicket);
// ─── Agreements ───────────────────────────────────────────────────────────────
router.get('/agreements', userMeController_1.UserAgreementController.getAgreements);
router.post('/agreements', userMeController_1.UserAgreementController.acceptAgreement);
// ─── Consents ─────────────────────────────────────────────────────────────────
router.get('/consents', userMeController_1.UserConsentController.getConsents);
router.post('/consents', userMeController_1.UserConsentController.acceptConsent);
router.delete('/consents/:type', userMeController_1.UserConsentController.withdrawConsent);
exports.default = router;
