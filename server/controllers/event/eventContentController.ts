import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { EventContentService } from '../../services/event/eventContentService';
import { EventConfigService } from '../../services/event/eventConfigService';

export class EventContentController {

  // ─── Timeline ──────────────────────────────────────────────────────────────
  static getTimelines     = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getTimelines(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createTimeline   = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createTimeline(req.body); sendResponse(res, { statusCode: 201, message: 'Timeline created', data: d }); });
  static updateTimeline   = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updateTimeline(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Timeline updated', data: d }); });
  static deleteTimeline   = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteTimeline(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Timeline deleted', data: null }); });

  // ─── Schedule ──────────────────────────────────────────────────────────────
  static getSchedules     = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getSchedules(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createSchedule   = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createSchedule(req.body); sendResponse(res, { statusCode: 201, message: 'Schedule created', data: d }); });
  static updateSchedule   = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updateSchedule(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Schedule updated', data: d }); });
  static deleteSchedule   = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteSchedule(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Schedule deleted', data: null }); });

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  static getFAQs          = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getFAQs(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createFAQ        = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createFAQ(req.body); sendResponse(res, { statusCode: 201, message: 'FAQ created', data: d }); });
  static updateFAQ        = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updateFAQ(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'FAQ updated', data: d }); });
  static deleteFAQ        = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteFAQ(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'FAQ deleted', data: null }); });

  // ─── Gallery ───────────────────────────────────────────────────────────────
  static getGallery       = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getGallery(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createGallery    = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createGalleryItem(req.body); sendResponse(res, { statusCode: 201, message: 'Gallery item added', data: d }); });
  static updateGallery    = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updateGalleryItem(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Gallery item updated', data: d }); });
  static deleteGallery    = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteGalleryItem(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Gallery item deleted', data: null }); });

  // ─── Tags ──────────────────────────────────────────────────────────────────
  static getTags          = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getTags(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static addTag           = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.addTag(Number(req.params.eventId), req.body.tag); sendResponse(res, { statusCode: 201, message: 'Tag added', data: d }); });
  static deleteTag        = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteTag(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Tag removed', data: null }); });

  // ─── Policy ────────────────────────────────────────────────────────────────
  static getPolicies      = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getPolicies(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createPolicy     = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createPolicy(req.body); sendResponse(res, { statusCode: 201, message: 'Policy created', data: d }); });
  static updatePolicy     = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updatePolicy(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Policy updated', data: d }); });
  static deletePolicy     = catchAsync(async (req: Request, res: Response) => { await EventContentService.deletePolicy(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Policy deleted', data: null }); });

  // ─── Terms ─────────────────────────────────────────────────────────────────
  static getTerms         = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getTerms(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createTerms      = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createTerms(req.body); sendResponse(res, { statusCode: 201, message: 'Terms created', data: d }); });
  static updateTerms      = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updateTerms(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Terms updated', data: d }); });
  static deleteTerms      = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteTerms(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Terms deleted', data: null }); });

  // ─── Checklist ─────────────────────────────────────────────────────────────
  static getChecklists    = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getChecklists(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createChecklist  = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createChecklist(req.body); sendResponse(res, { statusCode: 201, message: 'Checklist item created', data: d }); });
  static updateChecklist  = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updateChecklist(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Checklist item updated', data: d }); });
  static deleteChecklist  = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteChecklist(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Checklist item deleted', data: null }); });

  // ─── Milestones ────────────────────────────────────────────────────────────
  static getMilestones    = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.getMilestones(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createMilestone  = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.createMilestone(req.body); sendResponse(res, { statusCode: 201, message: 'Milestone created', data: d }); });
  static updateMilestone  = catchAsync(async (req: Request, res: Response) => { const d = await EventContentService.updateMilestone(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Milestone updated', data: d }); });
  static deleteMilestone  = catchAsync(async (req: Request, res: Response) => { await EventContentService.deleteMilestone(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Milestone deleted', data: null }); });

  // ─── Requirement ───────────────────────────────────────────────────────────
  static getRequirements    = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.getRequirements(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createRequirement  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.createRequirement(req.body); sendResponse(res, { statusCode: 201, message: 'Requirement added', data: d }); });
  static updateRequirement  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.updateRequirement(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Requirement updated', data: d }); });
  static deleteRequirement  = catchAsync(async (req: Request, res: Response) => { await EventConfigService.deleteRequirement(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Requirement removed', data: null }); });

  // ─── Guest Config ──────────────────────────────────────────────────────────
  static getGuestConfig     = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.getGuestConfig(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createGuestConfig  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.createGuestConfig(req.body); sendResponse(res, { statusCode: 201, message: 'Guest config created', data: d }); });
  static updateGuestConfig  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.updateGuestConfig(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Guest config updated', data: d }); });
  static deleteGuestConfig  = catchAsync(async (req: Request, res: Response) => { await EventConfigService.deleteGuestConfig(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Guest config deleted', data: null }); });

  // ─── Venue ─────────────────────────────────────────────────────────────────
  static getVenues    = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.getVenues(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createVenue  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.createVenue(req.body); sendResponse(res, { statusCode: 201, message: 'Venue created', data: d }); });
  static updateVenue  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.updateVenue(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Venue updated', data: d }); });
  static deleteVenue  = catchAsync(async (req: Request, res: Response) => { await EventConfigService.deleteVenue(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Venue deleted', data: null }); });

  // ─── Feature ───────────────────────────────────────────────────────────────
  static getFeatures    = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.getFeatures(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static createFeature  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.createFeature(req.body); sendResponse(res, { statusCode: 201, message: 'Feature created', data: d }); });
  static updateFeature  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.updateFeature(Number(req.params.id), req.body); sendResponse(res, { statusCode: 200, message: 'Feature updated', data: d }); });
  static deleteFeature  = catchAsync(async (req: Request, res: Response) => { await EventConfigService.deleteFeature(Number(req.params.id)); sendResponse(res, { statusCode: 200, message: 'Feature deleted', data: null }); });

  // ─── Setting ───────────────────────────────────────────────────────────────
  static getSetting     = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.getSetting(Number(req.params.eventId)); sendResponse(res, { statusCode: 200, data: d }); });
  static upsertSetting  = catchAsync(async (req: Request, res: Response) => { const d = await EventConfigService.upsertSetting(Number(req.params.eventId), req.body); sendResponse(res, { statusCode: 200, message: 'Setting saved', data: d }); });
}
