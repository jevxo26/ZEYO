"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
// ── Helpers ───────────────────────────────────────────────────────────────────
/** Haversine distance in km between two lat/lng points */
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
/** Point-in-polygon check (ray-casting algorithm) */
function pointInPolygon(lat, lng, polygon) {
    let inside = false;
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = polygon[i].lat, yi = polygon[i].lng;
        const xj = polygon[j].lat, yj = polygon[j].lng;
        const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
        if (intersect)
            inside = !inside;
    }
    return inside;
}
class ZoneService {
}
exports.ZoneService = ZoneService;
_a = ZoneService;
// ── Zones ─────────────────────────────────────────────────────────────────
ZoneService.getAllZones = (0, catchServiceAsync_1.catchServiceAsync)(async (filters) => {
    return prisma_1.prisma.zone.findMany({
        where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.status) ? { status: filters.status } : {})), ((filters === null || filters === void 0 ? void 0 : filters.countryId) ? { countryId: filters.countryId } : {})), ((filters === null || filters === void 0 ? void 0 : filters.divisionId) ? { divisionId: filters.divisionId } : {})), ((filters === null || filters === void 0 ? void 0 : filters.districtId) ? { districtId: filters.districtId } : {})), ((filters === null || filters === void 0 ? void 0 : filters.cityId) ? { cityId: filters.cityId } : {})), ((filters === null || filters === void 0 ? void 0 : filters.zoneGroupId) ? { zoneGroupId: filters.zoneGroupId } : {})),
        include: {
            country: { select: { id: true, name: true, currency: true } },
            division: { select: { id: true, name: true } },
            district: { select: { id: true, name: true } },
            city: { select: { id: true, name: true } },
            zoneGroup: { select: { id: true, name: true } },
            zoneSetting: true,
        },
        orderBy: { name: 'asc' },
    });
});
ZoneService.getZoneById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zone.findUnique({
        where: { id },
        include: {
            country: { select: { id: true, name: true, currency: true } },
            division: { select: { id: true, name: true } },
            district: { select: { id: true, name: true } },
            city: { select: { id: true, name: true } },
            zoneGroup: { select: { id: true, name: true } },
            zoneSetting: true,
            zoneTaxes: { where: { status: 'active' } },
            zoneDeliveryCharges: true,
            zoneCoverages: { where: { status: 'active' } },
            zonePolygons: true,
            geoFences: { where: { status: 'active' } },
            zoneAnalytics: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
    });
});
ZoneService.getZoneByCode = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneCode) => {
    return prisma_1.prisma.zone.findUnique({ where: { zoneCode } });
});
ZoneService.createZone = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.zone.create({
        data: Object.assign(Object.assign({}, data), { status: 'active' }),
    });
});
ZoneService.updateZone = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.zone.update({ where: { id }, data });
});
ZoneService.deleteZone = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zone.delete({ where: { id } });
});
// ── ZoneGroups ────────────────────────────────────────────────────────────
ZoneService.getAllZoneGroups = (0, catchServiceAsync_1.catchServiceAsync)(async (status) => {
    return prisma_1.prisma.zoneGroup.findMany({
        where: status ? { status } : {},
        include: { zones: { where: { status: 'active' }, select: { id: true, name: true, zoneCode: true } } },
        orderBy: { name: 'asc' },
    });
});
ZoneService.createZoneGroup = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.zoneGroup.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
ZoneService.updateZoneGroup = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.zoneGroup.update({ where: { id }, data });
});
ZoneService.deleteZoneGroup = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zoneGroup.delete({ where: { id } });
});
// ── ZonePricing ───────────────────────────────────────────────────────────
ZoneService.getPricingByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId, serviceId) => {
    return prisma_1.prisma.zonePricing.findMany({
        where: Object.assign(Object.assign({ zoneId, status: 'active' }, (serviceId ? { serviceId } : {})), { OR: [
                { effectiveFrom: null },
                { effectiveFrom: { lte: new Date() } },
            ], AND: [
                { OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }] },
            ] }),
        orderBy: { serviceId: 'asc' },
    });
});
ZoneService.createZonePricing = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    var _b;
    return prisma_1.prisma.zonePricing.create({ data: Object.assign(Object.assign({}, data), { currency: (_b = data.currency) !== null && _b !== void 0 ? _b : 'BDT', status: 'active' }) });
});
ZoneService.updateZonePricing = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.zonePricing.update({ where: { id }, data });
});
ZoneService.deleteZonePricing = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zonePricing.delete({ where: { id } });
});
// ── ZoneService (availability) ────────────────────────────────────────────
ZoneService.getServicesByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zoneService.findMany({ where: { zoneId }, orderBy: { priority: 'asc' } });
});
ZoneService.upsertZoneService = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    var _b;
    return prisma_1.prisma.zoneService.upsert({
        where: { zoneId_serviceId: { zoneId: data.zoneId, serviceId: data.serviceId } },
        update: { isAvailable: data.isAvailable, priority: data.priority, remarks: data.remarks },
        create: Object.assign(Object.assign({}, data), { priority: (_b = data.priority) !== null && _b !== void 0 ? _b : 0 }),
    });
});
// ── ZonePackage ───────────────────────────────────────────────────────────
ZoneService.getPackagesByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zonePackage.findMany({ where: { zoneId, status: 'active' } });
});
ZoneService.createZonePackage = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    var _b;
    return prisma_1.prisma.zonePackage.create({ data: Object.assign(Object.assign({}, data), { discount: (_b = data.discount) !== null && _b !== void 0 ? _b : 0, status: 'active' }) });
});
ZoneService.updateZonePackage = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.zonePackage.update({ where: { id }, data });
});
ZoneService.deleteZonePackage = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zonePackage.delete({ where: { id } });
});
// ── ZoneHoliday ───────────────────────────────────────────────────────────
ZoneService.getHolidaysByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zoneHoliday.findMany({
        where: { zoneId, status: 'active' },
        orderBy: { holidayDate: 'asc' },
    });
});
ZoneService.createZoneHoliday = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.zoneHoliday.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
ZoneService.deleteZoneHoliday = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zoneHoliday.delete({ where: { id } });
});
// ── ZoneTax ───────────────────────────────────────────────────────────────
ZoneService.getTaxesByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zoneTax.findMany({ where: { zoneId, status: 'active' } });
});
ZoneService.createZoneTax = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.zoneTax.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
ZoneService.updateZoneTax = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.zoneTax.update({ where: { id }, data });
});
ZoneService.deleteZoneTax = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zoneTax.delete({ where: { id } });
});
// ── ZoneDeliveryCharge ────────────────────────────────────────────────────
ZoneService.getDeliveryChargesByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zoneDeliveryCharge.findMany({ where: { zoneId } });
});
ZoneService.createZoneDeliveryCharge = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.zoneDeliveryCharge.create({ data });
});
ZoneService.deleteZoneDeliveryCharge = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zoneDeliveryCharge.delete({ where: { id } });
});
// ── ZoneCoverage ──────────────────────────────────────────────────────────
ZoneService.getCoverageByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zoneCoverage.findMany({ where: { zoneId, status: 'active' } });
});
ZoneService.createZoneCoverage = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.zoneCoverage.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
ZoneService.deleteZoneCoverage = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zoneCoverage.delete({ where: { id } });
});
// ── ZonePolygon ───────────────────────────────────────────────────────────
ZoneService.getPolygonsByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zonePolygon.findMany({ where: { zoneId } });
});
ZoneService.createZonePolygon = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.zonePolygon.create({ data });
});
ZoneService.deleteZonePolygon = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.zonePolygon.delete({ where: { id } });
});
// ── GeoLocation ───────────────────────────────────────────────────────────
ZoneService.getGeoLocationsByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.geoLocation.findMany({ where: { zoneId } });
});
ZoneService.createGeoLocation = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.geoLocation.create({ data });
});
// ── GeoFence ──────────────────────────────────────────────────────────────
ZoneService.getGeoFencesByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.geoFence.findMany({ where: { zoneId, status: 'active' } });
});
ZoneService.createGeoFence = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.geoFence.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
ZoneService.deleteGeoFence = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.geoFence.delete({ where: { id } });
});
// ── ZoneAnalytics ─────────────────────────────────────────────────────────
ZoneService.getAnalyticsByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zoneAnalytics.findFirst({ where: { zoneId }, orderBy: { createdAt: 'desc' } });
});
ZoneService.updateZoneAnalytics = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId, data) => {
    const existing = await prisma_1.prisma.zoneAnalytics.findFirst({ where: { zoneId } });
    if (existing) {
        return prisma_1.prisma.zoneAnalytics.update({ where: { id: existing.id }, data });
    }
    return prisma_1.prisma.zoneAnalytics.create({ data: Object.assign({ zoneId }, data) });
});
// ── ZoneSetting ───────────────────────────────────────────────────────────
ZoneService.getSettingByZone = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId) => {
    return prisma_1.prisma.zoneSetting.findUnique({ where: { zoneId } });
});
ZoneService.upsertZoneSetting = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId, data) => {
    var _b, _c, _d, _e, _f;
    return prisma_1.prisma.zoneSetting.upsert({
        where: { zoneId },
        update: data,
        create: {
            zoneId,
            allowBooking: (_b = data.allowBooking) !== null && _b !== void 0 ? _b : true,
            allowCalculator: (_c = data.allowCalculator) !== null && _c !== void 0 ? _c : true,
            allowPackage: (_d = data.allowPackage) !== null && _d !== void 0 ? _d : true,
            allowVendorAssignment: (_e = data.allowVendorAssignment) !== null && _e !== void 0 ? _e : true,
            isActive: (_f = data.isActive) !== null && _f !== void 0 ? _f : true,
        },
    });
});
// ── ServiceZone ───────────────────────────────────────────────────────────
ZoneService.getZonesByService = (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => {
    return prisma_1.prisma.serviceZone.findMany({
        where: { serviceId, status: 'active' },
        include: { zone: { select: { id: true, name: true, zoneCode: true } } },
    });
});
ZoneService.createServiceZone = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.serviceZone.upsert({
        where: { serviceId_zoneId: { serviceId: data.serviceId, zoneId: data.zoneId } },
        update: { status: 'active' },
        create: Object.assign(Object.assign({}, data), { status: 'active' }),
    });
});
// ─────────────────────────────────────────────────────────────────────────
// ⭐ BUSINESS LOGIC
// ─────────────────────────────────────────────────────────────────────────
/**
 * calculatePrice()
 * Smart pricing calculator.
 * Given a zone, service, optional package, and optional travel distance:
 *  1. Fetch base price from ZonePricing
 *  2. Apply taxes (additive on top of base)
 *  3. Add delivery charge (flat or per_km)
 *  4. Return itemised breakdown
 */
