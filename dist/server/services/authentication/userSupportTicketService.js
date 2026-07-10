"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSupportTicketService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
// Simple ticket number generator: TKT-YYYYMMDD-XXXX
const generateTicketNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `TKT-${date}-${rand}`;
};
class UserSupportTicketService {
}
exports.UserSupportTicketService = UserSupportTicketService;
_a = UserSupportTicketService;
UserSupportTicketService.getTickets = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userSupportTicket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserSupportTicketService.getTicketById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    return prisma.userSupportTicket.findFirst({
        where: { id, userId },
    });
});
UserSupportTicketService.createTicket = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    return prisma.userSupportTicket.create({
        data: {
            userId,
            ticketNumber: generateTicketNumber(),
            subject: data.subject,
            description: data.description,
            priority: data.priority || 'medium',
            status: 'open',
        },
    });
});
UserSupportTicketService.cancelTicket = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const ticket = await prisma.userSupportTicket.findFirst({ where: { id, userId } });
    if (!ticket)
        throw new Error('Ticket not found');
    if (['resolved', 'closed'].includes(ticket.status))
        throw new Error('Cannot cancel a resolved or closed ticket');
    return prisma.userSupportTicket.update({ where: { id }, data: { status: 'cancelled' } });
});
// Admin only
UserSupportTicketService.assignTicket = (0, catchServiceAsync_1.catchServiceAsync)(async (id, adminId) => {
    return prisma.userSupportTicket.update({
        where: { id },
        data: { assignedAdminId: adminId, status: 'in_progress' },
    });
});
UserSupportTicketService.resolveTicket = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.userSupportTicket.update({
        where: { id },
        data: { status: 'resolved', resolvedAt: new Date() },
    });
});
UserSupportTicketService.getAllTickets = (0, catchServiceAsync_1.catchServiceAsync)(async (status, skip = 0, take = 20) => {
    return prisma.userSupportTicket.findMany({
        where: status ? { status } : {},
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        skip,
        take,
    });
});
