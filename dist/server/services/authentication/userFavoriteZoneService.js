"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFavoriteZoneService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserFavoriteZoneService {
}
exports.UserFavoriteZoneService = UserFavoriteZoneService;
_a = UserFavoriteZoneService;
UserFavoriteZoneService.getFavorites = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userFavoriteZone.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserFavoriteZoneService.addFavorite = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, zoneId) => {
    return prisma_1.prisma.userFavoriteZone.upsert({
        where: { userId_zoneId: { userId, zoneId } },
        update: {},
        create: { userId, zoneId },
    });
});
UserFavoriteZoneService.removeFavorite = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, zoneId) => {
    const fav = await prisma_1.prisma.userFavoriteZone.findUnique({
        where: { userId_zoneId: { userId, zoneId } },
    });
    if (!fav)
        throw new Error('Favorite not found');
    await prisma_1.prisma.userFavoriteZone.delete({ where: { userId_zoneId: { userId, zoneId } } });
    return { message: 'Zone removed from favorites' };
});
