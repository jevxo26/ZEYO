"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const permissionSelect = {
    id: true,
    name: true,
    code: true,
    description: true,
    moduleId: true,
    action: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};
class PermissionService {
}
exports.PermissionService = PermissionService;
_a = PermissionService;
// ── List ──────────────────────────────────────────────────────────────────
PermissionService.getAll = (0, catchServiceAsync_1.catchServiceAsync)(async (filters) => {
    return prisma_1.prisma.permission.findMany({
        where: Object.assign(Object.assign(Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.moduleId) ? { moduleId: filters.moduleId } : {})), ((filters === null || filters === void 0 ? void 0 : filters.action) ? { action: filters.action } : {})), ((filters === null || filters === void 0 ? void 0 : filters.status) ? { status: filters.status } : {})),
        select: Object.assign(Object.assign({}, permissionSelect), { module: { select: { id: true, name: true, code: true } } }),
        orderBy: [{ moduleId: 'asc' }, { name: 'asc' }],
    });
});
// ── Detail ────────────────────────────────────────────────────────────────
PermissionService.getById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.permission.findUnique({
        where: { id },
        select: Object.assign(Object.assign({}, permissionSelect), { module: { select: { id: true, name: true, code: true } } }),
    });
});
// ── Create ────────────────────────────────────────────────────────────────
PermissionService.create = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    const permission = await prisma_1.prisma.permission.create({
        data: {
            name: data.name,
            code: data.code.toUpperCase(),
            moduleId: data.moduleId,
            action: data.action,
            description: data.description,
            status: 'active',
        },
        select: permissionSelect,
    });
    // Auto-create ModulePermission join
    await prisma_1.prisma.modulePermission.upsert({
        where: { moduleId_permissionId: { moduleId: data.moduleId, permissionId: permission.id } },
        update: {},
        create: { moduleId: data.moduleId, permissionId: permission.id },
    });
    return permission;
});
// ── Update ────────────────────────────────────────────────────────────────
PermissionService.update = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.permission.update({
        where: { id },
        data: Object.assign(Object.assign(Object.assign(Object.assign({}, (data.name !== undefined ? { name: data.name } : {})), (data.description !== undefined ? { description: data.description } : {})), (data.action !== undefined ? { action: data.action } : {})), (data.status !== undefined ? { status: data.status } : {})),
        select: permissionSelect,
    });
});
// ── Delete ────────────────────────────────────────────────────────────────
PermissionService.delete = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.permission.delete({ where: { id } });
});
