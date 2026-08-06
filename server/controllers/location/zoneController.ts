// ─────────────────────────────────────────────────────────────────────────────
// ZoneController
// HTTP handlers for Zone and all sub-entities:
// ZonePricing, ZoneService, ZonePackage, ZoneHoliday, ZoneTax,
// ZoneDeliveryCharge, ZoneCoverage, ZonePolygon, GeoLocation,
// GeoFence, ZoneAnalytics, ZoneSetting, ServiceZone, ZoneGroup.
// Business logic endpoints: calculatePrice, getAvailableVendors, resolveZone.
// ─────────────────────────────────────────────────────────────────────────────
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ZoneService } from '../../services/location/zoneService';

export class ZoneController {

  // ── Zones ─────────────────────────────────────────────────────────────────
  static getAllZones = catchAsync(async (req: Request, res: Response) => {
    const { status, countryId, divisionId, districtId, cityId, zoneGroupId } = req.query as Record<string, string>;
    const data = await ZoneService.getAllZones({
      status,
      countryId:   countryId   ? Number(countryId)   : undefined,
      divisionId:  divisionId  ? Number(divisionId)  : undefined,
      districtId:  districtId  ? Number(districtId)  : undefined,
      cityId:      cityId      ? Number(cityId)      : undefined,
      zoneGroupId: zoneGroupId ? Number(zoneGroupId) : undefined,
    });
    sendResponse(res, { statusCode: 200, data });
  });