ZoneService.calculatePrice = (0, catchServiceAsync_1.catchServiceAsync)(async (params) => {
    const { zoneId, serviceId, packageId, distanceKm = 0 } = params;
    // 1. Active pricing record
    const pricing = await prisma_1.prisma.zonePricing.findFirst({
        where: Object.assign(Object.assign({ zoneId, serviceId, status: 'active' }, (packageId ? { packageId } : {})), { OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: new Date() } }], AND: [{ OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }] }] }),
    });
    if (!pricing)
        throw new Error(`No active pricing found for zoneId=${zoneId} serviceId=${serviceId}`);
    const basePrice = pricing.basePrice;
    // 2. Taxes
    const taxes = await prisma_1.prisma.zoneTax.findMany({ where: { zoneId, status: 'active' } });
    let taxAmount = 0;
    const taxBreakdown = [];
    for (const tax of taxes) {
        const amount = tax.taxType === 'percentage'
            ? (basePrice * tax.taxValue) / 100
            : tax.taxValue;
        taxAmount += amount;
        taxBreakdown.push({ name: tax.taxName, type: tax.taxType, value: tax.taxValue, amount });
    }
    // 3. Delivery charges
    const deliveryCharges = await prisma_1.prisma.zoneDeliveryCharge.findMany({ where: { zoneId } });
    let deliveryAmount = 0;
    const deliveryBreakdown = [];
    for (const dc of deliveryCharges) {
        const amount = dc.chargeType === 'per_km' ? dc.amount * distanceKm : dc.amount;
        deliveryAmount += amount;
        deliveryBreakdown.push({ type: dc.chargeType, amount });
    }
    const subtotal = basePrice;
    const totalTax = taxAmount;
    const totalDelivery = deliveryAmount;
    const grandTotal = subtotal + totalTax + totalDelivery;
    return {
        zoneId,
        serviceId,
        packageId,
        currency: pricing.currency,
        basePrice,
        minimumPrice: pricing.minimumPrice,
        maximumPrice: pricing.maximumPrice,
        taxAmount: totalTax,
        taxBreakdown,
        deliveryAmount: totalDelivery,
        deliveryBreakdown,
        grandTotal,
        distanceKm,
    };
});
/**
 * getAvailableVendors()
 * Returns vendors operating in a given zone (via VendorServiceZone).
 */
