import { Request, Response } from 'express';
import { ConfigService } from '../../services/admin/configService';

export class ConfigController {
  // Settings
  static async getSettings(req: Request, res: Response) {
    try {
      const data = await ConfigService.getSettings();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
  static async updateSetting(req: Request, res: Response) {
    try {
      const { settingKey, settingValue, settingType } = req.body;
      const data = await ConfigService.updateSetting(settingKey, settingValue, settingType);
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // Feature Flags
  static async getFeatureFlags(req: Request, res: Response) {
    try {
      const data = await ConfigService.getFeatureFlags();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
  static async toggleFeature(req: Request, res: Response) {
    try {
      const { featureName, isEnabled } = req.body;
      const data = await ConfigService.toggleFeature(featureName, isEnabled);
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // Logs
  static async getAuditLogs(req: Request, res: Response) {
    try {
      const data = await ConfigService.getAuditLogs();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
  static async getSystemLogs(req: Request, res: Response) {
    try {
      const data = await ConfigService.getSystemLogs();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}
