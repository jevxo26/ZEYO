"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserPreferenceService {
}
exports.UserPreferenceService = UserPreferenceService;
_a = UserPreferenceService;
UserPreferenceService.getPreferences = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userPreference.upsert({
        where: { userId },
        update: {},
        create: { userId },
    });
});
UserPreferenceService.updatePreferences = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    return prisma.userPreference.upsert({
        where: { userId },
        update: data,
        create: Object.assign({ userId }, data),
    });
});
