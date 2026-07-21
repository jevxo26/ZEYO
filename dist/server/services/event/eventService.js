"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
exports.EventService = {
    // ─── Event CRUD ────────────────────────────────────────────────────────────
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        return prisma_1.prisma.event.findMany({
            where: Object.assign({ deletedAt: null }, (filters.status && { status: filters.status })),
            orderBy: { displayOrder: 'asc' },
            include: {
                categories: { include: { subCategories: true } },
                setting: true,
            },
        });
    }),
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma_1.prisma.event.findFirst({
            where: { id, deletedAt: null },
            include: {
                categories: { include: { subCategories: true } },
                types: true,
                themes: true,
                packageTypes: true,
                timelines: true,
                schedules: true,
                requirements: true,
                guestConfig: true,
                venues: true,
                checklists: true,
                milestones: true,
                policies: true,
                terms: true,
                faqs: true,
                gallery: true,
                tags: true,
                features: true,
                setting: true,
            },
        });
    }),
    getBySlug: (0, catchServiceAsync_1.catchServiceAsync)(async (slug) => {
        return prisma_1.prisma.event.findFirst({
            where: { slug, deletedAt: null },
            include: {
                categories: { include: { subCategories: true } },
                types: true,
                themes: true,
                packageTypes: true,
                timelines: { orderBy: { displayOrder: 'asc' } },
                faqs: { orderBy: { displayOrder: 'asc' } },
                gallery: { orderBy: { displayOrder: 'asc' } },
                tags: true,
                features: { orderBy: { displayOrder: 'asc' } },
                setting: true,
            },
        });
    }),
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma_1.prisma.event.create({ data });
    }),
    update: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma_1.prisma.event.update({ where: { id }, data });
    }),
    softDelete: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma_1.prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
    }),
    // ─── EventCategory CRUD ────────────────────────────────────────────────────
    getAllCategories: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma_1.prisma.eventCategory.findMany({
            where: Object.assign({}, (eventId && { eventId })),
            orderBy: { displayOrder: 'asc' },
            include: { subCategories: { orderBy: { displayOrder: 'asc' } } },
        });
    }),
    createCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma_1.prisma.eventCategory.create({ data });
    }),
    updateCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma_1.prisma.eventCategory.update({ where: { id }, data });
    }),
    deleteCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma_1.prisma.eventCategory.delete({ where: { id } });
    }),
    // ─── EventSubCategory CRUD ─────────────────────────────────────────────────
    createSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma_1.prisma.eventSubCategory.create({ data });
    }),
    updateSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma_1.prisma.eventSubCategory.update({ where: { id }, data });
    }),
    deleteSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma_1.prisma.eventSubCategory.delete({ where: { id } });
    }),
    // ─── EventType CRUD ────────────────────────────────────────────────────────
    getTypes: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma_1.prisma.eventType.findMany({ where: { eventId }, orderBy: { id: 'asc' } });
    }),
    createType: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma_1.prisma.eventType.create({ data });
    }),
    updateType: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma_1.prisma.eventType.update({ where: { id }, data });
    }),
    deleteType: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma_1.prisma.eventType.delete({ where: { id } });
    }),
    // ─── EventTheme CRUD ───────────────────────────────────────────────────────
    getThemes: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma_1.prisma.eventTheme.findMany({ where: { eventId } });
    }),
    createTheme: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma_1.prisma.eventTheme.create({ data });
    }),
    updateTheme: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma_1.prisma.eventTheme.update({ where: { id }, data });
    }),
    deleteTheme: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma_1.prisma.eventTheme.delete({ where: { id } });
    }),
    // ─── EventPackageType CRUD ─────────────────────────────────────────────────
    getPackageTypes: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma_1.prisma.eventPackageType.findMany({
            where: { eventId }, orderBy: { displayOrder: 'asc' },
        });
    }),
    createPackageType: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma_1.prisma.eventPackageType.create({ data });
    }),
    updatePackageType: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma_1.prisma.eventPackageType.update({ where: { id }, data });
    }),
    deletePackageType: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma_1.prisma.eventPackageType.delete({ where: { id } });
    }),
};
