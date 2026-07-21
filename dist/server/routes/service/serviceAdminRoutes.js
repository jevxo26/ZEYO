"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../../controllers/service/serviceController");
const router = (0, express_1.Router)();
// ── Services CRUD ─────────────────────────────────────────────────────────────
router.get('/', serviceController_1.ServiceController.getAll);
router.get('/:id', serviceController_1.ServiceController.getById);
router.post('/', serviceController_1.ServiceController.create);
router.put('/:id', serviceController_1.ServiceController.update);
router.delete('/:id', serviceController_1.ServiceController.delete);
// ── Categories ────────────────────────────────────────────────────────────────
router.get('/categories', serviceController_1.ServiceController.getAllCategories);
router.post('/categories', serviceController_1.ServiceController.createCategory);
router.put('/categories/:id', serviceController_1.ServiceController.updateCategory);
router.delete('/categories/:id', serviceController_1.ServiceController.deleteCategory);
// ── SubCategories ─────────────────────────────────────────────────────────────
router.post('/sub-categories', serviceController_1.ServiceController.createSubCategory);
router.put('/sub-categories/:id', serviceController_1.ServiceController.updateSubCategory);
router.delete('/sub-categories/:id', serviceController_1.ServiceController.deleteSubCategory);
// ── Types ─────────────────────────────────────────────────────────────────────
router.get('/:serviceId/types', serviceController_1.ServiceController.getTypes);
router.post('/types', serviceController_1.ServiceController.createType);
router.put('/types/:id', serviceController_1.ServiceController.updateType);
router.delete('/types/:id', serviceController_1.ServiceController.deleteType);
// ── Options ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/options', serviceController_1.ServiceController.getOptions);
router.post('/options', serviceController_1.ServiceController.createOption);
router.put('/options/:id', serviceController_1.ServiceController.updateOption);
router.delete('/options/:id', serviceController_1.ServiceController.deleteOption);
// ── Configurations & Variants ─────────────────────────────────────────────────
router.get('/:serviceId/configurations', serviceController_1.ServiceController.getConfigurations);
router.post('/configurations', serviceController_1.ServiceController.createConfiguration);
router.put('/configurations/:id', serviceController_1.ServiceController.updateConfiguration);
router.delete('/configurations/:id', serviceController_1.ServiceController.deleteConfiguration);
router.post('/variants', serviceController_1.ServiceController.createVariant);
router.put('/variants/:id', serviceController_1.ServiceController.updateVariant);
router.delete('/variants/:id', serviceController_1.ServiceController.deleteVariant);
// ── Coverages ─────────────────────────────────────────────────────────────────
router.get('/:serviceId/coverages', serviceController_1.ServiceController.getCoverages);
router.post('/coverages', serviceController_1.ServiceController.createCoverage);
router.put('/coverages/:id', serviceController_1.ServiceController.updateCoverage);
router.delete('/coverages/:id', serviceController_1.ServiceController.deleteCoverage);
// ── Pricing ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/pricing', serviceController_1.ServiceController.getPricing);
router.post('/:serviceId/pricing', serviceController_1.ServiceController.upsertPricing);
// ── Zone Pricing ──────────────────────────────────────────────────────────────
router.get('/:serviceId/zone-pricing', serviceController_1.ServiceController.getZonePricing);
router.post('/:serviceId/zone-pricing', serviceController_1.ServiceController.upsertZonePricing);
router.delete('/zone-pricing/:id', serviceController_1.ServiceController.deleteZonePricing);
// ── Addons ────────────────────────────────────────────────────────────────────
router.get('/:serviceId/addons', serviceController_1.ServiceController.getAddons);
router.post('/addons', serviceController_1.ServiceController.createAddon);
router.put('/addons/:id', serviceController_1.ServiceController.updateAddon);
router.delete('/addons/:id', serviceController_1.ServiceController.deleteAddon);
// ── Attributes ────────────────────────────────────────────────────────────────
router.get('/:serviceId/attributes', serviceController_1.ServiceController.getAttributes);
router.post('/attributes', serviceController_1.ServiceController.createAttribute);
router.delete('/attributes/:id', serviceController_1.ServiceController.deleteAttribute);
// ── Requirements ──────────────────────────────────────────────────────────────
router.get('/:serviceId/requirements', serviceController_1.ServiceController.getRequirements);
router.post('/:serviceId/requirements', serviceController_1.ServiceController.upsertRequirement);
router.delete('/requirements/:id', serviceController_1.ServiceController.deleteRequirement);
// ── Availability ──────────────────────────────────────────────────────────────
router.get('/:serviceId/availability', serviceController_1.ServiceController.getAvailability);
router.post('/availability', serviceController_1.ServiceController.createAvailability);
router.put('/availability/:id', serviceController_1.ServiceController.updateAvailability);
router.delete('/availability/:id', serviceController_1.ServiceController.deleteAvailability);
// ── Gallery ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/gallery', serviceController_1.ServiceController.getGallery);
router.post('/gallery', serviceController_1.ServiceController.createGallery);
router.put('/gallery/:id', serviceController_1.ServiceController.updateGallery);
router.delete('/gallery/:id', serviceController_1.ServiceController.deleteGallery);
// ── FAQs ──────────────────────────────────────────────────────────────────────
router.get('/:serviceId/faqs', serviceController_1.ServiceController.getFAQs);
router.post('/faqs', serviceController_1.ServiceController.createFAQ);
router.put('/faqs/:id', serviceController_1.ServiceController.updateFAQ);
router.delete('/faqs/:id', serviceController_1.ServiceController.deleteFAQ);
// ── Policies ──────────────────────────────────────────────────────────────────
router.get('/:serviceId/policies', serviceController_1.ServiceController.getPolicies);
router.post('/policies', serviceController_1.ServiceController.createPolicy);
router.put('/policies/:id', serviceController_1.ServiceController.updatePolicy);
router.delete('/policies/:id', serviceController_1.ServiceController.deletePolicy);
// ── Analytics ─────────────────────────────────────────────────────────────────
router.get('/:serviceId/analytics', serviceController_1.ServiceController.getAnalytics);
router.post('/:serviceId/analytics', serviceController_1.ServiceController.upsertAnalytics);
// ── Tags ──────────────────────────────────────────────────────────────────────
router.get('/:serviceId/tags', serviceController_1.ServiceController.getTags);
router.post('/:serviceId/tags', serviceController_1.ServiceController.addTag);
router.delete('/tags/:id', serviceController_1.ServiceController.deleteTag);
// ── Setting ───────────────────────────────────────────────────────────────────
router.get('/:serviceId/setting', serviceController_1.ServiceController.getSetting);
router.post('/:serviceId/setting', serviceController_1.ServiceController.upsertSetting);
exports.default = router;
