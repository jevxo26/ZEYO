"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const packageService_1 = require("../../services/package/packageService");
const customerService_1 = require("../../services/customer/customerService");
class PackageController {
}
exports.PackageController = PackageController;
_a = PackageController;
// ── Packages ───────────────────────────────────────────────────────────────
PackageController.getAllPackages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, eventId, categoryId, subCategoryId, zoneId, isFeatured } = req.query;
    const data = await packageService_1.PackageService.getAllPackages({
        status: status ? String(status) : undefined,
        eventId: eventId ? Number(eventId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        subCategoryId: subCategoryId ? Number(subCategoryId) : undefined,
        zoneId: zoneId ? Number(zoneId) : undefined,
        isFeatured: isFeatured !== undefined ? String(isFeatured) === 'true' : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PackageController.getPackageById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const { zoneId } = req.query;
    const data = await packageService_1.PackageService.getPackageById(id, zoneId ? Number(zoneId) : undefined);
    if (!data) {
        return res.status(404).json({ success: false, message: 'Package not found', data: null });
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PackageController.createPackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createPackage(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Package created successfully', data });
});
PackageController.updatePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const data = await packageService_1.PackageService.updatePackage(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package updated successfully', data });
});
PackageController.deletePackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await packageService_1.PackageService.deletePackage(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package soft-deleted successfully' });
});
// ── Categories ─────────────────────────────────────────────────────────────
PackageController.getAllCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.getAllCategories();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PackageController.createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Category created successfully', data });
});
PackageController.updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const data = await packageService_1.PackageService.updateCategory(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Category updated successfully', data });
});
PackageController.deleteCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await packageService_1.PackageService.deleteCategory(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Category deleted successfully' });
});
// ── SubCategories ──────────────────────────────────────────────────────────
PackageController.getAllSubCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { categoryId } = req.query;
    const data = await packageService_1.PackageService.getAllSubCategories(categoryId ? Number(categoryId) : undefined);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PackageController.createSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createSubCategory(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Subcategory created successfully', data });
});
PackageController.updateSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const data = await packageService_1.PackageService.updateSubCategory(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Subcategory updated successfully', data });
});
PackageController.deleteSubCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await packageService_1.PackageService.deleteSubCategory(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Subcategory deleted successfully' });
});
// ── PackageTypes ───────────────────────────────────────────────────────────
PackageController.createPackageType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createPackageType(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Package type created', data });
});
PackageController.updatePackageType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.typeId);
    const data = await packageService_1.PackageService.updatePackageType(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package type updated', data });
});
PackageController.deletePackageType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.typeId);
    await packageService_1.PackageService.deletePackageType(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package type deleted' });
});
// ── Services & Items ───────────────────────────────────────────────────────
PackageController.createPackageService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createPackageService(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Package service added', data });
});
PackageController.updatePackageService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.serviceId);
    const data = await packageService_1.PackageService.updatePackageService(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package service updated', data });
});
PackageController.deletePackageService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.serviceId);
    await packageService_1.PackageService.deletePackageService(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package service removed' });
});
PackageController.createServiceItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createServiceItem(Object.assign(Object.assign({}, req.body), { packageServiceId: Number(req.params.serviceId) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Package service configuration added', data });
});
PackageController.updateServiceItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.itemId);
    const data = await packageService_1.PackageService.updateServiceItem(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package service configuration updated', data });
});
PackageController.deleteServiceItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.itemId);
    await packageService_1.PackageService.deleteServiceItem(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Package service configuration removed' });
});
// ── Pricing & Zone Pricing ─────────────────────────────────────────────────
PackageController.createPricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createPricing(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Generic pricing added', data });
});
PackageController.createZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createZonePricing(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Zone pricing added', data });
});
PackageController.updateZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.pricingId);
    const data = await packageService_1.PackageService.updateZonePricing(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone pricing updated', data });
});
PackageController.deleteZonePricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.pricingId);
    await packageService_1.PackageService.deleteZonePricing(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Zone pricing deleted' });
});
// ── Addons ─────────────────────────────────────────────────────────────────
PackageController.createAddon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createAddon(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Addon created', data });
});
PackageController.updateAddon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.addonId);
    const data = await packageService_1.PackageService.updateAddon(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Addon updated', data });
});
PackageController.deleteAddon = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.addonId);
    await packageService_1.PackageService.deleteAddon(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Addon deleted' });
});
// ── Features ───────────────────────────────────────────────────────────────
PackageController.createFeature = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createFeature(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Feature added', data });
});
PackageController.updateFeature = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.featureId);
    const data = await packageService_1.PackageService.updateFeature(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Feature updated', data });
});
PackageController.deleteFeature = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.featureId);
    await packageService_1.PackageService.deleteFeature(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Feature deleted' });
});
// ── Gallery ────────────────────────────────────────────────────────────────
PackageController.createGalleryItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createGalleryItem(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Gallery item added', data });
});
PackageController.deleteGalleryItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.galleryId);
    await packageService_1.PackageService.deleteGalleryItem(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Gallery item deleted' });
});
// ── FAQ ────────────────────────────────────────────────────────────────────
PackageController.createFAQ = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createFAQ(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'FAQ added', data });
});
PackageController.updateFAQ = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.faqId);
    const data = await packageService_1.PackageService.updateFAQ(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'FAQ updated', data });
});
PackageController.deleteFAQ = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.faqId);
    await packageService_1.PackageService.deleteFAQ(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'FAQ deleted' });
});
// ── Policies & Terms ───────────────────────────────────────────────────────
PackageController.createPolicy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createPolicy(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Policy added', data });
});
PackageController.updatePolicy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.policyId);
    const data = await packageService_1.PackageService.updatePolicy(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Policy updated', data });
});
PackageController.deletePolicy = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.policyId);
    await packageService_1.PackageService.deletePolicy(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Policy deleted' });
});
PackageController.createTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createTerms(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Terms added', data });
});
PackageController.updateTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.termsId);
    const data = await packageService_1.PackageService.updateTerms(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Terms updated', data });
});
PackageController.deleteTerms = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.termsId);
    await packageService_1.PackageService.deleteTerms(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Terms deleted' });
});
// ── Availability ───────────────────────────────────────────────────────────
PackageController.createAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createAvailability(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Availability mapping added', data });
});
PackageController.updateAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.availabilityId);
    const data = await packageService_1.PackageService.updateAvailability(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Availability mapping updated', data });
});
PackageController.deleteAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.availabilityId);
    await packageService_1.PackageService.deleteAvailability(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Availability mapping removed' });
});
// ── Discounts ──────────────────────────────────────────────────────────────
PackageController.createDiscount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.createDiscount(Object.assign(Object.assign({}, req.body), { packageId: Number(req.params.id) }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Discount added', data });
});
PackageController.updateDiscount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.discountId);
    const data = await packageService_1.PackageService.updateDiscount(id, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Discount updated', data });
});
PackageController.deleteDiscount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Number(req.params.discountId);
    await packageService_1.PackageService.deleteDiscount(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Discount deleted' });
});
// ── Reviews ────────────────────────────────────────────────────────────────
PackageController.getReviewsByPackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.getReviewsByPackage(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PackageController.submitReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (isNaN(userId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
    }
    const customer = await customerService_1.CustomerService.getCustomerByUserId(userId);
    if (!customer) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Customer profile not found' });
    }
    const packageId = Number(req.params.id);
    const { rating, review } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    const data = await packageService_1.PackageService.submitReview({
        packageId,
        customerId: customer.id,
        rating,
        review
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Review submitted successfully', data });
});
// ── Analytics ──────────────────────────────────────────────────────────────
PackageController.getAnalyticsByPackage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.getAnalyticsByPackage(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PackageController.updateAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await packageService_1.PackageService.updateAnalytics(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Analytics updated', data });
});
