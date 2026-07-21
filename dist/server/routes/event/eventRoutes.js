"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../../controllers/event/eventController");
const eventContentController_1 = require("../../controllers/event/eventContentController");
const router = (0, express_1.Router)();
// ─── Public Read-Only Routes ─────────────────────────────────────────────────
// Events
router.get('/', eventController_1.EventController.getAll);
router.get('/slug/:slug', eventController_1.EventController.getBySlug);
router.get('/:id', eventController_1.EventController.getById);
// Categories
router.get('/categories/all', eventController_1.EventController.getAllCategories);
// Sub-resources per event (read-only)
router.get('/:eventId/types', eventController_1.EventController.getTypes);
router.get('/:eventId/themes', eventController_1.EventController.getThemes);
router.get('/:eventId/package-types', eventController_1.EventController.getPackageTypes);
router.get('/:eventId/timelines', eventContentController_1.EventContentController.getTimelines);
router.get('/:eventId/schedules', eventContentController_1.EventContentController.getSchedules);
router.get('/:eventId/faqs', eventContentController_1.EventContentController.getFAQs);
router.get('/:eventId/gallery', eventContentController_1.EventContentController.getGallery);
router.get('/:eventId/tags', eventContentController_1.EventContentController.getTags);
router.get('/:eventId/policies', eventContentController_1.EventContentController.getPolicies);
router.get('/:eventId/terms', eventContentController_1.EventContentController.getTerms);
router.get('/:eventId/checklists', eventContentController_1.EventContentController.getChecklists);
router.get('/:eventId/milestones', eventContentController_1.EventContentController.getMilestones);
router.get('/:eventId/requirements', eventContentController_1.EventContentController.getRequirements);
router.get('/:eventId/guest-config', eventContentController_1.EventContentController.getGuestConfig);
router.get('/:eventId/venues', eventContentController_1.EventContentController.getVenues);
router.get('/:eventId/features', eventContentController_1.EventContentController.getFeatures);
router.get('/:eventId/setting', eventContentController_1.EventContentController.getSetting);
exports.default = router;
