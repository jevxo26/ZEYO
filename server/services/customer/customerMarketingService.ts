import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class CustomerMarketingService {
  // ─── Referrals ────────────────────────────────────────────────────────────
  static getReferrals = catchServiceAsync(async (customerId: number) => {
    return prisma.customerReferral.findMany({
      where: {
        OR: [
          { customerId },
          { referredCustomerId: customerId },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            customerCode: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        referredCustomer: {
          select: {
            id: true,
            customerCode: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  });

  static getReferralByCode = catchServiceAsync(async (referralCode: string) => {
    return prisma.customerReferral.findFirst({
      where: { referralCode },
    });
  });

  static applyReferral = catchServiceAsync(async (referredCustomerId: number, referralCode: string) => {
    return prisma.$transaction(async (tx) => {
      // Find the referring customer. They must have this referralCode as their customerCode or a saved code
      // We will look for a Customer whose customerCode matches the referralCode
      const referrer = await tx.customer.findUnique({
        where: { customerCode: referralCode },
      });

      if (!referrer) {
        throw new Error('Invalid referral code');
      }

      if (referrer.id === referredCustomerId) {
        throw new Error('You cannot refer yourself');
      }

      // Check if this referred customer was already referred
      const existingReferral = await tx.customerReferral.findUnique({
        where: { referredCustomerId },
      });

      if (existingReferral) {
        throw new Error('This customer has already been referred');
      }

      // Default reward amount for referral
      const referralBonus = 100.0;

      // Create Referral log
      const referral = await tx.customerReferral.create({
        data: {
          customerId: referrer.id,
          referralCode,
          referredCustomerId,
          rewardAmount: referralBonus,
          status: 'completed',
        },
      });

      // Credit the referrer's wallet with rewardBalance
      const referrerWallet = await tx.customerWallet.findUnique({
        where: { customerId: referrer.id },
      });

      if (referrerWallet) {
        await tx.customerWallet.update({
          where: { customerId: referrer.id },
          data: {
            rewardBalance: referrerWallet.rewardBalance + referralBonus,
          },
        });

        // Add a reward record for referrer
        await tx.customerReward.create({
          data: {
            customerId: referrer.id,
            rewardType: 'referral_bonus',
            points: 10,
            amount: referralBonus,
            description: `Referral bonus for inviting Customer #${referredCustomerId}`,
            status: 'active',
          },
        });
      }

      return referral;
    });
  });

  // ─── Reviews ──────────────────────────────────────────────────────────────
  static getReviews = catchServiceAsync(async (customerId: number) => {
    return prisma.customerReview.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static createReview = catchServiceAsync(async (customerId: number, data: {
    bookingId: number;
    rating: number;
    title?: string;
    review?: string;
    serviceQuality?: number;
    supportExperience?: number;
    bookingExperience?: number;
    overallExperience?: number;
  }) => {
    // Confirm booking exists in history for this customer (to ensure they actually booked)
    const booking = await prisma.customerBookingHistory.findFirst({
      where: { customerId, bookingId: data.bookingId },
    });
    if (!booking) {
      throw new Error('You can only review services associated with a valid booking history');
    }

    return prisma.customerReview.create({
      data: {
        ...data,
        customerId,
      },
    });
  });
}
