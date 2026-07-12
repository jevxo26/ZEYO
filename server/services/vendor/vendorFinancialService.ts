import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class VendorFinancialService {
  // ─── Bank Accounts ────────────────────────────────────────────────────────
  static addBankAccount = catchServiceAsync(async (vendorId: number, data: {
    bankName?: string;
    branchName?: string;
    accountName?: string;
    accountNumber?: string;
    routingNumber?: string;
    mobileBankingProvider?: string;
    mobileBankingNumber?: string;
    isDefault?: boolean;
  }) => {
    return prisma.$transaction(async (tx) => {
      // If default is true, reset other accounts
      if (data.isDefault) {
        await tx.vendorBankAccount.updateMany({
          where: { vendorId },
          data: { isDefault: false },
        });
      }

      return tx.vendorBankAccount.create({
        data: {
          vendorId,
          bankName: data.bankName || null,
          branchName: data.branchName || null,
          accountName: data.accountName || null,
          accountNumber: data.accountNumber || null,
          routingNumber: data.routingNumber || null,
          mobileBankingProvider: data.mobileBankingProvider || null,
          mobileBankingNumber: data.mobileBankingNumber || null,
          isDefault: !!data.isDefault,
        },
      });
    });
  });

  static getBankAccounts = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorBankAccount.findMany({
      where: { vendorId },
    });
  });

  static setDefaultBankAccount = catchServiceAsync(async (id: number, vendorId: number) => {
    return prisma.$transaction(async (tx) => {
      await tx.vendorBankAccount.updateMany({
        where: { vendorId },
        data: { isDefault: false },
      });

      return tx.vendorBankAccount.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  });

  static deleteBankAccount = catchServiceAsync(async (id: number) => {
    return prisma.vendorBankAccount.delete({
      where: { id },
    });
  });

  // ─── Wallet Operations ───────────────────────────────────────────────────
  static getWallet = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorWallet.findFirst({
      where: { vendorId },
    });
  });

  static createTransaction = catchServiceAsync(async (vendorId: number, data: {
    bookingId?: number;
    transactionType: string; // credit | debit | payout
    amount: number;
    reference?: string;
    status?: string;
  }) => {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.vendorWallet.findUnique({
        where: { vendorId },
      });

      if (!wallet) {
        throw new Error('Vendor wallet not found');
      }

      // Update wallet balance based on transaction type
      let newBalance = wallet.balance;
      let newWithdrawable = wallet.withdrawableAmount;
      let newPending = wallet.pendingAmount;

      if (data.transactionType === 'credit') {
        newBalance += data.amount;
        newWithdrawable += data.amount;
      } else if (data.transactionType === 'debit') {
        newBalance -= data.amount;
        newWithdrawable -= data.amount;
      }

      const updatedWallet = await tx.vendorWallet.update({
        where: { vendorId },
        data: {
          balance: newBalance,
          withdrawableAmount: newWithdrawable,
          pendingAmount: newPending,
        },
      });

      const transaction = await tx.vendorTransaction.create({
        data: {
          vendorId,
          walletId: wallet.id,
          bookingId: data.bookingId || null,
          transactionType: data.transactionType,
          amount: data.amount,
          reference: data.reference || null,
          status: data.status || 'completed',
        },
      });

      return { transaction, wallet: updatedWallet };
    });
  });

  // ─── Payout Operations ───────────────────────────────────────────────────
  static requestPayout = catchServiceAsync(async (vendorId: number, data: {
    requestedAmount: number;
    paymentMethod: string; // bank_transfer | bkash | nagad
  }) => {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.vendorWallet.findUnique({
        where: { vendorId },
      });

      if (!wallet) {
        throw new Error('Vendor wallet not found');
      }

      if (wallet.withdrawableAmount < data.requestedAmount) {
        throw new Error('Insufficient withdrawable balance');
      }

      // Update wallet: transfer requestedAmount from withdrawableAmount to pendingAmount
      await tx.vendorWallet.update({
        where: { vendorId },
        data: {
          withdrawableAmount: wallet.withdrawableAmount - data.requestedAmount,
          pendingAmount: wallet.pendingAmount + data.requestedAmount,
        },
      });

      return tx.vendorPayout.create({
        data: {
          vendorId,
          walletId: wallet.id,
          requestedAmount: data.requestedAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: 'pending',
        },
      });
    });
  });

  static getPayouts = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorPayout.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static getTransactions = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorTransaction.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  });

  static processPayout = catchServiceAsync(async (payoutId: number, processedBy: number, status: 'approved' | 'rejected') => {
    return prisma.$transaction(async (tx) => {
      const payout = await tx.vendorPayout.findUnique({
        where: { id: payoutId },
      });

      if (!payout) {
        throw new Error('Payout request not found');
      }

      if (payout.paymentStatus !== 'pending') {
        throw new Error('Payout request has already been processed');
      }

      const wallet = await tx.vendorWallet.findUnique({
        where: { id: payout.walletId },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (status === 'approved') {
        // Deduct from pending balance and overall balance
        const updatedWallet = await tx.vendorWallet.update({
          where: { id: wallet.id },
          data: {
            pendingAmount: wallet.pendingAmount - payout.requestedAmount,
            balance: wallet.balance - payout.requestedAmount,
          },
        });

        // Update payout status
        const updatedPayout = await tx.vendorPayout.update({
          where: { id: payoutId },
          data: {
            paymentStatus: 'processed',
            approvedAmount: payout.requestedAmount,
            processedBy,
            processedAt: new Date(),
          },
        });

        // Record a transaction
        await tx.vendorTransaction.create({
          data: {
            vendorId: payout.vendorId,
            walletId: wallet.id,
            transactionType: 'payout',
            amount: payout.requestedAmount,
            reference: `Payout approved (ID: ${payoutId})`,
            status: 'completed',
          },
        });

        return { payout: updatedPayout, wallet: updatedWallet };
      } else {
        // Return pending balance back to withdrawable
        const updatedWallet = await tx.vendorWallet.update({
          where: { id: wallet.id },
          data: {
            pendingAmount: wallet.pendingAmount - payout.requestedAmount,
            withdrawableAmount: wallet.withdrawableAmount + payout.requestedAmount,
          },
        });

        const updatedPayout = await tx.vendorPayout.update({
          where: { id: payoutId },
          data: {
            paymentStatus: 'rejected',
            processedBy,
            processedAt: new Date(),
          },
        });

        return { payout: updatedPayout, wallet: updatedWallet };
      }
    });
  });
}
