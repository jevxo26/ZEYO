"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSavedEventService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserSavedEventService {
}
exports.UserSavedEventService = UserSavedEventService;
_a = UserSavedEventService;
UserSavedEventService.getSavedEvents = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userSavedEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserSavedEventService.getSavedEventById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    return prisma_1.prisma.userSavedEvent.findFirst({ where: { id, userId } });
});
UserSavedEventService.createSavedEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    return prisma_1.prisma.userSavedEvent.create({ data: Object.assign({ userId }, data) });
});
UserSavedEventService.updateSavedEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId, data) => {
    const event = await prisma_1.prisma.userSavedEvent.findFirst({ where: { id, userId } });
    if (!event)
        throw new Error('Saved event not found');
    return prisma_1.prisma.userSavedEvent.update({ where: { id }, data });
});
UserSavedEventService.deleteSavedEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const event = await prisma_1.prisma.userSavedEvent.findFirst({ where: { id, userId } });
    if (!event)
        throw new Error('Saved event not found');
    await prisma_1.prisma.userSavedEvent.delete({ where: { id } });
    return { message: 'Saved event deleted' };
});
