"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserSessionService {
}
exports.UserSessionService = UserSessionService;
_a = UserSessionService;
UserSessionService.getSessions = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userSession.findMany({
        where: { userId, status: 'active' },
        include: { device: { select: { deviceName: true, deviceType: true, operatingSystem: true, browser: true } } },
        orderBy: { loginTime: 'desc' },
    });
});
UserSessionService.revokeSession = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const session = await prisma.userSession.findFirst({ where: { id, userId } });
    if (!session)
        throw new Error('Session not found');
    return prisma.userSession.update({
        where: { id },
        data: { status: 'revoked', logoutTime: new Date() },
    });
});
UserSessionService.revokeAllSessions = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, excludeSessionId) => {
    await prisma.userSession.updateMany({
        where: Object.assign({ userId, status: 'active' }, (excludeSessionId ? { NOT: { id: excludeSessionId } } : {})),
        data: { status: 'revoked', logoutTime: new Date() },
    });
    return { message: 'All sessions revoked' };
});
