"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
const moduleSelect = {
    id: true,
    name: true,
    code: true,
    icon: true,
    displayOrder: true,
    description: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};
class ModuleService {
}
exports.ModuleService = ModuleService;
_a = ModuleService;
// ── List ──────────────────────────────────────────────────────────────────
ModuleService.getAll = (0, catchServiceAsync_1.catchServiceAsync)(async (status) => {
    return prisma.module.findMany({
        where: Object.assign({}, (status ? { status } : {})),
        select: moduleSelect,
        orderBy: { displayOrder: 'asc' },
    });
});
// ── List with Permissions ─────────────────────────────────────────────────
ModuleService.getAllWithPermissions = (0, catchServiceAsync_1.catchServiceAsync)(async () => {
    return prisma.module.findMany({
        where: { status: 'active' },
        orderBy: { displayOrder: 'asc' },
        select: Object.assign(Object.assign({}, moduleSelect), { permissions: {
                where: { status: 'active' },
                select: { id: true, name: true, code: true, action: true, description: true },
                orderBy: { name: 'asc' },
            } }),
    });
});
// ── Detail ────────────────────────────────────────────────────────────────
ModuleService.getById = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.module.findUnique({
        where: { id },
        select: moduleSelect,
    });
});
// ── Create ────────────────────────────────────────────────────────────────
ModuleService.create = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    var _b;
    return prisma.module.create({
        data: {
            name: data.name,
            code: data.code.toUpperCase(),
            icon: data.icon,
            displayOrder: (_b = data.displayOrder) !== null && _b !== void 0 ? _b : 0,
            description: data.description,
            status: 'active',
        },
        select: moduleSelect,
    });
});
// ── Update ────────────────────────────────────────────────────────────────
ModuleService.update = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.module.update({
        where: { id },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.name !== undefined ? { name: data.name } : {})), (data.icon !== undefined ? { icon: data.icon } : {})), (data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {})), (data.description !== undefined ? { description: data.description } : {})), (data.status !== undefined ? { status: data.status } : {})),
        select: moduleSelect,
    });
});
// ── Delete ────────────────────────────────────────────────────────────────
ModuleService.delete = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.module.delete({ where: { id } });
});
