"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorServiceService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class VendorServiceService {
}
exports.VendorServiceService = VendorServiceService;
_a = VendorServiceService;
VendorServiceService.addService = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
    return prisma_1.prisma.vendorService.create({
        data: {
            vendorId,
            serviceId: data.serviceId,
            serviceName: data.serviceName,
            status: data.status || 'active',
        },
    });
});
VendorServiceService.getServicesByVendor = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => {
    return prisma_1.prisma.vendorService.findMany({
        where: { vendorId },
        include: {
            zones: true,
            pricing: true,
        },
    });
});
VendorServiceService.updateService = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.vendorService.update({
        where: { id },
        data,
    });
});
VendorServiceService.deleteService = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.vendorService.delete({
        where: { id },
    });
});
// ─── Service Zones ────────────────────────────────────────────────────────
VendorServiceService.addServiceZone = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorServiceId, data) => {
    return prisma_1.prisma.vendorServiceZone.create({
        data: {
            vendorServiceId,
            zoneId: data.zoneId,
            status: data.status || 'active',
        },
    });
});
VendorServiceService.getZonesByService = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorServiceId) => {
    return prisma_1.prisma.vendorServiceZone.findMany({
        where: { vendorServiceId },
    });
});
VendorServiceService.updateServiceZone = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.vendorServiceZone.update({
        where: { id },
        data,
    });
});
VendorServiceService.removeServiceZone = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.vendorServiceZone.delete({
        where: { id },
    });
});
// ─── Internal Pricing ──────────────────────────────────────────────────────
VendorServiceService.setPricing = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorServiceId, data) => {
    // Check if pricing already exists for this zone
    const existing = await prisma_1.prisma.vendorPricing.findFirst({
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
        return prisma_1.prisma.vendorPricing.update({
            where: { id: existing.id },
            data: pricingFields,
        });
    }
    return prisma_1.prisma.vendorPricing.create({
        data: Object.assign({ vendorServiceId, zoneId: data.zoneId }, pricingFields),
    });
});
VendorServiceService.getPricingByService = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorServiceId) => {
    return prisma_1.prisma.vendorPricing.findMany({
        where: { vendorServiceId },
    });
});
