"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSecurityController = void 0;
const userSecurityService_1 = require("../../services/authentication/userSecurityService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserSecurityController {
}
exports.UserSecurityController = UserSecurityController;
_a = UserSecurityController;
UserSecurityController.getSecurity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const security = await userSecurityService_1.UserSecurityService.getSecurity(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: security });
});
UserSecurityController.toggle2FA = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const { enabled, method } = req.body;
    if (typeof enabled !== 'boolean') {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`enabled` (boolean) is required' });
    }
    const security = await userSecurityService_1.UserSecurityService.toggle2FA(userId, enabled, method);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `2FA ${enabled ? 'enabled' : 'disabled'}`, data: security });
});
UserSecurityController.setSecurityQuestion = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const { question, answer } = req.body;
    if (!question || !answer) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`question` and `answer` are required' });
    }
    const security = await userSecurityService_1.UserSecurityService.setSecurityQuestion(userId, question, answer);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Security question updated', data: { id: security.id } });
});
