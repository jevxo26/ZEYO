"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSupportService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class CustomerSupportService {
}
exports.CustomerSupportService = CustomerSupportService;
_a = CustomerSupportService;
// ─── Support Tickets ──────────────────────────────────────────────────────
CustomerSupportService.getTickets = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerSupport.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerSupportService.getTicketById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma_1.prisma.customerSupport.findFirst({
        where: { id, customerId },
    });
});
CustomerSupportService.createTicket = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    const num = `TK-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    return prisma_1.prisma.customerSupport.create({
        data: Object.assign(Object.assign({}, data), { customerId, ticketNumber: num, priority: data.priority || 'low', status: 'open' }),
    });
});
CustomerSupportService.updateTicketStatus = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId, status) => {
    const resolvedAt = ['resolved', 'closed'].includes(status) ? new Date() : null;
    return prisma_1.prisma.customerSupport.update({
        where: { id, customerId },
        data: Object.assign({ status }, (resolvedAt ? { resolvedAt } : {})),
    });
});
// ─── Notifications ────────────────────────────────────────────────────────
CustomerSupportService.getNotifications = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerNotification.findMany({
        where: { customerId },
        orderBy: { sentAt: 'desc' },
    });
});
CustomerSupportService.markAsRead = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma_1.prisma.customerNotification.update({
        where: { id, customerId },
        data: { isRead: true },
    });
});
CustomerSupportService.markAllAsRead = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerNotification.updateMany({
        where: { customerId, isRead: false },
        data: { isRead: true },
    });
});
CustomerSupportService.createNotification = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    return prisma_1.prisma.customerNotification.create({
        data: Object.assign(Object.assign({}, data), { customerId, isRead: false, sentAt: new Date() }),
    });
});
