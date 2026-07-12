import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { EventService } from '../../services/event/eventService';

export class EventController {

  // ─── Event ─────────────────────────────────────────────────────────────────

  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.query as Record<string, string>;
    const events = await EventService.getAll({ status });
    sendResponse(res, { statusCode: 200, data: events });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const event = await EventService.getById(Number(req.params.id));
    if (!event) return res.status(404).json({ success: false, message: 'Event not found', data: null });
    sendResponse(res, { statusCode: 200, data: event });
  });

  static getBySlug = catchAsync(async (req: Request, res: Response) => {
    const event = await EventService.getBySlug(String(req.params.slug));
    if (!event) return res.status(404).json({ success: false, message: 'Event not found', data: null });
    sendResponse(res, { statusCode: 200, data: event });
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const event = await EventService.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Event created successfully', data: event });
  });

  static update = catchAsync(async (req: Request, res: Response) => {
    const event = await EventService.update(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Event updated successfully', data: event });
  });

  static delete = catchAsync(async (req: Request, res: Response) => {
    await EventService.softDelete(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Event deleted successfully', data: null });
  });

  // ─── Category ──────────────────────────────────────────────────────────────

  static getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.query as Record<string, string>;
    const categories = await EventService.getAllCategories(eventId ? Number(eventId) : undefined);
    sendResponse(res, { statusCode: 200, data: categories });
  });

  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const cat = await EventService.createCategory(req.body);
    sendResponse(res, { statusCode: 201, message: 'Category created', data: cat });
  });

  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const cat = await EventService.updateCategory(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Category updated', data: cat });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await EventService.deleteCategory(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Category deleted', data: null });
  });

  // ─── SubCategory ───────────────────────────────────────────────────────────

  static createSubCategory = catchAsync(async (req: Request, res: Response) => {
    const sub = await EventService.createSubCategory(req.body);
    sendResponse(res, { statusCode: 201, message: 'Sub-category created', data: sub });
  });

  static updateSubCategory = catchAsync(async (req: Request, res: Response) => {
    const sub = await EventService.updateSubCategory(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Sub-category updated', data: sub });
  });

  static deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
    await EventService.deleteSubCategory(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Sub-category deleted', data: null });
  });

  // ─── Type ──────────────────────────────────────────────────────────────────

  static getTypes = catchAsync(async (req: Request, res: Response) => {
    const types = await EventService.getTypes(Number(req.params.eventId));
    sendResponse(res, { statusCode: 200, data: types });
  });

  static createType = catchAsync(async (req: Request, res: Response) => {
    const type = await EventService.createType(req.body);
    sendResponse(res, { statusCode: 201, message: 'Event type created', data: type });
  });

  static updateType = catchAsync(async (req: Request, res: Response) => {
    const type = await EventService.updateType(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Event type updated', data: type });
  });

  static deleteType = catchAsync(async (req: Request, res: Response) => {
    await EventService.deleteType(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Event type deleted', data: null });
  });

  // ─── Theme ─────────────────────────────────────────────────────────────────

  static getThemes = catchAsync(async (req: Request, res: Response) => {
    const themes = await EventService.getThemes(Number(req.params.eventId));
    sendResponse(res, { statusCode: 200, data: themes });
  });

  static createTheme = catchAsync(async (req: Request, res: Response) => {
    const theme = await EventService.createTheme(req.body);
    sendResponse(res, { statusCode: 201, message: 'Theme created', data: theme });
  });

  static updateTheme = catchAsync(async (req: Request, res: Response) => {
    const theme = await EventService.updateTheme(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Theme updated', data: theme });
  });

  static deleteTheme = catchAsync(async (req: Request, res: Response) => {
    await EventService.deleteTheme(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Theme deleted', data: null });
  });

  // ─── PackageType ───────────────────────────────────────────────────────────

  static getPackageTypes = catchAsync(async (req: Request, res: Response) => {
    const pts = await EventService.getPackageTypes(Number(req.params.eventId));
    sendResponse(res, { statusCode: 200, data: pts });
  });

  static createPackageType = catchAsync(async (req: Request, res: Response) => {
    const pt = await EventService.createPackageType(req.body);
    sendResponse(res, { statusCode: 201, message: 'Package type created', data: pt });
  });

  static updatePackageType = catchAsync(async (req: Request, res: Response) => {
    const pt = await EventService.updatePackageType(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Package type updated', data: pt });
  });

  static deletePackageType = catchAsync(async (req: Request, res: Response) => {
    await EventService.deletePackageType(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Package type deleted', data: null });
  });
}
