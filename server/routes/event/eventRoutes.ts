import { Router } from 'express';
import { EventController } from '../../controllers/event/eventController';
import { EventContentController } from '../../controllers/event/eventContentController';

const router = Router();

// ─── Public Read-Only Routes ─────────────────────────────────────────────────

// Events
router.get('/',                EventController.getAll);
router.get('/slug/:slug',      EventController.getBySlug);
router.get('/:id',             EventController.getById);

// Categories
router.get('/categories/all',  EventController.getAllCategories);

// Sub-resources per event (read-only)
router.get('/:eventId/types',         EventController.getTypes);
router.get('/:eventId/themes',        EventController.getThemes);
router.get('/:eventId/package-types', EventController.getPackageTypes);
router.get('/:eventId/timelines',     EventContentController.getTimelines);
router.get('/:eventId/schedules',     EventContentController.getSchedules);
router.get('/:eventId/faqs',          EventContentController.getFAQs);
router.get('/:eventId/gallery',       EventContentController.getGallery);
router.get('/:eventId/tags',          EventContentController.getTags);
router.get('/:eventId/policies',      EventContentController.getPolicies);
router.get('/:eventId/terms',         EventContentController.getTerms);
router.get('/:eventId/checklists',    EventContentController.getChecklists);
router.get('/:eventId/milestones',    EventContentController.getMilestones);
router.get('/:eventId/requirements',  EventContentController.getRequirements);
router.get('/:eventId/guest-config',  EventContentController.getGuestConfig);
router.get('/:eventId/venues',        EventContentController.getVenues);
router.get('/:eventId/features',      EventContentController.getFeatures);
router.get('/:eventId/setting',       EventContentController.getSetting);

export default router;
