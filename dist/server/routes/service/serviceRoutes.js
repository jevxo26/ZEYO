"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../../controllers/service/serviceController");
const router = (0, express_1.Router)();
// Public read-only routes
router.get('/', serviceController_1.ServiceController.getAll);
router.get('/categories', serviceController_1.ServiceController.getAllCategories);
router.get('/slug/:slug', serviceController_1.ServiceController.getBySlug);
router.post('/calculate-prices', serviceController_1.ServiceController.calculatePrices); // Smart Calculator
router.get('/:id', serviceController_1.ServiceController.getById);
router.get('/:serviceId/types', serviceController_1.ServiceController.getTypes);
router.get('/:serviceId/options', serviceController_1.ServiceController.getOptions);
router.get('/:serviceId/configurations', serviceController_1.ServiceController.getConfigurations);
router.get('/:serviceId/coverages', serviceController_1.ServiceController.getCoverages);
router.get('/:serviceId/pricing', serviceController_1.ServiceController.getPricing);
router.get('/:serviceId/zone-pricing', serviceController_1.ServiceController.getZonePricing);
router.get('/:serviceId/addons', serviceController_1.ServiceController.getAddons);
router.get('/:serviceId/attributes', serviceController_1.ServiceController.getAttributes);
router.get('/:serviceId/availability', serviceController_1.ServiceController.getAvailability);
router.get('/:serviceId/gallery', serviceController_1.ServiceController.getGallery);
router.get('/:serviceId/faqs', serviceController_1.ServiceController.getFAQs);
router.get('/:serviceId/policies', serviceController_1.ServiceController.getPolicies);
router.get('/:serviceId/tags', serviceController_1.ServiceController.getTags);
router.get('/:serviceId/setting', serviceController_1.ServiceController.getSetting);
exports.default = router;
