"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = require("../../config/prisma");
class DashboardService {
    static async getDashboards() {
        return prisma_1.prisma.dashboard.findMany({
            include: { widgets: { orderBy: { displayOrder: 'asc' } } }
        });
    }
    static async createDashboard(data) {
        return prisma_1.prisma.dashboard.create({ data });
    }
    static async addWidget(dashboardId, widgetData) {
        return prisma_1.prisma.dashboardWidget.create({
            data: Object.assign(Object.assign({}, widgetData), { dashboardId })
        });
    }
}
exports.DashboardService = DashboardService;
