import { prisma } from '../../config/prisma';
// ─────────────────────────────────────────────────────────────────────────────
// ZoneService
// CRUD for Zone and all sub-entities (pricing, packages, services, holidays,
// taxes, delivery charges, coverage, polygons, geo-fences, analytics, settings).
// Also includes:
//   - calculatePrice(): smart pricing calculator with taxes + delivery
//   - getAvailableVendors(): zone-scoped vendor finder
//   - resolveZoneFromCoords(): geofence-based zone resolver
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



// ── Helpers ───────────────────────────────────────────────────────────────────
/** Haversine distance in km between two lat/lng points */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Point-in-polygon check (ray-casting algorithm) */
function pointInPolygon(
  lat: number, lng: number,
  polygon: Array<{ lat: number; lng: number }>
): boolean {
  let inside = false;
  const n = polygon.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export class ZoneService {

  // ── Zones ─────────────────────────────────────────────────────────────────
  static getAllZones = catchServiceAsync(async (filters?: {
    status?: string; countryId?: number; divisionId?: number;
    districtId?: number; cityId?: number; zoneGroupId?: number;
  }) => {
    return prisma.zone.findMany({
      where: {
        ...(filters?.status     ? { status:      filters.status }     : {}),
        ...(filters?.countryId  ? { countryId:   filters.countryId }  : {}),
        ...(filters?.divisionId ? { divisionId:  filters.divisionId } : {}),
        ...(filters?.districtId ? { districtId:  filters.districtId } : {}),
        ...(filters?.cityId     ? { cityId:      filters.cityId }     : {}),
        ...(filters?.zoneGroupId ? { zoneGroupId: filters.zoneGroupId } : {}),
      },
      include: {
        country:    { select: { id: true, name: true, currency: true } },
        division:   { select: { id: true, name: true } },
        district:   { select: { id: true, name: true } },
        city:       { select: { id: true, name: true } },
        zoneGroup:  { select: { id: true, name: true } },
        zoneSetting: true,
      },
      orderBy: { name: 'asc' },
    });
  });

  static getZoneById = catchServiceAsync(async (id: number) => {
    return prisma.zone.findUnique({
      where: { id },
      include: {
        country:            { select: { id: true, name: true, currency: true } },
        division:           { select: { id: true, name: true } },
        district:           { select: { id: true, name: true } },
        city:               { select: { id: true, name: true } },
        zoneGroup:          { select: { id: true, name: true } },
        zoneSetting:        true,
        zoneTaxes:          { where: { status: 'active' } },
        zoneDeliveryCharges: true,
        zoneCoverages:      { where: { status: 'active' } },
        zonePolygons:       true,
        geoFences:          { where: { status: 'active' } },
        zoneAnalytics:      { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  });

  static getZoneByCode = catchServiceAsync(async (zoneCode: string) => {
    return prisma.zone.findUnique({ where: { zoneCode } });
  });

  static createZone = catchServiceAsync(async (data: {
    name: string; zoneCode: string; countryId: number;
    divisionId?: number; districtId?: number; cityId?: number; areaId?: number;
    description?: string; zoneGroupId?: number;
  }) => {
    return prisma.zone.create({
      data: { ...data, status: 'active' },
    });
  });

  static updateZone = catchServiceAsync(async (id: number, data: Partial<{
    name: string; description: string; status: string;
    divisionId: number; districtId: number; cityId: number; areaId: number; zoneGroupId: number;
  }>) => {
    return prisma.zone.update({ where: { id }, data });
  });

  static deleteZone = catchServiceAsync(async (id: number) => {
    return prisma.zone.delete({ where: { id } });
  });

  // ── ZoneGroups ────────────────────────────────────────────────────────────
  static getAllZoneGroups = catchServiceAsync(async (status?: string) => {
    return prisma.zoneGroup.findMany({
      where: status ? { status } : {},
      include: { zones: { where: { status: 'active' }, select: { id: true, name: true, zoneCode: true } } },
      orderBy: { name: 'asc' },
    });
  });

  static createZoneGroup = catchServiceAsync(async (data: { name: string; description?: string }) => {
    return prisma.zoneGroup.create({ data: { ...data, status: 'active' } });
  });

  static updateZoneGroup = catchServiceAsync(async (id: number, data: Partial<{ name: string; description: string; status: string }>) => {
    return prisma.zoneGroup.update({ where: { id }, data });
  });

  static deleteZoneGroup = catchServiceAsync(async (id: number) => {
    return prisma.zoneGroup.delete({ where: { id } });
  });

  // ── ZonePricing ───────────────────────────────────────────────────────────
  static getPricingByZone = catchServiceAsync(async (zoneId: number, serviceId?: number) => {
    return prisma.zonePricing.findMany({
      where: {
        zoneId,
        status: 'active',
        ...(serviceId ? { serviceId } : {}),
        OR: [
          { effectiveFrom: null },
          { effectiveFrom: { lte: new Date() } },
        ],
        AND: [
          { OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }] },
        ],
      },
      orderBy: { serviceId: 'asc' },
    });
  });

  static createZonePricing = catchServiceAsync(async (data: {
    zoneId: number; serviceId: number; packageId?: number;
    basePrice: number; minimumPrice?: number; maximumPrice?: number;
    currency?: string; effectiveFrom?: Date; effectiveTo?: Date;
  }) => {
    return prisma.zonePricing.create({ data: { ...data, currency: data.currency ?? 'BDT', status: 'active' } });
  });

  static updateZonePricing = catchServiceAsync(async (id: number, data: Partial<{
    basePrice: number; minimumPrice: number; maximumPrice: number;
    currency: string; effectiveFrom: Date; effectiveTo: Date; status: string;
  }>) => {
    return prisma.zonePricing.update({ where: { id }, data });
  });

  static deleteZonePricing = catchServiceAsync(async (id: number) => {
    return prisma.zonePricing.delete({ where: { id } });
  });

  // ── ZoneService (availability) ────────────────────────────────────────────
  static getServicesByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zoneService.findMany({ where: { zoneId }, orderBy: { priority: 'asc' } });
  });

  static upsertZoneService = catchServiceAsync(async (data: {
    zoneId: number; serviceId: number; isAvailable: boolean; priority?: number; remarks?: string;
  }) => {
    return prisma.zoneService.upsert({
      where: { zoneId_serviceId: { zoneId: data.zoneId, serviceId: data.serviceId } },
      update: { isAvailable: data.isAvailable, priority: data.priority, remarks: data.remarks },
      create: { ...data, priority: data.priority ?? 0 },
    });
  });

  // ── ZonePackage ───────────────────────────────────────────────────────────
  static getPackagesByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zonePackage.findMany({ where: { zoneId, status: 'active' } });
  });

  static createZonePackage = catchServiceAsync(async (data: {
    zoneId: number; packageId: number; packagePrice: number; discount?: number;
  }) => {
    return prisma.zonePackage.create({ data: { ...data, discount: data.discount ?? 0, status: 'active' } });
  });

  static updateZonePackage = catchServiceAsync(async (id: number, data: Partial<{
    packagePrice: number; discount: number; status: string;
  }>) => {
    return prisma.zonePackage.update({ where: { id }, data });
  });

  static deleteZonePackage = catchServiceAsync(async (id: number) => {
    return prisma.zonePackage.delete({ where: { id } });
  });

  // ── ZoneHoliday ───────────────────────────────────────────────────────────
  static getHolidaysByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zoneHoliday.findMany({
      where: { zoneId, status: 'active' },
      orderBy: { holidayDate: 'asc' },
    });
  });

  static createZoneHoliday = catchServiceAsync(async (data: {
    zoneId: number; holidayName: string; holidayDate: Date; description?: string;
  }) => {
    return prisma.zoneHoliday.create({ data: { ...data, status: 'active' } });
  });

  static deleteZoneHoliday = catchServiceAsync(async (id: number) => {
    return prisma.zoneHoliday.delete({ where: { id } });
  });

  // ── ZoneTax ───────────────────────────────────────────────────────────────
  static getTaxesByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zoneTax.findMany({ where: { zoneId, status: 'active' } });
  });

  static createZoneTax = catchServiceAsync(async (data: {
    zoneId: number; taxName: string; taxType: string; taxValue: number;
  }) => {
    return prisma.zoneTax.create({ data: { ...data, status: 'active' } });
  });

  static updateZoneTax = catchServiceAsync(async (id: number, data: Partial<{
    taxName: string; taxType: string; taxValue: number; status: string;
  }>) => {
    return prisma.zoneTax.update({ where: { id }, data });
  });

  static deleteZoneTax = catchServiceAsync(async (id: number) => {
    return prisma.zoneTax.delete({ where: { id } });
  });

  // ── ZoneDeliveryCharge ────────────────────────────────────────────────────
  static getDeliveryChargesByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zoneDeliveryCharge.findMany({ where: { zoneId } });
  });

  static createZoneDeliveryCharge = catchServiceAsync(async (data: {
    zoneId: number; chargeType: string; amount: number; description?: string;
  }) => {
    return prisma.zoneDeliveryCharge.create({ data });
  });

  static deleteZoneDeliveryCharge = catchServiceAsync(async (id: number) => {
    return prisma.zoneDeliveryCharge.delete({ where: { id } });
  });

  // ── ZoneCoverage ──────────────────────────────────────────────────────────
  static getCoverageByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zoneCoverage.findMany({ where: { zoneId, status: 'active' } });
  });

  static createZoneCoverage = catchServiceAsync(async (data: {
    zoneId: number; coverageType: string; minimumDistance?: number; maximumDistance?: number;
  }) => {
    return prisma.zoneCoverage.create({ data: { ...data, status: 'active' } });
  });

  static deleteZoneCoverage = catchServiceAsync(async (id: number) => {
    return prisma.zoneCoverage.delete({ where: { id } });
  });

  // ── ZonePolygon ───────────────────────────────────────────────────────────
  static getPolygonsByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zonePolygon.findMany({ where: { zoneId } });
  });

  static createZonePolygon = catchServiceAsync(async (data: {
    zoneId: number; polygonData: object; centerLatitude?: number; centerLongitude?: number;
  }) => {
    return prisma.zonePolygon.create({ data });
  });

  static deleteZonePolygon = catchServiceAsync(async (id: number) => {
    return prisma.zonePolygon.delete({ where: { id } });
  });

  // ── GeoLocation ───────────────────────────────────────────────────────────
  static getGeoLocationsByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.geoLocation.findMany({ where: { zoneId } });
  });

  static createGeoLocation = catchServiceAsync(async (data: {
    zoneId?: number; latitude: number; longitude: number; address?: string;
  }) => {
    return prisma.geoLocation.create({ data });
  });

  // ── GeoFence ──────────────────────────────────────────────────────────────
  static getGeoFencesByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.geoFence.findMany({ where: { zoneId, status: 'active' } });
  });

  static createGeoFence = catchServiceAsync(async (data: {
    zoneId: number; radius: number; latitude: number; longitude: number;
  }) => {
    return prisma.geoFence.create({ data: { ...data, status: 'active' } });
  });

  static deleteGeoFence = catchServiceAsync(async (id: number) => {
    return prisma.geoFence.delete({ where: { id } });
  });

  // ── ZoneAnalytics ─────────────────────────────────────────────────────────
  static getAnalyticsByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zoneAnalytics.findFirst({ where: { zoneId }, orderBy: { createdAt: 'desc' } });
  });

  static updateZoneAnalytics = catchServiceAsync(async (zoneId: number, data: Partial<{
    totalBookings: number; totalRevenue: number; totalCustomers: number;
    totalVendors: number; averageBookingValue: number;
  }>) => {
    const existing = await prisma.zoneAnalytics.findFirst({ where: { zoneId } });
    if (existing) {
      return prisma.zoneAnalytics.update({ where: { id: existing.id }, data });
    }
    return prisma.zoneAnalytics.create({ data: { zoneId, ...data } });
  });

  // ── ZoneSetting ───────────────────────────────────────────────────────────
  static getSettingByZone = catchServiceAsync(async (zoneId: number) => {
    return prisma.zoneSetting.findUnique({ where: { zoneId } });
  });

  static upsertZoneSetting = catchServiceAsync(async (zoneId: number, data: Partial<{
    allowBooking: boolean; allowCalculator: boolean;
    allowPackage: boolean; allowVendorAssignment: boolean; isActive: boolean;
  }>) => {
    return prisma.zoneSetting.upsert({
      where: { zoneId },
      update: data,
      create: {
        zoneId,
        allowBooking:          data.allowBooking          ?? true,
        allowCalculator:       data.allowCalculator       ?? true,
        allowPackage:          data.allowPackage          ?? true,
        allowVendorAssignment: data.allowVendorAssignment ?? true,
        isActive:              data.isActive              ?? true,
      },
    });
  });

  // ── ServiceZone ───────────────────────────────────────────────────────────
  static getZonesByService = catchServiceAsync(async (serviceId: number) => {
    return prisma.serviceZone.findMany({
      where: { serviceId, status: 'active' },
      include: { zone: { select: { id: true, name: true, zoneCode: true } } },
    });
  });

  static createServiceZone = catchServiceAsync(async (data: {
    serviceId: number; zoneId: number;
  }) => {
    return prisma.serviceZone.upsert({
      where: { serviceId_zoneId: { serviceId: data.serviceId, zoneId: data.zoneId } },
      update: { status: 'active' },
      create: { ...data, status: 'active' },
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
  static calculatePrice = catchServiceAsync(async (params: {
    zoneId: number;
    serviceId: number;
    packageId?: number;
    distanceKm?: number;
  }) => {
    const { zoneId, serviceId, packageId, distanceKm = 0 } = params;

    // 1. Active pricing record
    const pricing = await prisma.zonePricing.findFirst({
      where: {
        zoneId, serviceId, status: 'active',
        ...(packageId ? { packageId } : {}),
        OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: new Date() } }],
        AND: [{ OR: [{ effectiveTo: null }, { effectiveTo: { gte: new Date() } }] }],
      },
    });
    if (!pricing) throw new Error(`No active pricing found for zoneId=${zoneId} serviceId=${serviceId}`);

    const basePrice = pricing.basePrice;

    // 2. Taxes
    const taxes = await prisma.zoneTax.findMany({ where: { zoneId, status: 'active' } });
    let taxAmount = 0;
    const taxBreakdown: Array<{ name: string; type: string; value: number; amount: number }> = [];
    for (const tax of taxes) {
      const amount =
        tax.taxType === 'percentage'
          ? (basePrice * tax.taxValue) / 100
          : tax.taxValue;
      taxAmount += amount;
      taxBreakdown.push({ name: tax.taxName, type: tax.taxType, value: tax.taxValue, amount });
    }

    // 3. Delivery charges
    const deliveryCharges = await prisma.zoneDeliveryCharge.findMany({ where: { zoneId } });
    let deliveryAmount = 0;
    const deliveryBreakdown: Array<{ type: string; amount: number }> = [];
    for (const dc of deliveryCharges) {
      const amount =
        dc.chargeType === 'per_km' ? dc.amount * distanceKm : dc.amount;
      deliveryAmount += amount;
      deliveryBreakdown.push({ type: dc.chargeType, amount });
    }

    const subtotal  = basePrice;
    const totalTax  = taxAmount;
    const totalDelivery = deliveryAmount;
    const grandTotal = subtotal + totalTax + totalDelivery;

    return {
      zoneId,
      serviceId,
      packageId,
      currency:   pricing.currency,
      basePrice,
      minimumPrice: pricing.minimumPrice,
      maximumPrice: pricing.maximumPrice,
      taxAmount:  totalTax,
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
  static getAvailableVendors = catchServiceAsync(async (zoneId: number, serviceId?: number) => {
    const zones = await prisma.vendorServiceZone.findMany({
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
      vendor:          z.vendorService.vendor,
      serviceId:       z.vendorService.serviceId,
      serviceName:     z.vendorService.serviceName,
    }));
  });

  /**
   * resolveZoneFromCoords()
   * Given a lat/lng pair, resolves which Zone the point belongs to.
   * Checks GeoFences (radius) first, then ZonePolygons (point-in-polygon).
   */
  static resolveZoneFromCoords = catchServiceAsync(async (latitude: number, longitude: number) => {
    const matched: Array<{ zoneId: number; zoneName: string; zoneCode: string; method: string }> = [];

    // 1. Check GeoFences
    const fences = await prisma.geoFence.findMany({
      where: { status: 'active' },
      include: { zone: { select: { id: true, name: true, zoneCode: true } } },
    });
    for (const fence of fences) {
      const dist = haversineKm(latitude, longitude, fence.latitude, fence.longitude);
      if (dist <= fence.radius) {
        matched.push({
          zoneId:   fence.zone.id,
          zoneName: fence.zone.name,
          zoneCode: fence.zone.zoneCode,
          method:   'geofence',
        });
      }
    }

    // 2. Check Polygons (if no fence match)
    if (matched.length === 0) {
      const polygons = await prisma.zonePolygon.findMany({
        include: { zone: { select: { id: true, name: true, zoneCode: true } } },
      });
      for (const poly of polygons) {
        const coords = poly.polygonData as Array<{ lat: number; lng: number }>;
        if (Array.isArray(coords) && pointInPolygon(latitude, longitude, coords)) {
          matched.push({
            zoneId:   poly.zone.id,
            zoneName: poly.zone.name,
            zoneCode: poly.zone.zoneCode,
            method:   'polygon',
          });
        }
      }
    }

    return matched;
  });
}
