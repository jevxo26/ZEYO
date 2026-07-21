"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("../../services/admin/dashboardService");
class DashboardController {
    static async getDashboards(req, res) {
        try {
            const data = await dashboardService_1.DashboardService.getDashboards();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createDashboard(req, res) {
        try {
            const data = await dashboardService_1.DashboardService.createDashboard(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async addWidget(req, res) {
        try {
            const { dashboardId } = req.params;
            const data = await dashboardService_1.DashboardService.addWidget(Number(dashboardId), req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.DashboardController = DashboardController;
