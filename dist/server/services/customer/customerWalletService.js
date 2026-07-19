"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerWalletService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class CustomerWalletService {
}
exports.CustomerWalletService = CustomerWalletService;
_a = CustomerWalletService;
CustomerWalletService.getWallet = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma.customerWallet.findUnique({
        where: { customerId },
    });
});
CustomerWalletService.getTransactions = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma.customerTransaction.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerWalletService.getRewards = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma.customerReward.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerWalletService.createTransaction = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    if (data.amount <= 0)
        throw new Error('Transaction amount must be greater than zero');
    return prisma.$transaction(async (tx) => {
        const wallet = await tx.customerWallet.findUnique({
            where: { customerId },
        });
        if (!wallet)
            throw new Error('Customer wallet not found');
        if (wallet.status !== 'active')
            throw new Error('Customer wallet is currently frozen');
        const change = data.transactionType === 'credit' ? data.amount : -data.amount;
        const newBalance = wallet.balance + change;
        if (newBalance < 0) {
            throw new Error('Insufficient wallet balance');
        }
        // Update wallet balance
        await tx.customerWallet.update({
            where: { customerId },
            data: { balance: newBalance },
        });
        // Record transaction
        return tx.customerTransaction.create({
            data: {
                customerId,
                walletId: wallet.id,
                bookingId: data.bookingId || null,
                transactionType: data.transactionType,
                amount: data.amount,
                reference: data.reference || null,
                status: 'completed',
            },
        });
    });
});
CustomerWalletService.addReward = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    const points = data.points || 0;
    const amount = data.amount || 0;
    let expiryDate = null;
    if (data.expiryDays) {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + data.expiryDays);
    }
    return prisma.$transaction(async (tx) => {
        const wallet = await tx.customerWallet.findUnique({
            where: { customerId },
        });
        if (!wallet)
            throw new Error('Wallet not found');
        // Update wallet rewards balance
        await tx.customerWallet.update({
            where: { customerId },
            data: {
                rewardBalance: wallet.rewardBalance + amount,
            },
        });
        // Create reward record
        return tx.customerReward.create({
            data: {
                customerId,
                rewardType: data.rewardType,
                points,
                amount,
                description: data.description || null,
                expiryDate,
                status: 'active',
            },
        });
    });
});
CustomerWalletService.redeemReward = (0, catchServiceAsync_1.catchServiceAsync)(async (rewardId, customerId) => {
    return prisma.$transaction(async (tx) => {
        const reward = await tx.customerReward.findFirst({
            where: { id: rewardId, customerId, status: 'active' },
        });
        if (!reward)
            throw new Error('Active reward coupon not found');
        if (reward.expiryDate && new Date(reward.expiryDate) < new Date()) {
            await tx.customerReward.update({
                where: { id: rewardId },
                data: { status: 'expired' },
            });
            throw new Error('Reward coupon has expired');
        }
        const wallet = await tx.customerWallet.findUnique({
            where: { customerId },
        });
        if (!wallet)
            throw new Error('Wallet not found');
        // Update reward status
        await tx.customerReward.update({
            where: { id: rewardId },
            data: { status: 'redeemed' },
        });
        // Transfer reward amount into general cash balance
        const newRewardBalance = Math.max(0, wallet.rewardBalance - reward.amount);
        const newBalance = wallet.balance + reward.amount;
        await tx.customerWallet.update({
            where: { customerId },
            data: {
                balance: newBalance,
                rewardBalance: newRewardBalance,
            },
        });
        // Create a transaction to reflect the transfer
        await tx.customerTransaction.create({
            data: {
                customerId,
                walletId: wallet.id,
                transactionType: 'credit',
                amount: reward.amount,
                reference: `Redeemed Reward #${rewardId}: ${reward.rewardType}`,
                status: 'completed',
            },
        });
        return { success: true, reward, newBalance };
    });
});
