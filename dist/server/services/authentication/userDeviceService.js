"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeviceService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserDeviceService {
}
exports.UserDeviceService = UserDeviceService;
_a = UserDeviceService;
UserDeviceService.getDevices = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userDevice.findMany({
        where: { userId },
        orderBy: { lastLoginAt: 'desc' },
    });
});
UserDeviceService.getDeviceById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    return prisma.userDevice.findFirst({ where: { id, userId } });
});
UserDeviceService.registerDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    // Upsert by deviceToken if provided, otherwise create
    if (data.deviceToken) {
        return prisma.userDevice.upsert({
            where: { id: 0 }, // no unique on deviceToken in schema yet — use create
            update: Object.assign(Object.assign({}, data), { userId, lastLoginAt: new Date() }),
            create: Object.assign(Object.assign({}, data), { userId, lastLoginAt: new Date() }),
        });
    }
    return prisma.userDevice.create({ data: Object.assign(Object.assign({}, data), { userId, lastLoginAt: new Date() }) });
});
UserDeviceService.updateDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId, data) => {
    const device = await prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device)
        throw new Error('Device not found');
    return prisma.userDevice.update({ where: { id }, data });
});
UserDeviceService.blockDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const device = await prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device)
        throw new Error('Device not found');
    return prisma.userDevice.update({ where: { id }, data: { status: 'blocked' } });
});
UserDeviceService.removeDevice = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const device = await prisma.userDevice.findFirst({ where: { id, userId } });
    if (!device)
        throw new Error('Device not found');
    await prisma.userDevice.delete({ where: { id } });
    return { message: 'Device removed' };
});
