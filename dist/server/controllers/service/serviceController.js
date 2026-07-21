"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const serviceService_1 = require("../../services/service/serviceService");
const servicePricingService_1 = require("../../services/service/servicePricingService");
const serviceContentService_1 = require("../../services/service/serviceContentService");
class ServiceController {
}
exports.ServiceController = ServiceController;
_a = ServiceController;
// ── Services ─────────────────────────────────────────────────────────────────
ServiceController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, categoryId } = req.query;
    const data = await serviceService_1.ServiceService.getAll({ status, categoryId: categoryId ? Number(categoryId) : undefined });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ServiceController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.getById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Service not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ServiceController.getBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.getBySlug(String(req.params.slug));
    if (!data)
        return res.status(404).json({ success: false, message: 'Service not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ServiceController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Service created', data });
});
ServiceController.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.update(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Service updated', data });
});
ServiceController.delete = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await serviceService_1.ServiceService.softDelete(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Service deleted', data: null });
});
// ── Categories ───────────────────────────────────────────────────────────────
ServiceController.getAllCategories = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await serviceService_1.ServiceService.getAllCategories();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
ServiceController.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.createCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Category created', data });
});
ServiceController.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.updateCategory(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Category updated', data });
});
ServiceController.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await serviceService_1.ServiceService.deleteCategory(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Category deleted', data: null });
});
// ── SubCategories ────────────────────────────────────────────────────────────
ServiceController.createSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.createSubCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Sub-category created', data });
});
ServiceController.updateSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await serviceService_1.ServiceService.updateSubCategory(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Sub-category updated', data });
});
ServiceController.deleteSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await serviceService_1.ServiceService.deleteSubCategory(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Sub-category deleted', data: null });
});
// ── Types ────────────────────────────────────────────────────────────────────
ServiceController.getTypes = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceService_1.ServiceService.getTypes(Number(req.params.serviceId)) }); });
ServiceController.createType = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Type created', data: await serviceService_1.ServiceService.createType(req.body) }); });
ServiceController.updateType = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Type updated', data: await serviceService_1.ServiceService.updateType(Number(req.params.id), req.body) }); });
ServiceController.deleteType = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceService_1.ServiceService.deleteType(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Type deleted', data: null }); });
// ── Options ──────────────────────────────────────────────────────────────────
ServiceController.getOptions = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceService_1.ServiceService.getOptions(Number(req.params.serviceId)) }); });
ServiceController.createOption = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Option created', data: await serviceService_1.ServiceService.createOption(req.body) }); });
ServiceController.updateOption = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Option updated', data: await serviceService_1.ServiceService.updateOption(Number(req.params.id), req.body) }); });
ServiceController.deleteOption = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceService_1.ServiceService.deleteOption(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Option deleted', data: null }); });
// ── Configurations & Variants ─────────────────────────────────────────────────
ServiceController.getConfigurations = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceService_1.ServiceService.getConfigurations(Number(req.params.serviceId)) }); });
ServiceController.createConfiguration = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Configuration created', data: await serviceService_1.ServiceService.createConfiguration(req.body) }); });
ServiceController.updateConfiguration = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Configuration updated', data: await serviceService_1.ServiceService.updateConfiguration(Number(req.params.id), req.body) }); });
ServiceController.deleteConfiguration = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceService_1.ServiceService.deleteConfiguration(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Configuration deleted', data: null }); });
ServiceController.createVariant = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Variant created', data: await serviceService_1.ServiceService.createVariant(req.body) }); });
ServiceController.updateVariant = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Variant updated', data: await serviceService_1.ServiceService.updateVariant(Number(req.params.id), req.body) }); });
ServiceController.deleteVariant = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceService_1.ServiceService.deleteVariant(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Variant deleted', data: null }); });
// ── Coverages ────────────────────────────────────────────────────────────────
ServiceController.getCoverages = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceService_1.ServiceService.getCoverages(Number(req.params.serviceId)) }); });
ServiceController.createCoverage = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Coverage created', data: await serviceService_1.ServiceService.createCoverage(req.body) }); });
ServiceController.updateCoverage = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Coverage updated', data: await serviceService_1.ServiceService.updateCoverage(Number(req.params.id), req.body) }); });
ServiceController.deleteCoverage = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceService_1.ServiceService.deleteCoverage(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Coverage deleted', data: null }); });
// ── Pricing ──────────────────────────────────────────────────────────────────
ServiceController.getPricing = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await servicePricingService_1.ServicePricingService.getPricing(Number(req.params.serviceId)) }); });
ServiceController.upsertPricing = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Pricing saved', data: await servicePricingService_1.ServicePricingService.upsertPricing(Number(req.params.serviceId), req.body) }); });
// ── Zone Pricing ─────────────────────────────────────────────────────────────
ServiceController.getZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await servicePricingService_1.ServicePricingService.getZonePricing(Number(req.params.serviceId)) }); });
ServiceController.upsertZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => { const _b = req.body, { zoneId } = _b, data = __rest(_b, ["zoneId"]); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone price saved', data: await servicePricingService_1.ServicePricingService.upsertZonePricing(Number(req.params.serviceId), zoneId, data) }); });
ServiceController.deleteZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => { await servicePricingService_1.ServicePricingService.deleteZonePricing(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone price deleted', data: null }); });
// ── Smart Calculator: bulk zone prices ───────────────────────────────────────
ServiceController.calculatePrices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { serviceIds, zoneId } = req.body;
    const data = await servicePricingService_1.ServicePricingService.getZonePricesForServices(serviceIds, zoneId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── Addons ───────────────────────────────────────────────────────────────────
ServiceController.getAddons = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await servicePricingService_1.ServicePricingService.getAddons(Number(req.params.serviceId)) }); });
ServiceController.createAddon = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Addon created', data: await servicePricingService_1.ServicePricingService.createAddon(req.body) }); });
ServiceController.updateAddon = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Addon updated', data: await servicePricingService_1.ServicePricingService.updateAddon(Number(req.params.id), req.body) }); });
ServiceController.deleteAddon = (0, catchAsync_1.catchAsync)(async (req, res) => { await servicePricingService_1.ServicePricingService.deleteAddon(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Addon deleted', data: null }); });
// ── Attributes ───────────────────────────────────────────────────────────────
ServiceController.getAttributes = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await servicePricingService_1.ServicePricingService.getAttributes(Number(req.params.serviceId)) }); });
ServiceController.createAttribute = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Attribute added', data: await servicePricingService_1.ServicePricingService.createAttribute(req.body) }); });
ServiceController.deleteAttribute = (0, catchAsync_1.catchAsync)(async (req, res) => { await servicePricingService_1.ServicePricingService.deleteAttribute(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Attribute deleted', data: null }); });
// ── Requirements ─────────────────────────────────────────────────────────────
ServiceController.getRequirements = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await servicePricingService_1.ServicePricingService.getRequirements(Number(req.params.serviceId)) }); });
ServiceController.upsertRequirement = (0, catchAsync_1.catchAsync)(async (req, res) => { const _b = req.body, { eventId } = _b, data = __rest(_b, ["eventId"]); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Requirement saved', data: await servicePricingService_1.ServicePricingService.upsertRequirement(Number(req.params.serviceId), eventId, data) }); });
ServiceController.deleteRequirement = (0, catchAsync_1.catchAsync)(async (req, res) => { await servicePricingService_1.ServicePricingService.deleteRequirement(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Requirement deleted', data: null }); });
// ── Availability ─────────────────────────────────────────────────────────────
ServiceController.getAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await servicePricingService_1.ServicePricingService.getAvailability(Number(req.params.serviceId)) }); });
ServiceController.createAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Availability created', data: await servicePricingService_1.ServicePricingService.createAvailability(req.body) }); });
ServiceController.updateAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Availability updated', data: await servicePricingService_1.ServicePricingService.updateAvailability(Number(req.params.id), req.body) }); });
ServiceController.deleteAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => { await servicePricingService_1.ServicePricingService.deleteAvailability(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Availability deleted', data: null }); });
// ── Gallery ──────────────────────────────────────────────────────────────────
ServiceController.getGallery = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceContentService_1.ServiceContentService.getGallery(Number(req.params.serviceId)) }); });
ServiceController.createGallery = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Gallery item added', data: await serviceContentService_1.ServiceContentService.createGalleryItem(req.body) }); });
ServiceController.updateGallery = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Gallery item updated', data: await serviceContentService_1.ServiceContentService.updateGalleryItem(Number(req.params.id), req.body) }); });
ServiceController.deleteGallery = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceContentService_1.ServiceContentService.deleteGalleryItem(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Gallery item deleted', data: null }); });
// ── FAQs ─────────────────────────────────────────────────────────────────────
ServiceController.getFAQs = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceContentService_1.ServiceContentService.getFAQs(Number(req.params.serviceId)) }); });
ServiceController.createFAQ = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'FAQ created', data: await serviceContentService_1.ServiceContentService.createFAQ(req.body) }); });
ServiceController.updateFAQ = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'FAQ updated', data: await serviceContentService_1.ServiceContentService.updateFAQ(Number(req.params.id), req.body) }); });
ServiceController.deleteFAQ = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceContentService_1.ServiceContentService.deleteFAQ(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'FAQ deleted', data: null }); });
// ── Policies ─────────────────────────────────────────────────────────────────
ServiceController.getPolicies = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceContentService_1.ServiceContentService.getPolicies(Number(req.params.serviceId)) }); });
ServiceController.createPolicy = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Policy created', data: await serviceContentService_1.ServiceContentService.createPolicy(req.body) }); });
ServiceController.updatePolicy = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Policy updated', data: await serviceContentService_1.ServiceContentService.updatePolicy(Number(req.params.id), req.body) }); });
ServiceController.deletePolicy = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceContentService_1.ServiceContentService.deletePolicy(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Policy deleted', data: null }); });
// ── Analytics ────────────────────────────────────────────────────────────────
ServiceController.getAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceContentService_1.ServiceContentService.getAnalytics(Number(req.params.serviceId)) }); });
ServiceController.upsertAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Analytics updated', data: await serviceContentService_1.ServiceContentService.upsertAnalytics(Number(req.params.serviceId), req.body) }); });
// ── Tags ─────────────────────────────────────────────────────────────────────
ServiceController.getTags = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceContentService_1.ServiceContentService.getTags(Number(req.params.serviceId)) }); });
ServiceController.addTag = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Tag added', data: await serviceContentService_1.ServiceContentService.addTag(Number(req.params.serviceId), req.body.tag) }); });
ServiceController.deleteTag = (0, catchAsync_1.catchAsync)(async (req, res) => { await serviceContentService_1.ServiceContentService.deleteTag(Number(req.params.id)); (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Tag removed', data: null }); });
// ── Setting ──────────────────────────────────────────────────────────────────
ServiceController.getSetting = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: await serviceContentService_1.ServiceContentService.getSetting(Number(req.params.serviceId)) }); });
ServiceController.upsertSetting = (0, catchAsync_1.catchAsync)(async (req, res) => { (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Setting saved', data: await serviceContentService_1.ServiceContentService.upsertSetting(Number(req.params.serviceId), req.body) }); });
