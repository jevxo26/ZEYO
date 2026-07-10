"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionController = void 0;
const userSessionService_1 = require("../../services/authentication/userSessionService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserSessionController {
}
exports.UserSessionController = UserSessionController;
_a = UserSessionController;
UserSessionController.getSessions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const sessions = await userSessionService_1.UserSessionService.getSessions(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: sessions });
});
UserSessionController.revokeSession = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const session = await userSessionService_1.UserSessionService.revokeSession(id, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Session revoked', data: session });
});
UserSessionController.revokeAllSessions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const result = await userSessionService_1.UserSessionService.revokeAllSessions(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: result.message });
});
