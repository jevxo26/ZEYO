"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = exports.ChatService = exports.SessionService = exports.CacheService = exports.EventService = exports.LogService = void 0;
const collections_1 = require("../../models/mongo/collections");
// ─── Log Services ─────────────────────────────────────────────────────────────
class LogService {
    static logActivity(data) {
        return collections_1.ActivityLog.create(data).catch(() => null); // silent fail
    }
    static logAudit(data) {
        return collections_1.AuditLog.create(data).catch(() => null);
    }
    static logBooking(data) {
        return collections_1.BookingLog.create(data).catch(() => null);
    }
    static logPayment(data) {
        return collections_1.PaymentLog.create(data).catch(() => null);
    }
    static logAssignment(data) {
        return collections_1.AssignmentLog.create(data).catch(() => null);
    }
    static logNotification(data) {
        return collections_1.NotificationLog.create(data).catch(() => null);
    }
    static logError(data) {
        return collections_1.ErrorLog.create(data).catch(() => null);
    }
    static getActivityLogs(filter = {}, limit = 50) {
        return collections_1.ActivityLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    }
    static getAuditLogs(filter = {}, limit = 50) {
        return collections_1.AuditLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    }
    static getErrorLogs(filter = {}, limit = 50) {
        return collections_1.ErrorLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    }
}
exports.LogService = LogService;
// ─── Event Services ───────────────────────────────────────────────────────────
class EventService {
    static trackEvent(data) {
        return collections_1.AnalyticsEvent.create(data).catch(() => null);
    }
    static trackSystemEvent(data) {
        return collections_1.SystemEvent.create(data).catch(() => null);
    }
    static trackSocketEvent(data) {
        return collections_1.SocketEvent.create(data).catch(() => null);
    }
    static getAnalyticsEvents(filter = {}, limit = 100) {
        return collections_1.AnalyticsEvent.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    }
}
exports.EventService = EventService;
// ─── Cache Services ───────────────────────────────────────────────────────────
class CacheService {
    static setReportCache(data) {
        return collections_1.ReportCache.findOneAndUpdate({ cacheKey: data.cacheKey }, data, { upsert: true, new: true });
    }
    static getReportCache(cacheKey) {
        return collections_1.ReportCache.findOne({ cacheKey, expiresAt: { $gt: new Date() } }).lean();
    }
    static setServiceCache(data) {
        return collections_1.ServiceCache.create(data).catch(() => null);
    }
    static setPricingCache(data) {
        return collections_1.PricingCache.create(data).catch(() => null);
    }
    static getPricingCache(zoneId, calculatorId) {
        return collections_1.PricingCache.findOne({ zoneId, calculatorId, expiresAt: { $gt: new Date() } }).lean();
    }
    static setQuotationCache(data) {
        return collections_1.QuotationCache.create(data).catch(() => null);
    }
    static updateDashboard(widget, value) {
        return collections_1.RealtimeDashboard.findOneAndUpdate({ widget }, { widget, value, lastUpdated: new Date() }, { upsert: true, new: true });
    }
    static getDashboard() {
        return collections_1.RealtimeDashboard.find().lean();
    }
}
exports.CacheService = CacheService;
// ─── Session Services ─────────────────────────────────────────────────────────
class SessionService {
    static createCustomerSession(data) {
        return collections_1.CustomerSession.create(Object.assign(Object.assign({}, data), { loginAt: new Date() })).catch(() => null);
    }
    static endCustomerSession(customerId) {
        return collections_1.CustomerSession.findOneAndUpdate({ customerId, logoutAt: null }, { logoutAt: new Date() }, { sort: { loginAt: -1 } }).catch(() => null);
    }
    static trackDevice(data) {
        return collections_1.DeviceSession.findOneAndUpdate({ deviceId: data.deviceId }, data, { upsert: true, new: true });
    }
    static trackSearch(data) {
        return collections_1.SearchHistory.create(Object.assign(Object.assign({}, data), { searchedAt: new Date() })).catch(() => null);
    }
    static getSearchHistory(customerId, limit = 20) {
        return collections_1.SearchHistory.find({ customerId }).sort({ searchedAt: -1 }).limit(limit).lean();
    }
}
exports.SessionService = SessionService;
// ─── Chat Services ────────────────────────────────────────────────────────────
class ChatService {
    static sendMessage(data) {
        return collections_1.ChatMessage.create(data);
    }
    static getMessages(conversationId, limit = 50) {
        return collections_1.ChatMessage.find({ conversationId }).sort({ createdAt: -1 }).limit(limit).lean();
    }
    static markRead(conversationId, senderId) {
        return collections_1.ChatMessage.updateMany({ conversationId, senderId: { $ne: senderId }, readStatus: false }, { readStatus: true });
    }
}
exports.ChatService = ChatService;
// ─── Queue Services ───────────────────────────────────────────────────────────
class QueueService {
    static enqueue(data) {
        return collections_1.NotificationQueue.create(Object.assign(Object.assign({}, data), { status: 'pending', retryCount: 0 })).catch(() => null);
    }
    static getPending(limit = 10) {
        return collections_1.NotificationQueue.find({ status: 'pending' }).sort({ createdAt: 1 }).limit(limit).lean();
    }
    static markDone(id) {
        return collections_1.NotificationQueue.findByIdAndUpdate(id, { status: 'done' });
    }
    static markFailed(id) {
        return collections_1.NotificationQueue.findByIdAndUpdate(id, { $inc: { retryCount: 1 }, status: 'failed' });
    }
}
exports.QueueService = QueueService;
