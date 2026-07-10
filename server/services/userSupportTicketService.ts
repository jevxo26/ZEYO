import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

// Simple ticket number generator: TKT-YYYYMMDD-XXXX
const generateTicketNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${date}-${rand}`;
};

export class UserSupportTicketService {
  static getTickets = catchServiceAsync(async (userId: number) => {
    return prisma.userSupportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static getTicketById = catchServiceAsync(async (id: number, userId: number) => {
    return prisma.userSupportTicket.findFirst({
      where: { id, userId },
    });
  });

  static createTicket = catchServiceAsync(async (userId: number, data: {
    subject: string;
    description: string;
    priority?: string;
  }) => {
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

  static cancelTicket = catchServiceAsync(async (id: number, userId: number) => {
    const ticket = await prisma.userSupportTicket.findFirst({ where: { id, userId } });
    if (!ticket) throw new Error('Ticket not found');
    if (['resolved', 'closed'].includes(ticket.status)) throw new Error('Cannot cancel a resolved or closed ticket');
    return prisma.userSupportTicket.update({ where: { id }, data: { status: 'cancelled' } });
  });

  // Admin only
  static assignTicket = catchServiceAsync(async (id: number, adminId: number) => {
    return prisma.userSupportTicket.update({
      where: { id },
      data: { assignedAdminId: adminId, status: 'in_progress' },
    });
  });

  static resolveTicket = catchServiceAsync(async (id: number) => {
    return prisma.userSupportTicket.update({
      where: { id },
      data: { status: 'resolved', resolvedAt: new Date() },
    });
  });

  static getAllTickets = catchServiceAsync(async (status?: string, skip = 0, take = 20) => {
    return prisma.userSupportTicket.findMany({
      where: status ? { status } : {},
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      skip,
      take,
    });
  });
}
