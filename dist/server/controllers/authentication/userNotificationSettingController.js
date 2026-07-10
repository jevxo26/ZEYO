"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotificationSettingController = void 0;
const userNotificationSettingService_1 = require("../../services/authentication/userNotificationSettingService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserNotificationSettingController {
}
exports.UserNotificationSettingController = UserNotificationSettingController;
_a = UserNotificationSettingController;
UserNotificationSettingController.getSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const settings = await userNotificationSettingService_1.UserNotificationSettingService.getSettings(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: settings });
});
UserNotificationSettingController.updateSettings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const settings = await userNotificationSettingService_1.UserNotificationSettingService.updateSettings(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Notification settings updated', data: settings });
});
