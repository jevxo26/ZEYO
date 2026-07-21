import { prisma } from '../../config/prisma';

export class DashboardService {
  static async getDashboards() {
    return prisma.dashboard.findMany({
      include: { widgets: { orderBy: { displayOrder: 'asc' } } }
    });
  }

  static async createDashboard(data: any) {
    return prisma.dashboard.create({ data });
  }

  static async addWidget(dashboardId: number, widgetData: any) {
    return prisma.dashboardWidget.create({
      data: { ...widgetData, dashboardId }
    });
  }
}
