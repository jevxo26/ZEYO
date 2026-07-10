import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserIdentityVerificationService {
  static getVerification = catchServiceAsync(async (userId: number) => {
    return prisma.userIdentityVerification.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static submitVerification = catchServiceAsync(async (userId: number, data: {
    documentType: string;
    documentNumber?: string;
    documentFront?: string;
    documentBack?: string;
    selfieImage?: string;
  }) => {
    // Cancel any previous pending submissions
    await prisma.userIdentityVerification.updateMany({
      where: { userId, verificationStatus: 'pending' },
      data: { verificationStatus: 'rejected', rejectionReason: 'Superseded by new submission' },
    });
    return prisma.userIdentityVerification.create({
      data: { userId, ...data, verificationStatus: 'pending' },
    });
  });

  // Admin only
  static reviewVerification = catchServiceAsync(async (id: number, adminId: number, status: 'approved' | 'rejected', reason?: string) => {
    return prisma.userIdentityVerification.update({
      where: { id },
      data: {
        verificationStatus: status,
        verifiedBy: adminId,
        verifiedAt: new Date(),
        ...(reason ? { rejectionReason: reason } : {}),
      },
    });
  });

  // Admin: get all pending verifications
  static getPendingVerifications = catchServiceAsync(async (skip = 0, take = 20) => {
    return prisma.userIdentityVerification.findMany({
      where: { verificationStatus: 'pending' },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
      skip,
      take,
    });
  });
}
