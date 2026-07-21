import { prisma } from '../../config/prisma';
import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class UserSavedEventService {
  static getSavedEvents = catchServiceAsync(async (userId: number) => {
    return prisma.userSavedEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static getSavedEventById = catchServiceAsync(async (id: number, userId: number) => {
    return prisma.userSavedEvent.findFirst({ where: { id, userId } });
  });

  static createSavedEvent = catchServiceAsync(async (userId: number, data: {
    title: string;
    eventTypeId?: number;
    estimatedBudget?: number;
    guestCount?: number;
    status?: string;
  }) => {
    return prisma.userSavedEvent.create({ data: { userId, ...data } });
  });

  static updateSavedEvent = catchServiceAsync(async (id: number, userId: number, data: Prisma.UserSavedEventUpdateInput) => {
    const event = await prisma.userSavedEvent.findFirst({ where: { id, userId } });
    if (!event) throw new Error('Saved event not found');
    return prisma.userSavedEvent.update({ where: { id }, data });
  });

  static deleteSavedEvent = catchServiceAsync(async (id: number, userId: number) => {
    const event = await prisma.userSavedEvent.findFirst({ where: { id, userId } });
    if (!event) throw new Error('Saved event not found');
    await prisma.userSavedEvent.delete({ where: { id } });
    return { message: 'Saved event deleted' };
  });
}
