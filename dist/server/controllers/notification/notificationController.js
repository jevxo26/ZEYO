"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notificationService_1 = require("../../services/notification/notificationService");
class NotificationController {
    // Get all in-app notifications for the logged-in customer
    static async getMyNotifications(req, res) {
        try {
            const customerId = req.user.id;
            const notifications = await notificationService_1.NotificationService.getCustomerInAppNotifications(customerId);
            res.json({ success: true, data: notifications });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Mark a specific notification as read
    static async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await notificationService_1.NotificationService.markInAppAsRead(Number(id));
            res.json({ success: true, message: 'Notification marked as read' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Get preferences
    static async getMyPreferences(req, res) {
        try {
            const customerId = req.user.id;
            const prefs = await notificationService_1.NotificationService.getPreferences(customerId);
            res.json({ success: true, data: prefs });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Update preferences
    static async updateMyPreferences(req, res) {
        try {
            const customerId = req.user.id;
            const prefs = await notificationService_1.NotificationService.updatePreferences(customerId, req.body);
            res.json({ success: true, message: 'Preferences updated', data: prefs });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
