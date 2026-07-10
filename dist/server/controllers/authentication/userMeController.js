"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConsentController = exports.UserAgreementController = exports.UserActivityController = exports.UserSavedEventController = exports.UserFavoriteZoneController = exports.UserPreferenceController = void 0;
const userPreferenceService_1 = require("../../services/authentication/userPreferenceService");
const userFavoriteZoneService_1 = require("../../services/authentication/userFavoriteZoneService");
const userSavedEventService_1 = require("../../services/authentication/userSavedEventService");
const userActivityService_1 = require("../../services/authentication/userActivityService");
const userAgreementService_1 = require("../../services/authentication/userAgreementService");
const userConsentService_1 = require("../../services/authentication/userConsentService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
// ── Preferences ──────────────────────────────────────────────────────────────
class UserPreferenceController {
}
exports.UserPreferenceController = UserPreferenceController;
_a = UserPreferenceController;
UserPreferenceController.getPreferences = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await userPreferenceService_1.UserPreferenceService.getPreferences(userId) });
});
UserPreferenceController.updatePreferences = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const result = await userPreferenceService_1.UserPreferenceService.updatePreferences(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Preferences updated', data: result });
});
// ── Favorite Zones ────────────────────────────────────────────────────────────
class UserFavoriteZoneController {
}
exports.UserFavoriteZoneController = UserFavoriteZoneController;
_b = UserFavoriteZoneController;
UserFavoriteZoneController.getFavorites = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await userFavoriteZoneService_1.UserFavoriteZoneService.getFavorites(userId) });
});
UserFavoriteZoneController.addFavorite = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const { zoneId } = req.body;
    if (!zoneId)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`zoneId` is required' });
    const result = await userFavoriteZoneService_1.UserFavoriteZoneService.addFavorite(userId, zoneId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Zone added to favorites', data: result });
});
UserFavoriteZoneController.removeFavorite = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const zoneId = parseInt(req.params['zoneId'], 10);
    const result = await userFavoriteZoneService_1.UserFavoriteZoneService.removeFavorite(userId, zoneId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: result.message });
});
// ── Saved Events ──────────────────────────────────────────────────────────────
class UserSavedEventController {
}
exports.UserSavedEventController = UserSavedEventController;
_c = UserSavedEventController;
UserSavedEventController.getSavedEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await userSavedEventService_1.UserSavedEventService.getSavedEvents(userId) });
});
UserSavedEventController.getSavedEventById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const event = await userSavedEventService_1.UserSavedEventService.getSavedEventById(id, userId);
    if (!event)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Saved event not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: event });
});
UserSavedEventController.createSavedEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g, _h;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    if (!((_h = req.body) === null || _h === void 0 ? void 0 : _h.title))
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`title` is required' });
    const result = await userSavedEventService_1.UserSavedEventService.createSavedEvent(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Saved event created', data: result });
});
UserSavedEventController.updateSavedEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const result = await userSavedEventService_1.UserSavedEventService.updateSavedEvent(id, userId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Saved event updated', data: result });
});
UserSavedEventController.deleteSavedEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const result = await userSavedEventService_1.UserSavedEventService.deleteSavedEvent(id, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: result.message });
});
// ── Activity ──────────────────────────────────────────────────────────────────
class UserActivityController {
}
exports.UserActivityController = UserActivityController;
_d = UserActivityController;
UserActivityController.getActivity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const limit = Math.min(parseInt(String(req.query['limit'] || '30'), 10), 100);
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await userActivityService_1.UserActivityService.getActivity(userId, limit, skip) });
});
// ── Agreements ────────────────────────────────────────────────────────────────
class UserAgreementController {
}
exports.UserAgreementController = UserAgreementController;
_e = UserAgreementController;
UserAgreementController.getAgreements = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await userAgreementService_1.UserAgreementService.getAgreements(userId) });
});
UserAgreementController.acceptAgreement = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const { agreementType, version } = req.body;
    if (!agreementType || !version) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`agreementType` and `version` are required' });
    }
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await userAgreementService_1.UserAgreementService.acceptAgreement(userId, { agreementType, version, ipAddress });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Agreement accepted', data: result });
});
// ── Consents ──────────────────────────────────────────────────────────────────
class UserConsentController {
}
exports.UserConsentController = UserConsentController;
_f = UserConsentController;
UserConsentController.getConsents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await userConsentService_1.UserConsentService.getConsents(userId) });
});
UserConsentController.acceptConsent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const { consentType } = req.body;
    if (!consentType)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`consentType` is required' });
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await userConsentService_1.UserConsentService.acceptConsent(userId, consentType, ipAddress);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Consent accepted', data: result });
});
UserConsentController.withdrawConsent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _g;
    const userId = parseInt(String((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId), 10);
    const consentType = req.params['type'];
    const result = await userConsentService_1.UserConsentService.withdrawConsent(userId, consentType);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Consent withdrawn', data: result });
});
