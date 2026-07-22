"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLog = exports.SystemEvent = exports.QuotationCache = exports.PricingCache = exports.ServiceCache = exports.ReportCache = exports.RealtimeDashboard = exports.SocketEvent = exports.NotificationQueue = exports.ChatMessage = exports.DeviceSession = exports.CustomerSession = exports.SearchHistory = exports.AnalyticsEvent = exports.NotificationLog = exports.AssignmentLog = exports.PaymentLog = exports.BookingLog = exports.AuditLog = exports.ActivityLog = void 0;
const mongoose_1 = require("mongoose");
// ─── 1. activity_logs ────────────────────────────────────────────────────────
const activityLogSchema = new mongoose_1.Schema({
    userId: { type: Number },
    userType: { type: String, enum: ['customer', 'vendor', 'admin', 'system'] },
    module: { type: String },
    action: { type: String, required: true },
    referenceId: { type: Number },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    ipAddress: { type: String },
    device: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 2. audit_logs ───────────────────────────────────────────────────────────
const auditLogSchema = new mongoose_1.Schema({
    adminId: { type: Number },
    module: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: Number },
    action: { type: String, required: true },
    oldData: { type: mongoose_1.Schema.Types.Mixed },
    newData: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 3. booking_logs ─────────────────────────────────────────────────────────
const bookingLogSchema = new mongoose_1.Schema({
    bookingId: { type: Number, required: true },
    status: { type: String, required: true },
    description: { type: String },
    performedBy: { type: Number },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 4. payment_logs ─────────────────────────────────────────────────────────
const paymentLogSchema = new mongoose_1.Schema({
    paymentId: { type: Number, required: true },
    gateway: { type: String },
    request: { type: mongoose_1.Schema.Types.Mixed },
    response: { type: mongoose_1.Schema.Types.Mixed },
    status: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 5. assignment_logs ──────────────────────────────────────────────────────
const assignmentLogSchema = new mongoose_1.Schema({
    assignmentId: { type: Number, required: true },
    vendorId: { type: Number },
    action: { type: String, required: true },
    description: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 6. notification_logs ────────────────────────────────────────────────────
const notificationLogSchema = new mongoose_1.Schema({
    notificationId: { type: Number },
    channel: { type: String, enum: ['email', 'sms', 'push', 'in-app'] },
    status: { type: String, enum: ['sent', 'failed', 'pending'] },
    providerResponse: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 7. analytics_events ─────────────────────────────────────────────────────
const analyticsEventSchema = new mongoose_1.Schema({
    eventName: { type: String, required: true },
    customerId: { type: Number },
    bookingId: { type: Number },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 8. search_history ───────────────────────────────────────────────────────
const searchHistorySchema = new mongoose_1.Schema({
    customerId: { type: Number },
    keyword: { type: String },
    zoneId: { type: Number },
    eventId: { type: Number },
    searchedAt: { type: Date, default: Date.now },
});
// ─── 9. customer_sessions ────────────────────────────────────────────────────
const customerSessionSchema = new mongoose_1.Schema({
    customerId: { type: Number, required: true },
    device: { type: String },
    browser: { type: String },
    ipAddress: { type: String },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date },
});
// ─── 10. device_sessions ─────────────────────────────────────────────────────
const deviceSessionSchema = new mongoose_1.Schema({
    deviceId: { type: String, required: true },
    customerId: { type: Number },
    platform: { type: String },
    deviceName: { type: String },
    appVersion: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 11. chat_messages ───────────────────────────────────────────────────────
const chatMessageSchema = new mongoose_1.Schema({
    conversationId: { type: Number, required: true },
    senderId: { type: Number, required: true },
    senderType: { type: String, enum: ['customer', 'admin', 'vendor'] },
    message: { type: String },
    attachments: [{ url: String, fileType: String }],
    readStatus: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 12. notification_queue ──────────────────────────────────────────────────
const notificationQueueSchema = new mongoose_1.Schema({
    notificationId: { type: Number },
    channel: { type: String },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    retryCount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'processing', 'done', 'failed'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 13. socket_events ───────────────────────────────────────────────────────
const socketEventSchema = new mongoose_1.Schema({
    event: { type: String, required: true },
    customerId: { type: Number },
    bookingId: { type: Number },
    payload: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 14. realtime_dashboard ──────────────────────────────────────────────────
const realtimeDashboardSchema = new mongoose_1.Schema({
    widget: { type: String, required: true, unique: true },
    value: { type: mongoose_1.Schema.Types.Mixed },
    lastUpdated: { type: Date, default: Date.now },
});
// ─── 15. report_cache ────────────────────────────────────────────────────────
const reportCacheSchema = new mongoose_1.Schema({
    reportId: { type: Number },
    cacheKey: { type: String, required: true, unique: true },
    fileUrl: { type: String },
    expiresAt: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
reportCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// ─── 16. service_cache ───────────────────────────────────────────────────────
const serviceCacheSchema = new mongoose_1.Schema({
    zoneId: { type: Number },
    serviceId: { type: Number },
    cachedData: { type: mongoose_1.Schema.Types.Mixed },
    expiresAt: { type: Date, required: true },
});
serviceCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// ─── 17. pricing_cache ───────────────────────────────────────────────────────
const pricingCacheSchema = new mongoose_1.Schema({
    zoneId: { type: Number },
    calculatorId: { type: Number },
    priceData: { type: mongoose_1.Schema.Types.Mixed },
    expiresAt: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
pricingCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// ─── 18. quotation_cache ─────────────────────────────────────────────────────
const quotationCacheSchema = new mongoose_1.Schema({
    customerId: { type: Number },
    quotationData: { type: mongoose_1.Schema.Types.Mixed },
    expiresAt: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
quotationCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// ─── 19. system_events ───────────────────────────────────────────────────────
const systemEventSchema = new mongoose_1.Schema({
    eventName: { type: String, required: true },
    payload: { type: mongoose_1.Schema.Types.Mixed },
    status: { type: String, enum: ['success', 'failed', 'running'] },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── 20. error_logs ──────────────────────────────────────────────────────────
const errorLogSchema = new mongoose_1.Schema({
    service: { type: String },
    errorType: { type: String },
    message: { type: String, required: true },
    stackTrace: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
}, { timestamps: { createdAt: true, updatedAt: false } });
// ─── Exports ─────────────────────────────────────────────────────────────────
exports.ActivityLog = mongoose_1.models.ActivityLog || (0, mongoose_1.model)('ActivityLog', activityLogSchema, 'activity_logs');
exports.AuditLog = mongoose_1.models.AuditLog || (0, mongoose_1.model)('AuditLog', auditLogSchema, 'audit_logs');
exports.BookingLog = mongoose_1.models.BookingLog || (0, mongoose_1.model)('BookingLog', bookingLogSchema, 'booking_logs');
exports.PaymentLog = mongoose_1.models.PaymentLog || (0, mongoose_1.model)('PaymentLog', paymentLogSchema, 'payment_logs');
exports.AssignmentLog = mongoose_1.models.AssignmentLog || (0, mongoose_1.model)('AssignmentLog', assignmentLogSchema, 'assignment_logs');
exports.NotificationLog = mongoose_1.models.NotificationLog || (0, mongoose_1.model)('NotificationLog', notificationLogSchema, 'notification_logs');
exports.AnalyticsEvent = mongoose_1.models.AnalyticsEvent || (0, mongoose_1.model)('AnalyticsEvent', analyticsEventSchema, 'analytics_events');
exports.SearchHistory = mongoose_1.models.SearchHistory || (0, mongoose_1.model)('SearchHistory', searchHistorySchema, 'search_history');
exports.CustomerSession = mongoose_1.models.CustomerSession || (0, mongoose_1.model)('CustomerSession', customerSessionSchema, 'customer_sessions');
exports.DeviceSession = mongoose_1.models.DeviceSession || (0, mongoose_1.model)('DeviceSession', deviceSessionSchema, 'device_sessions');
exports.ChatMessage = mongoose_1.models.ChatMessage || (0, mongoose_1.model)('ChatMessage', chatMessageSchema, 'chat_messages');
exports.NotificationQueue = mongoose_1.models.NotificationQueue || (0, mongoose_1.model)('NotificationQueue', notificationQueueSchema, 'notification_queue');
exports.SocketEvent = mongoose_1.models.SocketEvent || (0, mongoose_1.model)('SocketEvent', socketEventSchema, 'socket_events');
exports.RealtimeDashboard = mongoose_1.models.RealtimeDashboard || (0, mongoose_1.model)('RealtimeDashboard', realtimeDashboardSchema, 'realtime_dashboard');
exports.ReportCache = mongoose_1.models.ReportCache || (0, mongoose_1.model)('ReportCache', reportCacheSchema, 'report_cache');
exports.ServiceCache = mongoose_1.models.ServiceCache || (0, mongoose_1.model)('ServiceCache', serviceCacheSchema, 'service_cache');
exports.PricingCache = mongoose_1.models.PricingCache || (0, mongoose_1.model)('PricingCache', pricingCacheSchema, 'pricing_cache');
exports.QuotationCache = mongoose_1.models.QuotationCache || (0, mongoose_1.model)('QuotationCache', quotationCacheSchema, 'quotation_cache');
exports.SystemEvent = mongoose_1.models.SystemEvent || (0, mongoose_1.model)('SystemEvent', systemEventSchema, 'system_events');
exports.ErrorLog = mongoose_1.models.ErrorLog || (0, mongoose_1.model)('ErrorLog', errorLogSchema, 'error_logs');
