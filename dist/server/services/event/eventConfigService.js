"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventConfigService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
exports.EventConfigService = {
    // ─── Requirement ───────────────────────────────────────────────────────────
    getRequirements: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma.eventRequirement.findMany({ where: { eventId } })),
    createRequirement: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.eventRequirement.create({ data })),
    updateRequirement: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.eventRequirement.update({ where: { id }, data })),
    deleteRequirement: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.eventRequirement.delete({ where: { id } })),
    // ─── Guest Config ──────────────────────────────────────────────────────────
    getGuestConfig: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma.eventGuest.findMany({ where: { eventId } })),
    createGuestConfig: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.eventGuest.create({ data })),
    updateGuestConfig: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.eventGuest.update({ where: { id }, data })),
    deleteGuestConfig: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.eventGuest.delete({ where: { id } })),
    // ─── Venue ─────────────────────────────────────────────────────────────────
    getVenues: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma.eventVenue.findMany({ where: { eventId } })),
    createVenue: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.eventVenue.create({ data })),
    updateVenue: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.eventVenue.update({ where: { id }, data })),
    deleteVenue: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.eventVenue.delete({ where: { id } })),
    // ─── Feature ───────────────────────────────────────────────────────────────
    getFeatures: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma.eventFeature.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),
    createFeature: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.eventFeature.create({ data })),
    updateFeature: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.eventFeature.update({ where: { id }, data })),
    deleteFeature: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.eventFeature.delete({ where: { id } })),
    // ─── Setting ───────────────────────────────────────────────────────────────
    getSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => prisma.eventSetting.findUnique({ where: { eventId } })),
    upsertSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId, data) => prisma.eventSetting.upsert({
        where: { eventId },
        create: Object.assign({ eventId }, data),
        update: data,
    })),
};
