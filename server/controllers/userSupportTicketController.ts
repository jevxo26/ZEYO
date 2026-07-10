import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserSupportTicketService } from '../services/userSupportTicketService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class UserSupportTicketController {
  // ── User Routes ────────────────────────────────────────────────────────────
  static getMyTickets = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const tickets = await UserSupportTicketService.getTickets(userId);
    sendResponse(res, { statusCode: 200, data: tickets });
  });

  static getMyTicketById = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const ticket = await UserSupportTicketService.getTicketById(id, userId);
    if (!ticket) return sendResponse(res, { statusCode: 404, message: 'Ticket not found' });
    sendResponse(res, { statusCode: 200, data: ticket });
  });

  static createTicket = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const { subject, description, priority } = req.body as { subject: string; description: string; priority?: string };
    if (!subject || !description) {
      return sendResponse(res, { statusCode: 400, message: '`subject` and `description` are required' });
    }
    const ticket = await UserSupportTicketService.createTicket(userId, { subject, description, priority });
    sendResponse(res, { statusCode: 201, message: 'Support ticket created', data: ticket });
  });

  static cancelTicket = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const ticket = await UserSupportTicketService.cancelTicket(id, userId);
    sendResponse(res, { statusCode: 200, message: 'Ticket cancelled', data: ticket });
  });

  // ── Admin Routes ───────────────────────────────────────────────────────────
  static getAllTickets = catchAsync(async (req: AuthRequest, res: Response) => {
    const { status } = req.query as { status?: string };
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    const take = parseInt(String(req.query['take'] || '20'), 10);
    const result = await UserSupportTicketService.getAllTickets(status, skip, take);
    sendResponse(res, { statusCode: 200, data: result });
  });

  static assignTicket = catchAsync(async (req: AuthRequest, res: Response) => {
    const adminId = parseInt(String(req.user?.userId), 10);
    const id = parseInt(req.params['id'] as string, 10);
    const ticket = await UserSupportTicketService.assignTicket(id, adminId);
    sendResponse(res, { statusCode: 200, message: 'Ticket assigned', data: ticket });
  });

  static resolveTicket = catchAsync(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    const ticket = await UserSupportTicketService.resolveTicket(id);
    sendResponse(res, { statusCode: 200, message: 'Ticket resolved', data: ticket });
  });
}
