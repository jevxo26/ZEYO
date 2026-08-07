import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class CustomerWalletService {
  static getWallet = catchServiceAsync(async (customerId: number) => {
    return prisma.customerWallet.findUnique({
      where: { customerId },
    });
  });

  static getTransactions = catchServiceAsync(async (customerId: number) => {
    return prisma.customerTransaction.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static getRewards = catchServiceAsync(async (customerId: number) => {
    return prisma.customerReward.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static createTransaction = catchServiceAsync(async (customerId: number, data: {
    bookingId?: number;
    transactionType: 'credit' | 'debit';
    amount: number;
    reference?: string;
  }) => {
    if (data.amount <= 0) throw new Error('Transaction amount must be greater than zero');

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.customerWallet.findUnique({
        where: { customerId },
      });
      if (!wallet) throw new Error('Customer wallet not found');
      if (wallet.status !== 'active') throw new Error('Customer wallet is currently frozen');

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

  static addReward = catchServiceAsync(async (customerId: number, data: {
    rewardType: string;
    points?: number;
    amount?: number;
    description?: string;
    expiryDays?: number;
  }) => {
    const points = data.points || 0;
    const amount = data.amount || 0;

    let expiryDate: Date | null = null;
    if (data.expiryDays) {
      expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + data.expiryDays);
    }

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.customerWallet.findUnique({
        where: { customerId },
      });
      if (!wallet) throw new Error('Wallet not found');

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

  static redeemReward = catchServiceAsync(async (rewardId: number, customerId: number) => {
    return prisma.$transaction(async (tx) => {
      const reward = await tx.customerReward.findFirst({
        where: { id: rewardId, customerId, status: 'active' },
      });

      if (!reward) throw new Error('Active reward coupon not found');

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
      if (!wallet) throw new Error('Wallet not found');

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
}
