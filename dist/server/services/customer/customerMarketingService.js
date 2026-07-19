"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerMarketingService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class CustomerMarketingService {
}
exports.CustomerMarketingService = CustomerMarketingService;
_a = CustomerMarketingService;
// ─── Referrals ────────────────────────────────────────────────────────────
CustomerMarketingService.getReferrals = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
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
CustomerMarketingService.getReferralByCode = (0, catchServiceAsync_1.catchServiceAsync)(async (referralCode) => {
    return prisma.customerReferral.findFirst({
        where: { referralCode },
    });
});
CustomerMarketingService.applyReferral = (0, catchServiceAsync_1.catchServiceAsync)(async (referredCustomerId, referralCode) => {
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
CustomerMarketingService.getReviews = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma.customerReview.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerMarketingService.createReview = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    // Confirm booking exists in history for this customer (to ensure they actually booked)
    const booking = await prisma.customerBookingHistory.findFirst({
        where: { customerId, bookingId: data.bookingId },
    });
    if (!booking) {
        throw new Error('You can only review services associated with a valid booking history');
    }
    return prisma.customerReview.create({
        data: Object.assign(Object.assign({}, data), { customerId }),
    });
});
