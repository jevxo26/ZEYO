import { prisma } from '../../config/prisma';
// ─────────────────────────────────────────────────────────────────────────────
// ServiceService
// CRUD for Service, ServiceCategory, ServiceSubCategory,
// ServiceType, ServiceOption, ServiceConfiguration, ServiceVariant, ServiceCoverage
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export const ServiceService = {

  // ── Services ────────────────────────────────────────────────────────────────
  getAll: catchServiceAsync(async (filters: { status?: string; categoryId?: number } = {}) =>
    prisma.service.findMany({
      where: {
        deletedAt: null,
        ...(filters.status     && { status: filters.status }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
      },
      orderBy: { displayOrder: 'asc' },
      include: { category: true, setting: true, pricing: true },
    })),

  getById: catchServiceAsync(async (id: number) =>
    prisma.service.findFirst({
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

  getBySlug: catchServiceAsync(async (slug: string) =>
    prisma.service.findFirst({
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

  create: catchServiceAsync(async (data: {
    categoryId: number; name: string; slug: string; code?: string;
    description?: string; shortDescription?: string; icon?: string;
    thumbnail?: string; banner?: string; startingPrice?: number;
    status?: string; displayOrder?: number;
  }) => prisma.service.create({ data })),

  update: catchServiceAsync(async (id: number, data: Partial<{
    categoryId: number; name: string; slug: string; code: string;
    description: string; shortDescription: string; icon: string;
    thumbnail: string; banner: string; startingPrice: number;
    status: string; displayOrder: number;
  }>) => prisma.service.update({ where: { id }, data })),

  softDelete: catchServiceAsync(async (id: number) =>
    prisma.service.update({ where: { id }, data: { deletedAt: new Date() } })),

  // ── ServiceCategory ─────────────────────────────────────────────────────────
  getAllCategories: catchServiceAsync(async () =>
    prisma.serviceCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { subCategories: { orderBy: { displayOrder: 'asc' } } },
    })),

  createCategory: catchServiceAsync(async (data: {
    name: string; slug: string; description?: string;
    icon?: string; displayOrder?: number; status?: string;
  }) => prisma.serviceCategory.create({ data })),

  updateCategory: catchServiceAsync(async (id: number, data: Partial<{
    name: string; slug: string; description: string;
    icon: string; displayOrder: number; status: string;
  }>) => prisma.serviceCategory.update({ where: { id }, data })),

  deleteCategory: catchServiceAsync(async (id: number) =>
    prisma.serviceCategory.delete({ where: { id } })),

  // ── ServiceSubCategory ──────────────────────────────────────────────────────
  createSubCategory: catchServiceAsync(async (data: {
    serviceCategoryId: number; name: string;
    description?: string; displayOrder?: number; status?: string;
  }) => prisma.serviceSubCategory.create({ data })),

  updateSubCategory: catchServiceAsync(async (id: number, data: Partial<{
    name: string; description: string; displayOrder: number; status: string;
  }>) => prisma.serviceSubCategory.update({ where: { id }, data })),

  deleteSubCategory: catchServiceAsync(async (id: number) =>
    prisma.serviceSubCategory.delete({ where: { id } })),

  // ── ServiceType ─────────────────────────────────────────────────────────────
  getTypes: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceType.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),

  createType: catchServiceAsync(async (data: {
    serviceId: number; name: string; description?: string;
    displayOrder?: number; status?: string;
  }) => prisma.serviceType.create({ data })),

  updateType: catchServiceAsync(async (id: number, data: Partial<{
    name: string; description: string; displayOrder: number; status: string;
  }>) => prisma.serviceType.update({ where: { id }, data })),

  deleteType: catchServiceAsync(async (id: number) =>
    prisma.serviceType.delete({ where: { id } })),

  // ── ServiceOption ───────────────────────────────────────────────────────────
  getOptions: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceOption.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),

  createOption: catchServiceAsync(async (data: {
    serviceId: number; name: string; description?: string;
    displayOrder?: number; status?: string;
  }) => prisma.serviceOption.create({ data })),

  updateOption: catchServiceAsync(async (id: number, data: Partial<{
    name: string; description: string; displayOrder: number; status: string;
  }>) => prisma.serviceOption.update({ where: { id }, data })),

  deleteOption: catchServiceAsync(async (id: number) =>
    prisma.serviceOption.delete({ where: { id } })),

  // ── ServiceConfiguration & Variants ─────────────────────────────────────────
  getConfigurations: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceConfiguration.findMany({
      where: { serviceId }, orderBy: { displayOrder: 'asc' },
      include: { variants: true },
    })),

  createConfiguration: catchServiceAsync(async (data: {
    serviceId: number; configurationName: string; fieldType?: string;
    isRequired?: boolean; displayOrder?: number; defaultValue?: string;
  }) => prisma.serviceConfiguration.create({ data })),

  updateConfiguration: catchServiceAsync(async (id: number, data: Partial<{
    configurationName: string; fieldType: string; isRequired: boolean;
    displayOrder: number; defaultValue: string;
  }>) => prisma.serviceConfiguration.update({ where: { id }, data })),

  deleteConfiguration: catchServiceAsync(async (id: number) =>
    prisma.serviceConfiguration.delete({ where: { id } })),

  createVariant: catchServiceAsync(async (data: {
    serviceConfigurationId: number; name: string;
    description?: string; additionalPrice?: number; status?: string;
  }) => prisma.serviceVariant.create({ data })),

  updateVariant: catchServiceAsync(async (id: number, data: Partial<{
    name: string; description: string; additionalPrice: number; status: string;
  }>) => prisma.serviceVariant.update({ where: { id }, data })),

  deleteVariant: catchServiceAsync(async (id: number) =>
    prisma.serviceVariant.delete({ where: { id } })),

  // ── ServiceCoverage ─────────────────────────────────────────────────────────
  getCoverages: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceCoverage.findMany({ where: { serviceId } })),

  createCoverage: catchServiceAsync(async (data: {
    serviceId: number; coverageName: string; duration: number; unit?: string;
  }) => prisma.serviceCoverage.create({ data })),

  updateCoverage: catchServiceAsync(async (id: number, data: Partial<{
    coverageName: string; duration: number; unit: string;
  }>) => prisma.serviceCoverage.update({ where: { id }, data })),

  deleteCoverage: catchServiceAsync(async (id: number) =>
    prisma.serviceCoverage.delete({ where: { id } })),
};
