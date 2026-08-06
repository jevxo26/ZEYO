import { Request, Response } from 'express';
import { LogService, EventService, CacheService, SessionService, ChatService, QueueService } from '../../services/mongo/mongoService';

export class MongoController {
  // ─── Logs ─────────────────────────────────────────────────────────────────
  static async getActivityLogs(req: Request, res: Response) {
    try {
      const { userId, module, action, limit } = req.query as any;
      const filter: any = {};
      if (userId) filter.userId = Number(userId);
      if (module) filter.module = module;
      if (action) filter.action = action;
      const data = await LogService.getActivityLogs(filter, Number(limit) || 50);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getAuditLogs(req: Request, res: Response) {
    try {
      const { adminId, module, entity, limit } = req.query as any;
      const filter: any = {};
      if (adminId) filter.adminId = Number(adminId);
      if (module)  filter.module = module;
      if (entity)  filter.entity = entity;
      const data = await LogService.getAuditLogs(filter, Number(limit) || 50);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getErrorLogs(req: Request, res: Response) {
    try {
      const { severity, service, limit } = req.query as any;
      const filter: any = {};
      if (severity) filter.severity = severity;
      if (service)  filter.service = service;
      const data = await LogService.getErrorLogs(filter, Number(limit) || 50);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  // ─── Analytics Events ─────────────────────────────────────────────────────
  static async getAnalyticsEvents(req: Request, res: Response) {
    try {
      const { eventName, customerId, limit } = req.query as any;
      const filter: any = {};
      if (eventName)  filter.eventName = eventName;
      if (customerId) filter.customerId = Number(customerId);
      const data = await EventService.getAnalyticsEvents(filter, Number(limit) || 100);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async trackEvent(req: Request, res: Response) {
    try {
      const data = await EventService.trackEvent(req.body);
      res.status(201).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  // ─── Cache ────────────────────────────────────────────────────────────────
  static async getDashboardCache(req: Request, res: Response) {
    try {
      const data = await CacheService.getDashboard();
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async updateDashboardCache(req: Request, res: Response) {
    try {
      const { widget, value } = req.body;
      const data = await CacheService.updateDashboard(widget, value);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  // ─── Search History ───────────────────────────────────────────────────────
  static async trackSearch(req: Request, res: Response) {
    try {
      await SessionService.trackSearch(req.body);
      res.status(201).json({ success: true, message: 'Search tracked' });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async getSearchHistory(req: Request, res: Response) {
    try {
      const customerId = Number(req.params.customerId);
      const data = await SessionService.getSearchHistory(customerId);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  // ─── Chat ─────────────────────────────────────────────────────────────────
  static async getChatMessages(req: Request, res: Response) {
    try {
      const conversationId = Number(req.params.conversationId);
      const limit = Number(req.query.limit) || 50;
      const data = await ChatService.getMessages(conversationId, limit);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  static async sendChatMessage(req: Request, res: Response) {
    try {
      const conversationId = Number(req.params.conversationId);
      const data = await ChatService.sendMessage({ conversationId, ...req.body });
      res.status(201).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }

  // ─── Notification Queue ───────────────────────────────────────────────────
  static async getPendingQueue(req: Request, res: Response) {
    try {
      const data = await QueueService.getPending(Number(req.query.limit) || 10);
      res.json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  }
}
