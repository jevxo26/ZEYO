"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSupportTicketController = void 0;
const userSupportTicketService_1 = require("../../services/authentication/userSupportTicketService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserSupportTicketController {
}
exports.UserSupportTicketController = UserSupportTicketController;
_a = UserSupportTicketController;
// ── User Routes ────────────────────────────────────────────────────────────
UserSupportTicketController.getMyTickets = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const tickets = await userSupportTicketService_1.UserSupportTicketService.getTickets(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: tickets });
});
UserSupportTicketController.getMyTicketById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const ticket = await userSupportTicketService_1.UserSupportTicketService.getTicketById(id, userId);
    if (!ticket)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Ticket not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: ticket });
});
UserSupportTicketController.createTicket = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const { subject, description, priority } = req.body;
    if (!subject || !description) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: '`subject` and `description` are required' });
    }
    const ticket = await userSupportTicketService_1.UserSupportTicketService.createTicket(userId, { subject, description, priority });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Support ticket created', data: ticket });
});
UserSupportTicketController.cancelTicket = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const ticket = await userSupportTicketService_1.UserSupportTicketService.cancelTicket(id, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Ticket cancelled', data: ticket });
});
// ── Admin Routes ───────────────────────────────────────────────────────────
UserSupportTicketController.getAllTickets = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.query;
    const skip = parseInt(String(req.query['skip'] || '0'), 10);
    const take = parseInt(String(req.query['take'] || '20'), 10);
    const result = await userSupportTicketService_1.UserSupportTicketService.getAllTickets(status, skip, take);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: result });
});
UserSupportTicketController.assignTicket = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const adminId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const ticket = await userSupportTicketService_1.UserSupportTicketService.assignTicket(id, adminId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Ticket assigned', data: ticket });
});
UserSupportTicketController.resolveTicket = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    const ticket = await userSupportTicketService_1.UserSupportTicketService.resolveTicket(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Ticket resolved', data: ticket });
});
