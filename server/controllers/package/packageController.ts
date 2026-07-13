// ─────────────────────────────────────────────────────────────────────────────
// PackageController
// Controllers to route REST APIs to PackageService functions.
// Covers public cataloging, zone filter mapping, review submissions, and admin actions.
// ─────────────────────────────────────────────────────────────────────────────
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PackageService } from '../../services/package/packageService';
import { CustomerService } from '../../services/customer/customerService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class PackageController {

  // ── Packages ───────────────────────────────────────────────────────────────
  static getAllPackages = catchAsync(async (req: Request, res: Response) => {
    const { status, eventId, categoryId, subCategoryId, zoneId, isFeatured } = req.query;

    const data = await PackageService.getAllPackages({
      status: status ? String(status) : undefined,
      eventId: eventId ? Number(eventId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
      zoneId: zoneId ? Number(zoneId) : undefined,
      isFeatured: isFeatured !== undefined ? String(isFeatured) === 'true' : undefined,
    });

    sendResponse(res, { statusCode: 200, data });
  });

  static getPackageById = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { zoneId } = req.query;

    const data = await PackageService.getPackageById(id, zoneId ? Number(zoneId) : undefined);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Package not found', data: null });
    }

    sendResponse(res, { statusCode: 200, data });
  });

  static createPackage = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createPackage(req.body);
    sendResponse(res, { statusCode: 201, message: 'Package created successfully', data });
  });

  static updatePackage = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await PackageService.updatePackage(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Package updated successfully', data });
  });

  static deletePackage = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await PackageService.deletePackage(id);
    sendResponse(res, { statusCode: 200, message: 'Package soft-deleted successfully' });
  });

  // ── Categories ─────────────────────────────────────────────────────────────
  static getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.getAllCategories();
    sendResponse(res, { statusCode: 200, data });
  });

  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createCategory(req.body);
    sendResponse(res, { statusCode: 201, message: 'Category created successfully', data });
  });

  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await PackageService.updateCategory(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Category updated successfully', data });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await PackageService.deleteCategory(id);
    sendResponse(res, { statusCode: 200, message: 'Category deleted successfully' });
  });

  // ── SubCategories ──────────────────────────────────────────────────────────
  static getAllSubCategories = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.query;
    const data = await PackageService.getAllSubCategories(categoryId ? Number(categoryId) : undefined);
    sendResponse(res, { statusCode: 200, data });
  });

  static createSubCategory = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createSubCategory(req.body);
    sendResponse(res, { statusCode: 201, message: 'Subcategory created successfully', data });
  });

  static updateSubCategory = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await PackageService.updateSubCategory(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Subcategory updated successfully', data });
  });

  static deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await PackageService.deleteSubCategory(id);
    sendResponse(res, { statusCode: 200, message: 'Subcategory deleted successfully' });
  });

  // ── PackageTypes ───────────────────────────────────────────────────────────
  static createPackageType = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createPackageType({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Package type created', data });
  });

  static updatePackageType = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.typeId);
    const data = await PackageService.updatePackageType(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Package type updated', data });
  });

  static deletePackageType = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.typeId);
    await PackageService.deletePackageType(id);
    sendResponse(res, { statusCode: 200, message: 'Package type deleted' });
  });

  // ── Services & Items ───────────────────────────────────────────────────────
  static createPackageService = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createPackageService({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Package service added', data });
  });

  static updatePackageService = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.serviceId);
    const data = await PackageService.updatePackageService(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Package service updated', data });
  });

  static deletePackageService = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.serviceId);
    await PackageService.deletePackageService(id);
    sendResponse(res, { statusCode: 200, message: 'Package service removed' });
  });

  static createServiceItem = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createServiceItem({ ...req.body, packageServiceId: Number(req.params.serviceId) });
    sendResponse(res, { statusCode: 201, message: 'Package service configuration added', data });
  });

  static updateServiceItem = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.itemId);
    const data = await PackageService.updateServiceItem(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Package service configuration updated', data });
  });

  static deleteServiceItem = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.itemId);
    await PackageService.deleteServiceItem(id);
    sendResponse(res, { statusCode: 200, message: 'Package service configuration removed' });
  });

  // ── Pricing & Zone Pricing ─────────────────────────────────────────────────
  static createPricing = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createPricing({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Generic pricing added', data });
  });

  static createZonePricing = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createZonePricing({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Zone pricing added', data });
  });

  static updateZonePricing = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.pricingId);
    const data = await PackageService.updateZonePricing(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Zone pricing updated', data });
  });

  static deleteZonePricing = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.pricingId);
    await PackageService.deleteZonePricing(id);
    sendResponse(res, { statusCode: 200, message: 'Zone pricing deleted' });
  });

  // ── Addons ─────────────────────────────────────────────────────────────────
  static createAddon = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createAddon({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Addon created', data });
  });

  static updateAddon = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.addonId);
    const data = await PackageService.updateAddon(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Addon updated', data });
  });

  static deleteAddon = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.addonId);
    await PackageService.deleteAddon(id);
    sendResponse(res, { statusCode: 200, message: 'Addon deleted' });
  });

  // ── Features ───────────────────────────────────────────────────────────────
  static createFeature = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createFeature({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Feature added', data });
  });

  static updateFeature = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.featureId);
    const data = await PackageService.updateFeature(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Feature updated', data });
  });

  static deleteFeature = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.featureId);
    await PackageService.deleteFeature(id);
    sendResponse(res, { statusCode: 200, message: 'Feature deleted' });
  });

  // ── Gallery ────────────────────────────────────────────────────────────────
  static createGalleryItem = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createGalleryItem({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Gallery item added', data });
  });

  static deleteGalleryItem = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.galleryId);
    await PackageService.deleteGalleryItem(id);
    sendResponse(res, { statusCode: 200, message: 'Gallery item deleted' });
  });

  // ── FAQ ────────────────────────────────────────────────────────────────────
  static createFAQ = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createFAQ({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'FAQ added', data });
  });

  static updateFAQ = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.faqId);
    const data = await PackageService.updateFAQ(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'FAQ updated', data });
  });

  static deleteFAQ = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.faqId);
    await PackageService.deleteFAQ(id);
    sendResponse(res, { statusCode: 200, message: 'FAQ deleted' });
  });

  // ── Policies & Terms ───────────────────────────────────────────────────────
  static createPolicy = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createPolicy({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Policy added', data });
  });

  static updatePolicy = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.policyId);
    const data = await PackageService.updatePolicy(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Policy updated', data });
  });

  static deletePolicy = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.policyId);
    await PackageService.deletePolicy(id);
    sendResponse(res, { statusCode: 200, message: 'Policy deleted' });
  });

  static createTerms = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createTerms({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Terms added', data });
  });

  static updateTerms = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.termsId);
    const data = await PackageService.updateTerms(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Terms updated', data });
  });

  static deleteTerms = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.termsId);
    await PackageService.deleteTerms(id);
    sendResponse(res, { statusCode: 200, message: 'Terms deleted' });
  });

  // ── Availability ───────────────────────────────────────────────────────────
  static createAvailability = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createAvailability({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Availability mapping added', data });
  });

  static updateAvailability = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.availabilityId);
    const data = await PackageService.updateAvailability(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Availability mapping updated', data });
  });

  static deleteAvailability = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.availabilityId);
    await PackageService.deleteAvailability(id);
    sendResponse(res, { statusCode: 200, message: 'Availability mapping removed' });
  });

  // ── Discounts ──────────────────────────────────────────────────────────────
  static createDiscount = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.createDiscount({ ...req.body, packageId: Number(req.params.id) });
    sendResponse(res, { statusCode: 201, message: 'Discount added', data });
  });

  static updateDiscount = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.discountId);
    const data = await PackageService.updateDiscount(id, req.body);
    sendResponse(res, { statusCode: 200, message: 'Discount updated', data });
  });

  static deleteDiscount = catchAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.discountId);
    await PackageService.deleteDiscount(id);
    sendResponse(res, { statusCode: 200, message: 'Discount deleted' });
  });

  // ── Reviews ────────────────────────────────────────────────────────────────
  static getReviewsByPackage = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.getReviewsByPackage(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static submitReview = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
    }

    const customer = await CustomerService.getCustomerByUserId(userId);
    if (!customer) {
      return sendResponse(res, { statusCode: 404, message: 'Customer profile not found' });
    }

    const packageId = Number(req.params.id);
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const data = await PackageService.submitReview({
      packageId,
      customerId: customer.id,
      rating,
      review
    });

    sendResponse(res, { statusCode: 201, message: 'Review submitted successfully', data });
  });

  // ── Analytics ──────────────────────────────────────────────────────────────
  static getAnalyticsByPackage = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.getAnalyticsByPackage(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data });
  });

  static updateAnalytics = catchAsync(async (req: Request, res: Response) => {
    const data = await PackageService.updateAnalytics(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Analytics updated', data });
  });
}
