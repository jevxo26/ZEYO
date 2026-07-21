"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceContentService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
exports.ServiceContentService = {
    // ── Gallery ─────────────────────────────────────────────────────────────────
    getGallery: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceGallery.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),
    createGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.serviceGallery.create({ data })),
    updateGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.serviceGallery.update({ where: { id }, data })),
    deleteGalleryItem: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceGallery.delete({ where: { id } })),
    // ── FAQ ─────────────────────────────────────────────────────────────────────
    getFAQs: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceFAQ.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),
    createFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.serviceFAQ.create({ data })),
    updateFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.serviceFAQ.update({ where: { id }, data })),
    deleteFAQ: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceFAQ.delete({ where: { id } })),
    // ── Policy ──────────────────────────────────────────────────────────────────
    getPolicies: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.servicePolicy.findMany({ where: { serviceId } })),
    createPolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.servicePolicy.create({ data })),
    updatePolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.servicePolicy.update({ where: { id }, data })),
    deletePolicy: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.servicePolicy.delete({ where: { id } })),
    // ── Analytics ───────────────────────────────────────────────────────────────
    getAnalytics: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceAnalytics.findUnique({ where: { serviceId } })),
    upsertAnalytics: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, data) => prisma_1.prisma.serviceAnalytics.upsert({
        where: { serviceId },
        create: Object.assign({ serviceId }, data),
        update: data,
    })),
    // ── Tags ────────────────────────────────────────────────────────────────────
    getTags: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceTag.findMany({ where: { serviceId } })),
    addTag: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, tag) => prisma_1.prisma.serviceTag.upsert({
        where: { serviceId_tag: { serviceId, tag } },
        create: { serviceId, tag },
        update: {},
    })),
    deleteTag: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.serviceTag.delete({ where: { id } })),
    // ── Setting ─────────────────────────────────────────────────────────────────
    getSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma_1.prisma.serviceSetting.findUnique({ where: { serviceId } })),
    upsertSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId, data) => prisma_1.prisma.serviceSetting.upsert({
        where: { serviceId },
        create: Object.assign({ serviceId }, data),
        update: data,
    })),
};
