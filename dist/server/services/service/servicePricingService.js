"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePricingService = void 0;
// ─────────────────────────────────────────────────────────────────────────────
// ServicePricingService
// Zone pricing, base pricing, addons, attributes, requirements, availability
// ─────────────────────────────────────────────────────────────────────────────
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
exports.ServicePricingService = {
    // ── Base Pricing ────────────────────────────────────────────────────────────
    getPricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.servicePricing.findUnique({ where: { serviceId } })),
    upsertPricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, data) => prisma.servicePricing.upsert({
        where: { serviceId },
        create: Object.assign({ serviceId }, data),
        update: data,
    })),
    // ── Zone Pricing ────────────────────────────────────────────────────────────
    getZonePricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceZonePricing.findMany({ where: { serviceId }, include: { zone: true } })),
    getZonePricingByZone: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, zoneId) => prisma.serviceZonePricing.findUnique({
        where: { serviceId_zoneId: { serviceId, zoneId } },
    })),
    upsertZonePricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, zoneId, data) => prisma.serviceZonePricing.upsert({
        where: { serviceId_zoneId: { serviceId, zoneId } },
        create: Object.assign({ serviceId, zoneId }, data),
        update: data,
    })),
    deleteZonePricing: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceZonePricing.delete({ where: { id } })),
    // ── Bulk zone price lookup for Smart Calculator ─────────────────────────────
    getZonePricesForServices: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceIds, zoneId) => prisma.serviceZonePricing.findMany({
        where: { serviceId: { in: serviceIds }, zoneId, status: 'active' },
        include: { service: { select: { id: true, name: true, slug: true } } },
    })),
    // ── Service Addons ───────────────────────────────────────────────────────────
    getAddons: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceAddon.findMany({ where: { serviceId } })),
    createAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceAddon.create({ data })),
    updateAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceAddon.update({ where: { id }, data })),
    deleteAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceAddon.delete({ where: { id } })),
    // ── Service Attributes ──────────────────────────────────────────────────────
    getAttributes: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceAttribute.findMany({ where: { serviceId } })),
    createAttribute: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceAttribute.create({ data })),
    deleteAttribute: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceAttribute.delete({ where: { id } })),
    // ── Service Requirements ────────────────────────────────────────────────────
    getRequirements: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceRequirement.findMany({ where: { serviceId }, include: { event: true } })),
    getRequirementsByEvent: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma.serviceRequirement.findMany({ where: { eventId }, include: { service: true } })),
    upsertRequirement: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, eventId, data) => prisma.serviceRequirement.upsert({
        where: { serviceId_eventId: { serviceId, eventId } },
        create: Object.assign({ serviceId, eventId }, data),
        update: data,
    })),
    deleteRequirement: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceRequirement.delete({ where: { id } })),
    // ── Service Availability ────────────────────────────────────────────────────
    getAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceAvailability.findMany({ where: { serviceId } })),
    createAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceAvailability.create({ data })),
    updateAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceAvailability.update({ where: { id }, data })),
    deleteAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceAvailability.delete({ where: { id } })),
};
