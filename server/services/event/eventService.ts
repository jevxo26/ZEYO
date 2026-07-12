import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export const EventService = {

  // ─── Event CRUD ────────────────────────────────────────────────────────────

  getAll: catchServiceAsync(async (filters: { status?: string } = {}) => {
    return prisma.event.findMany({
      where: {
        deletedAt: null,
        ...(filters.status && { status: filters.status }),
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        categories: { include: { subCategories: true } },
        setting: true,
      },
    });
  }),

  getById: catchServiceAsync(async (id: number) => {
    return prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        categories:   { include: { subCategories: true } },
        types:        true,
        themes:       true,
        packageTypes: true,
        timelines:    true,
        schedules:    true,
        requirements: true,
        guestConfig:  true,
        venues:       true,
        checklists:   true,
        milestones:   true,
        policies:     true,
        terms:        true,
        faqs:         true,
        gallery:      true,
        tags:         true,
        features:     true,
        setting:      true,
      },
    });
  }),

  getBySlug: catchServiceAsync(async (slug: string) => {
    return prisma.event.findFirst({
      where: { slug, deletedAt: null },
      include: {
        categories:   { include: { subCategories: true } },
        types:        true,
        themes:       true,
        packageTypes: true,
        timelines:    { orderBy: { displayOrder: 'asc' } },
        faqs:         { orderBy: { displayOrder: 'asc' } },
        gallery:      { orderBy: { displayOrder: 'asc' } },
        tags:         true,
        features:     { orderBy: { displayOrder: 'asc' } },
        setting:      true,
      },
    });
  }),

  create: catchServiceAsync(async (data: {
    name: string; slug: string; description?: string;
    icon?: string; banner?: string; status?: string; displayOrder?: number;
  }) => {
    return prisma.event.create({ data });
  }),

  update: catchServiceAsync(async (id: number, data: Partial<{
    name: string; slug: string; description: string;
    icon: string; banner: string; status: string; displayOrder: number;
  }>) => {
    return prisma.event.update({ where: { id }, data });
  }),

  softDelete: catchServiceAsync(async (id: number) => {
    return prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });
  }),

  // ─── EventCategory CRUD ────────────────────────────────────────────────────

  getAllCategories: catchServiceAsync(async (eventId?: number) => {
    return prisma.eventCategory.findMany({
      where: { ...(eventId && { eventId }) },
      orderBy: { displayOrder: 'asc' },
      include: { subCategories: { orderBy: { displayOrder: 'asc' } } },
    });
  }),

  createCategory: catchServiceAsync(async (data: {
    eventId: number; name: string; slug: string;
    description?: string; icon?: string; displayOrder?: number; status?: string;
  }) => {
    return prisma.eventCategory.create({ data });
  }),

  updateCategory: catchServiceAsync(async (id: number, data: Partial<{
    name: string; slug: string; description: string;
    icon: string; displayOrder: number; status: string;
  }>) => {
    return prisma.eventCategory.update({ where: { id }, data });
  }),

  deleteCategory: catchServiceAsync(async (id: number) => {
    return prisma.eventCategory.delete({ where: { id } });
  }),

  // ─── EventSubCategory CRUD ─────────────────────────────────────────────────

  createSubCategory: catchServiceAsync(async (data: {
    categoryId: number; name: string; description?: string;
    displayOrder?: number; status?: string;
  }) => {
    return prisma.eventSubCategory.create({ data });
  }),

  updateSubCategory: catchServiceAsync(async (id: number, data: Partial<{
    name: string; description: string; displayOrder: number; status: string;
  }>) => {
    return prisma.eventSubCategory.update({ where: { id }, data });
  }),

  deleteSubCategory: catchServiceAsync(async (id: number) => {
    return prisma.eventSubCategory.delete({ where: { id } });
  }),

  // ─── EventType CRUD ────────────────────────────────────────────────────────

  getTypes: catchServiceAsync(async (eventId: number) => {
    return prisma.eventType.findMany({ where: { eventId }, orderBy: { id: 'asc' } });
  }),

  createType: catchServiceAsync(async (data: {
    eventId: number; type: string; description?: string;
    minimumGuest?: number; maximumGuest?: number; status?: string;
  }) => {
    return prisma.eventType.create({ data });
  }),

  updateType: catchServiceAsync(async (id: number, data: Partial<{
    type: string; description: string; minimumGuest: number; maximumGuest: number; status: string;
  }>) => {
    return prisma.eventType.update({ where: { id }, data });
  }),

  deleteType: catchServiceAsync(async (id: number) => {
    return prisma.eventType.delete({ where: { id } });
  }),

  // ─── EventTheme CRUD ───────────────────────────────────────────────────────

  getThemes: catchServiceAsync(async (eventId: number) => {
    return prisma.eventTheme.findMany({ where: { eventId } });
  }),

  createTheme: catchServiceAsync(async (data: {
    eventId: number; themeName: string; description?: string;
    thumbnail?: string; coverImage?: string; status?: string;
  }) => {
    return prisma.eventTheme.create({ data });
  }),

  updateTheme: catchServiceAsync(async (id: number, data: Partial<{
    themeName: string; description: string; thumbnail: string; coverImage: string; status: string;
  }>) => {
    return prisma.eventTheme.update({ where: { id }, data });
  }),

  deleteTheme: catchServiceAsync(async (id: number) => {
    return prisma.eventTheme.delete({ where: { id } });
  }),

  // ─── EventPackageType CRUD ─────────────────────────────────────────────────

  getPackageTypes: catchServiceAsync(async (eventId: number) => {
    return prisma.eventPackageType.findMany({
      where: { eventId }, orderBy: { displayOrder: 'asc' },
    });
  }),

  createPackageType: catchServiceAsync(async (data: {
    eventId: number; packageType: string; description?: string;
    displayOrder?: number; status?: string;
  }) => {
    return prisma.eventPackageType.create({ data });
  }),

  updatePackageType: catchServiceAsync(async (id: number, data: Partial<{
    packageType: string; description: string; displayOrder: number; status: string;
  }>) => {
    return prisma.eventPackageType.update({ where: { id }, data });
  }),

  deletePackageType: catchServiceAsync(async (id: number) => {
    return prisma.eventPackageType.delete({ where: { id } });
  }),
};
