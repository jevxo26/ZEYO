"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const locationService_1 = require("../../services/location/locationService");
class LocationController {
}
exports.LocationController = LocationController;
_a = LocationController;
// ── Countries ─────────────────────────────────────────────────────────────
LocationController.getAllCountries = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.query;
    const data = await locationService_1.LocationService.getAllCountries(status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.getCountryById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.getCountryById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Country not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.createCountry = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.createCountry(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Country created successfully', data });
});
LocationController.updateCountry = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.updateCountry(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Country updated successfully', data });
});
LocationController.deleteCountry = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await locationService_1.LocationService.deleteCountry(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Country deleted successfully', data: null });
});
// ── Divisions ─────────────────────────────────────────────────────────────
LocationController.getAllDivisions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { countryId, status } = req.query;
    const data = await locationService_1.LocationService.getAllDivisions(countryId ? Number(countryId) : undefined, status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.getDivisionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.getDivisionById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Division not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.createDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.createDivision(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Division created successfully', data });
});
LocationController.updateDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.updateDivision(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Division updated successfully', data });
});
LocationController.deleteDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await locationService_1.LocationService.deleteDivision(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Division deleted successfully', data: null });
});
// ── Districts ─────────────────────────────────────────────────────────────
LocationController.getAllDistricts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { divisionId, status } = req.query;
    const data = await locationService_1.LocationService.getAllDistricts(divisionId ? Number(divisionId) : undefined, status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.getDistrictById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.getDistrictById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'District not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.createDistrict = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.createDistrict(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'District created successfully', data });
});
LocationController.updateDistrict = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.updateDistrict(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'District updated successfully', data });
});
LocationController.deleteDistrict = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await locationService_1.LocationService.deleteDistrict(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'District deleted successfully', data: null });
});
// ── Cities ────────────────────────────────────────────────────────────────
LocationController.getAllCities = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { districtId, status } = req.query;
    const data = await locationService_1.LocationService.getAllCities(districtId ? Number(districtId) : undefined, status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.getCityById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.getCityById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'City not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.createCity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.createCity(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'City created successfully', data });
});
LocationController.updateCity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.updateCity(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'City updated successfully', data });
});
LocationController.deleteCity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await locationService_1.LocationService.deleteCity(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'City deleted successfully', data: null });
});
// ── Areas ─────────────────────────────────────────────────────────────────
LocationController.getAllAreas = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { cityId, status } = req.query;
    const data = await locationService_1.LocationService.getAllAreas(cityId ? Number(cityId) : undefined, status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.getAreaById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.getAreaById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Area not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
LocationController.createArea = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.createArea(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Area created successfully', data });
});
LocationController.updateArea = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.updateArea(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Area updated successfully', data });
});
LocationController.deleteArea = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await locationService_1.LocationService.deleteArea(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Area deleted successfully', data: null });
});
// ── Full Hierarchy ─────────────────────────────────────────────────────────
LocationController.getFullHierarchy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await locationService_1.LocationService.getFullHierarchy(Number(req.params.countryId));
    if (!data)
        return res.status(404).json({ success: false, message: 'Country not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
