import { Router } from 'express';
import { PackageController } from '../../controllers/package/packageController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();

// Enforce admin/manager authorization for all routes registered here
router.use(verifyToken);
router.use(requireRole('admin', 'manager'));

// ─── Categories Management ───────────────────────────────────────────────────
router.post('/categories',             PackageController.createCategory);
router.put('/categories/:id',          PackageController.updateCategory);
router.delete('/categories/:id',       PackageController.deleteCategory);

// ─── SubCategories Management ────────────────────────────────────────────────
router.post('/subcategories',          PackageController.createSubCategory);
router.put('/subcategories/:id',       PackageController.updateSubCategory);
router.delete('/subcategories/:id',    PackageController.deleteSubCategory);

// ─── Package Core CRUD ───────────────────────────────────────────────────────
router.post('/',                       PackageController.createPackage);
router.put('/:id',                    PackageController.updatePackage);
router.delete('/:id',                 PackageController.deletePackage);

// ─── PackageType Management ──────────────────────────────────────────────────
router.post('/:id/types',             PackageController.createPackageType);
router.put('/:id/types/:typeId',      PackageController.updatePackageType);
router.delete('/:id/types/:typeId',   PackageController.deletePackageType);

// ─── Services & Configurations ───────────────────────────────────────────────
router.post('/:id/services',                 PackageController.createPackageService);
router.put('/:id/services/:serviceId',      PackageController.updatePackageService);
router.delete('/:id/services/:serviceId',   PackageController.deletePackageService);

router.post('/:id/services/:serviceId/items',      PackageController.createServiceItem);
router.put('/:id/services/:serviceId/items/:itemId', PackageController.updateServiceItem);
router.delete('/:id/services/:serviceId/items/:itemId', PackageController.deleteServiceItem);

// ─── Pricing & Zone Pricing ─────────────────────────────────────────────────
router.post('/:id/pricing',                 PackageController.createPricing);
router.post('/:id/zone-pricing',            PackageController.createZonePricing);
router.put('/:id/zone-pricing/:pricingId',  PackageController.updateZonePricing);
router.delete('/:id/zone-pricing/:pricingId', PackageController.deleteZonePricing);

// ─── Addons & Features ───────────────────────────────────────────────────────
router.post('/:id/addons',                  PackageController.createAddon);
router.put('/:id/addons/:addonId',          PackageController.updateAddon);
router.delete('/:id/addons/:addonId',       PackageController.deleteAddon);

router.post('/:id/features',                PackageController.createFeature);
router.put('/:id/features/:featureId',      PackageController.updateFeature);
router.delete('/:id/features/:featureId',   PackageController.deleteFeature);

// ─── Gallery & FAQ ──────────────────────────────────────────────────────────
router.post('/:id/gallery',                 PackageController.createGalleryItem);
router.delete('/:id/gallery/:galleryId',    PackageController.deleteGalleryItem);

router.post('/:id/faqs',                    PackageController.createFAQ);
router.put('/:id/faqs/:faqId',              PackageController.updateFAQ);
router.delete('/:id/faqs/:faqId',           PackageController.deleteFAQ);

// ─── Policies & Terms ────────────────────────────────────────────────────────
router.post('/:id/policies',                PackageController.createPolicy);
router.put('/:id/policies/:policyId',      PackageController.updatePolicy);
router.delete('/:id/policies/:policyId',   PackageController.deletePolicy);

router.post('/:id/terms',                   PackageController.createTerms);
router.put('/:id/terms/:termsId',          PackageController.updateTerms);
router.delete('/:id/terms/:termsId',       PackageController.deleteTerms);

// ─── Availability & Discounts ────────────────────────────────────────────────
router.post('/:id/availabilities',          PackageController.createAvailability);
router.put('/:id/availabilities/:availabilityId', PackageController.updateAvailability);
router.delete('/:id/availabilities/:availabilityId', PackageController.deleteAvailability);

router.post('/:id/discounts',               PackageController.createDiscount);
router.put('/:id/discounts/:discountId',    PackageController.updateDiscount);
router.delete('/:id/discounts/:discountId', PackageController.deleteDiscount);

// ─── Analytics ───────────────────────────────────────────────────────────────
router.get('/:id/analytics',                PackageController.getAnalyticsByPackage);
router.put('/:id/analytics',                PackageController.updateAnalytics);

export default router;
