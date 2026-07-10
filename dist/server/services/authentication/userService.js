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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
// Safe user select — never exposes password or sensitive token fields
const safeUserSelect = {
    id: true,
    name: true,
    firstName: true,
    lastName: true,
    fullName: true,
    email: true,
    phone: true,
    profileImage: true,
    dateOfBirth: true,
    gender: true,
    roleId: true,
    status: true,
    isVerified: true,
    emailVerified: true,
    phoneVerified: true,
    lastLoginAt: true,
    lastActiveAt: true,
    provider: true,
    providerId: true,
    role: true,
    userRole: {
        select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    },
    issueDate: true,
    loginLog: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
};
class UserService {
}
exports.UserService = UserService;
_a = UserService;
UserService.getAllUsers = (0, catchServiceAsync_1.catchServiceAsync)(async () => {
    return prisma.user.findMany({
        where: { deletedAt: null },
        select: safeUserSelect,
    });
});
// id comes in as string from req.params — parse to Int for Prisma
UserService.getUserById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId))
        throw new Error('Invalid user id');
    return prisma.user.findFirst({
        where: { id: numericId, deletedAt: null },
        select: safeUserSelect,
    });
});
UserService.createUser = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    var _b, _c, _d, _e, _f;
    const createData = data;
    const firstName = (_b = data.firstName) === null || _b === void 0 ? void 0 : _b.toString().trim();
    const lastName = (_c = data.lastName) === null || _c === void 0 ? void 0 : _c.toString().trim();
    const fullNameFromParts = [firstName, lastName].filter(Boolean).join(' ').trim();
    const fullName = ((_d = data.fullName) === null || _d === void 0 ? void 0 : _d.toString().trim()) || fullNameFromParts || ((_e = data.name) === null || _e === void 0 ? void 0 : _e.toString().trim());
    const name = ((_f = data.name) === null || _f === void 0 ? void 0 : _f.toString().trim()) || fullName || fullNameFromParts;
    if (!name) {
        throw new Error('Name is required');
    }
    const dataToSave = Object.assign(Object.assign({}, data), { name, fullName: fullName || null, firstName: firstName || null, lastName: lastName || null, password: data.password ? await bcrypt_1.default.hash(data.password.toString(), 10) : undefined, userRole: createData.roleId
            ? { connect: { id: Number(createData.roleId) } }
            : { connect: { name: 'employee' } } });
    const user = await prisma.user.create({ data: dataToSave, select: safeUserSelect });
    // Auto-create empty UserProfile for new users created via admin panel
    try {
        await prisma.userProfile.create({ data: { userId: user.id } });
    }
    catch (_g) {
        // Profile may already exist — ignore duplicate
    }
    return user;
});
// id comes in as string from req.params — parse to Int for Prisma
UserService.updateUser = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId))
        throw new Error('Invalid user id');
    const updateData = data;
    const firstName = typeof updateData.firstName === 'string' ? updateData.firstName.trim() : undefined;
    const lastName = typeof updateData.lastName === 'string' ? updateData.lastName.trim() : undefined;
    const fullNameFromParts = [firstName, lastName].filter(Boolean).join(' ').trim();
    const fullName = typeof updateData.fullName === 'string'
        ? updateData.fullName.trim()
        : fullNameFromParts || (typeof updateData.name === 'string' ? updateData.name.trim() : undefined);
    const name = typeof updateData.name === 'string'
        ? updateData.name.trim()
        : fullName || fullNameFromParts;
    const dataToSave = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, data), (name ? { name } : {})), (typeof updateData.firstName === 'string' ? { firstName } : {})), (typeof updateData.lastName === 'string' ? { lastName } : {})), (fullName ? { fullName } : {})), (typeof updateData.password === 'string'
        ? { password: await bcrypt_1.default.hash(updateData.password, 10) }
        : {})), (updateData.roleId !== undefined && updateData.roleId !== null
        ? { userRole: { connect: { id: Number(updateData.roleId) } } }
        : {}));
    return prisma.user.update({
        where: { id: numericId },
        data: dataToSave,
        select: safeUserSelect,
    });
});
// Soft delete — sets deletedAt and status='deleted'
UserService.deleteUser = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId))
        throw new Error('Invalid user id');
    return prisma.user.update({
        where: { id: numericId },
        data: {
            deletedAt: new Date(),
            status: 'deleted',
        },
        select: safeUserSelect,
    });
});
UserService.getUserProfile = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userProfile.findUnique({
        where: { userId },
    });
});
UserService.upsertUserProfile = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    // Omit any relational fields; only keep plain profile scalar fields
    const _b = data, { user: _user, id: _id, userId: _uid, createdAt: _ca, updatedAt: _ua } = _b, safeData = __rest(_b, ["user", "id", "userId", "createdAt", "updatedAt"]);
    return prisma.userProfile.upsert({
        where: { userId },
        update: safeData,
        create: Object.assign(Object.assign({}, safeData), { userId }),
    });
});
