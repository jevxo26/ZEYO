"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSavedEventService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserSavedEventService {
}
exports.UserSavedEventService = UserSavedEventService;
_a = UserSavedEventService;
UserSavedEventService.getSavedEvents = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userSavedEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserSavedEventService.getSavedEventById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    return prisma.userSavedEvent.findFirst({ where: { id, userId } });
});
UserSavedEventService.createSavedEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    return prisma.userSavedEvent.create({ data: Object.assign({ userId }, data) });
});
UserSavedEventService.updateSavedEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId, data) => {
    const event = await prisma.userSavedEvent.findFirst({ where: { id, userId } });
    if (!event)
        throw new Error('Saved event not found');
    return prisma.userSavedEvent.update({ where: { id }, data });
});
UserSavedEventService.deleteSavedEvent = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const event = await prisma.userSavedEvent.findFirst({ where: { id, userId } });
    if (!event)
        throw new Error('Saved event not found');
    await prisma.userSavedEvent.delete({ where: { id } });
    return { message: 'Saved event deleted' };
});
