import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export const EventContentService = {

  // ─── Timeline ──────────────────────────────────────────────────────────────
  getTimelines: catchServiceAsync(async (eventId: number) =>
    prisma.eventTimeline.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),

  createTimeline: catchServiceAsync(async (data: {
    eventId: number; title: string; description?: string;
    startTime?: string; endTime?: string; displayOrder?: number;
  }) => prisma.eventTimeline.create({ data })),

  updateTimeline: catchServiceAsync(async (id: number, data: Partial<{
    title: string; description: string; startTime: string; endTime: string; displayOrder: number;
  }>) => prisma.eventTimeline.update({ where: { id }, data })),

  deleteTimeline: catchServiceAsync(async (id: number) =>
    prisma.eventTimeline.delete({ where: { id } })),

  // ─── Schedule ──────────────────────────────────────────────────────────────
  getSchedules: catchServiceAsync(async (eventId: number) =>
    prisma.eventSchedule.findMany({ where: { eventId }, orderBy: { dayNumber: 'asc' } })),

  createSchedule: catchServiceAsync(async (data: {
    eventId: number; dayNumber: number; title: string;
    startTime?: string; endTime?: string; description?: string;
  }) => prisma.eventSchedule.create({ data })),

  updateSchedule: catchServiceAsync(async (id: number, data: Partial<{
    dayNumber: number; title: string; startTime: string; endTime: string; description: string;
  }>) => prisma.eventSchedule.update({ where: { id }, data })),

  deleteSchedule: catchServiceAsync(async (id: number) =>
    prisma.eventSchedule.delete({ where: { id } })),

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  getFAQs: catchServiceAsync(async (eventId: number) =>
    prisma.eventFAQ.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),

  createFAQ: catchServiceAsync(async (data: {
    eventId: number; question: string; answer: string; displayOrder?: number;
  }) => prisma.eventFAQ.create({ data })),

  updateFAQ: catchServiceAsync(async (id: number, data: Partial<{
    question: string; answer: string; displayOrder: number;
  }>) => prisma.eventFAQ.update({ where: { id }, data })),

  deleteFAQ: catchServiceAsync(async (id: number) =>
    prisma.eventFAQ.delete({ where: { id } })),

  // ─── Gallery ───────────────────────────────────────────────────────────────
  getGallery: catchServiceAsync(async (eventId: number) =>
    prisma.eventGallery.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),

  createGalleryItem: catchServiceAsync(async (data: {
    eventId: number; image?: string; video?: string; thumbnail?: string; displayOrder?: number;
  }) => prisma.eventGallery.create({ data })),

  updateGalleryItem: catchServiceAsync(async (id: number, data: Partial<{
    image: string; video: string; thumbnail: string; displayOrder: number;
  }>) => prisma.eventGallery.update({ where: { id }, data })),

  deleteGalleryItem: catchServiceAsync(async (id: number) =>
    prisma.eventGallery.delete({ where: { id } })),

  // ─── Tags ──────────────────────────────────────────────────────────────────
  getTags: catchServiceAsync(async (eventId: number) =>
    prisma.eventTag.findMany({ where: { eventId } })),

  addTag: catchServiceAsync(async (eventId: number, tag: string) =>
    prisma.eventTag.upsert({
      where:  { eventId_tag: { eventId, tag } },
      create: { eventId, tag },
      update: {},
    })),

  deleteTag: catchServiceAsync(async (id: number) =>
    prisma.eventTag.delete({ where: { id } })),

  // ─── Policy ────────────────────────────────────────────────────────────────
  getPolicies: catchServiceAsync(async (eventId: number) =>
    prisma.eventPolicy.findMany({ where: { eventId } })),

  createPolicy: catchServiceAsync(async (data: {
    eventId: number; policyTitle: string; policyDescription: string;
  }) => prisma.eventPolicy.create({ data })),

  updatePolicy: catchServiceAsync(async (id: number, data: Partial<{
    policyTitle: string; policyDescription: string;
  }>) => prisma.eventPolicy.update({ where: { id }, data })),

  deletePolicy: catchServiceAsync(async (id: number) =>
    prisma.eventPolicy.delete({ where: { id } })),

  // ─── Terms ─────────────────────────────────────────────────────────────────
  getTerms: catchServiceAsync(async (eventId: number) =>
    prisma.eventTerms.findMany({ where: { eventId }, orderBy: { version: 'desc' } })),

  createTerms: catchServiceAsync(async (data: {
    eventId: number; title: string; description: string; version?: string; effectiveDate?: Date;
  }) => prisma.eventTerms.create({ data })),

  updateTerms: catchServiceAsync(async (id: number, data: Partial<{
    title: string; description: string; version: string; effectiveDate: Date;
  }>) => prisma.eventTerms.update({ where: { id }, data })),

  deleteTerms: catchServiceAsync(async (id: number) =>
    prisma.eventTerms.delete({ where: { id } })),

  // ─── Checklist ─────────────────────────────────────────────────────────────
  getChecklists: catchServiceAsync(async (eventId: number) =>
    prisma.eventChecklist.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),

  createChecklist: catchServiceAsync(async (data: {
    eventId: number; title: string; description?: string; displayOrder?: number; isRequired?: boolean;
  }) => prisma.eventChecklist.create({ data })),

  updateChecklist: catchServiceAsync(async (id: number, data: Partial<{
    title: string; description: string; displayOrder: number; isRequired: boolean;
  }>) => prisma.eventChecklist.update({ where: { id }, data })),

  deleteChecklist: catchServiceAsync(async (id: number) =>
    prisma.eventChecklist.delete({ where: { id } })),

  // ─── Milestones ────────────────────────────────────────────────────────────
  getMilestones: catchServiceAsync(async (eventId: number) =>
    prisma.eventMilestone.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),

  createMilestone: catchServiceAsync(async (data: {
    eventId: number; title: string; description?: string; dayOffset?: number; displayOrder?: number;
  }) => prisma.eventMilestone.create({ data })),

  updateMilestone: catchServiceAsync(async (id: number, data: Partial<{
    title: string; description: string; dayOffset: number; displayOrder: number;
  }>) => prisma.eventMilestone.update({ where: { id }, data })),

  deleteMilestone: catchServiceAsync(async (id: number) =>
    prisma.eventMilestone.delete({ where: { id } })),
};
