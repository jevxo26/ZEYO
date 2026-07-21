"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventContentService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
exports.EventContentService = {
    // ─── Timeline ──────────────────────────────────────────────────────────────
    getTimelines: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventTimeline.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),
    createTimeline: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventTimeline.create({ data })),
    updateTimeline: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventTimeline.update({ where: { id }, data })),
    deleteTimeline: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventTimeline.delete({ where: { id } })),
    // ─── Schedule ──────────────────────────────────────────────────────────────
    getSchedules: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventSchedule.findMany({ where: { eventId }, orderBy: { dayNumber: 'asc' } })),
    createSchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventSchedule.create({ data })),
    updateSchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventSchedule.update({ where: { id }, data })),
    deleteSchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventSchedule.delete({ where: { id } })),
    // ─── FAQ ───────────────────────────────────────────────────────────────────
    getFAQs: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventFAQ.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),
    createFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventFAQ.create({ data })),
    updateFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventFAQ.update({ where: { id }, data })),
    deleteFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventFAQ.delete({ where: { id } })),
    // ─── Gallery ───────────────────────────────────────────────────────────────
    getGallery: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventGallery.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),
    createGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventGallery.create({ data })),
    updateGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventGallery.update({ where: { id }, data })),
    deleteGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventGallery.delete({ where: { id } })),
    // ─── Tags ──────────────────────────────────────────────────────────────────
    getTags: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventTag.findMany({ where: { eventId } })),
    addTag: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId, tag) => prisma_1.prisma.eventTag.upsert({
        where: { eventId_tag: { eventId, tag } },
        create: { eventId, tag },
        update: {},
    })),
    deleteTag: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventTag.delete({ where: { id } })),
    // ─── Policy ────────────────────────────────────────────────────────────────
    getPolicies: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventPolicy.findMany({ where: { eventId } })),
    createPolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventPolicy.create({ data })),
    updatePolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventPolicy.update({ where: { id }, data })),
    deletePolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventPolicy.delete({ where: { id } })),
    // ─── Terms ─────────────────────────────────────────────────────────────────
    getTerms: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventTerms.findMany({ where: { eventId }, orderBy: { version: 'desc' } })),
    createTerms: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventTerms.create({ data })),
    updateTerms: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventTerms.update({ where: { id }, data })),
    deleteTerms: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventTerms.delete({ where: { id } })),
    // ─── Checklist ─────────────────────────────────────────────────────────────
    getChecklists: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventChecklist.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),
    createChecklist: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventChecklist.create({ data })),
    updateChecklist: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventChecklist.update({ where: { id }, data })),
    deleteChecklist: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventChecklist.delete({ where: { id } })),
    // ─── Milestones ────────────────────────────────────────────────────────────
    getMilestones: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma_1.prisma.eventMilestone.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),
    createMilestone: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.eventMilestone.create({ data })),
    updateMilestone: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.eventMilestone.update({ where: { id }, data })),
    deleteMilestone: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.eventMilestone.delete({ where: { id } })),
};
