"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ─────────────────────────────────────────────────────────────────────────────
// Location Routes
// Base: /api/locations
// Public: GET all, GET by id, GET hierarchy
// Admin: POST, PUT, DELETE (protected by verifyToken + requireRole)
// ─────────────────────────────────────────────────────────────────────────────
const express_1 = require("express");
const locationController_1 = require("../../controllers/location/locationController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// ── Countries ────────────────────────────────────────────────────────────────
router.get('/countries', locationController_1.LocationController.getAllCountries);
router.get('/countries/:id', locationController_1.LocationController.getCountryById);
router.get('/countries/:countryId/hierarchy', locationController_1.LocationController.getFullHierarchy);
router.post('/countries', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.createCountry);
router.put('/countries/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.updateCountry);
router.delete('/countries/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), locationController_1.LocationController.deleteCountry);
// ── Divisions ────────────────────────────────────────────────────────────────
router.get('/divisions', locationController_1.LocationController.getAllDivisions);
router.get('/divisions/:id', locationController_1.LocationController.getDivisionById);
router.post('/divisions', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.createDivision);
router.put('/divisions/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.updateDivision);
router.delete('/divisions/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), locationController_1.LocationController.deleteDivision);
// ── Districts ────────────────────────────────────────────────────────────────
router.get('/districts', locationController_1.LocationController.getAllDistricts);
router.get('/districts/:id', locationController_1.LocationController.getDistrictById);
router.post('/districts', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.createDistrict);
router.put('/districts/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.updateDistrict);
router.delete('/districts/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), locationController_1.LocationController.deleteDistrict);
// ── Cities ───────────────────────────────────────────────────────────────────
router.get('/cities', locationController_1.LocationController.getAllCities);
router.get('/cities/:id', locationController_1.LocationController.getCityById);
router.post('/cities', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.createCity);
router.put('/cities/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.updateCity);
router.delete('/cities/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), locationController_1.LocationController.deleteCity);
// ── Areas ────────────────────────────────────────────────────────────────────
router.get('/areas', locationController_1.LocationController.getAllAreas);
router.get('/areas/:id', locationController_1.LocationController.getAreaById);
router.post('/areas', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.createArea);
router.put('/areas/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'), locationController_1.LocationController.updateArea);
router.delete('/areas/:id', authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin'), locationController_1.LocationController.deleteArea);
exports.default = router;
