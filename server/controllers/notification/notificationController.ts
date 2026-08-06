import { Request, Response } from 'express';
import { NotificationService } from '../../services/notification/notificationService';

export class NotificationController {
  // Get all in-app notifications for the logged-in customer
  static async getMyNotifications(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.id;
      const notifications = await NotificationService.getCustomerInAppNotifications(customerId);
      res.json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Mark a specific notification as read
  static async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await NotificationService.markInAppAsRead(Number(id));
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get preferences
  static async getMyPreferences(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.id;
      const prefs = await NotificationService.getPreferences(customerId);
      res.json({ success: true, data: prefs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update preferences
  static async updateMyPreferences(req: Request, res: Response) {
    try {
      const customerId = (req as any).user.id;
      const prefs = await NotificationService.updatePreferences(customerId, req.body);
      res.json({ success: true, message: 'Preferences updated', data: prefs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
