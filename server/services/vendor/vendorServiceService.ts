import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class VendorServiceService {
  static addService = catchServiceAsync(async (vendorId: number, data: {
    serviceId: number;
    serviceName: string;
    status?: string;
  }) => {
    return prisma.vendorService.create({
      data: {
        vendorId,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        status: data.status || 'active',
      },
    });
  });

  static getServicesByVendor = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorService.findMany({
      where: { vendorId },
      include: {
        zones: true,
        pricing: true,
      },
    });
  });

  static updateService = catchServiceAsync(async (id: number, data: {
    status?: string;
  }) => {
    return prisma.vendorService.update({
      where: { id },
      data,
    });
  });

  static deleteService = catchServiceAsync(async (id: number) => {
    return prisma.vendorService.delete({
      where: { id },
    });
  });

  // ─── Service Zones ────────────────────────────────────────────────────────
  static addServiceZone = catchServiceAsync(async (vendorServiceId: number, data: {
    zoneId: number;
    status?: string;
  }) => {
    return prisma.vendorServiceZone.create({
      data: {
        vendorServiceId,
        zoneId: data.zoneId,
        status: data.status || 'active',
      },
    });
  });

  static getZonesByService = catchServiceAsync(async (vendorServiceId: number) => {
    return prisma.vendorServiceZone.findMany({
      where: { vendorServiceId },
    });
  });

  static updateServiceZone = catchServiceAsync(async (id: number, data: {
    status?: string;
  }) => {
    return prisma.vendorServiceZone.update({
      where: { id },
      data,
    });
  });

  static removeServiceZone = catchServiceAsync(async (id: number) => {
    return prisma.vendorServiceZone.delete({
      where: { id },
    });
  });

  // ─── Internal Pricing ──────────────────────────────────────────────────────
  static setPricing = catchServiceAsync(async (vendorServiceId: number, data: {
    zoneId: number;
    basePrice: number;
    minimumPrice?: number;
    maximumPrice?: number;
    priceType: string; // flat | hourly | daily | per_person
    status?: string;
  }) => {
    // Check if pricing already exists for this zone
    const existing = await prisma.vendorPricing.findFirst({
      where: { vendorServiceId, zoneId: data.zoneId },
    });

    const pricingFields = {
      basePrice: data.basePrice,
      minimumPrice: data.minimumPrice || null,
      maximumPrice: data.maximumPrice || null,
      priceType: data.priceType,
      status: data.status || 'active',
    };

    if (existing) {
      return prisma.vendorPricing.update({
        where: { id: existing.id },
        data: pricingFields,
      });
    }

    return prisma.vendorPricing.create({
      data: {
        vendorServiceId,
        zoneId: data.zoneId,
        ...pricingFields,
      },
    });
  });

  static getPricingByService = catchServiceAsync(async (vendorServiceId: number) => {
    return prisma.vendorPricing.findMany({
      where: { vendorServiceId },
    });
  });
}
