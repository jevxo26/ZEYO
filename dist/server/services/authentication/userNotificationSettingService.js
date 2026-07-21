"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotificationSettingService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const defaults = {
    pushNotification: true,
    emailNotification: true,
    smsNotification: false,
    marketingNotification: false,
    bookingNotification: true,
    paymentNotification: true,
    systemNotification: true,
};
class UserNotificationSettingService {
}
exports.UserNotificationSettingService = UserNotificationSettingService;
_a = UserNotificationSettingService;
UserNotificationSettingService.getSettings = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userNotificationSetting.upsert({
        where: { userId },
        update: {},
        create: Object.assign({ userId }, defaults),
    });
});
UserNotificationSettingService.updateSettings = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    return prisma_1.prisma.userNotificationSetting.upsert({
        where: { userId },
        update: data,
        create: Object.assign(Object.assign({ userId }, defaults), data),
    });
});
