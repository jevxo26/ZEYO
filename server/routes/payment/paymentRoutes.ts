import { Router } from 'express';
import { PaymentController } from '../../controllers/payment/paymentController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();
router.use(verifyToken, requireRole('admin', 'manager'));

// ── Static routes FIRST (before /:id wildcard) ─────────────────────────────────

// Stats
router.get('/stats',    PaymentController.getStats);

// Payment Methods & Gateways
router.get('/methods',  PaymentController.getMethods);
router.post('/methods', PaymentController.createMethod);
router.post('/gateways', PaymentController.createGateway);

// Invoice
router.post('/invoices',                      PaymentController.createInvoice);
router.get('/invoices/:invoiceId',             PaymentController.getInvoice);
router.put('/invoices/:invoiceId/status',      PaymentController.updateInvoiceStatus);

// Transactions
router.post('/transactions',                   PaymentController.recordTransaction);
router.put('/transactions/:txId',              PaymentController.updateTransaction);

// Refunds
router.post('/refunds',                        PaymentController.requestRefund);
router.put('/refunds/:refundId/approve',        PaymentController.approveRefund);
router.post('/refunds/transactions',            PaymentController.recordRefundTransaction);

// Settlements
router.post('/settlements',                                        PaymentController.createSettlement);
router.post('/settlements/vendors',                                PaymentController.addVendorSettlement);
router.put('/settlements/vendors/:vendorSettlementId/settle',      PaymentController.settleVendor);

// Commission & Tax
router.post('/commission',  PaymentController.recordCommission);
router.post('/taxes',       PaymentController.addTax);

// Webhook (public — called by gateway)
router.post('/webhooks',    PaymentController.saveWebhook);

// Settings
router.get('/settings',     PaymentController.getSetting);
router.post('/settings',    PaymentController.upsertSetting);

// ── Payment CRUD (/:id last) ───────────────────────────────────────────────────
router.get('/',         PaymentController.getAll);
router.post('/',        PaymentController.create);
router.get('/:id',      PaymentController.getById);
router.post('/:id/status',       PaymentController.updateStatus);
router.post('/:id/verify',       PaymentController.verify);
router.post('/:id/receipt',      PaymentController.generateReceipt);
router.post('/:id/billing',      PaymentController.setBillingAddress);

// Installments & Schedules
router.post('/:id/installments',                       PaymentController.addInstallment);
router.put('/:id/installments/:installmentId/pay',     PaymentController.payInstallment);
router.post('/:id/schedules',                          PaymentController.addSchedule);
router.put('/:id/schedules/:scheduleId/pay',           PaymentController.paySchedule);

export default router;
