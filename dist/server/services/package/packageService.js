"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
// ─────────────────────────────────────────────────────────────────────────────
// PackageService
// Service layer for Package and all sub-entities.
// Handles business logic for zone-wise packages, pricing mapping, and sub-entity CRUD.
// ─────────────────────────────────────────────────────────────────────────────
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class PackageService {
}
exports.PackageService = PackageService;
_a = PackageService;
// ── Packages ───────────────────────────────────────────────────────────────
PackageService.getAllPackages = (0, catchServiceAsync_1.catchServiceAsync)(async (filters) => {
    const whereClause = {
        deletedAt: null,
    };
    if (filters === null || filters === void 0 ? void 0 : filters.status)
        whereClause.status = filters.status;
    if (filters === null || filters === void 0 ? void 0 : filters.eventId)
        whereClause.eventId = filters.eventId;
    if (filters === null || filters === void 0 ? void 0 : filters.categoryId)
        whereClause.packageCategoryId = filters.categoryId;
    if (filters === null || filters === void 0 ? void 0 : filters.subCategoryId)
        whereClause.packageSubCategoryId = filters.subCategoryId;
    if ((filters === null || filters === void 0 ? void 0 : filters.isFeatured) !== undefined) {
        whereClause.setting = { isFeatured: filters.isFeatured };
    }
    // Zone-wise filter: Package must be available in the specified zone
    if (filters === null || filters === void 0 ? void 0 : filters.zoneId) {
        whereClause.availabilities = {
            some: {
                zoneId: filters.zoneId,
                status: 'active'
            }
        };
    }
    const packages = await prisma.package.findMany({
        where: whereClause,
        include: {
            packageCategory: true,
            packageSubCategory: true,
            event: { select: { id: true, name: true, slug: true } },
            setting: true,
            pricings: { orderBy: { createdAt: 'desc' }, take: 1 },
            zonePricings: (filters === null || filters === void 0 ? void 0 : filters.zoneId) ? { where: { zoneId: filters.zoneId, status: 'active' } } : false,
        },
        orderBy: { displayOrder: 'asc' },
    });
    // Map zone-specific prices if zoneId is provided
    return packages.map((pkg) => {
        let activePrice = pkg.startingPrice;
        let activeDiscount = 0;
        let isZonePriced = false;
        if ((filters === null || filters === void 0 ? void 0 : filters.zoneId) && pkg.zonePricings && pkg.zonePricings.length > 0) {
            activePrice = pkg.zonePricings[0].price;
            activeDiscount = pkg.zonePricings[0].discount;
            isZonePriced = true;
        }
        return Object.assign(Object.assign({}, pkg), { activePrice,
            activeDiscount,
            isZonePriced });
    });
});
PackageService.getPackageById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, zoneId) => {
    const pkg = await prisma.package.findFirst({
        where: { id, deletedAt: null },
        include: {
            packageCategory: true,
            packageSubCategory: true,
            event: true,
            setting: true,
            types: { where: { status: 'active' }, orderBy: { displayOrder: 'asc' } },
            services: {
                orderBy: { displayOrder: 'asc' },
                include: { serviceItems: true }
            },
            pricings: { orderBy: { createdAt: 'desc' } },
            zonePricings: zoneId ? { where: { zoneId, status: 'active' } } : true,
            guestRanges: true,
            coverages: true,
            addons: { where: { status: 'active' } },
            features: { orderBy: { displayOrder: 'asc' } },
            gallery: { orderBy: { displayOrder: 'asc' } },
            faqs: { orderBy: { displayOrder: 'asc' } },
            policies: true,
            terms: true,
            availabilities: { where: { status: 'active' } },
            discounts: { where: { status: 'active' } },
            analytics: true,
            reviews: { where: { status: 'active' }, orderBy: { createdAt: 'desc' } },
        }
    });
    if (!pkg)
        return null;
    let activePrice = pkg.startingPrice;
    let activeDiscount = 0;
    let isZonePriced = false;
    if (zoneId) {
        const zonePrice = pkg.zonePricings.find(zp => zp.zoneId === zoneId && zp.status === 'active');
        if (zonePrice) {
            activePrice = zonePrice.price;
            activeDiscount = zonePrice.discount;
            isZonePriced = true;
        }
    }
    return Object.assign(Object.assign({}, pkg), { activePrice,
        activeDiscount,
        isZonePriced });
});
PackageService.createPackage = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    const { settings } = data, packageData = __rest(data, ["settings"]);
    return prisma.$transaction(async (tx) => {
        var _b, _c, _d, _e, _f, _g, _h, _j;
        const pkg = await tx.package.create({
            data: Object.assign(Object.assign({}, packageData), { status: (_b = packageData.status) !== null && _b !== void 0 ? _b : 'active', displayOrder: (_c = packageData.displayOrder) !== null && _c !== void 0 ? _c : 0 })
        });
        // Create settings
        await tx.packageSetting.create({
            data: {
                packageId: pkg.id,
                allowCustomization: (_d = settings === null || settings === void 0 ? void 0 : settings.allowCustomization) !== null && _d !== void 0 ? _d : true,
                allowAddon: (_e = settings === null || settings === void 0 ? void 0 : settings.allowAddon) !== null && _e !== void 0 ? _e : true,
                allowReschedule: (_f = settings === null || settings === void 0 ? void 0 : settings.allowReschedule) !== null && _f !== void 0 ? _f : true,
                allowCancellation: (_g = settings === null || settings === void 0 ? void 0 : settings.allowCancellation) !== null && _g !== void 0 ? _g : true,
                showOnHomepage: (_h = settings === null || settings === void 0 ? void 0 : settings.showOnHomepage) !== null && _h !== void 0 ? _h : false,
                isFeatured: (_j = settings === null || settings === void 0 ? void 0 : settings.isFeatured) !== null && _j !== void 0 ? _j : false,
            }
        });
        return pkg;
    });
});
PackageService.updatePackage = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    const { settings } = data, packageData = __rest(data, ["settings"]);
    return prisma.$transaction(async (tx) => {
        var _b, _c, _d, _e, _f, _g;
        const pkg = await tx.package.update({
            where: { id },
            data: packageData,
        });
        if (settings) {
            await tx.packageSetting.upsert({
                where: { packageId: id },
                update: settings,
                create: {
                    packageId: id,
                    allowCustomization: (_b = settings.allowCustomization) !== null && _b !== void 0 ? _b : true,
                    allowAddon: (_c = settings.allowAddon) !== null && _c !== void 0 ? _c : true,
                    allowReschedule: (_d = settings.allowReschedule) !== null && _d !== void 0 ? _d : true,
                    allowCancellation: (_e = settings.allowCancellation) !== null && _e !== void 0 ? _e : true,
                    showOnHomepage: (_f = settings.showOnHomepage) !== null && _f !== void 0 ? _f : false,
                    isFeatured: (_g = settings.isFeatured) !== null && _g !== void 0 ? _g : false,
                }
            });
        }
        return pkg;
    });
});
PackageService.deletePackage = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.package.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
});
// ── PackageCategories ──────────────────────────────────────────────────────
PackageService.getAllCategories = (0, catchServiceAsync_1.catchServiceAsync)(async () => {
    return prisma.packageCategory.findMany({
        include: { subCategories: true },
        orderBy: { displayOrder: 'asc' },
    });
});
PackageService.createCategory = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageCategory.create({ data });
});
PackageService.updateCategory = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageCategory.update({ where: { id }, data });
});
PackageService.deleteCategory = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageCategory.delete({ where: { id } });
});
// ── PackageSubCategories ───────────────────────────────────────────────────
PackageService.getAllSubCategories = (0, catchServiceAsync_1.catchServiceAsync)(async (categoryId) => {
    return prisma.packageSubCategory.findMany({
        where: categoryId ? { packageCategoryId: categoryId } : {},
        orderBy: { displayOrder: 'asc' },
    });
});
PackageService.createSubCategory = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageSubCategory.create({ data });
});
PackageService.updateSubCategory = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageSubCategory.update({ where: { id }, data });
});
PackageService.deleteSubCategory = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageSubCategory.delete({ where: { id } });
});
// ── PackageTypes ───────────────────────────────────────────────────────────
PackageService.createPackageType = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageType.create({ data });
});
PackageService.updatePackageType = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageType.update({ where: { id }, data });
});
PackageService.deletePackageType = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageType.delete({ where: { id } });
});
// ── PackageServices & Items ───────────────────────────────────────────────
PackageService.createPackageService = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    const { items } = data, serviceData = __rest(data, ["items"]);
    return prisma.$transaction(async (tx) => {
        const service = await tx.packageService.create({
            data: serviceData,
        });
        if (items && items.length > 0) {
            await tx.packageServiceItem.createMany({
                data: items.map(item => {
                    var _b, _c;
                    return ({
                        packageServiceId: service.id,
                        serviceOptionId: item.serviceOptionId,
                        coverageId: item.coverageId,
                        quantity: (_b = item.quantity) !== null && _b !== void 0 ? _b : 1,
                        duration: (_c = item.duration) !== null && _c !== void 0 ? _c : 1.0,
                        remarks: item.remarks,
                    });
                })
            });
        }
        return tx.packageService.findUnique({
            where: { id: service.id },
            include: { serviceItems: true }
        });
    });
});
PackageService.updatePackageService = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageService.update({ where: { id }, data });
});
PackageService.deletePackageService = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageService.delete({ where: { id } });
});
PackageService.createServiceItem = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageServiceItem.create({ data });
});
PackageService.updateServiceItem = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageServiceItem.update({ where: { id }, data });
});
PackageService.deleteServiceItem = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageServiceItem.delete({ where: { id } });
});
// ── PackagePricing & Zone Pricing ──────────────────────────────────────────
PackageService.createPricing = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packagePricing.create({ data });
});
PackageService.createZonePricing = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageZonePricing.create({ data });
});
PackageService.updateZonePricing = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageZonePricing.update({ where: { id }, data });
});
PackageService.deleteZonePricing = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageZonePricing.delete({ where: { id } });
});
// ── Addons ─────────────────────────────────────────────────────────────────
PackageService.createAddon = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageAddon.create({ data });
});
PackageService.updateAddon = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageAddon.update({ where: { id }, data });
});
PackageService.deleteAddon = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageAddon.delete({ where: { id } });
});
// ── Features ───────────────────────────────────────────────────────────────
PackageService.createFeature = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageFeature.create({ data });
});
PackageService.updateFeature = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageFeature.update({ where: { id }, data });
});
PackageService.deleteFeature = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageFeature.delete({ where: { id } });
});
// ── Gallery ────────────────────────────────────────────────────────────────
PackageService.createGalleryItem = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageGallery.create({ data });
});
PackageService.deleteGalleryItem = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageGallery.delete({ where: { id } });
});
// ── FAQ ────────────────────────────────────────────────────────────────────
PackageService.createFAQ = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageFAQ.create({ data });
});
PackageService.updateFAQ = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageFAQ.update({ where: { id }, data });
});
PackageService.deleteFAQ = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageFAQ.delete({ where: { id } });
});
// ── Policies & Terms ───────────────────────────────────────────────────────
PackageService.createPolicy = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packagePolicy.create({ data });
});
PackageService.updatePolicy = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packagePolicy.update({ where: { id }, data });
});
PackageService.deletePolicy = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packagePolicy.delete({ where: { id } });
});
PackageService.createTerms = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageTerms.create({ data });
});
PackageService.updateTerms = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageTerms.update({ where: { id }, data });
});
PackageService.deleteTerms = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageTerms.delete({ where: { id } });
});
// ── Availability ───────────────────────────────────────────────────────────
PackageService.createAvailability = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageAvailability.create({ data });
});
PackageService.updateAvailability = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageAvailability.update({ where: { id }, data });
});
PackageService.deleteAvailability = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageAvailability.delete({ where: { id } });
});
// ── Discounts ──────────────────────────────────────────────────────────────
PackageService.createDiscount = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageDiscount.create({ data });
});
PackageService.updateDiscount = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.packageDiscount.update({ where: { id }, data });
});
PackageService.deleteDiscount = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.packageDiscount.delete({ where: { id } });
});
// ── Reviews ────────────────────────────────────────────────────────────────
PackageService.getReviewsByPackage = (0, catchServiceAsync_1.catchServiceAsync)(async (packageId) => {
    return prisma.packageReview.findMany({
        where: { packageId, status: 'active' },
        include: { customer: { include: { user: { select: { name: true, profileImage: true } } } } },
        orderBy: { createdAt: 'desc' },
    });
});
PackageService.submitReview = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma.packageReview.create({
        data: {
            packageId: data.packageId,
            customerId: data.customerId,
            rating: data.rating,
            review: data.review,
            status: 'active',
        }
    });
});
PackageService.updateReviewStatus = (0, catchServiceAsync_1.catchServiceAsync)(async (id, status) => {
    return prisma.packageReview.update({
        where: { id },
        data: { status }
    });
});
// ── Analytics ──────────────────────────────────────────────────────────────
PackageService.getAnalyticsByPackage = (0, catchServiceAsync_1.catchServiceAsync)(async (packageId) => {
    return prisma.packageAnalytics.findFirst({
        where: { packageId },
        orderBy: { createdAt: 'desc' }
    });
});
PackageService.updateAnalytics = (0, catchServiceAsync_1.catchServiceAsync)(async (packageId, data) => {
    const existing = await prisma.packageAnalytics.findFirst({ where: { packageId } });
    if (existing) {
        return prisma.packageAnalytics.update({ where: { id: existing.id }, data });
    }
    return prisma.packageAnalytics.create({ data: Object.assign({ packageId }, data) });
});
