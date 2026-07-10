import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserFavoriteZoneService {
  static getFavorites = catchServiceAsync(async (userId: number) => {
    return prisma.userFavoriteZone.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static addFavorite = catchServiceAsync(async (userId: number, zoneId: number) => {
    return prisma.userFavoriteZone.upsert({
      where: { userId_zoneId: { userId, zoneId } },
      update: {},
      create: { userId, zoneId },
    });
  });

  static removeFavorite = catchServiceAsync(async (userId: number, zoneId: number) => {
    const fav = await prisma.userFavoriteZone.findUnique({
      where: { userId_zoneId: { userId, zoneId } },
    });
    if (!fav) throw new Error('Favorite not found');
    await prisma.userFavoriteZone.delete({ where: { userId_zoneId: { userId, zoneId } } });
    return { message: 'Zone removed from favorites' };
  });
}
