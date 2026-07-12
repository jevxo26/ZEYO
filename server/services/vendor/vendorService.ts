import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

const defaultVendorSelect = {
  id: true,
  vendorCode: true,
  businessName: true,
  ownerName: true,
  email: true,
  phone: true,
  logo: true,
  coverImage: true,
  description: true,
  businessType: true,
  tradeLicenseNumber: true,
  status: true,
  isVerified: true,
  joinedAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  profile: true,
  business: true,
  owner: true,
  wallet: true,
  settings: true,
} as const;

export class VendorService {
  static generateVendorCode(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `VEND-${dateStr}-${rand}`;
  }

  static createVendor = catchServiceAsync(async (data: {
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    businessType: string;
    tradeLicenseNumber?: string;
    logo?: string;
    coverImage?: string;
    description?: string;
    profile?: Partial<Prisma.VendorProfileCreateWithoutVendorInput>;
    business?: Partial<Prisma.VendorBusinessCreateWithoutVendorInput>;
    owner?: Partial<Prisma.VendorOwnerCreateWithoutVendorInput>;
    settings?: Partial<Prisma.VendorSettingCreateWithoutVendorInput>;
  }) => {
    // Check if email already exists
    const existing = await prisma.vendor.findFirst({
      where: {
        OR: [
          { email: data.email },
          { vendorCode: data.tradeLicenseNumber ? undefined : '' } // Dummy check
        ]
      }
    });

    if (existing && existing.email === data.email) {
      throw new Error('Vendor already exists with this email');
    }

    const code = VendorService.generateVendorCode();

    const newVendor = await prisma.$transaction(async (tx) => {
      const vendor = await tx.vendor.create({
        data: {
          vendorCode: code,
          businessName: data.businessName,
          ownerName: data.ownerName,
          email: data.email,
          phone: data.phone,
          businessType: data.businessType,
          tradeLicenseNumber: data.tradeLicenseNumber || null,
          logo: data.logo || null,
          coverImage: data.coverImage || null,
          description: data.description || null,
          status: 'pending',
          isVerified: false,
        },
      });

      // Create profile
      await tx.vendorProfile.create({
        data: {
          vendorId: vendor.id,
          about: data.profile?.about || null,
          experience: data.profile?.experience || null,
          establishedYear: data.profile?.establishedYear || null,
          website: data.profile?.website || null,
          facebook: data.profile?.facebook || null,
          instagram: data.profile?.instagram || null,
          youtube: data.profile?.youtube || null,
          linkedin: data.profile?.linkedin || null,
          officeAddress: data.profile?.officeAddress || null,
        },
      });

      // Create business info
      await tx.vendorBusiness.create({
        data: {
          vendorId: vendor.id,
          businessType: data.business?.businessType || data.businessType,
          businessCategory: data.business?.businessCategory || null,
          tradeLicense: data.business?.tradeLicense || data.tradeLicenseNumber || null,
          tinNumber: data.business?.tinNumber || null,
          binNumber: data.business?.binNumber || null,
          companyRegistration: data.business?.companyRegistration || null,
          businessAddress: data.business?.businessAddress || null,
        },
      });

      // Create owner info
      await tx.vendorOwner.create({
        data: {
          vendorId: vendor.id,
          fullName: data.owner?.fullName || data.ownerName,
          phone: data.owner?.phone || data.phone,
          email: data.owner?.email || data.email,
          nidNumber: data.owner?.nidNumber || null,
          dateOfBirth: data.owner?.dateOfBirth ? new Date(data.owner.dateOfBirth) : null,
          address: data.owner?.address || null,
        },
      });

      // Create wallet
      await tx.vendorWallet.create({
        data: {
          vendorId: vendor.id,
          balance: 0.0,
          pendingAmount: 0.0,
          withdrawableAmount: 0.0,
          currency: 'BDT',
          status: 'active',
        },
      });

      // Create settings
      await tx.vendorSetting.create({
        data: {
          vendorId: vendor.id,
          autoAcceptAssignment: data.settings?.autoAcceptAssignment || false,
          notificationEnabled: data.settings?.notificationEnabled !== false,
          emailNotification: data.settings?.emailNotification !== false,
          smsNotification: data.settings?.smsNotification !== false,
          pushNotification: data.settings?.pushNotification !== false,
          workingHours: data.settings?.workingHours || null,
          holidayMode: !!data.settings?.holidayMode,
        },
      });

      return vendor;
    });

    return prisma.vendor.findUnique({
      where: { id: newVendor.id },
      select: defaultVendorSelect,
    });
  });

