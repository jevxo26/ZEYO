// ─────────────────────────────────────────────────────────────────────────────
// ServicePricingService
// Zone pricing, base pricing, addons, attributes, requirements, availability
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export const ServicePricingService = {

  // ── Base Pricing ────────────────────────────────────────────────────────────
  getPricing: catchServiceAsync(async (serviceId: number) =>
    prisma.servicePricing.findUnique({ where: { serviceId } })),

  upsertPricing: catchServiceAsync(async (serviceId: number, data: {
    basePrice: number; minimumPrice?: number; maximumPrice?: number;
    pricingType?: string; currency?: string;
  }) => prisma.servicePricing.upsert({
    where:  { serviceId },
    create: { serviceId, ...data },
    update: data,
  })),

  // ── Zone Pricing ────────────────────────────────────────────────────────────
  getZonePricing: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceZonePricing.findMany({ where: { serviceId }, include: { zone: true } })),

  getZonePricingByZone: catchServiceAsync(async (serviceId: number, zoneId: number) =>
    prisma.serviceZonePricing.findUnique({
      where: { serviceId_zoneId: { serviceId, zoneId } },
    })),

  upsertZonePricing: catchServiceAsync(async (serviceId: number, zoneId: number, data: {
    price: number; effectiveFrom?: Date; effectiveTo?: Date; status?: string;
  }) => prisma.serviceZonePricing.upsert({
    where:  { serviceId_zoneId: { serviceId, zoneId } },
    create: { serviceId, zoneId, ...data },
    update: data,
  })),

  deleteZonePricing: catchServiceAsync(async (id: number) =>
    prisma.serviceZonePricing.delete({ where: { id } })),

  // ── Bulk zone price lookup for Smart Calculator ─────────────────────────────
  getZonePricesForServices: catchServiceAsync(async (serviceIds: number[], zoneId: number) =>
    prisma.serviceZonePricing.findMany({
      where: { serviceId: { in: serviceIds }, zoneId, status: 'active' },
      include: { service: { select: { id: true, name: true, slug: true } } },
    })),

  // ── Service Addons ───────────────────────────────────────────────────────────
  getAddons: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceAddon.findMany({ where: { serviceId } })),

  createAddon: catchServiceAsync(async (data: {
    serviceId: number; name: string; description?: string;
    price?: number; pricingType?: string; status?: string;
  }) => prisma.serviceAddon.create({ data })),

  updateAddon: catchServiceAsync(async (id: number, data: Partial<{
    name: string; description: string; price: number; pricingType: string; status: string;
  }>) => prisma.serviceAddon.update({ where: { id }, data })),

  deleteAddon: catchServiceAsync(async (id: number) =>
    prisma.serviceAddon.delete({ where: { id } })),

  // ── Service Attributes ──────────────────────────────────────────────────────
  getAttributes: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceAttribute.findMany({ where: { serviceId } })),

  createAttribute: catchServiceAsync(async (data: {
    serviceId: number; attributeName: string; attributeValue: string;
  }) => prisma.serviceAttribute.create({ data })),

  deleteAttribute: catchServiceAsync(async (id: number) =>
    prisma.serviceAttribute.delete({ where: { id } })),

  // ── Service Requirements ────────────────────────────────────────────────────
  getRequirements: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceRequirement.findMany({ where: { serviceId }, include: { event: true } })),

  getRequirementsByEvent: catchServiceAsync(async (eventId: number) =>
    prisma.serviceRequirement.findMany({ where: { eventId }, include: { service: true } })),

  upsertRequirement: catchServiceAsync(async (serviceId: number, eventId: number, data: {
    isMandatory?: boolean; minimumQuantity?: number; maximumQuantity?: number;
  }) => prisma.serviceRequirement.upsert({
    where:  { serviceId_eventId: { serviceId, eventId } },
    create: { serviceId, eventId, ...data },
    update: data,
  })),

  deleteRequirement: catchServiceAsync(async (id: number) =>
    prisma.serviceRequirement.delete({ where: { id } })),

  // ── Service Availability ────────────────────────────────────────────────────
  getAvailability: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceAvailability.findMany({ where: { serviceId } })),

  createAvailability: catchServiceAsync(async (data: {
    serviceId: number; zoneId: number;
    availableFrom?: Date; availableTo?: Date; status?: string;
  }) => prisma.serviceAvailability.create({ data })),

  updateAvailability: catchServiceAsync(async (id: number, data: Partial<{
    availableFrom: Date; availableTo: Date; status: string;
  }>) => prisma.serviceAvailability.update({ where: { id }, data })),

  deleteAvailability: catchServiceAsync(async (id: number) =>
    prisma.serviceAvailability.delete({ where: { id } })),
};
