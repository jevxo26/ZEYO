"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFavoriteZoneService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserFavoriteZoneService {
}
exports.UserFavoriteZoneService = UserFavoriteZoneService;
_a = UserFavoriteZoneService;
UserFavoriteZoneService.getFavorites = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userFavoriteZone.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserFavoriteZoneService.addFavorite = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, zoneId) => {
    return prisma.userFavoriteZone.upsert({
        where: { userId_zoneId: { userId, zoneId } },
        update: {},
        create: { userId, zoneId },
    });
});
UserFavoriteZoneService.removeFavorite = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, zoneId) => {
    const fav = await prisma.userFavoriteZone.findUnique({
        where: { userId_zoneId: { userId, zoneId } },
    });
    if (!fav)
        throw new Error('Favorite not found');
    await prisma.userFavoriteZone.delete({ where: { userId_zoneId: { userId, zoneId } } });
    return { message: 'Zone removed from favorites' };
});
