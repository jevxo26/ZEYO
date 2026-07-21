"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const configService_1 = require("../../services/admin/configService");
class ConfigController {
    // Settings
    static async getSettings(req, res) {
        try {
            const data = await configService_1.ConfigService.getSettings();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async updateSetting(req, res) {
        try {
            const { settingKey, settingValue, settingType } = req.body;
            const data = await configService_1.ConfigService.updateSetting(settingKey, settingValue, settingType);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Feature Flags
    static async getFeatureFlags(req, res) {
        try {
            const data = await configService_1.ConfigService.getFeatureFlags();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async toggleFeature(req, res) {
        try {
            const { featureName, isEnabled } = req.body;
            const data = await configService_1.ConfigService.toggleFeature(featureName, isEnabled);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Logs
    static async getAuditLogs(req, res) {
        try {
            const data = await configService_1.ConfigService.getAuditLogs();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getSystemLogs(req, res) {
        try {
            const data = await configService_1.ConfigService.getSystemLogs();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.ConfigController = ConfigController;
