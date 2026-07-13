import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ServiceService } from '../../services/service/serviceService';
import { ServicePricingService } from '../../services/service/servicePricingService';
import { ServiceContentService } from '../../services/service/serviceContentService';

export class ServiceController {

  // ── Services ─────────────────────────────────────────────────────────────────
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { status, categoryId } = req.query as Record<string, string>;
    const data = await ServiceService.getAll({ status, categoryId: categoryId ? Number(categoryId) : undefined });
    sendResponse(res, { statusCode: 200, data });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.getById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Service not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static getBySlug = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.getBySlug(String(req.params.slug));
    if (!data) return res.status(404).json({ success: false, message: 'Service not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Service created', data });
  });

  static update = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.update(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Service updated', data });
  });

  static delete = catchAsync(async (req: Request, res: Response) => {
    await ServiceService.softDelete(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Service deleted', data: null });
  });

  // ── Categories ───────────────────────────────────────────────────────────────
  static getAllCategories = catchAsync(async (_req: Request, res: Response) => {
    const data = await ServiceService.getAllCategories();
    sendResponse(res, { statusCode: 200, data });
  });

  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.createCategory(req.body);
    sendResponse(res, { statusCode: 201, message: 'Category created', data });
  });

  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.updateCategory(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Category updated', data });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await ServiceService.deleteCategory(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Category deleted', data: null });
  });

  // ── SubCategories ────────────────────────────────────────────────────────────
  static createSubCategory = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.createSubCategory(req.body);
    sendResponse(res, { statusCode: 201, message: 'Sub-category created', data });
  });

  static updateSubCategory = catchAsync(async (req: Request, res: Response) => {
    const data = await ServiceService.updateSubCategory(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Sub-category updated', data });
  });

  static deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
    await ServiceService.deleteSubCategory(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Sub-category deleted', data: null });
  });

  // ── Types ────────────────────────────────────────────────────────────────────
  static getTypes     = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceService.getTypes(Number(req.params.serviceId)) }); });
  static createType   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Type created',   data: await ServiceService.createType(req.body) }); });
  static updateType   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Type updated',   data: await ServiceService.updateType(Number(req.params.id), req.body) }); });
  static deleteType   = catchAsync(async (req: Request, res: Response) => { await ServiceService.deleteType(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Type deleted',   data: null }); });

  // ── Options ──────────────────────────────────────────────────────────────────
  static getOptions     = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceService.getOptions(Number(req.params.serviceId)) }); });
  static createOption   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Option created',   data: await ServiceService.createOption(req.body) }); });
  static updateOption   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Option updated',   data: await ServiceService.updateOption(Number(req.params.id), req.body) }); });
  static deleteOption   = catchAsync(async (req: Request, res: Response) => { await ServiceService.deleteOption(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Option deleted',   data: null }); });

  // ── Configurations & Variants ─────────────────────────────────────────────────
  static getConfigurations     = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceService.getConfigurations(Number(req.params.serviceId)) }); });
  static createConfiguration   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Configuration created', data: await ServiceService.createConfiguration(req.body) }); });
  static updateConfiguration   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Configuration updated', data: await ServiceService.updateConfiguration(Number(req.params.id), req.body) }); });
  static deleteConfiguration   = catchAsync(async (req: Request, res: Response) => { await ServiceService.deleteConfiguration(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Configuration deleted', data: null }); });
  static createVariant         = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Variant created', data: await ServiceService.createVariant(req.body) }); });
  static updateVariant         = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Variant updated', data: await ServiceService.updateVariant(Number(req.params.id), req.body) }); });
  static deleteVariant         = catchAsync(async (req: Request, res: Response) => { await ServiceService.deleteVariant(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Variant deleted', data: null }); });

  // ── Coverages ────────────────────────────────────────────────────────────────
  static getCoverages   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceService.getCoverages(Number(req.params.serviceId)) }); });
  static createCoverage = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Coverage created', data: await ServiceService.createCoverage(req.body) }); });
  static updateCoverage = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Coverage updated', data: await ServiceService.updateCoverage(Number(req.params.id), req.body) }); });
  static deleteCoverage = catchAsync(async (req: Request, res: Response) => { await ServiceService.deleteCoverage(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Coverage deleted', data: null }); });

  // ── Pricing ──────────────────────────────────────────────────────────────────
  static getPricing       = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServicePricingService.getPricing(Number(req.params.serviceId)) }); });
  static upsertPricing    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Pricing saved', data: await ServicePricingService.upsertPricing(Number(req.params.serviceId), req.body) }); });

  // ── Zone Pricing ─────────────────────────────────────────────────────────────
  static getZonePricing         = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServicePricingService.getZonePricing(Number(req.params.serviceId)) }); });
  static upsertZonePricing      = catchAsync(async (req: Request, res: Response) => { const { zoneId, ...data } = req.body; sendResponse(res, { statusCode: 200, message: 'Zone price saved', data: await ServicePricingService.upsertZonePricing(Number(req.params.serviceId), zoneId, data) }); });
  static deleteZonePricing      = catchAsync(async (req: Request, res: Response) => { await ServicePricingService.deleteZonePricing(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Zone price deleted', data: null }); });

  // ── Smart Calculator: bulk zone prices ───────────────────────────────────────
  static calculatePrices = catchAsync(async (req: Request, res: Response) => {
    const { serviceIds, zoneId } = req.body;
    const data = await ServicePricingService.getZonePricesForServices(serviceIds, zoneId);
    sendResponse(res, { statusCode: 200, data });
  });

  // ── Addons ───────────────────────────────────────────────────────────────────
  static getAddons      = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServicePricingService.getAddons(Number(req.params.serviceId)) }); });
  static createAddon    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Addon created', data: await ServicePricingService.createAddon(req.body) }); });
  static updateAddon    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Addon updated', data: await ServicePricingService.updateAddon(Number(req.params.id), req.body) }); });
  static deleteAddon    = catchAsync(async (req: Request, res: Response) => { await ServicePricingService.deleteAddon(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Addon deleted', data: null }); });

  // ── Attributes ───────────────────────────────────────────────────────────────
  static getAttributes    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServicePricingService.getAttributes(Number(req.params.serviceId)) }); });
  static createAttribute  = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Attribute added', data: await ServicePricingService.createAttribute(req.body) }); });
  static deleteAttribute  = catchAsync(async (req: Request, res: Response) => { await ServicePricingService.deleteAttribute(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Attribute deleted', data: null }); });

  // ── Requirements ─────────────────────────────────────────────────────────────
  static getRequirements      = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServicePricingService.getRequirements(Number(req.params.serviceId)) }); });
  static upsertRequirement    = catchAsync(async (req: Request, res: Response) => { const { eventId, ...data } = req.body; sendResponse(res, { statusCode: 200, message: 'Requirement saved', data: await ServicePricingService.upsertRequirement(Number(req.params.serviceId), eventId, data) }); });
  static deleteRequirement    = catchAsync(async (req: Request, res: Response) => { await ServicePricingService.deleteRequirement(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Requirement deleted', data: null }); });

  // ── Availability ─────────────────────────────────────────────────────────────
  static getAvailability    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServicePricingService.getAvailability(Number(req.params.serviceId)) }); });
  static createAvailability = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Availability created', data: await ServicePricingService.createAvailability(req.body) }); });
  static updateAvailability = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Availability updated', data: await ServicePricingService.updateAvailability(Number(req.params.id), req.body) }); });
  static deleteAvailability = catchAsync(async (req: Request, res: Response) => { await ServicePricingService.deleteAvailability(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Availability deleted', data: null }); });

  // ── Gallery ──────────────────────────────────────────────────────────────────
  static getGallery     = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceContentService.getGallery(Number(req.params.serviceId)) }); });
  static createGallery  = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Gallery item added', data: await ServiceContentService.createGalleryItem(req.body) }); });
  static updateGallery  = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Gallery item updated', data: await ServiceContentService.updateGalleryItem(Number(req.params.id), req.body) }); });
  static deleteGallery  = catchAsync(async (req: Request, res: Response) => { await ServiceContentService.deleteGalleryItem(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Gallery item deleted', data: null }); });

  // ── FAQs ─────────────────────────────────────────────────────────────────────
  static getFAQs      = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceContentService.getFAQs(Number(req.params.serviceId)) }); });
  static createFAQ    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'FAQ created', data: await ServiceContentService.createFAQ(req.body) }); });
  static updateFAQ    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'FAQ updated', data: await ServiceContentService.updateFAQ(Number(req.params.id), req.body) }); });
  static deleteFAQ    = catchAsync(async (req: Request, res: Response) => { await ServiceContentService.deleteFAQ(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'FAQ deleted', data: null }); });

  // ── Policies ─────────────────────────────────────────────────────────────────
  static getPolicies    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceContentService.getPolicies(Number(req.params.serviceId)) }); });
  static createPolicy   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Policy created', data: await ServiceContentService.createPolicy(req.body) }); });
  static updatePolicy   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Policy updated', data: await ServiceContentService.updatePolicy(Number(req.params.id), req.body) }); });
  static deletePolicy   = catchAsync(async (req: Request, res: Response) => { await ServiceContentService.deletePolicy(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Policy deleted', data: null }); });

  // ── Analytics ────────────────────────────────────────────────────────────────
  static getAnalytics   = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceContentService.getAnalytics(Number(req.params.serviceId)) }); });
  static upsertAnalytics = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Analytics updated', data: await ServiceContentService.upsertAnalytics(Number(req.params.serviceId), req.body) }); });

  // ── Tags ─────────────────────────────────────────────────────────────────────
  static getTags    = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceContentService.getTags(Number(req.params.serviceId)) }); });
  static addTag     = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 201, message: 'Tag added', data: await ServiceContentService.addTag(Number(req.params.serviceId), req.body.tag) }); });
  static deleteTag  = catchAsync(async (req: Request, res: Response) => { await ServiceContentService.deleteTag(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Tag removed', data: null }); });

  // ── Setting ──────────────────────────────────────────────────────────────────
  static getSetting     = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, data: await ServiceContentService.getSetting(Number(req.params.serviceId)) }); });
  static upsertSetting  = catchAsync(async (req: Request, res: Response) => { sendResponse(res, { statusCode: 200, message: 'Setting saved', data: await ServiceContentService.upsertSetting(Number(req.params.serviceId), req.body) }); });
}
