// ─────────────────────────────────────────────────────────────────────────────
// PackageService
// Service layer for Package and all sub-entities.
// Handles business logic for zone-wise packages, pricing mapping, and sub-entity CRUD.
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class PackageService {

  // ── Packages ───────────────────────────────────────────────────────────────
  static getAllPackages = catchServiceAsync(async (filters?: {
    status?: string;
    eventId?: number;
    categoryId?: number;
    subCategoryId?: number;
    zoneId?: number;
    isFeatured?: boolean;
  }) => {
    const whereClause: any = {
      deletedAt: null,
    };

    if (filters?.status)      whereClause.status = filters.status;
    if (filters?.eventId)     whereClause.eventId = filters.eventId;
    if (filters?.categoryId)  whereClause.packageCategoryId = filters.categoryId;
    if (filters?.subCategoryId) whereClause.packageSubCategoryId = filters.subCategoryId;
    
    if (filters?.isFeatured !== undefined) {
      whereClause.setting = { isFeatured: filters.isFeatured };
    }

    // Zone-wise filter: Package must be available in the specified zone
    if (filters?.zoneId) {
      whereClause.availabilities = {
        some: {
          zoneId: filters.zoneId,
          status: 'active'
        }
      };
    }

    const packages = await prisma.package.findMany({
      where: whereClause,
      include: {
        packageCategory: true,
        packageSubCategory: true,
        event: { select: { id: true, name: true, slug: true } },
        setting: true,
        pricings: { orderBy: { createdAt: 'desc' }, take: 1 },
        zonePricings: filters?.zoneId ? { where: { zoneId: filters.zoneId, status: 'active' } } : false,
      },
      orderBy: { displayOrder: 'asc' },
    });

    // Map zone-specific prices if zoneId is provided
    return packages.map((pkg) => {
      let activePrice = pkg.startingPrice;
      let activeDiscount = 0;
      let isZonePriced = false;

      if (filters?.zoneId && pkg.zonePricings && pkg.zonePricings.length > 0) {
        activePrice = pkg.zonePricings[0].price;
        activeDiscount = pkg.zonePricings[0].discount;
        isZonePriced = true;
      }

      return {
        ...pkg,
        activePrice,
        activeDiscount,
        isZonePriced,
      };
    });
  });

  static getPackageById = catchServiceAsync(async (id: number, zoneId?: number) => {
    const pkg = await prisma.package.findFirst({
      where: { id, deletedAt: null },
      include: {
        packageCategory: true,
        packageSubCategory: true,
        event: true,
        setting: true,
        types: { where: { status: 'active' }, orderBy: { displayOrder: 'asc' } },
        services: {
          orderBy: { displayOrder: 'asc' },
          include: { serviceItems: true }
        },
        pricings: { orderBy: { createdAt: 'desc' } },
        zonePricings: zoneId ? { where: { zoneId, status: 'active' } } : true,
        guestRanges: true,
        coverages: true,
        addons: { where: { status: 'active' } },
        features: { orderBy: { displayOrder: 'asc' } },
        gallery: { orderBy: { displayOrder: 'asc' } },
        faqs: { orderBy: { displayOrder: 'asc' } },
        policies: true,
        terms: true,
        availabilities: { where: { status: 'active' } },
        discounts: { where: { status: 'active' } },
        analytics: true,
        reviews: { where: { status: 'active' }, orderBy: { createdAt: 'desc' } },
      }
    });

    if (!pkg) return null;

    let activePrice = pkg.startingPrice;
    let activeDiscount = 0;
    let isZonePriced = false;

    if (zoneId) {
      const zonePrice = pkg.zonePricings.find(zp => zp.zoneId === zoneId && zp.status === 'active');
      if (zonePrice) {
        activePrice = zonePrice.price;
        activeDiscount = zonePrice.discount;
        isZonePriced = true;
      }
    }

    return {
      ...pkg,
      activePrice,
      activeDiscount,
      isZonePriced,
    };
  });

  static createPackage = catchServiceAsync(async (data: {
    eventId: number;
    packageCategoryId?: number;
    packageSubCategoryId?: number;
    name: string;
    slug: string;
    code: string;
    description?: string;
    thumbnail?: string;
    banner?: string;
    startingPrice: number;
    displayOrder?: number;
    status?: string;
    settings?: {
      allowCustomization?: boolean;
      allowAddon?: boolean;
      allowReschedule?: boolean;
      allowCancellation?: boolean;
      showOnHomepage?: boolean;
      isFeatured?: boolean;
    };
  }) => {
    const { settings, ...packageData } = data;

    return prisma.$transaction(async (tx) => {
      const pkg = await tx.package.create({
        data: {
          ...packageData,
          status: packageData.status ?? 'active',
          displayOrder: packageData.displayOrder ?? 0,
        }
      });

      // Create settings
      await tx.packageSetting.create({
        data: {
          packageId: pkg.id,
          allowCustomization: settings?.allowCustomization ?? true,
          allowAddon: settings?.allowAddon ?? true,
          allowReschedule: settings?.allowReschedule ?? true,
          allowCancellation: settings?.allowCancellation ?? true,
          showOnHomepage: settings?.showOnHomepage ?? false,
          isFeatured: settings?.isFeatured ?? false,
        }
      });

      return pkg;
    });
  });

  static updatePackage = catchServiceAsync(async (id: number, data: Partial<{
    eventId: number;
    packageCategoryId: number;
    packageSubCategoryId: number;
    name: string;
    slug: string;
    code: string;
    description: string;
    thumbnail: string;
    banner: string;
    startingPrice: number;
    displayOrder: number;
    status: string;
    settings: {
      allowCustomization?: boolean;
      allowAddon?: boolean;
      allowReschedule?: boolean;
      allowCancellation?: boolean;
      showOnHomepage?: boolean;
      isFeatured?: boolean;
    };
  }>) => {
    const { settings, ...packageData } = data;

    return prisma.$transaction(async (tx) => {
      const pkg = await tx.package.update({
        where: { id },
        data: packageData,
      });

      if (settings) {
        await tx.packageSetting.upsert({
          where: { packageId: id },
          update: settings,
          create: {
            packageId: id,
            allowCustomization: settings.allowCustomization ?? true,
            allowAddon: settings.allowAddon ?? true,
            allowReschedule: settings.allowReschedule ?? true,
            allowCancellation: settings.allowCancellation ?? true,
            showOnHomepage: settings.showOnHomepage ?? false,
            isFeatured: settings.isFeatured ?? false,
          }
        });
      }

      return pkg;
    });
  });

  static deletePackage = catchServiceAsync(async (id: number) => {
    return prisma.package.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  });

  // ── PackageCategories ──────────────────────────────────────────────────────
  static getAllCategories = catchServiceAsync(async () => {
    return prisma.packageCategory.findMany({
      include: { subCategories: true },
      orderBy: { displayOrder: 'asc' },
    });
  });

  static createCategory = catchServiceAsync(async (data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    displayOrder?: number;
    status?: string;
  }) => {
    return prisma.packageCategory.create({ data });
  });

  static updateCategory = catchServiceAsync(async (id: number, data: Partial<{
    name: string;
    slug: string;
    description: string;
    icon: string;
    displayOrder: number;
    status: string;
  }>) => {
    return prisma.packageCategory.update({ where: { id }, data });
  });

  static deleteCategory = catchServiceAsync(async (id: number) => {
    return prisma.packageCategory.delete({ where: { id } });
  });

  // ── PackageSubCategories ───────────────────────────────────────────────────
  static getAllSubCategories = catchServiceAsync(async (categoryId?: number) => {
    return prisma.packageSubCategory.findMany({
      where: categoryId ? { packageCategoryId: categoryId } : {},
      orderBy: { displayOrder: 'asc' },
    });
  });

  static createSubCategory = catchServiceAsync(async (data: {
    packageCategoryId: number;
    name: string;
    description?: string;
    displayOrder?: number;
    status?: string;
  }) => {
    return prisma.packageSubCategory.create({ data });
  });

  static updateSubCategory = catchServiceAsync(async (id: number, data: Partial<{
    packageCategoryId: number;
    name: string;
    description: string;
    displayOrder: number;
    status: string;
  }>) => {
    return prisma.packageSubCategory.update({ where: { id }, data });
  });

  static deleteSubCategory = catchServiceAsync(async (id: number) => {
    return prisma.packageSubCategory.delete({ where: { id } });
  });

  // ── PackageTypes ───────────────────────────────────────────────────────────
  static createPackageType = catchServiceAsync(async (data: {
    packageId: number;
    name: string;
    description?: string;
    displayOrder?: number;
    status?: string;
  }) => {
    return prisma.packageType.create({ data });
  });

  static updatePackageType = catchServiceAsync(async (id: number, data: Partial<{
    name: string;
    description: string;
    displayOrder: number;
    status: string;
  }>) => {
    return prisma.packageType.update({ where: { id }, data });
  });

  static deletePackageType = catchServiceAsync(async (id: number) => {
    return prisma.packageType.delete({ where: { id } });
  });

  // ── PackageServices & Items ───────────────────────────────────────────────
  static createPackageService = catchServiceAsync(async (data: {
    packageId: number;
    serviceId: number;
    isRequired?: boolean;
    displayOrder?: number;
    items?: Array<{
      serviceOptionId: number;
      coverageId?: number;
      quantity?: number;
      duration?: number;
      remarks?: string;
    }>;
  }) => {
    const { items, ...serviceData } = data;
    return prisma.$transaction(async (tx) => {
      const service = await tx.packageService.create({
        data: serviceData,
      });

      if (items && items.length > 0) {
        await tx.packageServiceItem.createMany({
          data: items.map(item => ({
            packageServiceId: service.id,
            serviceOptionId: item.serviceOptionId,
            coverageId: item.coverageId,
            quantity: item.quantity ?? 1,
            duration: item.duration ?? 1.0,
            remarks: item.remarks,
          }))
        });
      }

      return tx.packageService.findUnique({
        where: { id: service.id },
        include: { serviceItems: true }
      });
    });
  });

  static updatePackageService = catchServiceAsync(async (id: number, data: Partial<{
    isRequired: boolean;
    displayOrder: number;
  }>) => {
    return prisma.packageService.update({ where: { id }, data });
  });

  static deletePackageService = catchServiceAsync(async (id: number) => {
    return prisma.packageService.delete({ where: { id } });
  });

  static createServiceItem = catchServiceAsync(async (data: {
    packageServiceId: number;
    serviceOptionId: number;
    coverageId?: number;
    quantity?: number;
    duration?: number;
    remarks?: string;
  }) => {
    return prisma.packageServiceItem.create({ data });
  });

  static updateServiceItem = catchServiceAsync(async (id: number, data: Partial<{
    serviceOptionId: number;
    coverageId: number;
    quantity: number;
    duration: number;
    remarks: string;
  }>) => {
    return prisma.packageServiceItem.update({ where: { id }, data });
  });

  static deleteServiceItem = catchServiceAsync(async (id: number) => {
    return prisma.packageServiceItem.delete({ where: { id } });
  });

  // ── PackagePricing & Zone Pricing ──────────────────────────────────────────
  static createPricing = catchServiceAsync(async (data: {
    packageId: number;
    basePrice: number;
    discountAmount?: number;
    discountType?: string;
    taxAmount?: number;
    finalPrice: number;
    currency?: string;
  }) => {
    return prisma.packagePricing.create({ data });
  });

  static createZonePricing = catchServiceAsync(async (data: {
    packageId: number;
    zoneId: number;
    price: number;
    discount?: number;
    effectiveFrom?: Date;
    effectiveTo?: Date;
    status?: string;
  }) => {
    return prisma.packageZonePricing.create({ data });
  });

  static updateZonePricing = catchServiceAsync(async (id: number, data: Partial<{
    price: number;
    discount: number;
    effectiveFrom: Date;
    effectiveTo: Date;
    status: string;
  }>) => {
    return prisma.packageZonePricing.update({ where: { id }, data });
  });

  static deleteZonePricing = catchServiceAsync(async (id: number) => {
    return prisma.packageZonePricing.delete({ where: { id } });
  });

  // ── Addons ─────────────────────────────────────────────────────────────────
  static createAddon = catchServiceAsync(async (data: {
    packageId: number;
    serviceId: number;
    name: string;
    price: number;
    pricingType: string;
    status?: string;
  }) => {
    return prisma.packageAddon.create({ data });
  });

  static updateAddon = catchServiceAsync(async (id: number, data: Partial<{
    name: string;
    price: number;
    pricingType: string;
    status: string;
  }>) => {
    return prisma.packageAddon.update({ where: { id }, data });
  });

  static deleteAddon = catchServiceAsync(async (id: number) => {
    return prisma.packageAddon.delete({ where: { id } });
  });

  // ── Features ───────────────────────────────────────────────────────────────
  static createFeature = catchServiceAsync(async (data: {
    packageId: number;
    title: string;
    description?: string;
    icon?: string;
    displayOrder?: number;
  }) => {
    return prisma.packageFeature.create({ data });
  });

  static updateFeature = catchServiceAsync(async (id: number, data: Partial<{
    title: string;
    description: string;
    icon: string;
    displayOrder: number;
  }>) => {
    return prisma.packageFeature.update({ where: { id }, data });
  });

  static deleteFeature = catchServiceAsync(async (id: number) => {
    return prisma.packageFeature.delete({ where: { id } });
  });

  // ── Gallery ────────────────────────────────────────────────────────────────
  static createGalleryItem = catchServiceAsync(async (data: {
    packageId: number;
    image?: string;
    video?: string;
    thumbnail?: string;
    displayOrder?: number;
  }) => {
    return prisma.packageGallery.create({ data });
  });

  static deleteGalleryItem = catchServiceAsync(async (id: number) => {
    return prisma.packageGallery.delete({ where: { id } });
  });

  // ── FAQ ────────────────────────────────────────────────────────────────────
  static createFAQ = catchServiceAsync(async (data: {
    packageId: number;
    question: string;
    answer: string;
    displayOrder?: number;
  }) => {
    return prisma.packageFAQ.create({ data });
  });

  static updateFAQ = catchServiceAsync(async (id: number, data: Partial<{
    question: string;
    answer: string;
    displayOrder: number;
  }>) => {
    return prisma.packageFAQ.update({ where: { id }, data });
  });

  static deleteFAQ = catchServiceAsync(async (id: number) => {
    return prisma.packageFAQ.delete({ where: { id } });
  });

  // ── Policies & Terms ───────────────────────────────────────────────────────
  static createPolicy = catchServiceAsync(async (data: {
    packageId: number;
    title: string;
    description: string;
  }) => {
    return prisma.packagePolicy.create({ data });
  });

  static updatePolicy = catchServiceAsync(async (id: number, data: Partial<{
    title: string;
    description: string;
  }>) => {
    return prisma.packagePolicy.update({ where: { id }, data });
  });

  static deletePolicy = catchServiceAsync(async (id: number) => {
    return prisma.packagePolicy.delete({ where: { id } });
  });

  static createTerms = catchServiceAsync(async (data: {
    packageId: number;
    title: string;
    description: string;
    version?: string;
    effectiveDate?: Date;
  }) => {
    return prisma.packageTerms.create({ data });
  });

  static updateTerms = catchServiceAsync(async (id: number, data: Partial<{
    title: string;
    description: string;
    version: string;
    effectiveDate: Date;
  }>) => {
    return prisma.packageTerms.update({ where: { id }, data });
  });

  static deleteTerms = catchServiceAsync(async (id: number) => {
    return prisma.packageTerms.delete({ where: { id } });
  });

  // ── Availability ───────────────────────────────────────────────────────────
  static createAvailability = catchServiceAsync(async (data: {
    packageId: number;
    zoneId: number;
    availableFrom?: Date;
    availableTo?: Date;
    bookingLimit?: number;
    status?: string;
  }) => {
    return prisma.packageAvailability.create({ data });
  });

  static updateAvailability = catchServiceAsync(async (id: number, data: Partial<{
    availableFrom: Date;
    availableTo: Date;
    bookingLimit: number;
    status: string;
  }>) => {
    return prisma.packageAvailability.update({ where: { id }, data });
  });

  static deleteAvailability = catchServiceAsync(async (id: number) => {
    return prisma.packageAvailability.delete({ where: { id } });
  });

  // ── Discounts ──────────────────────────────────────────────────────────────
  static createDiscount = catchServiceAsync(async (data: {
    packageId: number;
    discountType: string;
    discountValue: number;
    minimumAmount?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) => {
    return prisma.packageDiscount.create({ data });
  });

  static updateDiscount = catchServiceAsync(async (id: number, data: Partial<{
    discountType: string;
    discountValue: number;
    minimumAmount: number;
    startDate: Date;
    endDate: Date;
    status: string;
  }>) => {
    return prisma.packageDiscount.update({ where: { id }, data });
  });

  static deleteDiscount = catchServiceAsync(async (id: number) => {
    return prisma.packageDiscount.delete({ where: { id } });
  });

  // ── Reviews ────────────────────────────────────────────────────────────────
  static getReviewsByPackage = catchServiceAsync(async (packageId: number) => {
    return prisma.packageReview.findMany({
      where: { packageId, status: 'active' },
      include: { customer: { include: { user: { select: { name: true, profileImage: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  });

  static submitReview = catchServiceAsync(async (data: {
    packageId: number;
    customerId: number;
    rating: number;
    review?: string;
  }) => {
    return prisma.packageReview.create({
      data: {
        packageId: data.packageId,
        customerId: data.customerId,
        rating: data.rating,
        review: data.review,
        status: 'active',
      }
    });
  });

  static updateReviewStatus = catchServiceAsync(async (id: number, status: string) => {
    return prisma.packageReview.update({
      where: { id },
      data: { status }
    });
  });

  // ── Analytics ──────────────────────────────────────────────────────────────
  static getAnalyticsByPackage = catchServiceAsync(async (packageId: number) => {
    return prisma.packageAnalytics.findFirst({
      where: { packageId },
      orderBy: { createdAt: 'desc' }
    });
  });

  static updateAnalytics = catchServiceAsync(async (packageId: number, data: Partial<{
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    conversionRate: number;
  }>) => {
    const existing = await prisma.packageAnalytics.findFirst({ where: { packageId } });
    if (existing) {
      return prisma.packageAnalytics.update({ where: { id: existing.id }, data });
    }
    return prisma.packageAnalytics.create({ data: { packageId, ...data } });
  });
}
