"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeviceService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserDeviceService {
}
exports.UserDeviceService = UserDeviceService;
_a = UserDeviceService;
UserDeviceService.getDevices = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userDevice.findMany({
        where: { userId },
        orderBy: { lastLoginAt: 'desc' },
    });
});
UserDeviceService.getDeviceById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    return prisma_1.prisma.userDevice.findFirst({ where: { id, userId } });
});
UserDeviceService.registerDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    // Upsert by deviceToken if provided, otherwise create
    if (data.deviceToken) {
        return prisma_1.prisma.userDevice.upsert({
            where: { id: 0 }, // no unique on deviceToken in schema yet — use create
            update: Object.assign(Object.assign({}, data), { userId, lastLoginAt: new Date() }),
            create: Object.assign(Object.assign({}, data), { userId, lastLoginAt: new Date() }),
        });
    }
    return prisma_1.prisma.userDevice.create({ data: Object.assign(Object.assign({}, data), { userId, lastLoginAt: new Date() }) });
});
UserDeviceService.updateDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId, data) => {
    const device = await prisma_1.prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device)
        throw new Error('Device not found');
    return prisma_1.prisma.userDevice.update({ where: { id }, data });
});
UserDeviceService.blockDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const device = await prisma_1.prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device)
        throw new Error('Device not found');
    return prisma_1.prisma.userDevice.update({ where: { id }, data: { status: 'blocked' } });
});
UserDeviceService.removeDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const device = await prisma_1.prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device)
        throw new Error('Device not found');
    await prisma_1.prisma.userDevice.delete({ where: { id } });
    return { message: 'Device removed' };
});
