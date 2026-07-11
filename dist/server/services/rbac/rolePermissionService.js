"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class RolePermissionService {
}
exports.RolePermissionService = RolePermissionService;
_a = RolePermissionService;
// ── Get all permissions assigned to a role ────────────────────────────────
RolePermissionService.getByRole = (0, catchServiceAsync_1.catchServiceAsync)(async (roleId) => {
    return prisma.rolePermission.findMany({
        where: { roleId },
        include: {
            permission: {
                select: {
                    id: true, name: true, code: true, action: true,
                    module: { select: { id: true, name: true, code: true } },
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });
});
// ── Assign a permission to a role (upsert) ────────────────────────────────
RolePermissionService.assign = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const flags = {
        canCreate: (_b = data.canCreate) !== null && _b !== void 0 ? _b : false,
        canRead: (_c = data.canRead) !== null && _c !== void 0 ? _c : false,
        canUpdate: (_d = data.canUpdate) !== null && _d !== void 0 ? _d : false,
        canDelete: (_e = data.canDelete) !== null && _e !== void 0 ? _e : false,
        canApprove: (_f = data.canApprove) !== null && _f !== void 0 ? _f : false,
        canAssign: (_g = data.canAssign) !== null && _g !== void 0 ? _g : false,
        canExport: (_h = data.canExport) !== null && _h !== void 0 ? _h : false,
        canImport: (_j = data.canImport) !== null && _j !== void 0 ? _j : false,
        canManage: (_k = data.canManage) !== null && _k !== void 0 ? _k : false,
    };
    return prisma.rolePermission.upsert({
        where: {
            roleId_permissionId: { roleId: data.roleId, permissionId: data.permissionId },
        },
        update: flags,
        create: Object.assign({ roleId: data.roleId, permissionId: data.permissionId }, flags),
    });
});
// ── Bulk assign permissions to a role ─────────────────────────────────────
RolePermissionService.bulkAssign = (0, catchServiceAsync_1.catchServiceAsync)(async (roleId, permissionIds) => {
    const ops = permissionIds.map((permissionId) => prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: { canRead: true },
        create: { roleId, permissionId, canRead: true },
    }));
    return Promise.all(ops);
});
// ── Revoke a permission from a role ───────────────────────────────────────
RolePermissionService.revoke = (0, catchServiceAsync_1.catchServiceAsync)(async (roleId, permissionId) => {
    return prisma.rolePermission.delete({
        where: { roleId_permissionId: { roleId, permissionId } },
    });
});
// ── Revoke all permissions from a role ────────────────────────────────────
RolePermissionService.revokeAll = (0, catchServiceAsync_1.catchServiceAsync)(async (roleId) => {
    return prisma.rolePermission.deleteMany({ where: { roleId } });
});
