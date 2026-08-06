import { Router } from 'express';
import { EventController } from '../../controllers/event/eventController';
import { EventContentController } from '../../controllers/event/eventContentController';

const router = Router();

// ─── Admin Full CRUD Routes ──────────────────────────────────────────────────

// Events
router.get('/',                 EventController.getAll);
router.get('/:id',              EventController.getById);
router.post('/',                EventController.create);
router.put('/:id',              EventController.update);
router.delete('/:id',           EventController.delete);

// Categories
router.get('/categories/all',   EventController.getAllCategories);
router.post('/categories',      EventController.createCategory);
router.put('/categories/:id',   EventController.updateCategory);
router.delete('/categories/:id', EventController.deleteCategory);

// SubCategories
router.post('/sub-categories',       EventController.createSubCategory);
router.put('/sub-categories/:id',    EventController.updateSubCategory);
router.delete('/sub-categories/:id', EventController.deleteSubCategory);

// Types
router.get('/:eventId/types',         EventController.getTypes);
router.post('/types',                 EventController.createType);
router.put('/types/:id',              EventController.updateType);
router.delete('/types/:id',           EventController.deleteType);

// Themes
router.get('/:eventId/themes',        EventController.getThemes);
router.post('/themes',                EventController.createTheme);
router.put('/themes/:id',             EventController.updateTheme);
router.delete('/themes/:id',          EventController.deleteTheme);

// Package Types
router.get('/:eventId/package-types',    EventController.getPackageTypes);
router.post('/package-types',            EventController.createPackageType);
router.put('/package-types/:id',         EventController.updatePackageType);
router.delete('/package-types/:id',      EventController.deletePackageType);

// Timelines
router.get('/:eventId/timelines',        EventContentController.getTimelines);
router.post('/timelines',                EventContentController.createTimeline);
router.put('/timelines/:id',             EventContentController.updateTimeline);
router.delete('/timelines/:id',          EventContentController.deleteTimeline);

// Schedules
router.get('/:eventId/schedules',        EventContentController.getSchedules);
router.post('/schedules',                EventContentController.createSchedule);
router.put('/schedules/:id',             EventContentController.updateSchedule);
router.delete('/schedules/:id',          EventContentController.deleteSchedule);

// FAQs
router.get('/:eventId/faqs',             EventContentController.getFAQs);
router.post('/faqs',                     EventContentController.createFAQ);
router.put('/faqs/:id',                  EventContentController.updateFAQ);
router.delete('/faqs/:id',               EventContentController.deleteFAQ);

// Gallery
router.get('/:eventId/gallery',          EventContentController.getGallery);
router.post('/gallery',                  EventContentController.createGallery);
router.put('/gallery/:id',               EventContentController.updateGallery);
router.delete('/gallery/:id',            EventContentController.deleteGallery);

// Tags
router.get('/:eventId/tags',             EventContentController.getTags);
router.post('/:eventId/tags',            EventContentController.addTag);
router.delete('/tags/:id',               EventContentController.deleteTag);

// Policies
router.get('/:eventId/policies',         EventContentController.getPolicies);
router.post('/policies',                 EventContentController.createPolicy);
router.put('/policies/:id',              EventContentController.updatePolicy);
router.delete('/policies/:id',           EventContentController.deletePolicy);

// Terms
router.get('/:eventId/terms',            EventContentController.getTerms);
router.post('/terms',                    EventContentController.createTerms);
router.put('/terms/:id',                 EventContentController.updateTerms);
router.delete('/terms/:id',              EventContentController.deleteTerms);

// Checklists
router.get('/:eventId/checklists',       EventContentController.getChecklists);
router.post('/checklists',               EventContentController.createChecklist);
router.put('/checklists/:id',            EventContentController.updateChecklist);
router.delete('/checklists/:id',         EventContentController.deleteChecklist);

// Milestones
router.get('/:eventId/milestones',       EventContentController.getMilestones);
router.post('/milestones',               EventContentController.createMilestone);
router.put('/milestones/:id',            EventContentController.updateMilestone);
router.delete('/milestones/:id',         EventContentController.deleteMilestone);

// Requirements
router.get('/:eventId/requirements',     EventContentController.getRequirements);
router.post('/requirements',             EventContentController.createRequirement);
router.put('/requirements/:id',          EventContentController.updateRequirement);
router.delete('/requirements/:id',       EventContentController.deleteRequirement);

// Guest Config
router.get('/:eventId/guest-config',     EventContentController.getGuestConfig);
router.post('/guest-config',             EventContentController.createGuestConfig);
router.put('/guest-config/:id',          EventContentController.updateGuestConfig);
router.delete('/guest-config/:id',       EventContentController.deleteGuestConfig);

// Venues
router.get('/:eventId/venues',           EventContentController.getVenues);
router.post('/venues',                   EventContentController.createVenue);
router.put('/venues/:id',                EventContentController.updateVenue);
router.delete('/venues/:id',             EventContentController.deleteVenue);

// Features
router.get('/:eventId/features',         EventContentController.getFeatures);
router.post('/features',                 EventContentController.createFeature);
router.put('/features/:id',              EventContentController.updateFeature);
router.delete('/features/:id',           EventContentController.deleteFeature);

// Setting (upsert)
router.get('/:eventId/setting',          EventContentController.getSetting);
router.post('/:eventId/setting',         EventContentController.upsertSetting);

export default router;
