import { prisma } from '../../config/prisma';

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

    // Create Base Notification
    const notification = await prisma.notification.create({
      data: {
        ...notificationData,
        priority: notificationData.priority || 'low',
        status: 'pending',
      },
    });

    // Queue for each channel
    for (const channel of channels) {
      await prisma.notificationQueue.create({
        data: {
          notificationId: notification.id,
          channel,
          status: 'pending',
        },
      });

      if (channel === 'IN_APP' && data.customerId) {
        await prisma.inAppNotification.create({
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
