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
const emailService_1 = require("../emailService");
const smsService_1 = require("../smsService");
class NotificationService {
    // Trigger a new notification
    static async sendNotification(data) {
        const { channels } = data, notificationData = __rest(data, ["channels"]);
        const notification = await prisma_1.prisma.notification.create({
            data: Object.assign(Object.assign({}, notificationData), { priority: notificationData.priority || 'low', status: 'pending' }),
        });
        const queueItems = await Promise.all(channels.map(async (channel) => prisma_1.prisma.notificationQueue.create({
            data: {
                notificationId: notification.id,
                channel,
            },
        })));
        if (channels.includes('IN_APP') && data.customerId) {
            await prisma_1.prisma.inAppNotification.create({
                data: {
                    notificationId: notification.id,
                    customerId: data.customerId,
                },
            });
        }
        await NotificationService.processNotificationQueue(notification.id, queueItems);
        return notification;
    }
    static async processNotificationQueue(notificationId, queueItems) {
        var _a, _b, _c, _d;
        const notification = await prisma_1.prisma.notification.findUnique({
            where: { id: notificationId },
            include: {
                customer: {
                    select: {
                        user: {
                            select: {
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
                notificationQueue: true,
            },
        });
        if (!notification) {
            return null;
        }
        const pendingItems = queueItems || notification.notificationQueue.filter((item) => item.status === 'pending');
        const customerEmail = (_b = (_a = notification.customer) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.email;
        const customerPhone = (_d = (_c = notification.customer) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.phone;
        let overallSuccess = true;
        for (const item of pendingItems) {
            try {
                if (item.channel === 'EMAIL') {
                    if (!customerEmail) {
                        throw new Error('Customer email not available');
                    }
                    await (0, emailService_1.sendEmail)(customerEmail, notification.title, notification.message, `<p>${notification.message}</p>`);
                    await prisma_1.prisma.emailNotification.create({
                        data: {
                            notificationId: notification.id,
                            email: customerEmail,
                            subject: notification.title,
                            body: notification.message,
                            status: 'sent',
                            sentAt: new Date(),
                        },
                    });
                    await prisma_1.prisma.notificationQueue.update({
                        where: { id: item.id },
                        data: { status: 'sent', sentAt: new Date() },
                    });
                }
                else if (item.channel === 'SMS') {
                    if (!customerPhone) {
                        throw new Error('Customer phone number not available');
                    }
                    await (0, smsService_1.sendSMS)(customerPhone, notification.message);
                    await prisma_1.prisma.sMSNotification.create({
                        data: {
                            notificationId: notification.id,
                            phone: customerPhone,
                            message: notification.message,
                            provider: 'twilio',
                            status: 'sent',
                            sentAt: new Date(),
                        },
                    });
                    await prisma_1.prisma.notificationQueue.update({
                        where: { id: item.id },
                        data: { status: 'sent', sentAt: new Date() },
                    });
                }
                else if (item.channel === 'IN_APP') {
                    await prisma_1.prisma.notificationQueue.update({
                        where: { id: item.id },
                        data: { status: 'sent', sentAt: new Date() },
                    });
                }
                else if (item.channel === 'PUSH') {
                    console.warn(`Push notification queue entry ${item.id} created but no push delivery is configured.`);
                    await prisma_1.prisma.notificationQueue.update({
                        where: { id: item.id },
                        data: { status: 'sent', sentAt: new Date() },
                    });
                }
                else {
                    await prisma_1.prisma.notificationQueue.update({
                        where: { id: item.id },
                        data: { status: 'failed' },
                    });
                    overallSuccess = false;
                }
            }
            catch (error) {
                overallSuccess = false;
                console.error(`Notification queue dispatch failed for entry ${item.id}:`, error);
                await prisma_1.prisma.notificationQueue.update({
                    where: { id: item.id },
                    data: {
                        status: 'failed',
                        retryCount: { increment: 1 },
                    },
                });
            }
        }
        await prisma_1.prisma.notification.update({
            where: { id: notificationId },
            data: {
                status: overallSuccess ? 'sent' : 'failed',
            },
        });
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
