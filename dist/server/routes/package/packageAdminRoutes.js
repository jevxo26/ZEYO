"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const packageController_1 = require("../../controllers/package/packageController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Enforce admin/manager authorization for all routes registered here
router.use(authMiddleware_1.verifyToken);
router.use((0, authMiddleware_1.requireRole)('admin', 'manager'));
// ─── Categories Management ───────────────────────────────────────────────────
router.post('/categories', packageController_1.PackageController.createCategory);
router.put('/categories/:id', packageController_1.PackageController.updateCategory);
router.delete('/categories/:id', packageController_1.PackageController.deleteCategory);
// ─── SubCategories Management ────────────────────────────────────────────────
router.post('/subcategories', packageController_1.PackageController.createSubCategory);
router.put('/subcategories/:id', packageController_1.PackageController.updateSubCategory);
router.delete('/subcategories/:id', packageController_1.PackageController.deleteSubCategory);
// ─── Package Core CRUD ───────────────────────────────────────────────────────
router.post('/', packageController_1.PackageController.createPackage);
router.put('/:id', packageController_1.PackageController.updatePackage);
router.delete('/:id', packageController_1.PackageController.deletePackage);
// ─── PackageType Management ──────────────────────────────────────────────────
router.post('/:id/types', packageController_1.PackageController.createPackageType);
router.put('/:id/types/:typeId', packageController_1.PackageController.updatePackageType);
router.delete('/:id/types/:typeId', packageController_1.PackageController.deletePackageType);
// ─── Services & Configurations ───────────────────────────────────────────────
router.post('/:id/services', packageController_1.PackageController.createPackageService);
router.put('/:id/services/:serviceId', packageController_1.PackageController.updatePackageService);
router.delete('/:id/services/:serviceId', packageController_1.PackageController.deletePackageService);
router.post('/:id/services/:serviceId/items', packageController_1.PackageController.createServiceItem);
router.put('/:id/services/:serviceId/items/:itemId', packageController_1.PackageController.updateServiceItem);
router.delete('/:id/services/:serviceId/items/:itemId', packageController_1.PackageController.deleteServiceItem);
// ─── Pricing & Zone Pricing ─────────────────────────────────────────────────
router.post('/:id/pricing', packageController_1.PackageController.createPricing);
router.post('/:id/zone-pricing', packageController_1.PackageController.createZonePricing);
router.put('/:id/zone-pricing/:pricingId', packageController_1.PackageController.updateZonePricing);
router.delete('/:id/zone-pricing/:pricingId', packageController_1.PackageController.deleteZonePricing);
// ─── Addons & Features ───────────────────────────────────────────────────────
router.post('/:id/addons', packageController_1.PackageController.createAddon);
router.put('/:id/addons/:addonId', packageController_1.PackageController.updateAddon);
router.delete('/:id/addons/:addonId', packageController_1.PackageController.deleteAddon);
router.post('/:id/features', packageController_1.PackageController.createFeature);
router.put('/:id/features/:featureId', packageController_1.PackageController.updateFeature);
router.delete('/:id/features/:featureId', packageController_1.PackageController.deleteFeature);
// ─── Gallery & FAQ ──────────────────────────────────────────────────────────
router.post('/:id/gallery', packageController_1.PackageController.createGalleryItem);
router.delete('/:id/gallery/:galleryId', packageController_1.PackageController.deleteGalleryItem);
router.post('/:id/faqs', packageController_1.PackageController.createFAQ);
router.put('/:id/faqs/:faqId', packageController_1.PackageController.updateFAQ);
router.delete('/:id/faqs/:faqId', packageController_1.PackageController.deleteFAQ);
// ─── Policies & Terms ────────────────────────────────────────────────────────
router.post('/:id/policies', packageController_1.PackageController.createPolicy);
router.put('/:id/policies/:policyId', packageController_1.PackageController.updatePolicy);
router.delete('/:id/policies/:policyId', packageController_1.PackageController.deletePolicy);
router.post('/:id/terms', packageController_1.PackageController.createTerms);
router.put('/:id/terms/:termsId', packageController_1.PackageController.updateTerms);
router.delete('/:id/terms/:termsId', packageController_1.PackageController.deleteTerms);
// ─── Availability & Discounts ────────────────────────────────────────────────
router.post('/:id/availabilities', packageController_1.PackageController.createAvailability);
router.put('/:id/availabilities/:availabilityId', packageController_1.PackageController.updateAvailability);
router.delete('/:id/availabilities/:availabilityId', packageController_1.PackageController.deleteAvailability);
router.post('/:id/discounts', packageController_1.PackageController.createDiscount);
router.put('/:id/discounts/:discountId', packageController_1.PackageController.updateDiscount);
router.delete('/:id/discounts/:discountId', packageController_1.PackageController.deleteDiscount);
// ─── Analytics ───────────────────────────────────────────────────────────────
router.get('/:id/analytics', packageController_1.PackageController.getAnalyticsByPackage);
router.put('/:id/analytics', packageController_1.PackageController.updateAnalytics);
exports.default = router;