ZoneService.getAvailableVendors = (0, catchServiceAsync_1.catchServiceAsync)(async (zoneId, serviceId) => {
    const zones = await prisma_1.prisma.vendorServiceZone.findMany({
        where: { zoneId, status: 'active' },
        include: {
            vendorService: {
                include: {
                    vendor: {
                        select: {
                            id: true, vendorCode: true, businessName: true,
                            ownerName: true, email: true, phone: true,
                            businessType: true, status: true, isVerified: true,
                        },
                    },
                },
            },
        },
    });
    const filtered = serviceId
        ? zones.filter(z => z.vendorService.serviceId === serviceId)
        : zones;
    return filtered.map(z => ({
        vendorServiceId: z.vendorServiceId,
        vendor: z.vendorService.vendor,
        serviceId: z.vendorService.serviceId,
        serviceName: z.vendorService.serviceName,
    }));
});
/**
 * resolveZoneFromCoords()
 * Given a lat/lng pair, resolves which Zone the point belongs to.
 * Checks GeoFences (radius) first, then ZonePolygons (point-in-polygon).
 */
ZoneService.resolveZoneFromCoords = (0, catchServiceAsync_1.catchServiceAsync)(async (latitude, longitude) => {
    const matched = [];
    // 1. Check GeoFences
    const fences = await prisma_1.prisma.geoFence.findMany({
        where: { status: 'active' },
        include: { zone: { select: { id: true, name: true, zoneCode: true } } },
    });
    for (const fence of fences) {
        const dist = haversineKm(latitude, longitude, fence.latitude, fence.longitude);
        if (dist <= fence.radius) {
            matched.push({
                zoneId: fence.zone.id,
                zoneName: fence.zone.name,
                zoneCode: fence.zone.zoneCode,
                method: 'geofence',
            });
        }
    }
    // 2. Check Polygons (if no fence match)
    if (matched.length === 0) {
        const polygons = await prisma_1.prisma.zonePolygon.findMany({
            include: { zone: { select: { id: true, name: true, zoneCode: true } } },
        });
        for (const poly of polygons) {
            const coords = poly.polygonData;
            if (Array.isArray(coords) && pointInPolygon(latitude, longitude, coords)) {
                matched.push({
                    zoneId: poly.zone.id,
                    zoneName: poly.zone.name,
                    zoneCode: poly.zone.zoneCode,
                    method: 'polygon',
                });
            }
        }
    }
    return matched;
});
