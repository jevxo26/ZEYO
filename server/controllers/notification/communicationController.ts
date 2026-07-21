import { Request, Response } from 'express';
import { CommunicationService } from '../../services/notification/communicationService';

export class CommunicationController {
  // Get all conversations for a customer
  static async getMyConversations(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.id;
      const conversations = await CommunicationService.getCustomerConversations(customerId);
      res.json({ success: true, data: conversations });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get specific conversation with messages
  static async getConversationThread(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.id;
      const { id } = req.params;
      const conversation = await CommunicationService.getConversation(Number(id), customerId);
      
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      
      res.json({ success: true, data: conversation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Start a new conversation
  static async startConversation(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.id;
      const { bookingId } = req.body;
      const conversation = await CommunicationService.startConversation(customerId, bookingId);
      res.status(201).json({ success: true, data: conversation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Send a message
  static async sendMessage(req: Request, res: Response) {
    try {
      const senderId = (req as any).user.id; // Customer ID
      const { conversationId, message, messageType } = req.body;
      
      const msg = await CommunicationService.sendMessage({
        conversationId: Number(conversationId),
        senderId,
        senderType: 'customer',
        message,
        messageType
      });
      
      res.status(201).json({ success: true, data: msg });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
