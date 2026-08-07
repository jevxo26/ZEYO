import { prisma } from '../../config/prisma';

export class ReportingService {
  // KPIs
  static async getKPIs() {
    return prisma.kPI.findMany();
  }

  static async updateKPI(id: number, data: any) {
    return prisma.kPI.update({ where: { id }, data });
  }

  // Reports
  static async getReports() {
    return prisma.report.findMany({ include: { generatedBy: { select: { name: true } } } });
  }

  static async generateReport(reportName: string, reportType: string, generatedById: number) {
    return prisma.report.create({
      data: {
        reportName,
        reportType,
        generatedById,
        fileUrl: `/reports/download/${Date.now()}.pdf` // Placeholder for actual file gen
      }
    });
  }

  // Schedules
  static async getSchedules() {
    return prisma.reportSchedule.findMany({ include: { report: true } });
  }
}
