import { prisma } from '../../config/prisma';
import { sendEmail } from '../emailService';
import { sendSMS } from '../smsService';

export class NotificationService {
  // Trigger a new notification
  static async sendNotification(data: {
    customerId?: number;
    bookingId?: number;
    title: string;
    message: string;
    notificationType: string;
    priority?: string;
    channels: ('PUSH' | 'EMAIL' | 'SMS' | 'IN_APP')[];
  }) {
    const { channels, ...notificationData } = data;

    const notification = await prisma.notification.create({
      data: {
        ...notificationData,
        priority: notificationData.priority || 'low',
        status: 'pending',
      },
    });

    const queueItems = await Promise.all(
      channels.map(async (channel) =>
        prisma.notificationQueue.create({
          data: {
            notificationId: notification.id,
            channel,
          },
        })
      )
    );

    if (channels.includes('IN_APP') && data.customerId) {
      await prisma.inAppNotification.create({
        data: {
          notificationId: notification.id,
          customerId: data.customerId,
        },
      });
    }

    await NotificationService.processNotificationQueue(notification.id, queueItems);

    return notification;
  }

  static async processNotificationQueue(notificationId: number, queueItems?: { id: number; channel: string }[]) {
    const notification = await prisma.notification.findUnique({
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
    const customerEmail = notification.customer?.user?.email;
    const customerPhone = notification.customer?.user?.phone;

    let overallSuccess = true;

    for (const item of pendingItems) {
      try {
        if (item.channel === 'EMAIL') {
          if (!customerEmail) {
            throw new Error('Customer email not available');
          }

          await sendEmail(
            customerEmail,
            notification.title,
            notification.message,
            `<p>${notification.message}</p>`
          );

          await prisma.emailNotification.create({
            data: {
              notificationId: notification.id,
              email: customerEmail,
              subject: notification.title,
              body: notification.message,
              status: 'sent',
              sentAt: new Date(),
            },
          });

          await prisma.notificationQueue.update({
            where: { id: item.id },
            data: { status: 'sent', sentAt: new Date() },
          });
        } else if (item.channel === 'SMS') {
          if (!customerPhone) {
            throw new Error('Customer phone number not available');
          }

          await sendSMS(customerPhone, notification.message);

          await prisma.sMSNotification.create({
            data: {
              notificationId: notification.id,
              phone: customerPhone,
              message: notification.message,
              provider: 'twilio',
              status: 'sent',
              sentAt: new Date(),
            },
          });

          await prisma.notificationQueue.update({
            where: { id: item.id },
            data: { status: 'sent', sentAt: new Date() },
          });
        } else if (item.channel === 'IN_APP') {
          await prisma.notificationQueue.update({
            where: { id: item.id },
            data: { status: 'sent', sentAt: new Date() },
          });
        } else if (item.channel === 'PUSH') {
          console.warn(`Push notification queue entry ${item.id} created but no push delivery is configured.`);
          await prisma.notificationQueue.update({
            where: { id: item.id },
            data: { status: 'sent', sentAt: new Date() },
          });
        } else {
          await prisma.notificationQueue.update({
            where: { id: item.id },
            data: { status: 'failed' },
          });
          overallSuccess = false;
        }
      } catch (error) {
        overallSuccess = false;
        console.error(`Notification queue dispatch failed for entry ${item.id}:`, error);
        await prisma.notificationQueue.update({
          where: { id: item.id },
          data: {
            status: 'failed',
            retryCount: { increment: 1 },
          },
        });
      }
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: overallSuccess ? 'sent' : 'failed',
      },
    });

    return notification;
  }

  // Get In-App Notifications for a Customer
  static async getCustomerInAppNotifications(customerId: number) {
    return prisma.inAppNotification.findMany({
      where: { customerId },
      include: { notification: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mark In-App Notification as read
  static async markInAppAsRead(notificationId: number) {
    return prisma.inAppNotification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  // Get Customer Preferences
  static async getPreferences(customerId: number) {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { customerId },
    });
    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { customerId },
      });
    }
    return prefs;
  }

  // Update Customer Preferences
  static async updatePreferences(customerId: number, data: any) {
    return prisma.notificationPreference.upsert({
      where: { customerId },
      update: data,
      create: { customerId, ...data },
    });
  }
}
