import { Schema, model, Document, models } from 'mongoose';

// ─── 1. activity_logs ────────────────────────────────────────────────────────
const activityLogSchema = new Schema({
  userId:      { type: Number },
  userType:    { type: String, enum: ['customer', 'vendor', 'admin', 'system'] },
  module:      { type: String },
  action:      { type: String, required: true },
  referenceId: { type: Number },
  metadata:    { type: Schema.Types.Mixed },
  ipAddress:   { type: String },
  device:      { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 2. audit_logs ───────────────────────────────────────────────────────────
const auditLogSchema = new Schema({
  adminId:  { type: Number },
  module:   { type: String, required: true },
  entity:   { type: String, required: true },
  entityId: { type: Number },
  action:   { type: String, required: true },
  oldData:  { type: Schema.Types.Mixed },
  newData:  { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 3. booking_logs ─────────────────────────────────────────────────────────
const bookingLogSchema = new Schema({
  bookingId:   { type: Number, required: true },
  status:      { type: String, required: true },
  description: { type: String },
  performedBy: { type: Number },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 4. payment_logs ─────────────────────────────────────────────────────────
const paymentLogSchema = new Schema({
  paymentId: { type: Number, required: true },
  gateway:   { type: String },
  request:   { type: Schema.Types.Mixed },
  response:  { type: Schema.Types.Mixed },
  status:    { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 5. assignment_logs ──────────────────────────────────────────────────────
const assignmentLogSchema = new Schema({
  assignmentId: { type: Number, required: true },
  vendorId:     { type: Number },
  action:       { type: String, required: true },
  description:  { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 6. notification_logs ────────────────────────────────────────────────────
const notificationLogSchema = new Schema({
  notificationId:   { type: Number },
  channel:          { type: String, enum: ['email', 'sms', 'push', 'in-app'] },
  status:           { type: String, enum: ['sent', 'failed', 'pending'] },
  providerResponse: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 7. analytics_events ─────────────────────────────────────────────────────
const analyticsEventSchema = new Schema({
  eventName:  { type: String, required: true },
  customerId: { type: Number },
  bookingId:  { type: Number },
  metadata:   { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 8. search_history ───────────────────────────────────────────────────────
const searchHistorySchema = new Schema({
  customerId: { type: Number },
  keyword:    { type: String },
  zoneId:     { type: Number },
  eventId:    { type: Number },
  searchedAt: { type: Date, default: Date.now },
});

// ─── 9. customer_sessions ────────────────────────────────────────────────────
const customerSessionSchema = new Schema({
  customerId: { type: Number, required: true },
  device:     { type: String },
  browser:    { type: String },
  ipAddress:  { type: String },
  loginAt:    { type: Date, default: Date.now },
  logoutAt:   { type: Date },
});

// ─── 10. device_sessions ─────────────────────────────────────────────────────
const deviceSessionSchema = new Schema({
  deviceId:    { type: String, required: true },
  customerId:  { type: Number },
  platform:    { type: String },
  deviceName:  { type: String },
  appVersion:  { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 11. chat_messages ───────────────────────────────────────────────────────
const chatMessageSchema = new Schema({
  conversationId: { type: Number, required: true },
  senderId:       { type: Number, required: true },
  senderType:     { type: String, enum: ['customer', 'admin', 'vendor'] },
  message:        { type: String },
  attachments:    [{ url: String, fileType: String }],
  readStatus:     { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 12. notification_queue ──────────────────────────────────────────────────
const notificationQueueSchema = new Schema({
  notificationId: { type: Number },
  channel:        { type: String },
  priority:       { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  retryCount:     { type: Number, default: 0 },
  status:         { type: String, enum: ['pending', 'processing', 'done', 'failed'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 13. socket_events ───────────────────────────────────────────────────────
const socketEventSchema = new Schema({
  event:      { type: String, required: true },
  customerId: { type: Number },
  bookingId:  { type: Number },
  payload:    { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 14. realtime_dashboard ──────────────────────────────────────────────────
const realtimeDashboardSchema = new Schema({
  widget:      { type: String, required: true, unique: true },
  value:       { type: Schema.Types.Mixed },
  lastUpdated: { type: Date, default: Date.now },
});

// ─── 15. report_cache ────────────────────────────────────────────────────────
const reportCacheSchema = new Schema({
  reportId:  { type: Number },
  cacheKey:  { type: String, required: true, unique: true },
  fileUrl:   { type: String },
  expiresAt: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
reportCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── 16. service_cache ───────────────────────────────────────────────────────
const serviceCacheSchema = new Schema({
  zoneId:     { type: Number },
  serviceId:  { type: Number },
  cachedData: { type: Schema.Types.Mixed },
  expiresAt:  { type: Date, required: true },
});
serviceCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── 17. pricing_cache ───────────────────────────────────────────────────────
const pricingCacheSchema = new Schema({
  zoneId:       { type: Number },
  calculatorId: { type: Number },
  priceData:    { type: Schema.Types.Mixed },
  expiresAt:    { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
pricingCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── 18. quotation_cache ─────────────────────────────────────────────────────
const quotationCacheSchema = new Schema({
  customerId:    { type: Number },
  quotationData: { type: Schema.Types.Mixed },
  expiresAt:     { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
quotationCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── 19. system_events ───────────────────────────────────────────────────────
const systemEventSchema = new Schema({
  eventName: { type: String, required: true },
  payload:   { type: Schema.Types.Mixed },
  status:    { type: String, enum: ['success', 'failed', 'running'] },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── 20. error_logs ──────────────────────────────────────────────────────────
const errorLogSchema = new Schema({
  service:    { type: String },
  errorType:  { type: String },
  message:    { type: String, required: true },
  stackTrace: { type: String },
  severity:   { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ─── Exports ─────────────────────────────────────────────────────────────────
export const ActivityLog        = models.ActivityLog        || model('ActivityLog',        activityLogSchema,        'activity_logs');
export const AuditLog           = models.AuditLog           || model('AuditLog',           auditLogSchema,           'audit_logs');
export const BookingLog         = models.BookingLog         || model('BookingLog',         bookingLogSchema,         'booking_logs');
export const PaymentLog         = models.PaymentLog         || model('PaymentLog',         paymentLogSchema,         'payment_logs');
export const AssignmentLog      = models.AssignmentLog      || model('AssignmentLog',      assignmentLogSchema,      'assignment_logs');
export const NotificationLog    = models.NotificationLog    || model('NotificationLog',    notificationLogSchema,    'notification_logs');
export const AnalyticsEvent     = models.AnalyticsEvent     || model('AnalyticsEvent',     analyticsEventSchema,     'analytics_events');
export const SearchHistory      = models.SearchHistory      || model('SearchHistory',      searchHistorySchema,      'search_history');
export const CustomerSession    = models.CustomerSession    || model('CustomerSession',    customerSessionSchema,    'customer_sessions');
export const DeviceSession      = models.DeviceSession      || model('DeviceSession',      deviceSessionSchema,      'device_sessions');
export const ChatMessage        = models.ChatMessage        || model('ChatMessage',        chatMessageSchema,        'chat_messages');
export const NotificationQueue  = models.NotificationQueue  || model('NotificationQueue',  notificationQueueSchema,  'notification_queue');
export const SocketEvent        = models.SocketEvent        || model('SocketEvent',        socketEventSchema,        'socket_events');
export const RealtimeDashboard  = models.RealtimeDashboard  || model('RealtimeDashboard',  realtimeDashboardSchema,  'realtime_dashboard');
export const ReportCache        = models.ReportCache        || model('ReportCache',        reportCacheSchema,        'report_cache');
export const ServiceCache       = models.ServiceCache       || model('ServiceCache',       serviceCacheSchema,       'service_cache');
export const PricingCache       = models.PricingCache       || model('PricingCache',       pricingCacheSchema,       'pricing_cache');
export const QuotationCache     = models.QuotationCache     || model('QuotationCache',     quotationCacheSchema,     'quotation_cache');
export const SystemEvent        = models.SystemEvent        || model('SystemEvent',        systemEventSchema,        'system_events');
export const ErrorLog           = models.ErrorLog           || model('ErrorLog',           errorLogSchema,           'error_logs');
