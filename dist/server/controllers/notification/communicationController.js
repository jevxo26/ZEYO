"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationController = void 0;
const communicationService_1 = require("../../services/notification/communicationService");
class CommunicationController {
    // Get all conversations for a customer
    static async getMyConversations(req, res) {
        try {
            const customerId = req.user.id;
            const conversations = await communicationService_1.CommunicationService.getCustomerConversations(customerId);
            res.json({ success: true, data: conversations });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get specific conversation with messages
    static async getConversationThread(req, res) {
        try {
            const customerId = req.user.id;
            const { id } = req.params;
            const conversation = await communicationService_1.CommunicationService.getConversation(Number(id), customerId);
            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' });
            }
            res.json({ success: true, data: conversation });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Start a new conversation
    static async startConversation(req, res) {
        try {
            const customerId = req.user.id;
            const { bookingId } = req.body;
            const conversation = await communicationService_1.CommunicationService.startConversation(customerId, bookingId);
            res.status(201).json({ success: true, data: conversation });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Send a message
    static async sendMessage(req, res) {
        try {
            const senderId = req.user.id; // Customer ID
            const { conversationId, message, messageType } = req.body;
            const msg = await communicationService_1.CommunicationService.sendMessage({
                conversationId: Number(conversationId),
                senderId,
                senderType: 'customer',
                message,
                messageType
            });
            res.status(201).json({ success: true, data: msg });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.CommunicationController = CommunicationController;
