"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
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
    return prisma_1.prisma.user.findMany({
        where: { deletedAt: null },
        select: safeUserSelect,
    });
});
// id comes in as string from req.params — parse to Int for Prisma
UserService.getUserProfile = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            profile: true,
            userRole: true,
        },
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
    const user = await prisma_1.prisma.user.create({ data: dataToSave, select: safeUserSelect });
    // Auto-create empty UserProfile for new users created via admin panel
    try {
        await prisma_1.prisma.userProfile.create({ data: { userId: user.id } });
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
    return prisma_1.prisma.user.update({
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
    return prisma_1.prisma.user.update({
        where: { id: numericId },
        data: {
            deletedAt: new Date(),
            status: 'deleted',
        },
        select: safeUserSelect,
    });
});
UserService.getUserById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        throw new Error("Invalid user id");
    }
    return prisma_1.prisma.user.findFirst({
        where: {
            id: numericId,
            deletedAt: null,
        },
        select: safeUserSelect,
    });
});
UserService.upsertUserProfile = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    var _b, _c, _d, _e;
    // Fields that belong to the User table
    const userFields = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'profileImage'];
    // Separate incoming data into User-table fields and UserProfile-table fields
    const userData = {};
    const profileData = {};
    for (const [key, value] of Object.entries(data)) {
        if (userFields.includes(key)) {
            userData[key] = value;
        }
        else if (!['user', 'id', 'userId', 'createdAt', 'updatedAt'].includes(key)) {
            profileData[key] = value;
        }
    }
    // Update User table if there's relevant data
    if (Object.keys(userData).length > 0) {
        // Recompute fullName/name if firstName or lastName changed
        if (userData.firstName || userData.lastName) {
            const existingUser = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
            const firstName = (_c = (_b = userData.firstName) !== null && _b !== void 0 ? _b : existingUser === null || existingUser === void 0 ? void 0 : existingUser.firstName) !== null && _c !== void 0 ? _c : '';
            const lastName = (_e = (_d = userData.lastName) !== null && _d !== void 0 ? _d : existingUser === null || existingUser === void 0 ? void 0 : existingUser.lastName) !== null && _e !== void 0 ? _e : '';
            const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
            if (fullName) {
                userData.fullName = fullName;
                userData.name = fullName;
            }
        }
        if (userData.dateOfBirth) {
            userData.dateOfBirth = new Date(userData.dateOfBirth);
        }
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: userData,
        });
    }
    // Update/create UserProfile table
    const profile = await prisma_1.prisma.userProfile.upsert({
        where: { userId },
        update: profileData,
        create: Object.assign(Object.assign({}, profileData), { userId }),
    });
    // Return combined data so frontend gets everything back
    const updatedUser = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: safeUserSelect,
    });
    return Object.assign(Object.assign({}, updatedUser), { profile });
});
