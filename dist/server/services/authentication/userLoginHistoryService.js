"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginHistoryService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserLoginHistoryService {
}
exports.UserLoginHistoryService = UserLoginHistoryService;
_a = UserLoginHistoryService;
UserLoginHistoryService.getHistory = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, limit = 20, skip = 0) => {
    const [total, records] = await Promise.all([
        prisma_1.prisma.userLoginHistory.count({ where: { userId } }),
        prisma_1.prisma.userLoginHistory.findMany({
            where: { userId },
            include: { device: { select: { deviceName: true, deviceType: true } } },
            orderBy: { loginAt: 'desc' },
            take: limit,
            skip,
        }),
    ]);
    return { total, records };
});
UserLoginHistoryService.createEntry = (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
    return prisma_1.prisma.userLoginHistory.create({ data });
});
