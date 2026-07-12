import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { VendorFinancialService } from '../../services/vendor/vendorFinancialService';

export class VendorFinancialController {
  // ─── Bank Accounts ────────────────────────────────────────────────────────
  static adminAddBankAccount = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const account = await VendorFinancialService.addBankAccount(id, req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'Bank account added successfully',
      data: account,
    });
  });

  static adminGetBankAccounts = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const accounts = await VendorFinancialService.getBankAccounts(id);
    sendResponse(res, { statusCode: 200, data: accounts });
  });

  static adminSetDefaultBankAccount = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10); // Vendor ID
    const accountId = parseInt(req.params['accountId'] as string, 10);

    if (isNaN(id) || isNaN(accountId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID or account ID' });
    }

    const account = await VendorFinancialService.setDefaultBankAccount(accountId, id);
    sendResponse(res, {
      statusCode: 200,
      message: 'Default bank account updated successfully',
      data: account,
    });
  });

  static adminDeleteBankAccount = catchAsync(async (req: Request, res: Response) => {
    const accountId = parseInt(req.params['accountId'] as string, 10);
    if (isNaN(accountId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid bank account ID' });
    }

    await VendorFinancialService.deleteBankAccount(accountId);
    sendResponse(res, {
      statusCode: 200,
      message: 'Bank account deleted successfully',
    });
  });

  // ─── Wallet & Transactions ────────────────────────────────────────────────
  static adminGetWallet = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const wallet = await VendorFinancialService.getWallet(id);
    sendResponse(res, { statusCode: 200, data: wallet || {} });
  });

  static adminCreateTransaction = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { transactionType, amount, bookingId, reference, status } = req.body;
    if (!transactionType || amount === undefined) {
      return sendResponse(res, { statusCode: 400, message: 'transactionType and amount are required' });
    }

    const result = await VendorFinancialService.createTransaction(id, {
      bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
      transactionType,
      amount: parseFloat(amount),
      reference,
      status,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Transaction processed successfully',
      data: result,
    });
  });

  static adminGetTransactions = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const txs = await VendorFinancialService.getTransactions(id);
    sendResponse(res, { statusCode: 200, data: txs });
  });

  // ─── Payout Requests ─────────────────────────────────────────────────────
  static adminRequestPayout = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { requestedAmount, paymentMethod } = req.body;
    if (requestedAmount === undefined || !paymentMethod) {
      return sendResponse(res, { statusCode: 400, message: 'requestedAmount and paymentMethod are required' });
    }

    const payout = await VendorFinancialService.requestPayout(id, {
      requestedAmount: parseFloat(requestedAmount),
      paymentMethod,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Payout request registered successfully',
      data: payout,
    });
  });

  static adminGetPayouts = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const payouts = await VendorFinancialService.getPayouts(id);
    sendResponse(res, { statusCode: 200, data: payouts });
  });

  static adminProcessPayout = catchAsync(async (req: Request, res: Response) => {
    const payoutId = parseInt(req.params['payoutId'] as string, 10);
    const processedBy = 1; // System Admin user ID or req.user.userId

    if (isNaN(payoutId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid payout ID' });
    }

    const { status } = req.body; // approved | rejected
    if (!status || (status !== 'approved' && status !== 'rejected')) {
      return sendResponse(res, { statusCode: 400, message: 'Status must be approved or rejected' });
    }

    const result = await VendorFinancialService.processPayout(payoutId, processedBy, status);
    sendResponse(res, {
      statusCode: 200,
      message: `Payout request ${status === 'approved' ? 'approved and processed' : 'rejected'} successfully`,
      data: result,
    });
  });
}
