"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class LocationService {
}
exports.LocationService = LocationService;
_a = LocationService;
// ── Countries ─────────────────────────────────────────────────────────────
LocationService.getAllCountries = (0, catchServiceAsync_1.catchServiceAsync)(async (status) => {
    return prisma_1.prisma.country.findMany({
        where: status ? { status } : {},
        orderBy: { name: 'asc' },
    });
});
LocationService.getCountryById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.country.findUnique({ where: { id } });
});
LocationService.createCountry = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.country.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
LocationService.updateCountry = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.country.update({ where: { id }, data });
});
LocationService.deleteCountry = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.country.delete({ where: { id } });
});
// ── Divisions ─────────────────────────────────────────────────────────────
LocationService.getAllDivisions = (0, catchServiceAsync_1.catchServiceAsync)(async (countryId, status) => {
    return prisma_1.prisma.division.findMany({
        where: Object.assign(Object.assign({}, (countryId ? { countryId } : {})), (status ? { status } : {})),
        include: { country: { select: { id: true, name: true, isoCode: true } } },
        orderBy: { name: 'asc' },
    });
});
LocationService.getDivisionById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.division.findUnique({
        where: { id },
        include: { country: true },
    });
});
LocationService.createDivision = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.division.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
LocationService.updateDivision = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.division.update({ where: { id }, data });
});
LocationService.deleteDivision = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.division.delete({ where: { id } });
});
// ── Districts ─────────────────────────────────────────────────────────────
LocationService.getAllDistricts = (0, catchServiceAsync_1.catchServiceAsync)(async (divisionId, status) => {
    return prisma_1.prisma.district.findMany({
        where: Object.assign(Object.assign({}, (divisionId ? { divisionId } : {})), (status ? { status } : {})),
        include: { division: { select: { id: true, name: true } } },
        orderBy: { name: 'asc' },
    });
});
LocationService.getDistrictById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.district.findUnique({
        where: { id },
        include: { division: { include: { country: true } } },
    });
});
LocationService.createDistrict = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.district.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
LocationService.updateDistrict = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.district.update({ where: { id }, data });
});
LocationService.deleteDistrict = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.district.delete({ where: { id } });
});
// ── Cities ────────────────────────────────────────────────────────────────
LocationService.getAllCities = (0, catchServiceAsync_1.catchServiceAsync)(async (districtId, status) => {
    return prisma_1.prisma.city.findMany({
        where: Object.assign(Object.assign({}, (districtId ? { districtId } : {})), (status ? { status } : {})),
        include: { district: { select: { id: true, name: true } } },
        orderBy: { name: 'asc' },
    });
});
LocationService.getCityById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.city.findUnique({
        where: { id },
        include: { district: { include: { division: { include: { country: true } } } } },
    });
});
LocationService.createCity = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.city.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
LocationService.updateCity = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.city.update({ where: { id }, data });
});
LocationService.deleteCity = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.city.delete({ where: { id } });
});
// ── Areas ─────────────────────────────────────────────────────────────────
LocationService.getAllAreas = (0, catchServiceAsync_1.catchServiceAsync)(async (cityId, status) => {
    return prisma_1.prisma.area.findMany({
        where: Object.assign(Object.assign({}, (cityId ? { cityId } : {})), (status ? { status } : {})),
        include: { city: { select: { id: true, name: true } } },
        orderBy: { name: 'asc' },
    });
});
LocationService.getAreaById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.area.findUnique({
        where: { id },
        include: { city: { include: { district: { include: { division: true } } } } },
    });
});
LocationService.createArea = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.area.create({ data: Object.assign(Object.assign({}, data), { status: 'active' }) });
});
LocationService.updateArea = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.area.update({ where: { id }, data });
});
LocationService.deleteArea = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.area.delete({ where: { id } });
});
// ── Hierarchy Helper ──────────────────────────────────────────────────────
// Returns full hierarchy: Country → Divisions → Districts → Cities → Areas
LocationService.getFullHierarchy = (0, catchServiceAsync_1.catchServiceAsync)(async (countryId) => {
    return prisma_1.prisma.country.findUnique({
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
