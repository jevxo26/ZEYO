"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const prisma_1 = require("../config/prisma");
const catchServiceAsync_1 = require("../utils/catchServiceAsync");
const safeRoleSelect = {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    updatedAt: true,
};
class RoleService {
}
exports.RoleService = RoleService;
_a = RoleService;
RoleService.getAllRoles = (0, catchServiceAsync_1.catchServiceAsync)(async () => {
    return prisma_1.prisma.role.findMany({
        orderBy: { name: 'asc' },
        select: safeRoleSelect,
    });
});
RoleService.getRoleById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.role.findUnique({
        where: { id },
        select: safeRoleSelect,
    });
});
