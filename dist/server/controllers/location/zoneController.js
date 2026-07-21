"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const zoneService_1 = require("../../services/location/zoneService");
class ZoneController {
}
exports.ZoneController = ZoneController;
_a = ZoneController;
// ── Zones ─────────────────────────────────────────────────────────────────
ZoneController.getAllZones = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, countryId, divisionId, districtId, cityId, zoneGroupId } = req.query;
    const data = await zoneService_1.ZoneService.getAllZones({
        status,
        countryId: countryId ? Number(countryId) : undefined,
        divisionId: divisionId ? Number(divisionId) : undefined,
        districtId: districtId ? Number(districtId) : undefined,
        cityId: cityId ? Number(cityId) : undefined,
        zoneGroupId: zoneGroupId ? Number(zoneGroupId) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.getZoneById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getZoneById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Zone not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZone(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Zone created successfully', data });
});
ZoneController.updateZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.updateZone(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone updated successfully', data });
});
ZoneController.deleteZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone deleted successfully', data: null });
});
// ── ZoneGroups ────────────────────────────────────────────────────────────
ZoneController.getAllZoneGroups = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.query;
    const data = await zoneService_1.ZoneService.getAllZoneGroups(status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZoneGroup = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZoneGroup(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'ZoneGroup created successfully', data });
});
ZoneController.updateZoneGroup = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.updateZoneGroup(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'ZoneGroup updated successfully', data });
});
ZoneController.deleteZoneGroup = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZoneGroup(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'ZoneGroup deleted successfully', data: null });
});
// ── ZonePricing ───────────────────────────────────────────────────────────
ZoneController.getPricingByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { serviceId } = req.query;
    const data = await zoneService_1.ZoneService.getPricingByZone(Number(req.params.id), serviceId ? Number(serviceId) : undefined);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZonePricing(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Pricing created successfully', data });
});
ZoneController.updateZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.updateZonePricing(Number(req.params.pricingId), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Pricing updated successfully', data });
});
ZoneController.deleteZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZonePricing(Number(req.params.pricingId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Pricing deleted successfully', data: null });
});
// ── ZoneService (availability) ────────────────────────────────────────────
ZoneController.getServicesByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getServicesByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.upsertZoneService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.upsertZoneService(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone service updated', data });
});
// ── ZonePackage ───────────────────────────────────────────────────────────
ZoneController.getPackagesByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getPackagesByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZonePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZonePackage(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Zone package created', data });
});
ZoneController.updateZonePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.updateZonePackage(Number(req.params.packageId), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone package updated', data });
});
ZoneController.deleteZonePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZonePackage(Number(req.params.packageId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone package deleted', data: null });
});
// ── ZoneHoliday ───────────────────────────────────────────────────────────
ZoneController.getHolidaysByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getHolidaysByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZoneHoliday = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZoneHoliday(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id), holidayDate: new Date(req.body.holidayDate) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Holiday created', data });
});
ZoneController.deleteZoneHoliday = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZoneHoliday(Number(req.params.holidayId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Holiday deleted', data: null });
});
// ── ZoneTax ───────────────────────────────────────────────────────────────
ZoneController.getTaxesByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getTaxesByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZoneTax = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZoneTax(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Tax created', data });
});
ZoneController.updateZoneTax = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.updateZoneTax(Number(req.params.taxId), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Tax updated', data });
});
ZoneController.deleteZoneTax = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZoneTax(Number(req.params.taxId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Tax deleted', data: null });
});
// ── ZoneDeliveryCharge ────────────────────────────────────────────────────
ZoneController.getDeliveryChargesByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getDeliveryChargesByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZoneDeliveryCharge = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZoneDeliveryCharge(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Delivery charge created', data });
});
ZoneController.deleteZoneDeliveryCharge = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZoneDeliveryCharge(Number(req.params.chargeId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Delivery charge deleted', data: null });
});
// ── ZoneCoverage ──────────────────────────────────────────────────────────
ZoneController.getCoverageByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getCoverageByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZoneCoverage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZoneCoverage(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Coverage created', data });
});
ZoneController.deleteZoneCoverage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZoneCoverage(Number(req.params.coverageId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Coverage deleted', data: null });
});
// ── ZonePolygon ───────────────────────────────────────────────────────────
ZoneController.getPolygonsByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getPolygonsByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createZonePolygon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createZonePolygon(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Polygon created', data });
});
ZoneController.deleteZonePolygon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteZonePolygon(Number(req.params.polygonId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Polygon deleted', data: null });
});
// ── GeoLocation ───────────────────────────────────────────────────────────
ZoneController.getGeoLocationsByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getGeoLocationsByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createGeoLocation = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createGeoLocation(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'GeoLocation created', data });
});
// ── GeoFence ──────────────────────────────────────────────────────────────
ZoneController.getGeoFencesByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getGeoFencesByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createGeoFence = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createGeoFence(Object.assign(Object.assign({}, req.body), { zoneId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'GeoFence created', data });
});
ZoneController.deleteGeoFence = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await zoneService_1.ZoneService.deleteGeoFence(Number(req.params.fenceId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'GeoFence deleted', data: null });
});
// ── ZoneAnalytics ─────────────────────────────────────────────────────────
ZoneController.getAnalyticsByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getAnalyticsByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.updateZoneAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.updateZoneAnalytics(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Analytics updated', data });
});
// ── ZoneSetting ───────────────────────────────────────────────────────────
ZoneController.getSettingByZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getSettingByZone(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.upsertZoneSetting = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.upsertZoneSetting(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone settings updated', data });
});
// ── ServiceZone ───────────────────────────────────────────────────────────
ZoneController.getZonesByService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.getZonesByService(Number(req.params.serviceId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ZoneController.createServiceZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await zoneService_1.ZoneService.createServiceZone(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Service zone mapping created', data });
});
// ── Vendors in Zone ───────────────────────────────────────────────────────
ZoneController.getAvailableVendors = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { serviceId } = req.query;
    const data = await zoneService_1.ZoneService.getAvailableVendors(Number(req.params.id), serviceId ? Number(serviceId) : undefined);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── ⭐ Smart Pricing Calculator ────────────────────────────────────────────
ZoneController.calculatePrice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { zoneId, serviceId, packageId, distanceKm } = req.body;
    if (!zoneId || !serviceId) {
        return res.status(400).json({ success: false, message: 'zoneId and serviceId are required', data: null });
    }
    const data = await zoneService_1.ZoneService.calculatePrice({
        zoneId: Number(zoneId),
        serviceId: Number(serviceId),
        packageId: packageId ? Number(packageId) : undefined,
        distanceKm: distanceKm ? Number(distanceKm) : 0,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── Resolve Zone from Coordinates ─────────────────────────────────────────
ZoneController.resolveZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ success: false, message: 'latitude and longitude are required', data: null });
    }
    const data = await zoneService_1.ZoneService.resolveZoneFromCoords(Number(latitude), Number(longitude));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
