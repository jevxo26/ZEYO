"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthService = void 0;
const prisma_1 = require("../../config/prisma");
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Use same secret constants as authService for consistency
const JWT_SECRET = process.env.JWT_SECRET || 'ZEYO_access_secret_2026_please_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ZEYO_refresh_secret_2026_please_change_in_production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d');
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d');
class SocialAuthService {
    static async findOrCreateUser(params) {
        const { email, name, provider, providerId, profileImage } = params;
        let user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            // Update provider info if user is logging in via social for first time with existing email
            if (user.provider !== provider) {
                user = await prisma_1.prisma.user.update({
                    where: { email },
                    data: Object.assign({ provider, providerId }, (profileImage ? { profileImage } : {})),
                });
            }
        }
        else {
            // Create new user
            user = await prisma_1.prisma.user.create({
                data: Object.assign({ email,
                    name,
                    provider,
                    providerId, role: 'employee', emailVerified: true, isVerified: true }, (profileImage ? { profileImage } : {})),
            });
            // Auto-create UserProfile for social login users
            try {
                await prisma_1.prisma.userProfile.create({ data: { userId: user.id } });
            }
            catch (_b) {
                // Ignore if already exists
            }
        }
        // Sign access token with userId (Int) — consistent with authService
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Also generate and store a refresh token for social login users
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken, lastLoginAt: new Date(), lastActiveAt: new Date() },
        });
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return {
            token,
            refreshToken,
            user: userWithoutPassword,
        };
    }
}
exports.SocialAuthService = SocialAuthService;
_a = SocialAuthService;
SocialAuthService.loginWithGoogle = (0, catchServiceAsync_1.catchServiceAsync)(async (credential) => {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        throw new Error('Invalid Google token payload');
    }
    const { email, name, sub: googleId, picture } = payload;
    return await _a.findOrCreateUser({
        email,
        name: name || 'Google User',
        provider: 'google',
        providerId: googleId,
        profileImage: picture,
    });
});
SocialAuthService.loginWithFacebook = (0, catchServiceAsync_1.catchServiceAsync)(async (accessToken) => {
    var _b;
    // Verify the Facebook access token and get user info
    const { data } = await axios_1.default.get(`https://graph.facebook.com/me`, {
        params: {
            fields: 'id,name,email,picture',
            access_token: accessToken,
        },
    });
    if (!data || !data.email) {
        throw new Error('Invalid Facebook token payload or email not provided');
    }
    const { email, name, id: facebookId, picture } = data;
    return await _a.findOrCreateUser({
        email,
        name: name || 'Facebook User',
        provider: 'facebook',
        providerId: facebookId,
        profileImage: (_b = picture === null || picture === void 0 ? void 0 : picture.data) === null || _b === void 0 ? void 0 : _b.url,
    });
});
