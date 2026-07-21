"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicePricingService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
exports.ServicePricingService = {
    // ── Base Pricing ────────────────────────────────────────────────────────────
    getPricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.servicePricing.findUnique({ where: { serviceId } })),
    upsertPricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, data) => prisma_1.prisma.servicePricing.upsert({
        where: { serviceId },
        create: Object.assign({ serviceId }, data),
        update: data,
    })),
    // ── Zone Pricing ────────────────────────────────────────────────────────────
    getZonePricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceZonePricing.findMany({ where: { serviceId }, include: { zone: true } })),
    getZonePricingByZone: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, zoneId) => prisma_1.prisma.serviceZonePricing.findUnique({
        where: { serviceId_zoneId: { serviceId, zoneId } },
    })),
    upsertZonePricing: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, zoneId, data) => prisma_1.prisma.serviceZonePricing.upsert({
        where: { serviceId_zoneId: { serviceId, zoneId } },
        create: Object.assign({ serviceId, zoneId }, data),
        update: data,
    })),
    deleteZonePricing: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceZonePricing.delete({ where: { id } })),
    // ── Bulk zone price lookup for Smart Calculator ─────────────────────────────
    getZonePricesForServices: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceIds, zoneId) => prisma_1.prisma.serviceZonePricing.findMany({
        where: { serviceId: { in: serviceIds }, zoneId, status: 'active' },
        include: { service: { select: { id: true, name: true, slug: true } } },
    })),
    // ── Service Addons ───────────────────────────────────────────────────────────
    getAddons: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceAddon.findMany({ where: { serviceId } })),
    createAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.serviceAddon.create({ data })),
    updateAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.serviceAddon.update({ where: { id }, data })),
    deleteAddon: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceAddon.delete({ where: { id } })),
    // ── Service Attributes ──────────────────────────────────────────────────────
    getAttributes: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceAttribute.findMany({ where: { serviceId } })),
    createAttribute: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.serviceAttribute.create({ data })),
    deleteAttribute: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceAttribute.delete({ where: { id } })),
    // ── Service Requirements ────────────────────────────────────────────────────
    getRequirements: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceRequirement.findMany({ where: { serviceId }, include: { event: true } })),
    getRequirementsByEvent: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.serviceRequirement.findMany({ where: { eventId }, include: { service: true } })),
    upsertRequirement: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, eventId, data) => prisma_1.prisma.serviceRequirement.upsert({
        where: { serviceId_eventId: { serviceId, eventId } },
        create: Object.assign({ serviceId, eventId }, data),
        update: data,
    })),
    deleteRequirement: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceRequirement.delete({ where: { id } })),
    // ── Service Availability ────────────────────────────────────────────────────
    getAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceAvailability.findMany({ where: { serviceId } })),
    createAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.serviceAvailability.create({ data })),
    updateAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.serviceAvailability.update({ where: { id }, data })),
    deleteAvailability: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceAvailability.delete({ where: { id } })),
};
