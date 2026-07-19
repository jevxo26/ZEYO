"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ─────────────────────────────────────────────────────────────────────────────
// Zone Routes
// Base: /api/zones
//
// Public: GET zones, GET zone by id, calculate price, resolve zone from coords
// Admin:  full CRUD on zones and all sub-entities
// ─────────────────────────────────────────────────────────────────────────────
const express_1 = require("express");
const zoneController_1 = require("../../controllers/location/zoneController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// ── Business Logic (Public) ───────────────────────────────────────────────────
// ⭐ Smart pricing calculator: POST /api/zones/calculate-price
router.post('/calculate-price', zoneController_1.ZoneController.calculatePrice);
// Resolve which zone a coordinate belongs to: POST /api/zones/resolve
router.post('/resolve', zoneController_1.ZoneController.resolveZone);
// Service-to-Zone mapping: GET /api/zones/service/:serviceId
router.get('/service/:serviceId', zoneController_1.ZoneController.getZonesByService);
// ── ZoneGroups ────────────────────────────────────────────────────────────────
router.get('/groups', zoneController_1.ZoneController.getAllZoneGroups);
router.post('/groups', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZoneGroup);
router.put('/groups/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.updateZoneGroup);
router.delete('/groups/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZoneGroup);
// ── Zone ServiceZone mapping ──────────────────────────────────────────────────
router.post('/service-zones', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createServiceZone);
// ── Zone CRUD ────────────────────────────────────────────────────────────────
router.get('/', zoneController_1.ZoneController.getAllZones);
router.get('/:id', zoneController_1.ZoneController.getZoneById);
router.post('/', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZone);
router.put('/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.updateZone);
router.delete('/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZone);
// ── ZonePricing ───────────────────────────────────────────────────────────────
router.get('/:id/pricing', zoneController_1.ZoneController.getPricingByZone);
router.post('/:id/pricing', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZonePricing);
router.put('/:id/pricing/:pricingId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.updateZonePricing);
router.delete('/:id/pricing/:pricingId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZonePricing);
// ── ZoneService (availability) ────────────────────────────────────────────────
router.get('/:id/services', zoneController_1.ZoneController.getServicesByZone);
router.post('/:id/services', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.upsertZoneService);
// ── ZonePackage ───────────────────────────────────────────────────────────────
router.get('/:id/packages', zoneController_1.ZoneController.getPackagesByZone);
router.post('/:id/packages', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZonePackage);
router.put('/:id/packages/:packageId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.updateZonePackage);
router.delete('/:id/packages/:packageId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZonePackage);
// ── ZoneHoliday ───────────────────────────────────────────────────────────────
router.get('/:id/holidays', zoneController_1.ZoneController.getHolidaysByZone);
router.post('/:id/holidays', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZoneHoliday);
router.delete('/:id/holidays/:holidayId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZoneHoliday);
// ── ZoneTax ───────────────────────────────────────────────────────────────────
router.get('/:id/taxes', zoneController_1.ZoneController.getTaxesByZone);
router.post('/:id/taxes', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZoneTax);
router.put('/:id/taxes/:taxId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.updateZoneTax);
router.delete('/:id/taxes/:taxId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZoneTax);
// ── ZoneDeliveryCharge ────────────────────────────────────────────────────────
router.get('/:id/delivery-charges', zoneController_1.ZoneController.getDeliveryChargesByZone);
router.post('/:id/delivery-charges', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZoneDeliveryCharge);
router.delete('/:id/delivery-charges/:chargeId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZoneDeliveryCharge);
// ── ZoneCoverage ──────────────────────────────────────────────────────────────
router.get('/:id/coverage', zoneController_1.ZoneController.getCoverageByZone);
router.post('/:id/coverage', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZoneCoverage);
router.delete('/:id/coverage/:coverageId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZoneCoverage);
// ── ZonePolygon ───────────────────────────────────────────────────────────────
router.get('/:id/polygons', zoneController_1.ZoneController.getPolygonsByZone);
router.post('/:id/polygons', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createZonePolygon);
router.delete('/:id/polygons/:polygonId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteZonePolygon);
// ── GeoLocation ───────────────────────────────────────────────────────────────
router.get('/:id/geo-locations', zoneController_1.ZoneController.getGeoLocationsByZone);
router.post('/:id/geo-locations', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createGeoLocation);
// ── GeoFence ──────────────────────────────────────────────────────────────────
router.get('/:id/geo-fences', zoneController_1.ZoneController.getGeoFencesByZone);
router.post('/:id/geo-fences', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.createGeoFence);
router.delete('/:id/geo-fences/:fenceId', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), zoneController_1.ZoneController.deleteGeoFence);
// ── ZoneAnalytics ─────────────────────────────────────────────────────────────
router.get('/:id/analytics', zoneController_1.ZoneController.getAnalyticsByZone);
router.put('/:id/analytics', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.updateZoneAnalytics);
// ── ZoneSetting ───────────────────────────────────────────────────────────────
router.get('/:id/settings', zoneController_1.ZoneController.getSettingByZone);
router.put('/:id/settings', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), zoneController_1.ZoneController.upsertZoneSetting);
// ── Vendors in Zone ───────────────────────────────────────────────────────────
router.get('/:id/vendors', zoneController_1.ZoneController.getAvailableVendors);
exports.default = router;
