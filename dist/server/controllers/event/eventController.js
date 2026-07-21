"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const eventService_1 = require("../../services/event/eventService");
class EventController {
}
exports.EventController = EventController;
_a = EventController;
// ─── Event ─────────────────────────────────────────────────────────────────
EventController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.query;
    const events = await eventService_1.EventService.getAll({ status });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: events });
});
EventController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const event = await eventService_1.EventService.getById(Number(req.params.id));
    if (!event)
        return res.status(404).json({ success: false, message: 'Event not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: event });
});
EventController.getBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const event = await eventService_1.EventService.getBySlug(String(req.params.slug));
    if (!event)
        return res.status(404).json({ success: false, message: 'Event not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: event });
});
EventController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const event = await eventService_1.EventService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Event created successfully', data: event });
});
EventController.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const event = await eventService_1.EventService.update(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Event updated successfully', data: event });
});
EventController.delete = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await eventService_1.EventService.softDelete(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Event deleted successfully', data: null });
});
// ─── Category ──────────────────────────────────────────────────────────────
EventController.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { eventId } = req.query;
    const categories = await eventService_1.EventService.getAllCategories(eventId ? Number(eventId) : undefined);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: categories });
});
EventController.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const cat = await eventService_1.EventService.createCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Category created', data: cat });
});
EventController.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const cat = await eventService_1.EventService.updateCategory(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Category updated', data: cat });
});
EventController.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await eventService_1.EventService.deleteCategory(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Category deleted', data: null });
});
// ─── SubCategory ───────────────────────────────────────────────────────────
EventController.createSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sub = await eventService_1.EventService.createSubCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Sub-category created', data: sub });
});
EventController.updateSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sub = await eventService_1.EventService.updateSubCategory(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Sub-category updated', data: sub });
});
EventController.deleteSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await eventService_1.EventService.deleteSubCategory(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Sub-category deleted', data: null });
});
// ─── Type ──────────────────────────────────────────────────────────────────
EventController.getTypes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const types = await eventService_1.EventService.getTypes(Number(req.params.eventId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: types });
});
EventController.createType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const type = await eventService_1.EventService.createType(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Event type created', data: type });
});
EventController.updateType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const type = await eventService_1.EventService.updateType(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Event type updated', data: type });
});
EventController.deleteType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await eventService_1.EventService.deleteType(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Event type deleted', data: null });
});
// ─── Theme ─────────────────────────────────────────────────────────────────
EventController.getThemes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const themes = await eventService_1.EventService.getThemes(Number(req.params.eventId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: themes });
});
EventController.createTheme = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const theme = await eventService_1.EventService.createTheme(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Theme created', data: theme });
});
EventController.updateTheme = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const theme = await eventService_1.EventService.updateTheme(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Theme updated', data: theme });
});
EventController.deleteTheme = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await eventService_1.EventService.deleteTheme(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Theme deleted', data: null });
});
// ─── PackageType ───────────────────────────────────────────────────────────
EventController.getPackageTypes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const pts = await eventService_1.EventService.getPackageTypes(Number(req.params.eventId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: pts });
});
EventController.createPackageType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const pt = await eventService_1.EventService.createPackageType(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Package type created', data: pt });
});
EventController.updatePackageType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const pt = await eventService_1.EventService.updatePackageType(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package type updated', data: pt });
});
EventController.deletePackageType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await eventService_1.EventService.deletePackageType(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package type deleted', data: null });
});
