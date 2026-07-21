"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const paymentService_1 = require("../../services/payment/paymentService");
class PaymentController {
}
exports.PaymentController = PaymentController;
_a = PaymentController;
// ── Payment ────────────────────────────────────────────────────────────────
PaymentController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Payment record created', data });
});
PaymentController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { paymentStatus, customerId, page, limit } = req.query;
    const data = await paymentService_1.PaymentService.getAll({
        paymentStatus: paymentStatus,
        customerId: customerId ? Number(customerId) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PaymentController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.getById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Payment not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PaymentController.getStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await paymentService_1.PaymentService.getStats();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PaymentController.updateStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const { paymentStatus, paidAmount } = req.body;
    const data = await paymentService_1.PaymentService.updateStatus(Number(req.params.id), paymentStatus, paidAmount, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `Status → ${paymentStatus}`, data });
});
// ── Payment Methods ────────────────────────────────────────────────────────
PaymentController.createMethod = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.createMethod(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Payment method created', data });
});
PaymentController.getMethods = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await paymentService_1.PaymentService.getMethods();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
// ── Gateway ────────────────────────────────────────────────────────────────
PaymentController.createGateway = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.createGateway(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Gateway configured', data });
});
// ── Transaction ────────────────────────────────────────────────────────────
PaymentController.recordTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.recordTransaction(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Transaction recorded', data });
});
PaymentController.updateTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.updateTransaction(Number(req.params.txId), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Transaction updated', data });
});
// ── Installment ────────────────────────────────────────────────────────────
PaymentController.addInstallment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.addInstallment(Object.assign({ paymentId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Installment added', data });
});
PaymentController.payInstallment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.payInstallment(Number(req.params.installmentId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Installment paid', data });
});
// ── Schedule ───────────────────────────────────────────────────────────────
PaymentController.addSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.addSchedule(Object.assign({ paymentId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Schedule added', data });
});
PaymentController.paySchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.paySchedule(Number(req.params.scheduleId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Schedule milestone paid', data });
});
// ── Invoice ────────────────────────────────────────────────────────────────
PaymentController.createInvoice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.createInvoice(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Invoice generated', data });
});
PaymentController.getInvoice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.getInvoice(Number(req.params.invoiceId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PaymentController.updateInvoiceStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.updateInvoiceStatus(Number(req.params.invoiceId), req.body.status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Invoice status updated', data });
});
// ── Receipt ────────────────────────────────────────────────────────────────
PaymentController.generateReceipt = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.generateReceipt(Number(req.params.id), req.body.receiptUrl);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Receipt generated', data });
});
// ── Verification ───────────────────────────────────────────────────────────
PaymentController.verify = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const { verificationStatus, verificationNote } = req.body;
    const data = await paymentService_1.PaymentService.verify(Number(req.params.id), userId, verificationStatus, verificationNote);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `Payment ${verificationStatus}`, data });
});
// ── Webhook ────────────────────────────────────────────────────────────────
PaymentController.saveWebhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.saveWebhook(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, data });
});
// ── Refund ─────────────────────────────────────────────────────────────────
PaymentController.requestRefund = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await paymentService_1.PaymentService.requestRefund(Object.assign({ requestedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Refund requested', data });
});
PaymentController.approveRefund = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await paymentService_1.PaymentService.approveRefund(Number(req.params.refundId), userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Refund approved', data });
});
PaymentController.recordRefundTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.recordRefundTransaction(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Refund transaction recorded', data });
});
// ── Settlement ─────────────────────────────────────────────────────────────
PaymentController.createSettlement = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.createSettlement(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Settlement created', data });
});
PaymentController.addVendorSettlement = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.addVendorSettlement(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Vendor settlement added', data });
});
PaymentController.settleVendor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.settleVendor(Number(req.params.vendorSettlementId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Vendor settled', data });
});
// ── Platform Commission ────────────────────────────────────────────────────
PaymentController.recordCommission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.recordCommission(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Commission recorded', data });
});
// ── Tax ────────────────────────────────────────────────────────────────────
PaymentController.addTax = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.addTax(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Tax recorded', data });
});
// ── Billing Address ────────────────────────────────────────────────────────
PaymentController.setBillingAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.setBillingAddress(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Billing address saved', data });
});
// ── Setting ────────────────────────────────────────────────────────────────
PaymentController.getSetting = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await paymentService_1.PaymentService.getSetting();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
PaymentController.upsertSetting = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await paymentService_1.PaymentService.upsertSetting(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Settings saved', data });
});
