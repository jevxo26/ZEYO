"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacRoleService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
// ─────────────────────────────────────────────────────────────────────────────
// Safe select — fields returned in list / detail responses
// ─────────────────────────────────────────────────────────────────────────────
const roleSelect = {
    id: true,
    name: true,
    code: true,
    description: true,
    roleType: true,
    priority: true,
    isSystem: true,
    status: true,
    createdBy: true,
    updatedBy: true,
    createdAt: true,
    updatedAt: true,
};
class RbacRoleService {
}
exports.RbacRoleService = RbacRoleService;
_a = RbacRoleService;
// ── List ──────────────────────────────────────────────────────────────────
RbacRoleService.getAll = (0, catchServiceAsync_1.catchServiceAsync)(async (filters) => {
    return prisma.role.findMany({
        where: Object.assign(Object.assign({ deletedAt: null }, ((filters === null || filters === void 0 ? void 0 : filters.status) ? { status: filters.status } : {})), ((filters === null || filters === void 0 ? void 0 : filters.roleType) ? { roleType: filters.roleType } : {})),
        select: roleSelect,
        orderBy: { priority: 'desc' },
    });
});
// ── Detail ────────────────────────────────────────────────────────────────
RbacRoleService.getById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.role.findFirst({
        where: { id, deletedAt: null },
        select: roleSelect,
    });
});
RbacRoleService.getByCode = (0, catchServiceAsync_1.catchServiceAsync)(async (code) => {
    return prisma.role.findFirst({
        where: { code, deletedAt: null },
        select: roleSelect,
    });
});
// ── Create ────────────────────────────────────────────────────────────────
RbacRoleService.create = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    var _b, _c;
    return prisma.role.create({
        data: {
            name: data.name,
            code: data.code.toUpperCase(),
            description: data.description,
            roleType: (_b = data.roleType) !== null && _b !== void 0 ? _b : 'custom',
            priority: (_c = data.priority) !== null && _c !== void 0 ? _c : 0,
            isSystem: false,
            status: 'active',
            createdBy: data.createdBy,
        },
        select: roleSelect,
    });
});
// ── Update ────────────────────────────────────────────────────────────────
RbacRoleService.update = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.role.update({
        where: { id },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.name !== undefined ? { name: data.name } : {})), (data.description !== undefined ? { description: data.description } : {})), (data.roleType !== undefined ? { roleType: data.roleType } : {})), (data.priority !== undefined ? { priority: data.priority } : {})), (data.status !== undefined ? { status: data.status } : {})), (data.updatedBy !== undefined ? { updatedBy: data.updatedBy } : {})),
        select: roleSelect,
    });
});
// ── Soft Delete ───────────────────────────────────────────────────────────
RbacRoleService.softDelete = (0, catchServiceAsync_1.catchServiceAsync)(async (id, deletedBy) => {
    // Prevent deletion of system roles
    const role = await prisma.role.findUnique({ where: { id }, select: { isSystem: true } });
    if (role === null || role === void 0 ? void 0 : role.isSystem) {
        throw Object.assign(new Error('System roles cannot be deleted.'), { statusCode: 403 });
    }
    return prisma.role.update({
        where: { id },
        data: { deletedAt: new Date(), updatedBy: deletedBy },
        select: roleSelect,
    });
});
// ── Permissions for a role ─────────────────────────────────────────────────
RbacRoleService.getPermissions = (0, catchServiceAsync_1.catchServiceAsync)(async (roleId) => {
    return prisma.rolePermission.findMany({
        where: { roleId },
        include: {
            permission: {
                select: { id: true, name: true, code: true, action: true, module: { select: { name: true, code: true } } },
            },
        },
        orderBy: { createdAt: 'asc' },
    });
});
