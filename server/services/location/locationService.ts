// ─────────────────────────────────────────────────────────────────────────────
// LocationService
// CRUD for Country, Division, District, City, Area geographic hierarchy.
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class LocationService {

  // ── Countries ─────────────────────────────────────────────────────────────
  static getAllCountries = catchServiceAsync(async (status?: string) => {
    return prisma.country.findMany({
      where: status ? { status } : {},
      orderBy: { name: 'asc' },
    });
  });

  static getCountryById = catchServiceAsync(async (id: number) => {
    return prisma.country.findUnique({ where: { id } });
  });

  static createCountry = catchServiceAsync(async (data: {
    name: string; isoCode: string; currency: string; phoneCode: string;
  }) => {
    return prisma.country.create({ data: { ...data, status: 'active' } });
  });

  static updateCountry = catchServiceAsync(async (id: number, data: Partial<{
    name: string; currency: string; phoneCode: string; status: string;
  }>) => {
    return prisma.country.update({ where: { id }, data });
  });

  static deleteCountry = catchServiceAsync(async (id: number) => {
    return prisma.country.delete({ where: { id } });
  });

  // ── Divisions ─────────────────────────────────────────────────────────────
  static getAllDivisions = catchServiceAsync(async (countryId?: number, status?: string) => {
    return prisma.division.findMany({
      where: {
        ...(countryId ? { countryId } : {}),
        ...(status ? { status } : {}),
      },
      include: { country: { select: { id: true, name: true, isoCode: true } } },
      orderBy: { name: 'asc' },
    });
  });

  static getDivisionById = catchServiceAsync(async (id: number) => {
    return prisma.division.findUnique({
      where: { id },
      include: { country: true },
    });
  });

  static createDivision = catchServiceAsync(async (data: {
    countryId: number; name: string; code?: string;
  }) => {
    return prisma.division.create({ data: { ...data, status: 'active' } });
  });

  static updateDivision = catchServiceAsync(async (id: number, data: Partial<{
    name: string; code: string; status: string;
  }>) => {
    return prisma.division.update({ where: { id }, data });
  });

  static deleteDivision = catchServiceAsync(async (id: number) => {
    return prisma.division.delete({ where: { id } });
  });

  // ── Districts ─────────────────────────────────────────────────────────────
  static getAllDistricts = catchServiceAsync(async (divisionId?: number, status?: string) => {
    return prisma.district.findMany({
      where: {
        ...(divisionId ? { divisionId } : {}),
        ...(status ? { status } : {}),
      },
      include: { division: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    });
  });

  static getDistrictById = catchServiceAsync(async (id: number) => {
    return prisma.district.findUnique({
      where: { id },
      include: { division: { include: { country: true } } },
    });
  });

  static createDistrict = catchServiceAsync(async (data: {
    divisionId: number; name: string; code?: string;
  }) => {
    return prisma.district.create({ data: { ...data, status: 'active' } });
  });

  static updateDistrict = catchServiceAsync(async (id: number, data: Partial<{
    name: string; code: string; status: string;
  }>) => {
    return prisma.district.update({ where: { id }, data });
  });

  static deleteDistrict = catchServiceAsync(async (id: number) => {
    return prisma.district.delete({ where: { id } });
  });

  // ── Cities ────────────────────────────────────────────────────────────────
  static getAllCities = catchServiceAsync(async (districtId?: number, status?: string) => {
    return prisma.city.findMany({
      where: {
        ...(districtId ? { districtId } : {}),
        ...(status ? { status } : {}),
      },
      include: { district: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    });
  });

  static getCityById = catchServiceAsync(async (id: number) => {
    return prisma.city.findUnique({
      where: { id },
      include: { district: { include: { division: { include: { country: true } } } } },
    });
  });

  static createCity = catchServiceAsync(async (data: {
    districtId: number; name: string; code?: string;
  }) => {
    return prisma.city.create({ data: { ...data, status: 'active' } });
  });

  static updateCity = catchServiceAsync(async (id: number, data: Partial<{
    name: string; code: string; status: string;
  }>) => {
    return prisma.city.update({ where: { id }, data });
  });

  static deleteCity = catchServiceAsync(async (id: number) => {
    return prisma.city.delete({ where: { id } });
  });

  // ── Areas ─────────────────────────────────────────────────────────────────
  static getAllAreas = catchServiceAsync(async (cityId?: number, status?: string) => {
    return prisma.area.findMany({
      where: {
        ...(cityId ? { cityId } : {}),
        ...(status ? { status } : {}),
      },
      include: { city: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    });
  });

  static getAreaById = catchServiceAsync(async (id: number) => {
    return prisma.area.findUnique({
      where: { id },
      include: { city: { include: { district: { include: { division: true } } } } },
    });
  });

  static createArea = catchServiceAsync(async (data: {
    cityId: number; name: string; postalCode?: string; latitude?: number; longitude?: number;
  }) => {
    return prisma.area.create({ data: { ...data, status: 'active' } });
  });

  static updateArea = catchServiceAsync(async (id: number, data: Partial<{
    name: string; postalCode: string; latitude: number; longitude: number; status: string;
  }>) => {
    return prisma.area.update({ where: { id }, data });
  });

  static deleteArea = catchServiceAsync(async (id: number) => {
    return prisma.area.delete({ where: { id } });
  });

  // ── Hierarchy Helper ──────────────────────────────────────────────────────
  // Returns full hierarchy: Country → Divisions → Districts → Cities → Areas
  static getFullHierarchy = catchServiceAsync(async (countryId: number) => {
    return prisma.country.findUnique({
      where: { id: countryId },
      include: {
        divisions: {
          where: { status: 'active' },
          orderBy: { name: 'asc' },
          include: {
            districts: {
              where: { status: 'active' },
              orderBy: { name: 'asc' },
              include: {
                cities: {
                  where: { status: 'active' },
                  orderBy: { name: 'asc' },
                  include: {
                    areas: { where: { status: 'active' }, orderBy: { name: 'asc' } },
                  },
                },
              },
            },
          },
        },
      },
    });
  });
}
