import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export const EventConfigService = {

  // ─── Requirement ───────────────────────────────────────────────────────────
  getRequirements: catchServiceAsync(async (eventId: number) =>
    prisma.eventRequirement.findMany({ where: { eventId } })),

  createRequirement: catchServiceAsync(async (data: {
    eventId: number; serviceId: number; isRequired?: boolean;
    isOptional?: boolean; minimumQuantity?: number; maximumQuantity?: number;
  }) => prisma.eventRequirement.create({ data })),

  updateRequirement: catchServiceAsync(async (id: number, data: Partial<{
    serviceId: number; isRequired: boolean; isOptional: boolean;
    minimumQuantity: number; maximumQuantity: number;
  }>) => prisma.eventRequirement.update({ where: { id }, data })),

  deleteRequirement: catchServiceAsync(async (id: number) =>
    prisma.eventRequirement.delete({ where: { id } })),

  // ─── Guest Config ──────────────────────────────────────────────────────────
  getGuestConfig: catchServiceAsync(async (eventId: number) =>
    prisma.eventGuest.findMany({ where: { eventId } })),

  createGuestConfig: catchServiceAsync(async (data: {
    eventId: number; minimumGuest?: number; maximumGuest?: number; recommendedGuest?: number;
  }) => prisma.eventGuest.create({ data })),

  updateGuestConfig: catchServiceAsync(async (id: number, data: Partial<{
    minimumGuest: number; maximumGuest: number; recommendedGuest: number;
  }>) => prisma.eventGuest.update({ where: { id }, data })),

  deleteGuestConfig: catchServiceAsync(async (id: number) =>
    prisma.eventGuest.delete({ where: { id } })),

  // ─── Venue ─────────────────────────────────────────────────────────────────
  getVenues: catchServiceAsync(async (eventId: number) =>
    prisma.eventVenue.findMany({ where: { eventId } })),

  createVenue: catchServiceAsync(async (data: {
    eventId: number; venueType: string; indoorOutdoor?: string;
    minimumCapacity?: number; maximumCapacity?: number; description?: string;
  }) => prisma.eventVenue.create({ data })),

  updateVenue: catchServiceAsync(async (id: number, data: Partial<{
    venueType: string; indoorOutdoor: string;
    minimumCapacity: number; maximumCapacity: number; description: string;
  }>) => prisma.eventVenue.update({ where: { id }, data })),

  deleteVenue: catchServiceAsync(async (id: number) =>
    prisma.eventVenue.delete({ where: { id } })),

  // ─── Feature ───────────────────────────────────────────────────────────────
  getFeatures: catchServiceAsync(async (eventId: number) =>
    prisma.eventFeature.findMany({ where: { eventId }, orderBy: { displayOrder: 'asc' } })),

  createFeature: catchServiceAsync(async (data: {
    eventId: number; featureTitle: string; description?: string;
    icon?: string; displayOrder?: number;
  }) => prisma.eventFeature.create({ data })),

  updateFeature: catchServiceAsync(async (id: number, data: Partial<{
    featureTitle: string; description: string; icon: string; displayOrder: number;
  }>) => prisma.eventFeature.update({ where: { id }, data })),

  deleteFeature: catchServiceAsync(async (id: number) =>
    prisma.eventFeature.delete({ where: { id } })),

  // ─── Setting ───────────────────────────────────────────────────────────────
  getSetting: catchServiceAsync(async (eventId: number) =>
    prisma.eventSetting.findUnique({ where: { eventId } })),

  upsertSetting: catchServiceAsync(async (eventId: number, data: Partial<{
    allowPackageBooking: boolean; allowCalculator: boolean; allowCustomization: boolean;
    allowVendorAssignment: boolean; allowReschedule: boolean; allowCancellation: boolean; status: string;
  }>) =>
    prisma.eventSetting.upsert({
      where:  { eventId },
      create: { eventId, ...data },
      update: data,
    })),
};
