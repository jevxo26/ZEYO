import { Router } from 'express';
import { ServiceController } from '../../controllers/service/serviceController';

const router = Router();

// Public read-only routes
router.get('/',                          ServiceController.getAll);
router.get('/categories',                ServiceController.getAllCategories);
router.get('/slug/:slug',                ServiceController.getBySlug);
router.post('/calculate-prices',         ServiceController.calculatePrices); // Smart Calculator

router.get('/:id',                       ServiceController.getById);
router.get('/:serviceId/types',          ServiceController.getTypes);
router.get('/:serviceId/options',        ServiceController.getOptions);
router.get('/:serviceId/configurations', ServiceController.getConfigurations);
router.get('/:serviceId/coverages',      ServiceController.getCoverages);
router.get('/:serviceId/pricing',        ServiceController.getPricing);
router.get('/:serviceId/zone-pricing',   ServiceController.getZonePricing);
router.get('/:serviceId/addons',         ServiceController.getAddons);
router.get('/:serviceId/attributes',     ServiceController.getAttributes);
router.get('/:serviceId/availability',   ServiceController.getAvailability);
router.get('/:serviceId/gallery',        ServiceController.getGallery);
router.get('/:serviceId/faqs',           ServiceController.getFAQs);
router.get('/:serviceId/policies',       ServiceController.getPolicies);
router.get('/:serviceId/tags',           ServiceController.getTags);
router.get('/:serviceId/setting',        ServiceController.getSetting);

export default router;
