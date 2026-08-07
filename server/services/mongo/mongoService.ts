import {
  ActivityLog, AuditLog, BookingLog, PaymentLog,
  AssignmentLog, NotificationLog, AnalyticsEvent,
  SearchHistory, CustomerSession, DeviceSession,
  ChatMessage, NotificationQueue, SocketEvent,
  RealtimeDashboard, ReportCache, ServiceCache,
  PricingCache, QuotationCache, SystemEvent, ErrorLog
} from '../../models/mongo/collections';

// ─── Log Services ─────────────────────────────────────────────────────────────
export class LogService {
  static logActivity(data: { userId?: number; userType?: string; module?: string; action: string; referenceId?: number; metadata?: any; ipAddress?: string; device?: string }) {
    return ActivityLog.create(data).catch(() => null); // silent fail
  }

  static logAudit(data: { adminId?: number; module: string; entity: string; entityId?: number; action: string; oldData?: any; newData?: any }) {
    return AuditLog.create(data).catch(() => null);
  }

  static logBooking(data: { bookingId: number; status: string; description?: string; performedBy?: number }) {
    return BookingLog.create(data).catch(() => null);
  }

  static logPayment(data: { paymentId: number; gateway?: string; request?: any; response?: any; status?: string }) {
    return PaymentLog.create(data).catch(() => null);
  }

  static logAssignment(data: { assignmentId: number; vendorId?: number; action: string; description?: string }) {
    return AssignmentLog.create(data).catch(() => null);
  }

  static logNotification(data: { notificationId?: number; channel?: string; status?: string; providerResponse?: any }) {
    return NotificationLog.create(data).catch(() => null);
  }

  static logError(data: { service?: string; errorType?: string; message: string; stackTrace?: string; severity?: string }) {
    return ErrorLog.create(data).catch(() => null);
  }

  static getActivityLogs(filter: any = {}, limit = 50) {
    return ActivityLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  }

  static getAuditLogs(filter: any = {}, limit = 50) {
    return AuditLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  }

  static getErrorLogs(filter: any = {}, limit = 50) {
    return ErrorLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  }
}

// ─── Event Services ───────────────────────────────────────────────────────────
export class EventService {
  static trackEvent(data: { eventName: string; customerId?: number; bookingId?: number; metadata?: any }) {
    return AnalyticsEvent.create(data).catch(() => null);
  }

  static trackSystemEvent(data: { eventName: string; payload?: any; status?: string }) {
    return SystemEvent.create(data).catch(() => null);
  }

  static trackSocketEvent(data: { event: string; customerId?: number; bookingId?: number; payload?: any }) {
    return SocketEvent.create(data).catch(() => null);
  }

  static getAnalyticsEvents(filter: any = {}, limit = 100) {
    return AnalyticsEvent.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  }
}

// ─── Cache Services ───────────────────────────────────────────────────────────
export class CacheService {
  static setReportCache(data: { reportId?: number; cacheKey: string; fileUrl?: string; expiresAt: Date }) {
    return ReportCache.findOneAndUpdate({ cacheKey: data.cacheKey }, data, { upsert: true, new: true });
  }

  static getReportCache(cacheKey: string) {
    return ReportCache.findOne({ cacheKey, expiresAt: { $gt: new Date() } }).lean();
  }

  static setServiceCache(data: { zoneId?: number; serviceId?: number; cachedData: any; expiresAt: Date }) {
    return ServiceCache.create(data).catch(() => null);
  }

  static setPricingCache(data: { zoneId?: number; calculatorId?: number; priceData: any; expiresAt: Date }) {
    return PricingCache.create(data).catch(() => null);
  }

  static getPricingCache(zoneId: number, calculatorId: number) {
    return PricingCache.findOne({ zoneId, calculatorId, expiresAt: { $gt: new Date() } }).lean();
  }

  static setQuotationCache(data: { customerId?: number; quotationData: any; expiresAt: Date }) {
    return QuotationCache.create(data).catch(() => null);
  }

  static updateDashboard(widget: string, value: any) {
    return RealtimeDashboard.findOneAndUpdate({ widget }, { widget, value, lastUpdated: new Date() }, { upsert: true, new: true });
  }

  static getDashboard() {
    return RealtimeDashboard.find().lean();
  }
}

// ─── Session Services ─────────────────────────────────────────────────────────
export class SessionService {
  static createCustomerSession(data: { customerId: number; device?: string; browser?: string; ipAddress?: string }) {
    return CustomerSession.create({ ...data, loginAt: new Date() }).catch(() => null);
  }

  static endCustomerSession(customerId: number) {
    return CustomerSession.findOneAndUpdate(
      { customerId, logoutAt: null },
      { logoutAt: new Date() },
      { sort: { loginAt: -1 } }
    ).catch(() => null);
  }

  static trackDevice(data: { deviceId: string; customerId?: number; platform?: string; deviceName?: string; appVersion?: string }) {
    return DeviceSession.findOneAndUpdate({ deviceId: data.deviceId }, data, { upsert: true, new: true });
  }

  static trackSearch(data: { customerId?: number; keyword?: string; zoneId?: number; eventId?: number }) {
    return SearchHistory.create({ ...data, searchedAt: new Date() }).catch(() => null);
  }

  static getSearchHistory(customerId: number, limit = 20) {
    return SearchHistory.find({ customerId }).sort({ searchedAt: -1 }).limit(limit).lean();
  }
}

// ─── Chat Services ────────────────────────────────────────────────────────────
export class ChatService {
  static sendMessage(data: { conversationId: number; senderId: number; senderType?: string; message?: string; attachments?: any[] }) {
    return ChatMessage.create(data);
  }

  static getMessages(conversationId: number, limit = 50) {
    return ChatMessage.find({ conversationId }).sort({ createdAt: -1 }).limit(limit).lean();
  }

  static markRead(conversationId: number, senderId: number) {
    return ChatMessage.updateMany({ conversationId, senderId: { $ne: senderId }, readStatus: false }, { readStatus: true });
  }
}

// ─── Queue Services ───────────────────────────────────────────────────────────
export class QueueService {
  static enqueue(data: { notificationId?: number; channel?: string; priority?: string }) {
    return NotificationQueue.create({ ...data, status: 'pending', retryCount: 0 }).catch(() => null);
  }

  static getPending(limit = 10) {
    return NotificationQueue.find({ status: 'pending' }).sort({ createdAt: 1 }).limit(limit).lean();
  }

  static markDone(id: string) {
    return NotificationQueue.findByIdAndUpdate(id, { status: 'done' });
  }

  static markFailed(id: string) {
    return NotificationQueue.findByIdAndUpdate(id, { $inc: { retryCount: 1 }, status: 'failed' });
  }
}
