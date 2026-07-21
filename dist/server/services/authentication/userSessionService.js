"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserSessionService {
}
exports.UserSessionService = UserSessionService;
_a = UserSessionService;
UserSessionService.getSessions = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userSession.findMany({
        where: { userId, status: 'active' },
        include: { device: { select: { deviceName: true, deviceType: true, operatingSystem: true, browser: true } } },
        orderBy: { loginTime: 'desc' },
    });
});
UserSessionService.revokeSession = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const session = await prisma_1.prisma.userSession.findFirst({ where: { id, userId } });
    if (!session)
        throw new Error('Session not found');
    return prisma_1.prisma.userSession.update({
        where: { id },
        data: { status: 'revoked', logoutTime: new Date() },
    });
});
UserSessionService.revokeAllSessions = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, excludeSessionId) => {
    await prisma_1.prisma.userSession.updateMany({
        where: Object.assign({ userId, status: 'active' }, (excludeSessionId ? { NOT: { id: excludeSessionId } } : {})),
        data: { status: 'revoked', logoutTime: new Date() },
    });
    return { message: 'All sessions revoked' };
});
