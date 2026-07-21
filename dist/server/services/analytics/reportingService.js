"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingService = void 0;
const prisma_1 = require("../../config/prisma");
class ReportingService {
    // KPIs
    static async getKPIs() {
        return prisma_1.prisma.kPI.findMany();
    }
    static async updateKPI(id, data) {
        return prisma_1.prisma.kPI.update({ where: { id }, data });
    }
    // Reports
    static async getReports() {
        return prisma_1.prisma.report.findMany({ include: { generatedBy: { select: { name: true } } } });
    }
    static async generateReport(reportName, reportType, generatedById) {
        return prisma_1.prisma.report.create({
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
        return prisma_1.prisma.reportSchedule.findMany({ include: { report: true } });
    }
}
exports.ReportingService = ReportingService;
