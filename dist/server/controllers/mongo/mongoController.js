"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoController = void 0;
const mongoService_1 = require("../../services/mongo/mongoService");
class MongoController {
    // ─── Logs ─────────────────────────────────────────────────────────────────
    static async getActivityLogs(req, res) {
        try {
            const { userId, module, action, limit } = req.query;
            const filter = {};
            if (userId)
                filter.userId = Number(userId);
            if (module)
                filter.module = module;
            if (action)
                filter.action = action;
            const data = await mongoService_1.LogService.getActivityLogs(filter, Number(limit) || 50);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    static async getAuditLogs(req, res) {
        try {
            const { adminId, module, entity, limit } = req.query;
            const filter = {};
            if (adminId)
                filter.adminId = Number(adminId);
            if (module)
                filter.module = module;
            if (entity)
                filter.entity = entity;
            const data = await mongoService_1.LogService.getAuditLogs(filter, Number(limit) || 50);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    static async getErrorLogs(req, res) {
        try {
            const { severity, service, limit } = req.query;
            const filter = {};
            if (severity)
                filter.severity = severity;
            if (service)
                filter.service = service;
            const data = await mongoService_1.LogService.getErrorLogs(filter, Number(limit) || 50);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    // ─── Analytics Events ─────────────────────────────────────────────────────
    static async getAnalyticsEvents(req, res) {
        try {
            const { eventName, customerId, limit } = req.query;
            const filter = {};
            if (eventName)
                filter.eventName = eventName;
            if (customerId)
                filter.customerId = Number(customerId);
            const data = await mongoService_1.EventService.getAnalyticsEvents(filter, Number(limit) || 100);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    static async trackEvent(req, res) {
        try {
            const data = await mongoService_1.EventService.trackEvent(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    // ─── Cache ────────────────────────────────────────────────────────────────
    static async getDashboardCache(req, res) {
        try {
            const data = await mongoService_1.CacheService.getDashboard();
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    static async updateDashboardCache(req, res) {
        try {
            const { widget, value } = req.body;
            const data = await mongoService_1.CacheService.updateDashboard(widget, value);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    // ─── Search History ───────────────────────────────────────────────────────
    static async trackSearch(req, res) {
        try {
            await mongoService_1.SessionService.trackSearch(req.body);
            res.status(201).json({ success: true, message: 'Search tracked' });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    static async getSearchHistory(req, res) {
        try {
            const customerId = Number(req.params.customerId);
            const data = await mongoService_1.SessionService.getSearchHistory(customerId);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    // ─── Chat ─────────────────────────────────────────────────────────────────
    static async getChatMessages(req, res) {
        try {
            const conversationId = Number(req.params.conversationId);
            const limit = Number(req.query.limit) || 50;
            const data = await mongoService_1.ChatService.getMessages(conversationId, limit);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    static async sendChatMessage(req, res) {
        try {
            const conversationId = Number(req.params.conversationId);
            const data = await mongoService_1.ChatService.sendMessage(Object.assign({ conversationId }, req.body));
            res.status(201).json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    // ─── Notification Queue ───────────────────────────────────────────────────
    static async getPendingQueue(req, res) {
        try {
            const data = await mongoService_1.QueueService.getPending(Number(req.query.limit) || 10);
            res.json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
}
exports.MongoController = MongoController;
