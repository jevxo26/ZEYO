"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserRoleService {
}
exports.UserRoleService = UserRoleService;
_a = UserRoleService;
// ── Get all roles assigned to a user ──────────────────────────────────────
UserRoleService.getByUser = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userRole.findMany({
        where: { userId, status: 'active' },
        include: {
            role: {
                select: { id: true, name: true, code: true, roleType: true, priority: true },
            },
        },
        orderBy: { assignedAt: 'desc' },
    });
});
// ── Assign a role to a user ───────────────────────────────────────────────
UserRoleService.assign = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    // Revoke any existing active assignment for the same role
    await prisma.userRole.updateMany({
        where: { userId: data.userId, roleId: data.roleId, status: 'active' },
        data: { status: 'revoked' },
    });
    return prisma.userRole.create({
        data: {
            userId: data.userId,
            roleId: data.roleId,
            assignedBy: data.assignedBy,
            assignedAt: new Date(),
            expiresAt: data.expiresAt,
            status: 'active',
        },
        include: {
            role: { select: { id: true, name: true, code: true } },
        },
    });
});
// ── Revoke a role from a user ─────────────────────────────────────────────
UserRoleService.revoke = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, roleId) => {
    return prisma.userRole.updateMany({
        where: { userId, roleId, status: 'active' },
        data: { status: 'revoked' },
    });
});
// ── Get all users with a specific role ────────────────────────────────────
UserRoleService.getUsersByRole = (0, catchServiceAsync_1.catchServiceAsync)(async (roleId) => {
    return prisma.userRole.findMany({
        where: { roleId, status: 'active' },
        select: {
            id: true,
            userId: true,
            assignedBy: true,
            assignedAt: true,
            expiresAt: true,
            status: true,
        },
        orderBy: { assignedAt: 'desc' },
    });
});
