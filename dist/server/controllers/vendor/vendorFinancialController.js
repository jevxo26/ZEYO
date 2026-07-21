"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorFinancialController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const vendorFinancialService_1 = require("../../services/vendor/vendorFinancialService");
class VendorFinancialController {
}
exports.VendorFinancialController = VendorFinancialController;
_a = VendorFinancialController;
// ─── Bank Accounts ────────────────────────────────────────────────────────
VendorFinancialController.adminAddBankAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const account = await vendorFinancialService_1.VendorFinancialService.addBankAccount(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Bank account added successfully',
        data: account,
    });
});
VendorFinancialController.adminGetBankAccounts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const accounts = await vendorFinancialService_1.VendorFinancialService.getBankAccounts(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: accounts });
});
VendorFinancialController.adminSetDefaultBankAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10); // Vendor ID
    const accountId = parseInt(req.params['accountId'], 10);
    if (isNaN(id) || isNaN(accountId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID or account ID' });
    }
    const account = await vendorFinancialService_1.VendorFinancialService.setDefaultBankAccount(accountId, id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Default bank account updated successfully',
        data: account,
    });
});
VendorFinancialController.adminDeleteBankAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const accountId = parseInt(req.params['accountId'], 10);
    if (isNaN(accountId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid bank account ID' });
    }
    await vendorFinancialService_1.VendorFinancialService.deleteBankAccount(accountId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Bank account deleted successfully',
    });
});
// ─── Wallet & Transactions ────────────────────────────────────────────────
VendorFinancialController.adminGetWallet = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const wallet = await vendorFinancialService_1.VendorFinancialService.getWallet(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: wallet || {} });
});
VendorFinancialController.adminCreateTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { transactionType, amount, bookingId, reference, status } = req.body;
    if (!transactionType || amount === undefined) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'transactionType and amount are required' });
    }
    const result = await vendorFinancialService_1.VendorFinancialService.createTransaction(id, {
        bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
        transactionType,
        amount: parseFloat(amount),
        reference,
        status,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Transaction processed successfully',
        data: result,
    });
});
VendorFinancialController.adminGetTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const txs = await vendorFinancialService_1.VendorFinancialService.getTransactions(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: txs });
});
// ─── Payout Requests ─────────────────────────────────────────────────────
VendorFinancialController.adminRequestPayout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { requestedAmount, paymentMethod } = req.body;
    if (requestedAmount === undefined || !paymentMethod) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'requestedAmount and paymentMethod are required' });
    }
    const payout = await vendorFinancialService_1.VendorFinancialService.requestPayout(id, {
        requestedAmount: parseFloat(requestedAmount),
        paymentMethod,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Payout request registered successfully',
        data: payout,
    });
});
VendorFinancialController.adminGetPayouts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const payouts = await vendorFinancialService_1.VendorFinancialService.getPayouts(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: payouts });
});
VendorFinancialController.adminProcessPayout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payoutId = parseInt(req.params['payoutId'], 10);
    const processedBy = 1; // System Admin user ID or req.user.userId
    if (isNaN(payoutId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid payout ID' });
    }
    const { status } = req.body; // approved | rejected
    if (!status || (status !== 'approved' && status !== 'rejected')) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Status must be approved or rejected' });
    }
    const result = await vendorFinancialService_1.VendorFinancialService.processPayout(payoutId, processedBy, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: `Payout request ${status === 'approved' ? 'approved and processed' : 'rejected'} successfully`,
        data: result,
    });
});
