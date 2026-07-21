"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../../controllers/event/eventController");
const eventContentController_1 = require("../../controllers/event/eventContentController");
const router = (0, express_1.Router)();
// ─── Admin Full CRUD Routes ──────────────────────────────────────────────────
// Events
router.get('/', eventController_1.EventController.getAll);
router.get('/:id', eventController_1.EventController.getById);
router.post('/', eventController_1.EventController.create);
router.put('/:id', eventController_1.EventController.update);
router.delete('/:id', eventController_1.EventController.delete);
// Categories
router.get('/categories/all', eventController_1.EventController.getAllCategories);
router.post('/categories', eventController_1.EventController.createCategory);
router.put('/categories/:id', eventController_1.EventController.updateCategory);
router.delete('/categories/:id', eventController_1.EventController.deleteCategory);
// SubCategories
router.post('/sub-categories', eventController_1.EventController.createSubCategory);
router.put('/sub-categories/:id', eventController_1.EventController.updateSubCategory);
router.delete('/sub-categories/:id', eventController_1.EventController.deleteSubCategory);
// Types
router.get('/:eventId/types', eventController_1.EventController.getTypes);
router.post('/types', eventController_1.EventController.createType);
router.put('/types/:id', eventController_1.EventController.updateType);
router.delete('/types/:id', eventController_1.EventController.deleteType);
// Themes
router.get('/:eventId/themes', eventController_1.EventController.getThemes);
router.post('/themes', eventController_1.EventController.createTheme);
router.put('/themes/:id', eventController_1.EventController.updateTheme);
router.delete('/themes/:id', eventController_1.EventController.deleteTheme);
// Package Types
router.get('/:eventId/package-types', eventController_1.EventController.getPackageTypes);
router.post('/package-types', eventController_1.EventController.createPackageType);
router.put('/package-types/:id', eventController_1.EventController.updatePackageType);
router.delete('/package-types/:id', eventController_1.EventController.deletePackageType);
// Timelines
router.get('/:eventId/timelines', eventContentController_1.EventContentController.getTimelines);
router.post('/timelines', eventContentController_1.EventContentController.createTimeline);
router.put('/timelines/:id', eventContentController_1.EventContentController.updateTimeline);
router.delete('/timelines/:id', eventContentController_1.EventContentController.deleteTimeline);
// Schedules
router.get('/:eventId/schedules', eventContentController_1.EventContentController.getSchedules);
router.post('/schedules', eventContentController_1.EventContentController.createSchedule);
router.put('/schedules/:id', eventContentController_1.EventContentController.updateSchedule);
router.delete('/schedules/:id', eventContentController_1.EventContentController.deleteSchedule);
// FAQs
router.get('/:eventId/faqs', eventContentController_1.EventContentController.getFAQs);
router.post('/faqs', eventContentController_1.EventContentController.createFAQ);
router.put('/faqs/:id', eventContentController_1.EventContentController.updateFAQ);
router.delete('/faqs/:id', eventContentController_1.EventContentController.deleteFAQ);
// Gallery
router.get('/:eventId/gallery', eventContentController_1.EventContentController.getGallery);
router.post('/gallery', eventContentController_1.EventContentController.createGallery);
router.put('/gallery/:id', eventContentController_1.EventContentController.updateGallery);
router.delete('/gallery/:id', eventContentController_1.EventContentController.deleteGallery);
// Tags
router.get('/:eventId/tags', eventContentController_1.EventContentController.getTags);
router.post('/:eventId/tags', eventContentController_1.EventContentController.addTag);
router.delete('/tags/:id', eventContentController_1.EventContentController.deleteTag);
// Policies
router.get('/:eventId/policies', eventContentController_1.EventContentController.getPolicies);
router.post('/policies', eventContentController_1.EventContentController.createPolicy);
router.put('/policies/:id', eventContentController_1.EventContentController.updatePolicy);
router.delete('/policies/:id', eventContentController_1.EventContentController.deletePolicy);
// Terms
router.get('/:eventId/terms', eventContentController_1.EventContentController.getTerms);
router.post('/terms', eventContentController_1.EventContentController.createTerms);
router.put('/terms/:id', eventContentController_1.EventContentController.updateTerms);
router.delete('/terms/:id', eventContentController_1.EventContentController.deleteTerms);
// Checklists
router.get('/:eventId/checklists', eventContentController_1.EventContentController.getChecklists);
router.post('/checklists', eventContentController_1.EventContentController.createChecklist);
router.put('/checklists/:id', eventContentController_1.EventContentController.updateChecklist);
router.delete('/checklists/:id', eventContentController_1.EventContentController.deleteChecklist);
// Milestones
router.get('/:eventId/milestones', eventContentController_1.EventContentController.getMilestones);
router.post('/milestones', eventContentController_1.EventContentController.createMilestone);
router.put('/milestones/:id', eventContentController_1.EventContentController.updateMilestone);
router.delete('/milestones/:id', eventContentController_1.EventContentController.deleteMilestone);
// Requirements
router.get('/:eventId/requirements', eventContentController_1.EventContentController.getRequirements);
router.post('/requirements', eventContentController_1.EventContentController.createRequirement);
router.put('/requirements/:id', eventContentController_1.EventContentController.updateRequirement);
router.delete('/requirements/:id', eventContentController_1.EventContentController.deleteRequirement);
// Guest Config
router.get('/:eventId/guest-config', eventContentController_1.EventContentController.getGuestConfig);
router.post('/guest-config', eventContentController_1.EventContentController.createGuestConfig);
router.put('/guest-config/:id', eventContentController_1.EventContentController.updateGuestConfig);
router.delete('/guest-config/:id', eventContentController_1.EventContentController.deleteGuestConfig);
// Venues
router.get('/:eventId/venues', eventContentController_1.EventContentController.getVenues);
router.post('/venues', eventContentController_1.EventContentController.createVenue);
router.put('/venues/:id', eventContentController_1.EventContentController.updateVenue);
router.delete('/venues/:id', eventContentController_1.EventContentController.deleteVenue);
// Features
router.get('/:eventId/features', eventContentController_1.EventContentController.getFeatures);
router.post('/features', eventContentController_1.EventContentController.createFeature);
router.put('/features/:id', eventContentController_1.EventContentController.updateFeature);
router.delete('/features/:id', eventContentController_1.EventContentController.deleteFeature);
// Setting (upsert)
router.get('/:eventId/setting', eventContentController_1.EventContentController.getSetting);
router.post('/:eventId/setting', eventContentController_1.EventContentController.upsertSetting);
exports.default = router;
