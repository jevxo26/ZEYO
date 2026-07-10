"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginHistoryController = void 0;
const userLoginHistoryService_1 = require("../../services/authentication/userLoginHistoryService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserLoginHistoryController {
}
exports.UserLoginHistoryController = UserLoginHistoryController;
_a = UserLoginHistoryController;
UserLoginHistoryController.getHistory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const limit = Math.min(parseInt(String(req.query['limit'] || '20'), 10), 100);
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    const result = await userLoginHistoryService_1.UserLoginHistoryService.getHistory(userId, limit, skip);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: result });
});
