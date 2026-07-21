"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationService = void 0;
const prisma_1 = require("../../config/prisma");
class CommunicationService {
    // ─── Conversations ────────────────────────────────────────────────────────
    static async getCustomerConversations(customerId) {
        return prisma_1.prisma.conversation.findMany({
            where: { customerId },
            include: {
                admin: { select: { id: true, firstName: true, lastName: true } },
                booking: { select: { id: true, bookingStatus: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    static async getConversation(conversationId, customerId) {
        return prisma_1.prisma.conversation.findFirst({
            where: Object.assign({ id: conversationId }, (customerId ? { customerId } : {})),
            include: {
                messages: {
                    include: { attachments: true },
                    orderBy: { createdAt: 'asc' },
                },
                admin: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    static async startConversation(customerId, bookingId) {
        return prisma_1.prisma.conversation.create({
            data: {
                customerId,
                bookingId,
                status: 'open',
            },
        });
    }
    // ─── Messages ─────────────────────────────────────────────────────────────
    static async sendMessage(data) {
        // 1. Create Message
        const msg = await prisma_1.prisma.message.create({
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
        await prisma_1.prisma.conversation.update({
            where: { id: data.conversationId },
            data: { updatedAt: new Date() },
        });
        return msg;
    }
}
exports.CommunicationService = CommunicationService;
