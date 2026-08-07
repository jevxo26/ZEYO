import { Request, Response } from 'express';
import { DashboardService } from '../../services/admin/dashboardService';

export class DashboardController {
  static async getDashboards(req: Request, res: Response) {
    try {
      const data = await DashboardService.getDashboards();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  static async createDashboard(req: Request, res: Response) {
    try {
      const data = await DashboardService.createDashboard(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  static async addWidget(req: Request, res: Response) {
    try {
      const { dashboardId } = req.params;
      const data = await DashboardService.addWidget(Number(dashboardId), req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}
