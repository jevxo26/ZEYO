"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceContentService = void 0;
// ─────────────────────────────────────────────────────────────────────────────
// ServiceContentService
// Gallery, FAQ, Policy, Analytics, Tag, Setting
// ─────────────────────────────────────────────────────────────────────────────
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
exports.ServiceContentService = {
    // ── Gallery ─────────────────────────────────────────────────────────────────
    getGallery: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceGallery.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),
    createGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceGallery.create({ data })),
    updateGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceGallery.update({ where: { id }, data })),
    deleteGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceGallery.delete({ where: { id } })),
    // ── FAQ ─────────────────────────────────────────────────────────────────────
    getFAQs: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceFAQ.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),
    createFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceFAQ.create({ data })),
    updateFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceFAQ.update({ where: { id }, data })),
    deleteFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceFAQ.delete({ where: { id } })),
    // ── Policy ──────────────────────────────────────────────────────────────────
    getPolicies: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.servicePolicy.findMany({ where: { serviceId } })),
    createPolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.servicePolicy.create({ data })),
    updatePolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.servicePolicy.update({ where: { id }, data })),
    deletePolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.servicePolicy.delete({ where: { id } })),
    // ── Analytics ───────────────────────────────────────────────────────────────
    getAnalytics: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceAnalytics.findUnique({ where: { serviceId } })),
    upsertAnalytics: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, data) => prisma.serviceAnalytics.upsert({
        where: { serviceId },
        create: Object.assign({ serviceId }, data),
        update: data,
    })),
    // ── Tags ────────────────────────────────────────────────────────────────────
    getTags: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceTag.findMany({ where: { serviceId } })),
    addTag: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, tag) => prisma.serviceTag.upsert({
        where: { serviceId_tag: { serviceId, tag } },
        create: { serviceId, tag },
        update: {},
    })),
    deleteTag: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceTag.delete({ where: { id } })),
    // ── Setting ─────────────────────────────────────────────────────────────────
    getSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceSetting.findUnique({ where: { serviceId } })),
    upsertSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, data) => prisma.serviceSetting.upsert({
        where: { serviceId },
        create: Object.assign({ serviceId }, data),
        update: data,
    })),
};
