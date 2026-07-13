// ─────────────────────────────────────────────────────────────────────────────
// Location Routes
// Base: /api/locations
// Public: GET all, GET by id, GET hierarchy
// Admin: POST, PUT, DELETE (protected by verifyToken + requireRole)
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express';
import { LocationController } from '../../controllers/location/locationController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// ── Countries ────────────────────────────────────────────────────────────────
router.get('/countries',                     LocationController.getAllCountries);
router.get('/countries/:id',                 LocationController.getCountryById);
router.get('/countries/:countryId/hierarchy',LocationController.getFullHierarchy);
router.post('/countries',    verifyToken, requireRole('admin', 'manager'), LocationController.createCountry);
router.put('/countries/:id', verifyToken, requireRole('admin', 'manager'), LocationController.updateCountry);
router.delete('/countries/:id', verifyToken, requireRole('admin'),         LocationController.deleteCountry);

// ── Divisions ────────────────────────────────────────────────────────────────
router.get('/divisions',       LocationController.getAllDivisions);
router.get('/divisions/:id',   LocationController.getDivisionById);
router.post('/divisions',    verifyToken, requireRole('admin', 'manager'), LocationController.createDivision);
router.put('/divisions/:id', verifyToken, requireRole('admin', 'manager'), LocationController.updateDivision);
router.delete('/divisions/:id', verifyToken, requireRole('admin'),         LocationController.deleteDivision);

// ── Districts ────────────────────────────────────────────────────────────────
router.get('/districts',       LocationController.getAllDistricts);
router.get('/districts/:id',   LocationController.getDistrictById);
router.post('/districts',    verifyToken, requireRole('admin', 'manager'), LocationController.createDistrict);
router.put('/districts/:id', verifyToken, requireRole('admin', 'manager'), LocationController.updateDistrict);
router.delete('/districts/:id', verifyToken, requireRole('admin'),         LocationController.deleteDistrict);

// ── Cities ───────────────────────────────────────────────────────────────────
router.get('/cities',       LocationController.getAllCities);
router.get('/cities/:id',   LocationController.getCityById);
router.post('/cities',    verifyToken, requireRole('admin', 'manager'), LocationController.createCity);
router.put('/cities/:id', verifyToken, requireRole('admin', 'manager'), LocationController.updateCity);
router.delete('/cities/:id', verifyToken, requireRole('admin'),         LocationController.deleteCity);

// ── Areas ────────────────────────────────────────────────────────────────────
router.get('/areas',       LocationController.getAllAreas);
router.get('/areas/:id',   LocationController.getAreaById);
router.post('/areas',    verifyToken, requireRole('admin', 'manager'), LocationController.createArea);
router.put('/areas/:id', verifyToken, requireRole('admin', 'manager'), LocationController.updateArea);
router.delete('/areas/:id', verifyToken, requireRole('admin'),         LocationController.deleteArea);

export default router;
