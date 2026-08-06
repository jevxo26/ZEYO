import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';

export class AdminNotificationController {
  // ─── Templates ────────────────────────────────────────────────────────────
  static async getTemplates(req: Request, res: Response) {
    try {
      const templates = await prisma.notificationTemplate.findMany();
      res.json({ success: true, data: templates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createTemplate(req: Request, res: Response) {
    try {
      const template = await prisma.notificationTemplate.create({ data: req.body });
      res.status(201).json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ─── Broadcasts ───────────────────────────────────────────────────────────
  static async getBroadcasts(req: Request, res: Response) {
    try {
      const broadcasts = await prisma.broadcastNotification.findMany({
        include: { zone: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: broadcasts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createBroadcast(req: Request, res: Response) {
    try {
      const broadcast = await prisma.broadcastNotification.create({ data: req.body });
      res.status(201).json({ success: true, data: broadcast });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ─── Admin Chat/Messages ──────────────────────────────────────────────────
  static async getAllConversations(req: Request, res: Response) {
    try {
      const conversations = await prisma.conversation.findMany({
        include: {
          customer: { select: { id: true, user: { select: { name: true, email: true } } } },
          admin: { select: { id: true, name: true } }
        },
        orderBy: { updatedAt: 'desc' }
      });
      res.json({ success: true, data: conversations });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async replyToConversation(req: Request, res: Response) {
    try {
      const adminId = (req as any).user.id;
      const { id } = req.params;
      const { message, messageType } = req.body;

      const msg = await prisma.message.create({
        data: {
          conversationId: Number(id),
          senderId: adminId,
          senderType: 'admin',
          message,
          messageType: messageType || 'text'
        }
      });

      // Update conversation to show admin is handling it
      await prisma.conversation.update({
        where: { id: Number(id) },
        data: { adminId, updatedAt: new Date() }
      });

      res.status(201).json({ success: true, data: msg });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
