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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = require("../../config/prisma");
class NotificationService {
    // Trigger a new notification
    static async sendNotification(data) {
        const { channels } = data, notificationData = __rest(data, ["channels"]);
        // Create Base Notification
        const notification = await prisma_1.prisma.notification.create({
            data: Object.assign(Object.assign({}, notificationData), { priority: notificationData.priority || 'low', status: 'pending' }),
        });
        // Queue for each channel
        for (const channel of channels) {
            await prisma_1.prisma.notificationQueue.create({
                data: {
                    notificationId: notification.id,
                    channel,
                    status: 'pending',
                },
            });
            if (channel === 'IN_APP' && data.customerId) {
                await prisma_1.prisma.inAppNotification.create({
                    data: {
                        notificationId: notification.id,
                        customerId: data.customerId,
                    },
                });
            }
        }
        return notification;
    }
    // Get In-App Notifications for a Customer
    static async getCustomerInAppNotifications(customerId) {
        return prisma_1.prisma.inAppNotification.findMany({
            where: { customerId },
            include: { notification: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    // Mark In-App Notification as read
    static async markInAppAsRead(notificationId) {
        return prisma_1.prisma.inAppNotification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    // Get Customer Preferences
    static async getPreferences(customerId) {
        let prefs = await prisma_1.prisma.notificationPreference.findUnique({
            where: { customerId },
        });
        if (!prefs) {
            prefs = await prisma_1.prisma.notificationPreference.create({
                data: { customerId },
            });
        }
        return prefs;
    }
    // Update Customer Preferences
    static async updatePreferences(customerId, data) {
        return prisma_1.prisma.notificationPreference.upsert({
            where: { customerId },
            update: data,
            create: Object.assign({ customerId }, data),
        });
    }
}
exports.NotificationService = NotificationService;
