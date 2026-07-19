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
exports.VendorService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
const defaultVendorSelect = {
    id: true,
    vendorCode: true,
    businessName: true,
    ownerName: true,
    email: true,
    phone: true,
    logo: true,
    coverImage: true,
    description: true,
    businessType: true,
    tradeLicenseNumber: true,
    status: true,
    isVerified: true,
    joinedAt: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    profile: true,
    business: true,
    owner: true,
    wallet: true,
    settings: true,
};
class VendorService {
    static generateVendorCode() {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `VEND-${dateStr}-${rand}`;
    }
}
exports.VendorService = VendorService;
_a = VendorService;
VendorService.createVendor = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    // Check if email already exists
    const existing = await prisma.vendor.findFirst({
        where: {
            OR: [
                { email: data.email },
                { vendorCode: data.tradeLicenseNumber ? undefined : '' } // Dummy check
            ]
        }
    });
    if (existing && existing.email === data.email) {
        throw new Error('Vendor already exists with this email');
    }
    const code = _a.generateVendorCode();
    const newVendor = await prisma.$transaction(async (tx) => {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        const vendor = await tx.vendor.create({
            data: {
                vendorCode: code,
                businessName: data.businessName,
                ownerName: data.ownerName,
                email: data.email,
                phone: data.phone,
                businessType: data.businessType,
                tradeLicenseNumber: data.tradeLicenseNumber || null,
                logo: data.logo || null,
                coverImage: data.coverImage || null,
                description: data.description || null,
                status: 'pending',
                isVerified: false,
            },
        });
        // Create profile
        await tx.vendorProfile.create({
            data: {
                vendorId: vendor.id,
                about: ((_b = data.profile) === null || _b === void 0 ? void 0 : _b.about) || null,
                experience: ((_c = data.profile) === null || _c === void 0 ? void 0 : _c.experience) || null,
                establishedYear: ((_d = data.profile) === null || _d === void 0 ? void 0 : _d.establishedYear) || null,
                website: ((_e = data.profile) === null || _e === void 0 ? void 0 : _e.website) || null,
                facebook: ((_f = data.profile) === null || _f === void 0 ? void 0 : _f.facebook) || null,
                instagram: ((_g = data.profile) === null || _g === void 0 ? void 0 : _g.instagram) || null,
                youtube: ((_h = data.profile) === null || _h === void 0 ? void 0 : _h.youtube) || null,
                linkedin: ((_j = data.profile) === null || _j === void 0 ? void 0 : _j.linkedin) || null,
                officeAddress: ((_k = data.profile) === null || _k === void 0 ? void 0 : _k.officeAddress) || null,
            },
        });
        // Create business info
        await tx.vendorBusiness.create({
            data: {
                vendorId: vendor.id,
                businessType: ((_l = data.business) === null || _l === void 0 ? void 0 : _l.businessType) || data.businessType,
                businessCategory: ((_m = data.business) === null || _m === void 0 ? void 0 : _m.businessCategory) || null,
                tradeLicense: ((_o = data.business) === null || _o === void 0 ? void 0 : _o.tradeLicense) || data.tradeLicenseNumber || null,
                tinNumber: ((_p = data.business) === null || _p === void 0 ? void 0 : _p.tinNumber) || null,
                binNumber: ((_q = data.business) === null || _q === void 0 ? void 0 : _q.binNumber) || null,
                companyRegistration: ((_r = data.business) === null || _r === void 0 ? void 0 : _r.companyRegistration) || null,
                businessAddress: ((_s = data.business) === null || _s === void 0 ? void 0 : _s.businessAddress) || null,
            },
        });
        // Create owner info
        await tx.vendorOwner.create({
            data: {
                vendorId: vendor.id,
                fullName: ((_t = data.owner) === null || _t === void 0 ? void 0 : _t.fullName) || data.ownerName,
                phone: ((_u = data.owner) === null || _u === void 0 ? void 0 : _u.phone) || data.phone,
                email: ((_v = data.owner) === null || _v === void 0 ? void 0 : _v.email) || data.email,
                nidNumber: ((_w = data.owner) === null || _w === void 0 ? void 0 : _w.nidNumber) || null,
                dateOfBirth: ((_x = data.owner) === null || _x === void 0 ? void 0 : _x.dateOfBirth) ? new Date(data.owner.dateOfBirth) : null,
                address: ((_y = data.owner) === null || _y === void 0 ? void 0 : _y.address) || null,
            },
        });
        // Create wallet
        await tx.vendorWallet.create({
            data: {
                vendorId: vendor.id,
                balance: 0.0,
                pendingAmount: 0.0,
                withdrawableAmount: 0.0,
                currency: 'BDT',
                status: 'active',
            },
        });
        // Create settings
        await tx.vendorSetting.create({
            data: {
                vendorId: vendor.id,
                autoAcceptAssignment: ((_z = data.settings) === null || _z === void 0 ? void 0 : _z.autoAcceptAssignment) || false,
                notificationEnabled: ((_0 = data.settings) === null || _0 === void 0 ? void 0 : _0.notificationEnabled) !== false,
                emailNotification: ((_1 = data.settings) === null || _1 === void 0 ? void 0 : _1.emailNotification) !== false,
                smsNotification: ((_2 = data.settings) === null || _2 === void 0 ? void 0 : _2.smsNotification) !== false,
                pushNotification: ((_3 = data.settings) === null || _3 === void 0 ? void 0 : _3.pushNotification) !== false,
                workingHours: ((_4 = data.settings) === null || _4 === void 0 ? void 0 : _4.workingHours) || null,
                holidayMode: !!((_5 = data.settings) === null || _5 === void 0 ? void 0 : _5.holidayMode),
            },
        });
        return vendor;
    });
    return prisma.vendor.findUnique({
        where: { id: newVendor.id },
        select: defaultVendorSelect,
    });
});
VendorService.getVendorById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.vendor.findFirst({
        where: { id, deletedAt: null },
        select: defaultVendorSelect,
    });
});
VendorService.getVendorByCode = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorCode) => {
    return prisma.vendor.findFirst({
        where: { vendorCode, deletedAt: null },
        select: defaultVendorSelect,
    });
});
VendorService.getAllVendors = (0, catchServiceAsync_1.catchServiceAsync)(async () => {
    return prisma.vendor.findMany({
        where: { deletedAt: null },
        select: defaultVendorSelect,
    });
});
VendorService.updateVendor = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.$transaction(async (tx) => {
        // Update core
        const coreFields = {
            businessName: data.businessName,
            ownerName: data.ownerName,
            email: data.email,
            phone: data.phone,
            businessType: data.businessType,
            tradeLicenseNumber: data.tradeLicenseNumber,
            logo: data.logo,
            coverImage: data.coverImage,
            description: data.description,
            status: data.status,
        };
        await tx.vendor.update({
            where: { id },
            data: coreFields,
        });
        // Update profile
        if (data.profile) {
            await tx.vendorProfile.update({
                where: { vendorId: id },
                data: data.profile,
            });
        }
        // Update business
        if (data.business) {
            await tx.vendorBusiness.update({
                where: { vendorId: id },
                data: data.business,
            });
        }
        // Update owner
        if (data.owner) {
            const _b = data.owner, { dateOfBirth } = _b, ownerFields = __rest(_b, ["dateOfBirth"]);
            await tx.vendorOwner.update({
                where: { vendorId: id },
                data: Object.assign(Object.assign({}, ownerFields), (dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {})),
            });
        }
        // Update settings
        if (data.settings) {
            await tx.vendorSetting.update({
                where: { vendorId: id },
                data: data.settings,
            });
        }
        return tx.vendor.findUnique({
            where: { id },
            select: defaultVendorSelect,
        });
    });
});
VendorService.deleteVendor = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.vendor.update({
        where: { id },
        data: {
            deletedAt: new Date(),
            status: 'inactive',
        },
        select: defaultVendorSelect,
    });
});
// ─── Document Verification ────────────────────────────────────────────────
VendorService.uploadDocument = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
    return prisma.vendorDocument.create({
        data: {
            vendorId,
            documentType: data.documentType,
            documentName: data.documentName,
            documentUrl: data.documentUrl,
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
            verificationStatus: 'pending',
        },
    });
});
VendorService.getDocuments = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => {
    return prisma.vendorDocument.findMany({
        where: { vendorId },
    });
});
VendorService.verifyDocument = (0, catchServiceAsync_1.catchServiceAsync)(async (documentId, verifiedBy, status) => {
    return prisma.vendorDocument.update({
        where: { id: documentId },
        data: {
            verificationStatus: status, // approved | rejected
            verifiedBy,
            verifiedAt: new Date(),
        },
    });
});
// ─── Vendor General Verification ─────────────────────────────────────────
VendorService.verifyVendor = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, verifiedBy, data) => {
    return prisma.$transaction(async (tx) => {
        // Add verification log
        const log = await tx.vendorVerification.create({
            data: {
                vendorId,
                verificationType: data.verificationType,
                status: data.status,
                remarks: data.remarks || null,
                verifiedBy,
                verifiedAt: new Date(),
            },
        });
        // If status is success, update core vendor status
        if (data.status === 'success') {
            await tx.vendor.update({
                where: { id: vendorId },
                data: {
                    isVerified: true,
                    status: 'active',
                    joinedAt: new Date(),
                },
            });
        }
        return log;
    });
});
