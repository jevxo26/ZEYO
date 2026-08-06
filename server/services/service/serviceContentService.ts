import { prisma } from '../../config/prisma';
// ─────────────────────────────────────────────────────────────────────────────
// ServiceContentService
// Gallery, FAQ, Policy, Analytics, Tag, Setting
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export const ServiceContentService = {

  // ── Gallery ─────────────────────────────────────────────────────────────────
  getGallery: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceGallery.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),

  createGalleryItem: catchServiceAsync(async (data: {
    serviceId: number; image?: string; video?: string; thumbnail?: string; displayOrder?: number;
  }) => prisma.serviceGallery.create({ data })),

  updateGalleryItem: catchServiceAsync(async (id: number, data: Partial<{
    image: string; video: string; thumbnail: string; displayOrder: number;
  }>) => prisma.serviceGallery.update({ where: { id }, data })),

  deleteGalleryItem: catchServiceAsync(async (id: number) =>
    prisma.serviceGallery.delete({ where: { id } })),

  // ── FAQ ─────────────────────────────────────────────────────────────────────
  getFAQs: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceFAQ.findMany({ where: { serviceId }, orderBy: { displayOrder: 'asc' } })),

  createFAQ: catchServiceAsync(async (data: {
    serviceId: number; question: string; answer: string; displayOrder?: number;
  }) => prisma.serviceFAQ.create({ data })),

  updateFAQ: catchServiceAsync(async (id: number, data: Partial<{
    question: string; answer: string; displayOrder: number;
  }>) => prisma.serviceFAQ.update({ where: { id }, data })),

  deleteFAQ: catchServiceAsync(async (id: number) =>
    prisma.serviceFAQ.delete({ where: { id } })),

  // ── Policy ──────────────────────────────────────────────────────────────────
  getPolicies: catchServiceAsync(async (serviceId: number) =>
    prisma.servicePolicy.findMany({ where: { serviceId } })),

  createPolicy: catchServiceAsync(async (data: {
    serviceId: number; policyTitle: string; policyDescription: string;
  }) => prisma.servicePolicy.create({ data })),

  updatePolicy: catchServiceAsync(async (id: number, data: Partial<{
    policyTitle: string; policyDescription: string;
  }>) => prisma.servicePolicy.update({ where: { id }, data })),

  deletePolicy: catchServiceAsync(async (id: number) =>
    prisma.servicePolicy.delete({ where: { id } })),

  // ── Analytics ───────────────────────────────────────────────────────────────
  getAnalytics: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceAnalytics.findUnique({ where: { serviceId } })),

  upsertAnalytics: catchServiceAsync(async (serviceId: number, data: Partial<{
    totalBookings: number; totalRevenue: number; averageRating: number; conversionRate: number;
  }>) => prisma.serviceAnalytics.upsert({
    where:  { serviceId },
    create: { serviceId, ...data },
    update: data,
  })),

  // ── Tags ────────────────────────────────────────────────────────────────────
  getTags: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceTag.findMany({ where: { serviceId } })),

  addTag: catchServiceAsync(async (serviceId: number, tag: string) =>
    prisma.serviceTag.upsert({
      where:  { serviceId_tag: { serviceId, tag } },
      create: { serviceId, tag },
      update: {},
    })),

  deleteTag: catchServiceAsync(async (id: number) =>
    prisma.serviceTag.delete({ where: { id } })),

  // ── Setting ─────────────────────────────────────────────────────────────────
  getSetting: catchServiceAsync(async (serviceId: number) =>
    prisma.serviceSetting.findUnique({ where: { serviceId } })),

  upsertSetting: catchServiceAsync(async (serviceId: number, data: Partial<{
    allowCustomization: boolean; allowAddon: boolean; allowMultipleSelection: boolean;
    allowQuantity: boolean; allowDuration: boolean; isActive: boolean;
  }>) => prisma.serviceSetting.upsert({
    where:  { serviceId },
    create: { serviceId, ...data },
    update: data,
  })),
};