  static getVendorById = catchServiceAsync(async (id: number) => {
    return prisma.vendor.findFirst({
      where: { id, deletedAt: null },
      select: defaultVendorSelect,
    });
  });

  static getVendorByCode = catchServiceAsync(async (vendorCode: string) => {
    return prisma.vendor.findFirst({
      where: { vendorCode, deletedAt: null },
      select: defaultVendorSelect,
    });
  });

  static getAllVendors = catchServiceAsync(async () => {
    return prisma.vendor.findMany({
      where: { deletedAt: null },
      select: defaultVendorSelect,
    });
  });

  static updateVendor = catchServiceAsync(async (id: number, data: {
    businessName?: string;
    ownerName?: string;
    email?: string;
    phone?: string;
    businessType?: string;
    tradeLicenseNumber?: string;
    logo?: string;
    coverImage?: string;
    description?: string;
    status?: string;
    profile?: Partial<Prisma.VendorProfileUpdateWithoutVendorInput>;
    business?: Partial<Prisma.VendorBusinessUpdateWithoutVendorInput>;
    owner?: Partial<Prisma.VendorOwnerUpdateWithoutVendorInput>;
    settings?: Partial<Prisma.VendorSettingUpdateWithoutVendorInput>;
  }) => {
    return prisma.$transaction(async (tx) => {
      // Update core
      const coreFields = {
        businessName: data.businessName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        businessType: data.businessType,
        tradeLicenseNumber: data.tradeLicenseNumber,
        logo: data.logo,
        coverImage: data.coverImage,
        description: data.description,
        status: data.status,
      };

      await tx.vendor.update({
        where: { id },
        data: coreFields,
      });

      // Update profile
      if (data.profile) {
        await tx.vendorProfile.update({
          where: { vendorId: id },
          data: data.profile,
        });
      }

      // Update business
      if (data.business) {
        await tx.vendorBusiness.update({
          where: { vendorId: id },
          data: data.business,
        });
      }

      // Update owner
      if (data.owner) {
        const { dateOfBirth, ...ownerFields } = data.owner;
        await tx.vendorOwner.update({
          where: { vendorId: id },
          data: {
            ...ownerFields,
            ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth as string) } : {}),
          },
        });
      }

      // Update settings
      if (data.settings) {
        await tx.vendorSetting.update({
          where: { vendorId: id },
          data: data.settings,
        });
      }

      return tx.vendor.findUnique({
        where: { id },
        select: defaultVendorSelect,
      });
    });
  });

  static deleteVendor = catchServiceAsync(async (id: number) => {
    return prisma.vendor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'inactive',
      },
      select: defaultVendorSelect,
    });
  });

  // ─── Document Verification ────────────────────────────────────────────────
  static uploadDocument = catchServiceAsync(async (vendorId: number, data: {
    documentType: string;
    documentName: string;
    documentUrl: string;
    expiryDate?: Date | string;
  }) => {
    return prisma.vendorDocument.create({
      data: {
        vendorId,
        documentType: data.documentType,
        documentName: data.documentName,
        documentUrl: data.documentUrl,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        verificationStatus: 'pending',
      },
    });
  });

  static getDocuments = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorDocument.findMany({
      where: { vendorId },
    });
  });

  static verifyDocument = catchServiceAsync(async (documentId: number, verifiedBy: number, status: string) => {
    return prisma.vendorDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: status, // approved | rejected
        verifiedBy,
        verifiedAt: new Date(),
      },
    });
  });

  // ─── Vendor General Verification ─────────────────────────────────────────
  static verifyVendor = catchServiceAsync(async (vendorId: number, verifiedBy: number, data: {
    verificationType: string;
    status: string; // success | failed
    remarks?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      // Add verification log
      const log = await tx.vendorVerification.create({
        data: {
          vendorId,
          verificationType: data.verificationType,
          status: data.status,
          remarks: data.remarks || null,
          verifiedBy,
          verifiedAt: new Date(),
        },
      });

      // If status is success, update core vendor status
      if (data.status === 'success') {
        await tx.vendor.update({
          where: { id: vendorId },
          data: {
            isVerified: true,
            status: 'active',
            joinedAt: new Date(),
          },
        });
      }

      return log;
    });
  });
}
