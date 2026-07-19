"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
exports.EventService = {
    // ─── Event CRUD ────────────────────────────────────────────────────────────
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        return prisma.event.findMany({
            where: Object.assign({ deletedAt: null }, (filters.status && { status: filters.status })),
            orderBy: { displayOrder: 'asc' },
            include: {
                categories: { include: { subCategories: true } },
                setting: true,
            },
        });
    }),
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma.event.findFirst({
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
        return prisma.event.findFirst({
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
        return prisma.event.create({ data });
    }),
    update: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma.event.update({ where: { id }, data });
    }),
    softDelete: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
    }),
    // ─── EventCategory CRUD ────────────────────────────────────────────────────
    getAllCategories: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma.eventCategory.findMany({
            where: Object.assign({}, (eventId && { eventId })),
            orderBy: { displayOrder: 'asc' },
            include: { subCategories: { orderBy: { displayOrder: 'asc' } } },
        });
    }),
    createCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma.eventCategory.create({ data });
    }),
    updateCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma.eventCategory.update({ where: { id }, data });
    }),
    deleteCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma.eventCategory.delete({ where: { id } });
    }),
    // ─── EventSubCategory CRUD ─────────────────────────────────────────────────
    createSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma.eventSubCategory.create({ data });
    }),
    updateSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma.eventSubCategory.update({ where: { id }, data });
    }),
    deleteSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma.eventSubCategory.delete({ where: { id } });
    }),
    // ─── EventType CRUD ────────────────────────────────────────────────────────
    getTypes: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma.eventType.findMany({ where: { eventId }, orderBy: { id: 'asc' } });
    }),
    createType: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma.eventType.create({ data });
    }),
    updateType: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma.eventType.update({ where: { id }, data });
    }),
    deleteType: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma.eventType.delete({ where: { id } });
    }),
    // ─── EventTheme CRUD ───────────────────────────────────────────────────────
    getThemes: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma.eventTheme.findMany({ where: { eventId } });
    }),
    createTheme: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma.eventTheme.create({ data });
    }),
    updateTheme: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma.eventTheme.update({ where: { id }, data });
    }),
    deleteTheme: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma.eventTheme.delete({ where: { id } });
    }),
    // ─── EventPackageType CRUD ─────────────────────────────────────────────────
    getPackageTypes: (0, catchServiceAsync_1.catchServiceAsync)(async (eventId) => {
        return prisma.eventPackageType.findMany({
            where: { eventId }, orderBy: { displayOrder: 'asc' },
        });
    }),
    createPackageType: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        return prisma.eventPackageType.create({ data });
    }),
    updatePackageType: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
        return prisma.eventPackageType.update({ where: { id }, data });
    }),
    deletePackageType: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
        return prisma.eventPackageType.delete({ where: { id } });
    }),
};
