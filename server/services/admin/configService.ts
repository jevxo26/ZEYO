import { prisma } from '../../config/prisma';

export class ConfigService {
  // ─── Settings ─────────────────────────────────────────────────────────────
  static async getSettings() {
    return prisma.systemSetting.findMany();
  }

  static async updateSetting(settingKey: string, settingValue: string, settingType?: string) {
    return prisma.systemSetting.upsert({
      where: { settingKey },
      update: { settingValue },
      create: { settingKey, settingValue, settingType: settingType || 'string' }
    });
  }

  // ─── Feature Flags ────────────────────────────────────────────────────────
  static async getFeatureFlags() {
    return prisma.featureFlag.findMany();
  }

  static async toggleFeature(featureName: string, isEnabled: boolean) {
    return prisma.featureFlag.upsert({
      where: { featureName },
      update: { isEnabled },
      create: { featureName, isEnabled }
    });
  }

  // ─── Audit & System Logs ──────────────────────────────────────────────────
  static async getAuditLogs() {
    return prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getSystemLogs() {
    return prisma.systemLog.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
