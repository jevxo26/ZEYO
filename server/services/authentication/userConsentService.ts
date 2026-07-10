import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserConsentService {
  static getConsents = catchServiceAsync(async (userId: number) => {
    return prisma.userConsent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static acceptConsent = catchServiceAsync(async (userId: number, consentType: string, ipAddress?: string) => {
    return prisma.userConsent.upsert({
      where: { userId_consentType: { userId, consentType } },
      update: { status: 'accepted', acceptedAt: new Date(), withdrawnAt: null, ipAddress },
      create: { userId, consentType, status: 'accepted', acceptedAt: new Date(), ipAddress },
    });
  });

  static withdrawConsent = catchServiceAsync(async (userId: number, consentType: string) => {
    const consent = await prisma.userConsent.findUnique({
      where: { userId_consentType: { userId, consentType } },
    });
    if (!consent) throw new Error('Consent record not found');
    return prisma.userConsent.update({
      where: { userId_consentType: { userId, consentType } },
      data: { status: 'withdrawn', withdrawnAt: new Date() },
    });
  });
}
