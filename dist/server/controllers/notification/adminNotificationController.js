"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationController = void 0;
const prisma_1 = require("../../config/prisma");
class AdminNotificationController {
    // ─── Templates ────────────────────────────────────────────────────────────
    static async getTemplates(req, res) {
        try {
            const templates = await prisma_1.prisma.notificationTemplate.findMany();
            res.json({ success: true, data: templates });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createTemplate(req, res) {
        try {
            const template = await prisma_1.prisma.notificationTemplate.create({ data: req.body });
            res.status(201).json({ success: true, data: template });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // ─── Broadcasts ───────────────────────────────────────────────────────────
    static async getBroadcasts(req, res) {
        try {
            const broadcasts = await prisma_1.prisma.broadcastNotification.findMany({
                include: { zone: true },
                orderBy: { createdAt: 'desc' }
            });
            res.json({ success: true, data: broadcasts });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createBroadcast(req, res) {
        try {
            const broadcast = await prisma_1.prisma.broadcastNotification.create({ data: req.body });
            res.status(201).json({ success: true, data: broadcast });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // ─── Admin Chat/Messages ──────────────────────────────────────────────────
    static async getAllConversations(req, res) {
        try {
            const conversations = await prisma_1.prisma.conversation.findMany({
                include: {
                    customer: { select: { id: true, user: { select: { name: true, email: true } } } },
                    admin: { select: { id: true, name: true } }
                },
                orderBy: { updatedAt: 'desc' }
            });
            res.json({ success: true, data: conversations });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async replyToConversation(req, res) {
        try {
            const adminId = req.user.id;
            const { id } = req.params;
            const { message, messageType } = req.body;
            const msg = await prisma_1.prisma.message.create({
                data: {
                    conversationId: Number(id),
                    senderId: adminId,
                    senderType: 'admin',
                    message,
                    messageType: messageType || 'text'
                }
            });
            // Update conversation to show admin is handling it
            await prisma_1.prisma.conversation.update({
                where: { id: Number(id) },
                data: { adminId, updatedAt: new Date() }
            });
            res.status(201).json({ success: true, data: msg });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.AdminNotificationController = AdminNotificationController;
