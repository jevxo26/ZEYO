"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const prisma_1 = require("../../config/prisma");
class ConfigService {
    // ─── Settings ─────────────────────────────────────────────────────────────
    static async getSettings() {
        return prisma_1.prisma.systemSetting.findMany();
    }
    static async updateSetting(settingKey, settingValue, settingType) {
        return prisma_1.prisma.systemSetting.upsert({
            where: { settingKey },
            update: { settingValue },
            create: { settingKey, settingValue, settingType: settingType || 'string' }
        });
    }
    // ─── Feature Flags ────────────────────────────────────────────────────────
    static async getFeatureFlags() {
        return prisma_1.prisma.featureFlag.findMany();
    }
    static async toggleFeature(featureName, isEnabled) {
        return prisma_1.prisma.featureFlag.upsert({
            where: { featureName },
            update: { isEnabled },
            create: { featureName, isEnabled }
        });
    }
    // ─── Audit & System Logs ──────────────────────────────────────────────────
    static async getAuditLogs() {
        return prisma_1.prisma.auditLog.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async getSystemLogs() {
        return prisma_1.prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' } });
    }
}
exports.ConfigService = ConfigService;
