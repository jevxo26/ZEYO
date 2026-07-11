import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

const defaultCustomerSelect = {
  id: true,
  userId: true,
  customerCode: true,
  membershipLevel: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  profile: true,
  preference: true,
  setting: true,
  wallet: true,
} as const;

export class CustomerService {
  static generateCustomerCode(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `CUST-${dateStr}-${rand}`;
  }

  static createCustomer = catchServiceAsync(async (userId: number, data: {
    customerCode?: string;
    membershipLevel?: string;
    status?: string;
    profile?: Partial<Prisma.CustomerProfileCreateWithoutCustomerInput>;
    preference?: Partial<Prisma.CustomerPreferenceCreateWithoutCustomerInput>;
    setting?: Partial<Prisma.CustomerSettingCreateWithoutCustomerInput>;
  }) => {
    // Check if customer already exists for this user
    const existing = await prisma.customer.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new Error('Customer profile already exists for this user');
    }

    const code = data.customerCode || CustomerService.generateCustomerCode();

    const newCustomer = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          userId,
          customerCode: code,
          membershipLevel: data.membershipLevel || 'regular',
          status: data.status || 'active',
        },
      });

      // Create profile
      await tx.customerProfile.create({
        data: {
          customerId: customer.id,
          firstName: data.profile?.firstName || null,
          lastName: data.profile?.lastName || null,
          phone: data.profile?.phone || null,
          email: data.profile?.email || null,
          dateOfBirth: data.profile?.dateOfBirth ? new Date(data.profile.dateOfBirth) : null,
          gender: data.profile?.gender || null,
          profileImage: data.profile?.profileImage || null,
          occupation: data.profile?.occupation || null,
          companyName: data.profile?.companyName || null,
          preferredLanguage: data.profile?.preferredLanguage || 'bn',
          preferredCurrency: data.profile?.preferredCurrency || 'BDT',
        },
      });

      // Create preferences
      await tx.customerPreference.create({
        data: {
          customerId: customer.id,
          preferredZoneId: data.preference?.preferredZoneId || null,
          preferredEventTypeId: data.preference?.preferredEventTypeId || null,
          preferredBudget: data.preference?.preferredBudget || null,
          preferredGuestRange: data.preference?.preferredGuestRange || null,
          preferredContactMethod: data.preference?.preferredContactMethod || null,
          preferredCommunicationTime: data.preference?.preferredCommunicationTime || null,
        },
      });

      // Create settings
      await tx.customerSetting.create({
        data: {
          customerId: customer.id,
          language: data.setting?.language || 'bn',
          currency: data.setting?.currency || 'BDT',
          emailNotification: data.setting?.emailNotification !== false,
          pushNotification: data.setting?.pushNotification !== false,
          smsNotification: data.setting?.smsNotification !== false,
          marketingNotification: !!data.setting?.marketingNotification,
          theme: data.setting?.theme || 'light',
        },
      });

      // Create wallet
      await tx.customerWallet.create({
        data: {
          customerId: customer.id,
          balance: 0,
          rewardBalance: 0,
          currency: 'BDT',
          status: 'active',
        },
      });

      return customer;
    });

    return prisma.customer.findUnique({
      where: { id: newCustomer.id },
      select: defaultCustomerSelect,
    });
  });

  static getAllCustomers = catchServiceAsync(async () => {
    return prisma.customer.findMany({
      where: { deletedAt: null },
      select: defaultCustomerSelect,
    });
  });

  static getCustomerById = catchServiceAsync(async (id: number) => {
    return prisma.customer.findFirst({
      where: { id, deletedAt: null },
      select: defaultCustomerSelect,
    });
  });

  static getCustomerByUserId = catchServiceAsync(async (userId: number) => {
    return prisma.customer.findFirst({
      where: { userId, deletedAt: null },
      select: defaultCustomerSelect,
    });
  });

  static updateCustomer = catchServiceAsync(async (id: number, data: {
    membershipLevel?: string;
    status?: string;
    profile?: Partial<Prisma.CustomerProfileUpdateWithoutCustomerInput>;
    preference?: Partial<Prisma.CustomerPreferenceUpdateWithoutCustomerInput>;
    setting?: Partial<Prisma.CustomerSettingUpdateWithoutCustomerInput>;
  }) => {
    return prisma.$transaction(async (tx) => {
      // Update core customer fields
      if (data.membershipLevel || data.status) {
        await tx.customer.update({
          where: { id },
          data: {
            membershipLevel: data.membershipLevel,
            status: data.status,
          },
        });
      }

      // Update profile
      if (data.profile) {
        const { dateOfBirth, ...profileFields } = data.profile;
        await tx.customerProfile.update({
          where: { customerId: id },
          data: {
            ...profileFields,
            ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth as string) } : {}),
          },
        });
      }

      // Update preference
      if (data.preference) {
        await tx.customerPreference.update({
          where: { customerId: id },
          data: data.preference,
        });
      }

      // Update settings
      if (data.setting) {
        await tx.customerSetting.update({
          where: { customerId: id },
          data: data.setting,
        });
      }

      return tx.customer.findUnique({
        where: { id },
        select: defaultCustomerSelect,
      });
    });
  });

  static deleteCustomer = catchServiceAsync(async (id: number) => {
    return prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'inactive',
      },
      select: defaultCustomerSelect,
    });
  });

  // ─── Customer Activity Log ────────────────────────────────────────────────
  static logActivity = catchServiceAsync(async (customerId: number, activityType: string, description: string, ipAddress?: string, deviceId?: string) => {
    return prisma.customerActivity.create({
      data: {
        customerId,
        activityType,
        description,
        ipAddress,
        deviceId,
      },
    });
  });

  static getActivities = catchServiceAsync(async (customerId: number) => {
    return prisma.customerActivity.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });
}
