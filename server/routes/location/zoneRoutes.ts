// ─────────────────────────────────────────────────────────────────────────────
// Zone Routes
// Base: /api/zones
//
// Public: GET zones, GET zone by id, calculate price, resolve zone from coords
// Admin:  full CRUD on zones and all sub-entities
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express';
import { ZoneController } from '../../controllers/location/zoneController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// ── Business Logic (Public) ───────────────────────────────────────────────────
// ⭐ Smart pricing calculator: POST /api/zones/calculate-price
router.post('/calculate-price',      ZoneController.calculatePrice);
// Resolve which zone a coordinate belongs to: POST /api/zones/resolve
router.post('/resolve',              ZoneController.resolveZone);
// Service-to-Zone mapping: GET /api/zones/service/:serviceId
router.get('/service/:serviceId',    ZoneController.getZonesByService);

// ── ZoneGroups ────────────────────────────────────────────────────────────────
router.get('/groups',                ZoneController.getAllZoneGroups);
router.post('/groups',               verifyToken, requireRole('admin', 'manager'), ZoneController.createZoneGroup);
router.put('/groups/:id',            verifyToken, requireRole('admin', 'manager'), ZoneController.updateZoneGroup);
router.delete('/groups/:id',         verifyToken, requireRole('admin'),             ZoneController.deleteZoneGroup);

// ── Zone ServiceZone mapping ──────────────────────────────────────────────────
router.post('/service-zones',        verifyToken, requireRole('admin', 'manager'), ZoneController.createServiceZone);

// ── Zone CRUD ────────────────────────────────────────────────────────────────
router.get('/',                      ZoneController.getAllZones);
router.get('/:id',                   ZoneController.getZoneById);
router.post('/',                     verifyToken, requireRole('admin', 'manager'), ZoneController.createZone);
router.put('/:id',                   verifyToken, requireRole('admin', 'manager'), ZoneController.updateZone);
router.delete('/:id',                verifyToken, requireRole('admin'),             ZoneController.deleteZone);

// ── ZonePricing ───────────────────────────────────────────────────────────────
router.get('/:id/pricing',           ZoneController.getPricingByZone);
router.post('/:id/pricing',          verifyToken, requireRole('admin', 'manager'), ZoneController.createZonePricing);
router.put('/:id/pricing/:pricingId',verifyToken, requireRole('admin', 'manager'), ZoneController.updateZonePricing);
router.delete('/:id/pricing/:pricingId', verifyToken, requireRole('admin'),        ZoneController.deleteZonePricing);

// ── ZoneService (availability) ────────────────────────────────────────────────
router.get('/:id/services',          ZoneController.getServicesByZone);
router.post('/:id/services',         verifyToken, requireRole('admin', 'manager'), ZoneController.upsertZoneService);

// ── ZonePackage ───────────────────────────────────────────────────────────────
router.get('/:id/packages',          ZoneController.getPackagesByZone);
router.post('/:id/packages',         verifyToken, requireRole('admin', 'manager'), ZoneController.createZonePackage);
router.put('/:id/packages/:packageId', verifyToken, requireRole('admin', 'manager'), ZoneController.updateZonePackage);
router.delete('/:id/packages/:packageId', verifyToken, requireRole('admin'),       ZoneController.deleteZonePackage);

// ── ZoneHoliday ───────────────────────────────────────────────────────────────
router.get('/:id/holidays',          ZoneController.getHolidaysByZone);
router.post('/:id/holidays',         verifyToken, requireRole('admin', 'manager'), ZoneController.createZoneHoliday);
router.delete('/:id/holidays/:holidayId', verifyToken, requireRole('admin'),      ZoneController.deleteZoneHoliday);

// ── ZoneTax ───────────────────────────────────────────────────────────────────
router.get('/:id/taxes',             ZoneController.getTaxesByZone);
router.post('/:id/taxes',            verifyToken, requireRole('admin', 'manager'), ZoneController.createZoneTax);
router.put('/:id/taxes/:taxId',      verifyToken, requireRole('admin', 'manager'), ZoneController.updateZoneTax);
router.delete('/:id/taxes/:taxId',   verifyToken, requireRole('admin'),            ZoneController.deleteZoneTax);

// ── ZoneDeliveryCharge ────────────────────────────────────────────────────────
router.get('/:id/delivery-charges',  ZoneController.getDeliveryChargesByZone);
router.post('/:id/delivery-charges', verifyToken, requireRole('admin', 'manager'), ZoneController.createZoneDeliveryCharge);
router.delete('/:id/delivery-charges/:chargeId', verifyToken, requireRole('admin'), ZoneController.deleteZoneDeliveryCharge);

// ── ZoneCoverage ──────────────────────────────────────────────────────────────
router.get('/:id/coverage',          ZoneController.getCoverageByZone);
router.post('/:id/coverage',         verifyToken, requireRole('admin', 'manager'), ZoneController.createZoneCoverage);
router.delete('/:id/coverage/:coverageId', verifyToken, requireRole('admin'),     ZoneController.deleteZoneCoverage);

// ── ZonePolygon ───────────────────────────────────────────────────────────────
router.get('/:id/polygons',          ZoneController.getPolygonsByZone);
router.post('/:id/polygons',         verifyToken, requireRole('admin', 'manager'), ZoneController.createZonePolygon);
router.delete('/:id/polygons/:polygonId', verifyToken, requireRole('admin'),      ZoneController.deleteZonePolygon);

// ── GeoLocation ───────────────────────────────────────────────────────────────
router.get('/:id/geo-locations',     ZoneController.getGeoLocationsByZone);
router.post('/:id/geo-locations',    verifyToken, requireRole('admin', 'manager'), ZoneController.createGeoLocation);

// ── GeoFence ──────────────────────────────────────────────────────────────────
router.get('/:id/geo-fences',        ZoneController.getGeoFencesByZone);
router.post('/:id/geo-fences',       verifyToken, requireRole('admin', 'manager'), ZoneController.createGeoFence);
router.delete('/:id/geo-fences/:fenceId', verifyToken, requireRole('admin'),      ZoneController.deleteGeoFence);

// ── ZoneAnalytics ─────────────────────────────────────────────────────────────
router.get('/:id/analytics',         ZoneController.getAnalyticsByZone);
router.put('/:id/analytics',         verifyToken, requireRole('admin', 'manager'), ZoneController.updateZoneAnalytics);

// ── ZoneSetting ───────────────────────────────────────────────────────────────
router.get('/:id/settings',          ZoneController.getSettingByZone);
router.put('/:id/settings',          verifyToken, requireRole('admin', 'manager'), ZoneController.upsertZoneSetting);

// ── Vendors in Zone ───────────────────────────────────────────────────────────
router.get('/:id/vendors',           ZoneController.getAvailableVendors);

export default router;
