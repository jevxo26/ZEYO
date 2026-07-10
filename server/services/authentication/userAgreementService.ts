import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserAgreementService {
  static getAgreements = catchServiceAsync(async (userId: number) => {
    return prisma.userAgreement.findMany({
      where: { userId },
      orderBy: { acceptedAt: 'desc' },
    });
  });

  static acceptAgreement = catchServiceAsync(async (userId: number, data: {
    agreementType: string;
    version: string;
    ipAddress?: string;
  }) => {
    return prisma.userAgreement.create({
      data: { userId, ...data, acceptedAt: new Date() },
    });
  });

  static hasAccepted = catchServiceAsync(async (userId: number, agreementType: string, version: string) => {
    const agreement = await prisma.userAgreement.findFirst({
      where: { userId, agreementType, version },
    });
    return !!agreement;
  });
}
