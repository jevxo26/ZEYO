"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
// ─────────────────────────────────────────────────────────────────────────────
// ServiceService
// CRUD for Service, ServiceCategory, ServiceSubCategory,
// ServiceType, ServiceOption, ServiceConfiguration, ServiceVariant, ServiceCoverage
// ─────────────────────────────────────────────────────────────────────────────
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
exports.ServiceService = {
    // ── Services ────────────────────────────────────────────────────────────────
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => prisma.service.findMany({
        where: Object.assign(Object.assign({ deletedAt: null }, (filters.status && { status: filters.status })), (filters.categoryId && { categoryId: filters.categoryId })),
        orderBy: { displayOrder: 'asc' },
        include: { category: true, setting: true, pricing: true },
    })),
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.service.findFirst({
        where: { id, deletedAt: null },
        include: {
            category: true, types: true, options: true,
            configurations: { include: { variants: true } },
            coverages: true, pricing: true, zonePricing: true,
            addons: true, attributes: true, requirements: true,
            availability: true, gallery: true, faqs: true,
            policies: true, analytics: true, tags: true, setting: true,
        },
    })),
    getBySlug: (0, catchServiceAsync_1.catchServiceAsync)(async (slug) => prisma.service.findFirst({
        where: { slug, deletedAt: null },
        include: {
            category: true, types: true, options: true,
            configurations: { orderBy: { displayOrder: 'asc' }, include: { variants: true } },
            coverages: true, pricing: true, addons: true,
            gallery: { orderBy: { displayOrder: 'asc' } },
            faqs: { orderBy: { displayOrder: 'asc' } },
            tags: true, setting: true,
        },
    })),
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.service.create({ data })),
    update: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.service.update({ where: { id }, data })),
    softDelete: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.service.update({ where: { id }, data: { deletedAt: new Date() } })),
    // ── ServiceCategory ─────────────────────────────────────────────────────────
    getAllCategories: (0, catchServiceAsync_1.catchServiceAsync)(async () => prisma.serviceCategory.findMany({
        orderBy: { displayOrder: 'asc' },
        include: { subCategories: { orderBy: { displayOrder: 'asc' } } },
    })),
    createCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceCategory.create({ data })),
    updateCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceCategory.update({ where: { id }, data })),
    deleteCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceCategory.delete({ where: { id } })),
    // ── ServiceSubCategory ──────────────────────────────────────────────────────
    createSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceSubCategory.create({ data })),
    updateSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceSubCategory.update({ where: { id }, data })),
    deleteSubCategory: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceSubCategory.delete({ where: { id } })),
    // ── ServiceType ─────────────────────────────────────────────────────────────
    getTypes: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceType.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),
    createType: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceType.create({ data })),
    updateType: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceType.update({ where: { id }, data })),
    deleteType: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceType.delete({ where: { id } })),
    // ── ServiceOption ───────────────────────────────────────────────────────────
    getOptions: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceOption.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),
    createOption: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceOption.create({ data })),
    updateOption: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceOption.update({ where: { id }, data })),
    deleteOption: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceOption.delete({ where: { id } })),
    // ── ServiceConfiguration & Variants ─────────────────────────────────────────
    getConfigurations: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceConfiguration.findMany({
        where: { serviceId }, orderBy: { displayOrder: 'asc' },
        include: { variants: true },
    })),
    createConfiguration: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceConfiguration.create({ data })),
    updateConfiguration: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceConfiguration.update({ where: { id }, data })),
    deleteConfiguration: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceConfiguration.delete({ where: { id } })),
    createVariant: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceVariant.create({ data })),
    updateVariant: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceVariant.update({ where: { id }, data })),
    deleteVariant: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceVariant.delete({ where: { id } })),
    // ── ServiceCoverage ─────────────────────────────────────────────────────────
    getCoverages: (0, catchServiceAsync_1.catchServiceAsync)(async (serviceId) => prisma.serviceCoverage.findMany({ where: { serviceId } })),
    createCoverage: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma.serviceCoverage.create({ data })),
    updateCoverage: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma.serviceCoverage.update({ where: { id }, data })),
    deleteCoverage: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma.serviceCoverage.delete({ where: { id } })),
};
