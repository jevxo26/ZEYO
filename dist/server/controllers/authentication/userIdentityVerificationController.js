"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdentityVerificationController = void 0;
const userIdentityVerificationService_1 = require("../../services/authentication/userIdentityVerificationService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserIdentityVerificationController {
}
exports.UserIdentityVerificationController = UserIdentityVerificationController;
_a = UserIdentityVerificationController;
UserIdentityVerificationController.getVerification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const verification = await userIdentityVerificationService_1.UserIdentityVerificationService.getVerification(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: verification || null });
});
UserIdentityVerificationController.submitVerification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const { documentType, documentNumber, documentFront, documentBack, selfieImage } = req.body;
    if (!documentType) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`documentType` is required' });
    }
    const result = await userIdentityVerificationService_1.UserIdentityVerificationService.submitVerification(userId, {
        documentType, documentNumber, documentFront, documentBack, selfieImage,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Verification submitted — under review', data: result });
});
// Admin
UserIdentityVerificationController.getPendingVerifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    const take = parseInt(String(req.query['take'] || '20'), 10);
    const result = await userIdentityVerificationService_1.UserIdentityVerificationService.getPendingVerifications(skip, take);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: result });
});
UserIdentityVerificationController.reviewVerification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const adminId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const { status, reason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`status` must be approved or rejected' });
    }
    const result = await userIdentityVerificationService_1.UserIdentityVerificationService.reviewVerification(id, adminId, status, reason);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `Verification ${status}`, data: result });
});
