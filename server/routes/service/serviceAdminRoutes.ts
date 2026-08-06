import { Router } from 'express';
import { ServiceController } from '../../controllers/service/serviceController';

const router = Router();

// ── Services CRUD ─────────────────────────────────────────────────────────────
router.get('/',          ServiceController.getAll);
router.get('/:id',       ServiceController.getById);
router.post('/',         ServiceController.create);
router.put('/:id',       ServiceController.update);
router.delete('/:id',    ServiceController.delete);

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories',          ServiceController.getAllCategories);
router.post('/categories',         ServiceController.createCategory);
router.put('/categories/:id',      ServiceController.updateCategory);
router.delete('/categories/:id',   ServiceController.deleteCategory);

// ── SubCategories ─────────────────────────────────────────────────────────────
router.post('/sub-categories',        ServiceController.createSubCategory);
router.put('/sub-categories/:id',     ServiceController.updateSubCategory);
router.delete('/sub-categories/:id',  ServiceController.deleteSubCategory);

// ── Types ─────────────────────────────────────────────────────────────────────
router.get('/:serviceId/types',   ServiceController.getTypes);
router.post('/types',             ServiceController.createType);
router.put('/types/:id',          ServiceController.updateType);
router.delete('/types/:id',       ServiceController.deleteType);

// ── Options ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/options', ServiceController.getOptions);
router.post('/options',           ServiceController.createOption);
router.put('/options/:id',        ServiceController.updateOption);
router.delete('/options/:id',     ServiceController.deleteOption);

// ── Configurations & Variants ─────────────────────────────────────────────────
router.get('/:serviceId/configurations',   ServiceController.getConfigurations);
router.post('/configurations',             ServiceController.createConfiguration);
router.put('/configurations/:id',          ServiceController.updateConfiguration);
router.delete('/configurations/:id',       ServiceController.deleteConfiguration);
router.post('/variants',                   ServiceController.createVariant);
router.put('/variants/:id',                ServiceController.updateVariant);
router.delete('/variants/:id',             ServiceController.deleteVariant);

// ── Coverages ─────────────────────────────────────────────────────────────────
router.get('/:serviceId/coverages',  ServiceController.getCoverages);
router.post('/coverages',            ServiceController.createCoverage);
router.put('/coverages/:id',         ServiceController.updateCoverage);
router.delete('/coverages/:id',      ServiceController.deleteCoverage);

// ── Pricing ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/pricing',    ServiceController.getPricing);
router.post('/:serviceId/pricing',   ServiceController.upsertPricing);

// ── Zone Pricing ──────────────────────────────────────────────────────────────
router.get('/:serviceId/zone-pricing',      ServiceController.getZonePricing);
router.post('/:serviceId/zone-pricing',     ServiceController.upsertZonePricing);
router.delete('/zone-pricing/:id',          ServiceController.deleteZonePricing);

// ── Addons ────────────────────────────────────────────────────────────────────
router.get('/:serviceId/addons',  ServiceController.getAddons);
router.post('/addons',            ServiceController.createAddon);
router.put('/addons/:id',         ServiceController.updateAddon);
router.delete('/addons/:id',      ServiceController.deleteAddon);

// ── Attributes ────────────────────────────────────────────────────────────────
router.get('/:serviceId/attributes', ServiceController.getAttributes);
router.post('/attributes',           ServiceController.createAttribute);
router.delete('/attributes/:id',     ServiceController.deleteAttribute);

// ── Requirements ──────────────────────────────────────────────────────────────
router.get('/:serviceId/requirements',    ServiceController.getRequirements);
router.post('/:serviceId/requirements',   ServiceController.upsertRequirement);
router.delete('/requirements/:id',        ServiceController.deleteRequirement);

// ── Availability ──────────────────────────────────────────────────────────────
router.get('/:serviceId/availability',    ServiceController.getAvailability);
router.post('/availability',              ServiceController.createAvailability);
router.put('/availability/:id',           ServiceController.updateAvailability);
router.delete('/availability/:id',        ServiceController.deleteAvailability);

// ── Gallery ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/gallery',  ServiceController.getGallery);
router.post('/gallery',            ServiceController.createGallery);
router.put('/gallery/:id',         ServiceController.updateGallery);
router.delete('/gallery/:id',      ServiceController.deleteGallery);

// ── FAQs ──────────────────────────────────────────────────────────────────────
router.get('/:serviceId/faqs',  ServiceController.getFAQs);
router.post('/faqs',            ServiceController.createFAQ);
router.put('/faqs/:id',         ServiceController.updateFAQ);
router.delete('/faqs/:id',      ServiceController.deleteFAQ);

// ── Policies ──────────────────────────────────────────────────────────────────
router.get('/:serviceId/policies', ServiceController.getPolicies);
router.post('/policies',           ServiceController.createPolicy);
router.put('/policies/:id',        ServiceController.updatePolicy);
router.delete('/policies/:id',     ServiceController.deletePolicy);

// ── Analytics ─────────────────────────────────────────────────────────────────
router.get('/:serviceId/analytics',  ServiceController.getAnalytics);
router.post('/:serviceId/analytics', ServiceController.upsertAnalytics);

// ── Tags ──────────────────────────────────────────────────────────────────────
router.get('/:serviceId/tags',    ServiceController.getTags);
router.post('/:serviceId/tags',   ServiceController.addTag);
router.delete('/tags/:id',        ServiceController.deleteTag);

// ── Setting ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/setting',  ServiceController.getSetting);
router.post('/:serviceId/setting', ServiceController.upsertSetting);

export default router;
