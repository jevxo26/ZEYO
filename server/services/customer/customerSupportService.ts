import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class CustomerSupportService {
  // ─── Support Tickets ──────────────────────────────────────────────────────
  static getTickets = catchServiceAsync(async (customerId: number) => {
    return prisma.customerSupport.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static getTicketById = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.customerSupport.findFirst({
      where: { id, customerId },
    });
  });

  static createTicket = catchServiceAsync(async (customerId: number, data: {
    subject: string;
    description: string;
    priority?: string;
  }) => {
    const num = `TK-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return prisma.customerSupport.create({
      data: {
        ...data,
        customerId,
        ticketNumber: num,
        priority: data.priority || 'low',
        status: 'open',
      },
    });
  });

  static updateTicketStatus = catchServiceAsync(async (id: number, customerId: number, status: string) => {
    const resolvedAt = ['resolved', 'closed'].includes(status) ? new Date() : null;

    return prisma.customerSupport.update({
      where: { id, customerId },
      data: {
        status,
        ...(resolvedAt ? { resolvedAt } : {}),
      },
    });
  });

  // ─── Notifications ────────────────────────────────────────────────────────
  static getNotifications = catchServiceAsync(async (customerId: number) => {
    return prisma.customerNotification.findMany({
      where: { customerId },
      orderBy: { sentAt: 'desc' },
    });
  });

  static markAsRead = catchServiceAsync(async (id: number, customerId: number) => {
    return prisma.customerNotification.update({
      where: { id, customerId },
      data: { isRead: true },
    });
  });

  static markAllAsRead = catchServiceAsync(async (customerId: number) => {
    return prisma.customerNotification.updateMany({
      where: { customerId, isRead: false },
      data: { isRead: true },
    });
  });

  static createNotification = catchServiceAsync(async (customerId: number, data: {
    title: string;
    message: string;
    type: string;
  }) => {
    return prisma.customerNotification.create({
      data: {
        ...data,
        customerId,
        isRead: false,
        sentAt: new Date(),
      },
    });
  });
}
