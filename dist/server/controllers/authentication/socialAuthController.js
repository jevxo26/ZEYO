"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthController = void 0;
const socialAuthService_1 = require("../../services/authentication/socialAuthService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class SocialAuthController {
}
exports.SocialAuthController = SocialAuthController;
_a = SocialAuthController;
// Use catchAsync for consistency with the rest of the codebase
SocialAuthController.loginWithGoogle = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Google credential is required' });
        return;
    }
    const result = await socialAuthService_1.SocialAuthService.loginWithGoogle(credential);
    // Set HTTP-only refresh token cookie (same as regular login)
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Successfully logged in with Google',
        data: { user: result.user, token: result.token },
    });
});
SocialAuthController.loginWithFacebook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Facebook access token is required' });
        return;
    }
    const result = await socialAuthService_1.SocialAuthService.loginWithFacebook(accessToken);
    // Set HTTP-only refresh token cookie (same as regular login)
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Successfully logged in with Facebook',
        data: { user: result.user, token: result.token },
    });
});