  static getZoneById = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getZoneById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Zone not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static createZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZone(req.body);
    sendResponse(res, { statusCode: 201, message: 'Zone created successfully', data });
  });

  static updateZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.updateZone(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Zone updated successfully', data });
  });

  static deleteZone = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Zone deleted successfully', data: null });
  });

  // ── ZoneGroups ────────────────────────────────────────────────────────────
  static getAllZoneGroups = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.query as Record<string, string>;
    const data = await ZoneService.getAllZoneGroups(status);
    sendResponse(res, { statusCode: 200, data });
  });

  static createZoneGroup = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZoneGroup(req.body);
    sendResponse(res, { statusCode: 201, message: 'ZoneGroup created successfully', data });
  });

  static updateZoneGroup = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.updateZoneGroup(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'ZoneGroup updated successfully', data });
  });

  static deleteZoneGroup = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZoneGroup(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'ZoneGroup deleted successfully', data: null });
  });

  // ── ZonePricing ───────────────────────────────────────────────────────────
  static getPricingByZone = catchAsync(async (req: Request, res: Response) => {
    const { serviceId } = req.query as Record<string, string>;
    const data = await ZoneService.getPricingByZone(
      Number(req.params.id),
      serviceId ? Number(serviceId) : undefined
    );
    sendResponse(res, { statusCode: 200, data });
  });

  static createZonePricing = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZonePricing({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Pricing created successfully', data });
  });

  static updateZonePricing = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.updateZonePricing(Number(req.params.pricingId), req.body);
    sendResponse(res, { statusCode: 200, message: 'Pricing updated successfully', data });
  });

  static deleteZonePricing = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZonePricing(Number(req.params.pricingId));
    sendResponse(res, { statusCode: 200, message: 'Pricing deleted successfully', data: null });
  });

  // ── ZoneService (availability) ────────────────────────────────────────────
  static getServicesByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getServicesByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static upsertZoneService = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.upsertZoneService({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 200, message: 'Zone service updated', data });
  });

  // ── ZonePackage ───────────────────────────────────────────────────────────
  static getPackagesByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getPackagesByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createZonePackage = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZonePackage({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Zone package created', data });
  });

  static updateZonePackage = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.updateZonePackage(Number(req.params.packageId), req.body);
    sendResponse(res, { statusCode: 200, message: 'Zone package updated', data });
  });

  static deleteZonePackage = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZonePackage(Number(req.params.packageId));
    sendResponse(res, { statusCode: 200, message: 'Zone package deleted', data: null });
  });

  // ── ZoneHoliday ───────────────────────────────────────────────────────────
  static getHolidaysByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getHolidaysByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createZoneHoliday = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZoneHoliday({
      ...req.body,
      zoneId: Number(req.params.id),
      holidayDate: new Date(req.body.holidayDate),
    });
    sendResponse(res, { statusCode: 201, message: 'Holiday created', data });
  });

  static deleteZoneHoliday = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZoneHoliday(Number(req.params.holidayId));
    sendResponse(res, { statusCode: 200, message: 'Holiday deleted', data: null });
  });

  // ── ZoneTax ───────────────────────────────────────────────────────────────
  static getTaxesByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getTaxesByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createZoneTax = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZoneTax({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Tax created', data });
  });

  static updateZoneTax = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.updateZoneTax(Number(req.params.taxId), req.body);
    sendResponse(res, { statusCode: 200, message: 'Tax updated', data });
  });

  static deleteZoneTax = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZoneTax(Number(req.params.taxId));
    sendResponse(res, { statusCode: 200, message: 'Tax deleted', data: null });
  });

  // ── ZoneDeliveryCharge ────────────────────────────────────────────────────
  static getDeliveryChargesByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getDeliveryChargesByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createZoneDeliveryCharge = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZoneDeliveryCharge({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Delivery charge created', data });
  });

  static deleteZoneDeliveryCharge = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZoneDeliveryCharge(Number(req.params.chargeId));
    sendResponse(res, { statusCode: 200, message: 'Delivery charge deleted', data: null });
  });

  // ── ZoneCoverage ──────────────────────────────────────────────────────────
  static getCoverageByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getCoverageByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createZoneCoverage = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZoneCoverage({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Coverage created', data });
  });

  static deleteZoneCoverage = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZoneCoverage(Number(req.params.coverageId));
    sendResponse(res, { statusCode: 200, message: 'Coverage deleted', data: null });
  });

  // ── ZonePolygon ───────────────────────────────────────────────────────────
  static getPolygonsByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getPolygonsByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createZonePolygon = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createZonePolygon({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Polygon created', data });
  });

  static deleteZonePolygon = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteZonePolygon(Number(req.params.polygonId));
    sendResponse(res, { statusCode: 200, message: 'Polygon deleted', data: null });
  });

  // ── GeoLocation ───────────────────────────────────────────────────────────
  static getGeoLocationsByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getGeoLocationsByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createGeoLocation = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createGeoLocation({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'GeoLocation created', data });
  });

  // ── GeoFence ──────────────────────────────────────────────────────────────
  static getGeoFencesByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getGeoFencesByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static createGeoFence = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createGeoFence({ ...req.body, zoneId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'GeoFence created', data });
  });

  static deleteGeoFence = catchAsync(async (req: Request, res: Response) => {
    await ZoneService.deleteGeoFence(Number(req.params.fenceId));
    sendResponse(res, { statusCode: 200, message: 'GeoFence deleted', data: null });
  });

  // ── ZoneAnalytics ─────────────────────────────────────────────────────────
  static getAnalyticsByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getAnalyticsByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static updateZoneAnalytics = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.updateZoneAnalytics(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Analytics updated', data });
  });

  // ── ZoneSetting ───────────────────────────────────────────────────────────
  static getSettingByZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getSettingByZone(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static upsertZoneSetting = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.upsertZoneSetting(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Zone settings updated', data });
  });

  // ── ServiceZone ───────────────────────────────────────────────────────────
  static getZonesByService = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.getZonesByService(Number(req.params.serviceId));
    sendResponse(res, { statusCode: 200, data });
  });

  static createServiceZone = catchAsync(async (req: Request, res: Response) => {
    const data = await ZoneService.createServiceZone(req.body);
    sendResponse(res, { statusCode: 201, message: 'Service zone mapping created', data });
  });

  // ── Vendors in Zone ───────────────────────────────────────────────────────
  static getAvailableVendors = catchAsync(async (req: Request, res: Response) => {
    const { serviceId } = req.query as Record<string, string>;
    const data = await ZoneService.getAvailableVendors(
      Number(req.params.id),
      serviceId ? Number(serviceId) : undefined
    );
    sendResponse(res, { statusCode: 200, data });
  });

  // ── ⭐ Smart Pricing Calculator ────────────────────────────────────────────
  static calculatePrice = catchAsync(async (req: Request, res: Response) => {
    const { zoneId, serviceId, packageId, distanceKm } = req.body;
    if (!zoneId || !serviceId) {
      return res.status(400).json({ success: false, message: 'zoneId and serviceId are required', data: null });
    }
    const data = await ZoneService.calculatePrice({
      zoneId:     Number(zoneId),
      serviceId:  Number(serviceId),
      packageId:  packageId  ? Number(packageId)  : undefined,
      distanceKm: distanceKm ? Number(distanceKm) : 0,
    });
    sendResponse(res, { statusCode: 200, data });
  });

  // ── Resolve Zone from Coordinates ─────────────────────────────────────────
  static resolveZone = catchAsync(async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'latitude and longitude are required', data: null });
    }
    const data = await ZoneService.resolveZoneFromCoords(Number(latitude), Number(longitude));
    sendResponse(res, { statusCode: 200, data });
  });
}
