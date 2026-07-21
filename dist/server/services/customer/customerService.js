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
exports.CustomerService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const defaultCustomerSelect = {
    id: true,
    userId: true,
    customerCode: true,
    membershipLevel: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    profile: true,
    preference: true,
    setting: true,
    wallet: true,
};
class CustomerService {
    static generateCustomerCode() {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `CUST-${dateStr}-${rand}`;
    }
}
exports.CustomerService = CustomerService;
_a = CustomerService;
CustomerService.createCustomer = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    // Check if customer already exists for this user
    const existing = await prisma_1.prisma.customer.findUnique({
        where: { userId },
    });
    if (existing) {
        throw new Error('Customer profile already exists for this user');
    }
    const code = data.customerCode || _a.generateCustomerCode();
    const newCustomer = await prisma_1.prisma.$transaction(async (tx) => {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
        const customer = await tx.customer.create({
            data: {
                userId,
                customerCode: code,
                membershipLevel: data.membershipLevel || 'regular',
                status: data.status || 'active',
            },
        });
        // Create profile
        await tx.customerProfile.create({
            data: {
                customerId: customer.id,
                firstName: ((_b = data.profile) === null || _b === void 0 ? void 0 : _b.firstName) || null,
                lastName: ((_c = data.profile) === null || _c === void 0 ? void 0 : _c.lastName) || null,
                phone: ((_d = data.profile) === null || _d === void 0 ? void 0 : _d.phone) || null,
                email: ((_e = data.profile) === null || _e === void 0 ? void 0 : _e.email) || null,
                dateOfBirth: ((_f = data.profile) === null || _f === void 0 ? void 0 : _f.dateOfBirth) ? new Date(data.profile.dateOfBirth) : null,
                gender: ((_g = data.profile) === null || _g === void 0 ? void 0 : _g.gender) || null,
                profileImage: ((_h = data.profile) === null || _h === void 0 ? void 0 : _h.profileImage) || null,
                occupation: ((_j = data.profile) === null || _j === void 0 ? void 0 : _j.occupation) || null,
                companyName: ((_k = data.profile) === null || _k === void 0 ? void 0 : _k.companyName) || null,
                preferredLanguage: ((_l = data.profile) === null || _l === void 0 ? void 0 : _l.preferredLanguage) || 'bn',
                preferredCurrency: ((_m = data.profile) === null || _m === void 0 ? void 0 : _m.preferredCurrency) || 'BDT',
            },
        });
        // Create preferences
        await tx.customerPreference.create({
            data: {
                customerId: customer.id,
                preferredZoneId: (_p = (_o = data.preference) === null || _o === void 0 ? void 0 : _o.preferredZoneId) !== null && _p !== void 0 ? _p : null,
                preferredEventTypeId: (_r = (_q = data.preference) === null || _q === void 0 ? void 0 : _q.preferredEventTypeId) !== null && _r !== void 0 ? _r : null,
                preferredBudget: (_t = (_s = data.preference) === null || _s === void 0 ? void 0 : _s.preferredBudget) !== null && _t !== void 0 ? _t : null,
                preferredGuestRange: (_v = (_u = data.preference) === null || _u === void 0 ? void 0 : _u.preferredGuestRange) !== null && _v !== void 0 ? _v : null,
                preferredContactMethod: (_x = (_w = data.preference) === null || _w === void 0 ? void 0 : _w.preferredContactMethod) !== null && _x !== void 0 ? _x : null,
                preferredCommunicationTime: (_z = (_y = data.preference) === null || _y === void 0 ? void 0 : _y.preferredCommunicationTime) !== null && _z !== void 0 ? _z : null,
            },
        });
        // Create settings
        await tx.customerSetting.create({
            data: {
                customerId: customer.id,
                language: ((_0 = data.setting) === null || _0 === void 0 ? void 0 : _0.language) || 'bn',
                currency: ((_1 = data.setting) === null || _1 === void 0 ? void 0 : _1.currency) || 'BDT',
                emailNotification: ((_2 = data.setting) === null || _2 === void 0 ? void 0 : _2.emailNotification) !== false,
                pushNotification: ((_3 = data.setting) === null || _3 === void 0 ? void 0 : _3.pushNotification) !== false,
                smsNotification: ((_4 = data.setting) === null || _4 === void 0 ? void 0 : _4.smsNotification) !== false,
                marketingNotification: !!((_5 = data.setting) === null || _5 === void 0 ? void 0 : _5.marketingNotification),
                theme: ((_6 = data.setting) === null || _6 === void 0 ? void 0 : _6.theme) || 'light',
            },
        });
        // Create wallet
        await tx.customerWallet.create({
            data: {
                customerId: customer.id,
                balance: 0,
                rewardBalance: 0,
                currency: 'BDT',
                status: 'active',
            },
        });
        return customer;
    });
    return prisma_1.prisma.customer.findUnique({
        where: { id: newCustomer.id },
        select: defaultCustomerSelect,
    });
});
CustomerService.getAllCustomers = (0, catchServiceAsync_1.catchServiceAsync)(async () => {
    return prisma_1.prisma.customer.findMany({
        where: { deletedAt: null },
        select: defaultCustomerSelect,
    });
});
CustomerService.getCustomerById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.customer.findFirst({
        where: { id, deletedAt: null },
        select: defaultCustomerSelect,
    });
});
CustomerService.getCustomerByUserId = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.customer.findFirst({
        where: { userId, deletedAt: null },
        select: defaultCustomerSelect,
    });
});
CustomerService.updateCustomer = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        // Update core customer fields
        if (data.membershipLevel || data.status) {
            await tx.customer.update({
                where: { id },
                data: {
                    membershipLevel: data.membershipLevel,
                    status: data.status,
                },
            });
        }
        // Update profile
        if (data.profile) {
            const _b = data.profile, { dateOfBirth } = _b, profileFields = __rest(_b, ["dateOfBirth"]);
            await tx.customerProfile.update({
                where: { customerId: id },
                data: Object.assign(Object.assign({}, profileFields), (dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {})),
            });
        }
        // Update preference
        if (data.preference) {
            await tx.customerPreference.update({
                where: { customerId: id },
                data: data.preference,
            });
        }
        // Update settings
        if (data.setting) {
            await tx.customerSetting.update({
                where: { customerId: id },
                data: data.setting,
            });
        }
        return tx.customer.findUnique({
            where: { id },
            select: defaultCustomerSelect,
        });
    });
});
CustomerService.deleteCustomer = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.customer.update({
        where: { id },
        data: {
            deletedAt: new Date(),
            status: 'inactive',
        },
        select: defaultCustomerSelect,
    });
});
// ─── Customer Activity Log ────────────────────────────────────────────────
CustomerService.logActivity = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, activityType, description, ipAddress, deviceId) => {
    return prisma_1.prisma.customerActivity.create({
        data: {
            customerId,
            activityType,
            description,
            ipAddress,
            deviceId,
        },
    });
});
CustomerService.getActivities = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerActivity.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
