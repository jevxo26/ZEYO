// ─────────────────────────────────────────────────────────────────────────────
// LocationController
// Handles HTTP requests for Country, Division, District, City, Area endpoints.
// ─────────────────────────────────────────────────────────────────────────────
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { LocationService } from '../../services/location/locationService';

export class LocationController {

  // ── Countries ─────────────────────────────────────────────────────────────
  static getAllCountries = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.query as Record<string, string>;
    const data = await LocationService.getAllCountries(status);
    sendResponse(res, { statusCode: 200, data });
  });

  static getCountryById = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.getCountryById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Country not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static createCountry = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.createCountry(req.body);
    sendResponse(res, { statusCode: 201, message: 'Country created successfully', data });
  });

  static updateCountry = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.updateCountry(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Country updated successfully', data });
  });

  static deleteCountry = catchAsync(async (req: Request, res: Response) => {
    await LocationService.deleteCountry(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Country deleted successfully', data: null });
  });

  // ── Divisions ─────────────────────────────────────────────────────────────
  static getAllDivisions = catchAsync(async (req: Request, res: Response) => {
    const { countryId, status } = req.query as Record<string, string>;
    const data = await LocationService.getAllDivisions(countryId ? Number(countryId) : undefined, status);
    sendResponse(res, { statusCode: 200, data });
  });

  static getDivisionById = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.getDivisionById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Division not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static createDivision = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.createDivision(req.body);
    sendResponse(res, { statusCode: 201, message: 'Division created successfully', data });
  });

  static updateDivision = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.updateDivision(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Division updated successfully', data });
  });

  static deleteDivision = catchAsync(async (req: Request, res: Response) => {
    await LocationService.deleteDivision(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Division deleted successfully', data: null });
  });

  // ── Districts ─────────────────────────────────────────────────────────────
  static getAllDistricts = catchAsync(async (req: Request, res: Response) => {
    const { divisionId, status } = req.query as Record<string, string>;
    const data = await LocationService.getAllDistricts(divisionId ? Number(divisionId) : undefined, status);
    sendResponse(res, { statusCode: 200, data });
  });

  static getDistrictById = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.getDistrictById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'District not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static createDistrict = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.createDistrict(req.body);
    sendResponse(res, { statusCode: 201, message: 'District created successfully', data });
  });

  static updateDistrict = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.updateDistrict(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'District updated successfully', data });
  });

  static deleteDistrict = catchAsync(async (req: Request, res: Response) => {
    await LocationService.deleteDistrict(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'District deleted successfully', data: null });
  });

  // ── Cities ────────────────────────────────────────────────────────────────
  static getAllCities = catchAsync(async (req: Request, res: Response) => {
    const { districtId, status } = req.query as Record<string, string>;
    const data = await LocationService.getAllCities(districtId ? Number(districtId) : undefined, status);
    sendResponse(res, { statusCode: 200, data });
  });

  static getCityById = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.getCityById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'City not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static createCity = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.createCity(req.body);
    sendResponse(res, { statusCode: 201, message: 'City created successfully', data });
  });

  static updateCity = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.updateCity(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'City updated successfully', data });
  });

  static deleteCity = catchAsync(async (req: Request, res: Response) => {
    await LocationService.deleteCity(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'City deleted successfully', data: null });
  });

  // ── Areas ─────────────────────────────────────────────────────────────────
  static getAllAreas = catchAsync(async (req: Request, res: Response) => {
    const { cityId, status } = req.query as Record<string, string>;
    const data = await LocationService.getAllAreas(cityId ? Number(cityId) : undefined, status);
    sendResponse(res, { statusCode: 200, data });
  });

  static getAreaById = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.getAreaById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Area not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static createArea = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.createArea(req.body);
    sendResponse(res, { statusCode: 201, message: 'Area created successfully', data });
  });

  static updateArea = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.updateArea(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Area updated successfully', data });
  });

  static deleteArea = catchAsync(async (req: Request, res: Response) => {
    await LocationService.deleteArea(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Area deleted successfully', data: null });
  });

  // ── Full Hierarchy ─────────────────────────────────────────────────────────
  static getFullHierarchy = catchAsync(async (req: Request, res: Response) => {
    const data = await LocationService.getFullHierarchy(Number(req.params.countryId));
    if (!data) return res.status(404).json({ success: false, message: 'Country not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });
}
