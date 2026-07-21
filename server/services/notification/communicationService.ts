import { prisma } from '../../config/prisma';

export class CommunicationService {
  // ─── Conversations ────────────────────────────────────────────────────────
  static async getCustomerConversations(customerId: number) {
    return prisma.conversation.findMany({
      where: { customerId },
      include: {
        admin: { select: { id: true, firstName: true, lastName: true } },
        booking: { select: { id: true, bookingStatus: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async getConversation(conversationId: number, customerId?: number) {
    return prisma.conversation.findFirst({
      where: {
        id: conversationId,
        ...(customerId ? { customerId } : {}),
      },
      include: {
        messages: {
          include: { attachments: true },
          orderBy: { createdAt: 'asc' },
        },
        admin: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  static async startConversation(customerId: number, bookingId?: number) {
    return prisma.conversation.create({
      data: {
        customerId,
        bookingId,
        status: 'open',
      },
    });
  }

  // ─── Messages ─────────────────────────────────────────────────────────────
  static async sendMessage(data: {
    conversationId: number;
    senderId: number;
    senderType: 'customer' | 'admin';
    message: string;
    messageType?: string;
  }) {
    // 1. Create Message
    const msg = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        senderType: data.senderType,
        message: data.message,
        messageType: data.messageType || 'text',
        status: 'sent',
      },
    });

    // 2. Update Conversation timestamp
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });

    return msg;
  }
}
