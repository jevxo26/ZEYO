"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../../controllers/payment/paymentController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'));
// ── Static routes FIRST (before /:id wildcard) ─────────────────────────────────
// Stats
router.get('/stats', paymentController_1.PaymentController.getStats);
// Payment Methods & Gateways
router.get('/methods', paymentController_1.PaymentController.getMethods);
router.post('/methods', paymentController_1.PaymentController.createMethod);
router.post('/gateways', paymentController_1.PaymentController.createGateway);
// Invoice
router.post('/invoices', paymentController_1.PaymentController.createInvoice);
router.get('/invoices/:invoiceId', paymentController_1.PaymentController.getInvoice);
router.put('/invoices/:invoiceId/status', paymentController_1.PaymentController.updateInvoiceStatus);
// Transactions
router.post('/transactions', paymentController_1.PaymentController.recordTransaction);
router.put('/transactions/:txId', paymentController_1.PaymentController.updateTransaction);
// Refunds
router.post('/refunds', paymentController_1.PaymentController.requestRefund);
router.put('/refunds/:refundId/approve', paymentController_1.PaymentController.approveRefund);
router.post('/refunds/transactions', paymentController_1.PaymentController.recordRefundTransaction);
// Settlements
router.post('/settlements', paymentController_1.PaymentController.createSettlement);
router.post('/settlements/vendors', paymentController_1.PaymentController.addVendorSettlement);
router.put('/settlements/vendors/:vendorSettlementId/settle', paymentController_1.PaymentController.settleVendor);
// Commission & Tax
router.post('/commission', paymentController_1.PaymentController.recordCommission);
router.post('/taxes', paymentController_1.PaymentController.addTax);
// Webhook (public — called by gateway)
router.post('/webhooks', paymentController_1.PaymentController.saveWebhook);
// Settings
router.get('/settings', paymentController_1.PaymentController.getSetting);
router.post('/settings', paymentController_1.PaymentController.upsertSetting);
// ── Payment CRUD (/:id last) ───────────────────────────────────────────────────
router.get('/', paymentController_1.PaymentController.getAll);
router.post('/', paymentController_1.PaymentController.create);
router.get('/:id', paymentController_1.PaymentController.getById);
router.post('/:id/status', paymentController_1.PaymentController.updateStatus);
router.post('/:id/verify', paymentController_1.PaymentController.verify);
router.post('/:id/receipt', paymentController_1.PaymentController.generateReceipt);
router.post('/:id/billing', paymentController_1.PaymentController.setBillingAddress);
// Installments & Schedules
router.post('/:id/installments', paymentController_1.PaymentController.addInstallment);
router.put('/:id/installments/:installmentId/pay', paymentController_1.PaymentController.payInstallment);
router.post('/:id/schedules', paymentController_1.PaymentController.addSchedule);
router.put('/:id/schedules/:scheduleId/pay', paymentController_1.PaymentController.paySchedule);
exports.default = router;
