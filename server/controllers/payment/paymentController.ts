import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PaymentService } from '../../services/payment/paymentService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class PaymentController {

  // ── Payment ────────────────────────────────────────────────────────────────
  static create = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Payment record created', data });
  });

  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { paymentStatus, customerId, page, limit } = req.query;
    const data = await PaymentService.getAll({
      paymentStatus: paymentStatus as string,
      customerId: customerId ? Number(customerId) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    sendResponse(res, { statusCode: 200, data });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.getById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Payment not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static getStats = catchAsync(async (_req: Request, res: Response) => {
    const data = await PaymentService.getStats();
    sendResponse(res, { statusCode: 200, data });
  });

  static updateStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const { paymentStatus, paidAmount } = req.body;
    const data = await PaymentService.updateStatus(Number(req.params.id), paymentStatus, paidAmount, userId);
    sendResponse(res, { statusCode: 200, message: `Status → ${paymentStatus}`, data });
  });

  // ── Payment Methods ────────────────────────────────────────────────────────
  static createMethod = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.createMethod(req.body);
    sendResponse(res, { statusCode: 201, message: 'Payment method created', data });
  });

  static getMethods = catchAsync(async (_req: Request, res: Response) => {
    const data = await PaymentService.getMethods();
    sendResponse(res, { statusCode: 200, data });
  });

  // ── Gateway ────────────────────────────────────────────────────────────────
  static createGateway = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.createGateway(req.body);
    sendResponse(res, { statusCode: 201, message: 'Gateway configured', data });
  });

  // ── Transaction ────────────────────────────────────────────────────────────
  static recordTransaction = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.recordTransaction(req.body);
    sendResponse(res, { statusCode: 201, message: 'Transaction recorded', data });
  });

  static updateTransaction = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.updateTransaction(Number(req.params.txId), req.body);
    sendResponse(res, { statusCode: 200, message: 'Transaction updated', data });
  });

  // ── Installment ────────────────────────────────────────────────────────────
  static addInstallment = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.addInstallment({ paymentId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Installment added', data });
  });

  static payInstallment = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.payInstallment(Number(req.params.installmentId));
    sendResponse(res, { statusCode: 200, message: 'Installment paid', data });
  });

  // ── Schedule ───────────────────────────────────────────────────────────────
  static addSchedule = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.addSchedule({ paymentId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Schedule added', data });
  });

  static paySchedule = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.paySchedule(Number(req.params.scheduleId));
    sendResponse(res, { statusCode: 200, message: 'Schedule milestone paid', data });
  });

  // ── Invoice ────────────────────────────────────────────────────────────────
  static createInvoice = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.createInvoice(req.body);
    sendResponse(res, { statusCode: 201, message: 'Invoice generated', data });
  });

  static getInvoice = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.getInvoice(Number(req.params.invoiceId));
    sendResponse(res, { statusCode: 200, data });
  });

  static updateInvoiceStatus = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.updateInvoiceStatus(Number(req.params.invoiceId), req.body.status);
    sendResponse(res, { statusCode: 200, message: 'Invoice status updated', data });
  });

  // ── Receipt ────────────────────────────────────────────────────────────────
  static generateReceipt = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.generateReceipt(Number(req.params.id), req.body.receiptUrl);
    sendResponse(res, { statusCode: 201, message: 'Receipt generated', data });
  });

  // ── Verification ───────────────────────────────────────────────────────────
  static verify = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId!;
    const { verificationStatus, verificationNote } = req.body;
    const data = await PaymentService.verify(Number(req.params.id), userId, verificationStatus, verificationNote);
    sendResponse(res, { statusCode: 200, message: `Payment ${verificationStatus}`, data });
  });

  // ── Webhook ────────────────────────────────────────────────────────────────
  static saveWebhook = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.saveWebhook(req.body);
    sendResponse(res, { statusCode: 201, data });
  });

  // ── Refund ─────────────────────────────────────────────────────────────────
  static requestRefund = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await PaymentService.requestRefund({ requestedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Refund requested', data });
  });

  static approveRefund = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId!;
    const data = await PaymentService.approveRefund(Number(req.params.refundId), userId);
    sendResponse(res, { statusCode: 200, message: 'Refund approved', data });
  });

  static recordRefundTransaction = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.recordRefundTransaction(req.body);
    sendResponse(res, { statusCode: 201, message: 'Refund transaction recorded', data });
  });

  // ── Settlement ─────────────────────────────────────────────────────────────
  static createSettlement = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.createSettlement(req.body);
    sendResponse(res, { statusCode: 201, message: 'Settlement created', data });
  });

  static addVendorSettlement = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.addVendorSettlement(req.body);
    sendResponse(res, { statusCode: 201, message: 'Vendor settlement added', data });
  });

  static settleVendor = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.settleVendor(Number(req.params.vendorSettlementId));
    sendResponse(res, { statusCode: 200, message: 'Vendor settled', data });
  });

  // ── Platform Commission ────────────────────────────────────────────────────
  static recordCommission = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.recordCommission(req.body);
    sendResponse(res, { statusCode: 201, message: 'Commission recorded', data });
  });

  // ── Tax ────────────────────────────────────────────────────────────────────
  static addTax = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.addTax(req.body);
    sendResponse(res, { statusCode: 201, message: 'Tax recorded', data });
  });

  // ── Billing Address ────────────────────────────────────────────────────────
  static setBillingAddress = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.setBillingAddress(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Billing address saved', data });
  });

  // ── Setting ────────────────────────────────────────────────────────────────
  static getSetting = catchAsync(async (_req: Request, res: Response) => {
    const data = await PaymentService.getSetting();
    sendResponse(res, { statusCode: 200, data });
  });

  static upsertSetting = catchAsync(async (req: Request, res: Response) => {
    const data = await PaymentService.upsertSetting(req.body);
    sendResponse(res, { statusCode: 200, message: 'Settings saved', data });
  });
}
