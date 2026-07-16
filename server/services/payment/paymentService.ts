// ─────────────────────────────────────────────────────────────────────────────
// PaymentService — Core service for Part 12: Payment & Billing Module
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient, Prisma } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

async function generatePaymentNumber(): Promise<string> {
  const count = await prisma.payment.count();
  const year  = new Date().getFullYear();
  return `PAY-${year}-${String(count + 1).padStart(6, '0')}`;
}

async function generateInvoiceNumber(): Promise<string> {
  const count = await prisma.paymentInvoice.count();
  const year  = new Date().getFullYear();
  return `INV-${year}-${String(count + 1).padStart(6, '0')}`;
}

async function generateReceiptNumber(): Promise<string> {
  const count = await prisma.paymentReceipt.count();
  const year  = new Date().getFullYear();
  return `RCP-${year}-${String(count + 1).padStart(6, '0')}`;
}

export const PaymentService = {

  // ── Payment CRUD ──────────────────────────────────────────────────────────
  create: catchServiceAsync(async (data: {
    bookingId: number; customerId: number; paymentType?: string;
    subtotal: number; discount?: number; tax?: number; totalAmount: number;
    dueAmount: number; currency?: string;
  }) => {
    const paymentNumber = await generatePaymentNumber();
    return prisma.payment.create({ data: { paymentNumber, paidAmount: 0, ...data } });
  }),

  getAll: catchServiceAsync(async (filters: {
    paymentStatus?: string; customerId?: number; page?: number; limit?: number;
  } = {}) => {
    const { paymentStatus, customerId, page = 1, limit = 20 } = filters;
    const where: Record<string, unknown> = {};
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (customerId)    where.customerId    = customerId;
    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { transactions: { orderBy: { createdAt: 'desc' }, take: 1 }, receipt: true, verification: true },
      }),
      prisma.payment.count({ where }),
    ]);
    return { data, total, page, limit };
  }),

  getById: catchServiceAsync(async (id: number) =>
    prisma.payment.findUnique({
      where: { id },
      include: {
        transactions: true,
        installments: { orderBy: { installmentNumber: 'asc' } },
        schedules: { orderBy: { dueDate: 'asc' } },
        receipt: true,
        verification: true,
        webhooks: { orderBy: { receivedAt: 'desc' } },
        refunds: { include: { transactions: true } },
        taxTransactions: true,
        billingAddress: true,
        history: { orderBy: { createdAt: 'desc' } },
        logs: { orderBy: { createdAt: 'desc' } },
      },
    })),

  updateStatus: catchServiceAsync(async (id: number, paymentStatus: string, paidAmount?: number, performedBy?: number) => {
    const payment = await prisma.payment.update({
      where: { id },
      data: { paymentStatus, ...(paidAmount !== undefined ? { paidAmount } : {}) },
    });
    await prisma.paymentHistory.create({
      data: { paymentId: id, action: 'status_update', performedBy, newStatus: paymentStatus },
    });
    return payment;
  }),

  getStats: catchServiceAsync(async () => {
    const [total, pending, partial, paid, overdue, refunded] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { paymentStatus: 'pending' } }),
      prisma.payment.count({ where: { paymentStatus: 'partial' } }),
      prisma.payment.count({ where: { paymentStatus: 'paid' } }),
      prisma.payment.count({ where: { paymentStatus: 'overdue' } }),
      prisma.payment.count({ where: { paymentStatus: 'refunded' } }),
    ]);
    const totalRevenue = await prisma.payment.aggregate({ _sum: { paidAmount: true } });
    return { total, pending, partial, paid, overdue, refunded, totalRevenue: totalRevenue._sum.paidAmount ?? 0 };
  }),

  // ── PaymentMethod ─────────────────────────────────────────────────────────
  createMethod: catchServiceAsync(async (data: {
    name: string; provider: string; methodType?: string; processingFee?: number;
  }) => prisma.paymentMethod.create({ data })),

  getMethods: catchServiceAsync(async () =>
    prisma.paymentMethod.findMany({ where: { status: 'active' }, include: { gateways: true } })),

  // ── PaymentGateway ────────────────────────────────────────────────────────
  createGateway: catchServiceAsync(async (data: {
    paymentMethodId: number; gatewayName: string; merchantId?: string; environment?: string;
  }) => prisma.paymentGateway.create({ data })),

  // ── PaymentTransaction ────────────────────────────────────────────────────
  recordTransaction: catchServiceAsync(async (data: {
    paymentId: number; transactionId: string; paymentMethodId?: number;
    gatewayTransactionId?: string; amount: number; currency?: string;
    transactionStatus?: string; responseCode?: string; responseMessage?: string;
  }) => prisma.paymentTransaction.create({ data })),

  updateTransaction: catchServiceAsync(async (id: number, data: {
    transactionStatus?: string; responseCode?: string; responseMessage?: string; gatewayTransactionId?: string;
  }) => prisma.paymentTransaction.update({ where: { id }, data })),

  // ── PaymentInstallment ────────────────────────────────────────────────────
  addInstallment: catchServiceAsync(async (data: {
    paymentId: number; installmentNumber: number; amount: number; dueDate: Date;
  }) => prisma.paymentInstallment.create({ data })),

  payInstallment: catchServiceAsync(async (id: number) =>
    prisma.paymentInstallment.update({ where: { id }, data: { status: 'paid', paidDate: new Date() } })),

  // ── PaymentSchedule ───────────────────────────────────────────────────────
  addSchedule: catchServiceAsync(async (data: {
    paymentId: number; milestone: string; percentage: number; amount: number; dueDate: Date;
  }) => prisma.paymentSchedule.create({ data })),

  paySchedule: catchServiceAsync(async (id: number) =>
    prisma.paymentSchedule.update({ where: { id }, data: { status: 'paid' } })),

  // ── PaymentInvoice ────────────────────────────────────────────────────────
  createInvoice: catchServiceAsync(async (data: {
    bookingId: number; subtotal: number; discount?: number; tax?: number; grandTotal: number;
    items?: Array<{ serviceId?: number; serviceName: string; quantity: number; unitPrice: number; totalPrice: number }>;
  }) => {
    const { items, ...invoiceData } = data;
    const invoiceNumber = await generateInvoiceNumber();
    return prisma.paymentInvoice.create({
      data: {
        invoiceNumber, ...invoiceData,
        ...(items ? { items: { create: items } } : {}),
      },
      include: { items: true },
    });
  }),

  getInvoice: catchServiceAsync(async (id: number) =>
    prisma.paymentInvoice.findUnique({ where: { id }, include: { items: true, payments: true } })),

  updateInvoiceStatus: catchServiceAsync(async (id: number, status: string) =>
    prisma.paymentInvoice.update({ where: { id }, data: { status } })),

  // ── PaymentReceipt ────────────────────────────────────────────────────────
  generateReceipt: catchServiceAsync(async (paymentId: number, receiptUrl?: string) => {
    const receiptNumber = await generateReceiptNumber();
    return prisma.paymentReceipt.create({ data: { paymentId, receiptNumber, receiptUrl } });
  }),

  // ── PaymentVerification ───────────────────────────────────────────────────
  verify: catchServiceAsync(async (paymentId: number, verifiedBy: number, verificationStatus: string, verificationNote?: string) =>
    prisma.paymentVerification.upsert({
      where: { paymentId },
      create: { paymentId, verifiedBy, verificationStatus, verificationNote, verifiedAt: new Date() },
      update: { verifiedBy, verificationStatus, verificationNote, verifiedAt: new Date() },
    })),

  // ── PaymentWebhook ────────────────────────────────────────────────────────
  saveWebhook: catchServiceAsync(async (data: {
    paymentId?: number; gatewayName: string; eventType: string; payload: object; status?: string;
  }) => prisma.paymentWebhook.create({ data })),

  // ── Refund ────────────────────────────────────────────────────────────────
  requestRefund: catchServiceAsync(async (data: {
    paymentId: number; bookingId: number; refundAmount: number; refundReason?: string; requestedBy?: number;
  }) => prisma.refund.create({ data })),

  approveRefund: catchServiceAsync(async (refundId: number, approvedBy: number) =>
    prisma.refund.update({ where: { id: refundId }, data: { refundStatus: 'approved', approvedBy } })),

  recordRefundTransaction: catchServiceAsync(async (data: {
    refundId: number; transactionId: string; amount: number; gatewayReference?: string;
  }) => prisma.refundTransaction.create({ data })),

  // ── Settlement ────────────────────────────────────────────────────────────
  createSettlement: catchServiceAsync(async (data: {
    bookingId: number; totalAmount: number; vendorAmount: number;
    platformCommission: number; taxAmount?: number; netAmount: number;
  }) => prisma.settlement.create({ data, include: { vendorSettlements: true } })),

  addVendorSettlement: catchServiceAsync(async (data: {
    settlementId: number; vendorId: number; assignmentId?: number; amount: number;
  }) => prisma.vendorSettlement.create({ data })),

  settleVendor: catchServiceAsync(async (id: number) =>
    prisma.vendorSettlement.update({ where: { id }, data: { paymentStatus: 'paid', paidAt: new Date() } })),

  // ── PlatformCommission ────────────────────────────────────────────────────
  recordCommission: catchServiceAsync(async (data: {
    bookingId: number; vendorId?: number; commissionType?: string;
    commissionRate: number; commissionAmount: number;
  }) => prisma.platformCommission.create({ data })),

  // ── TaxTransaction ────────────────────────────────────────────────────────
  addTax: catchServiceAsync(async (data: {
    paymentId: number; taxName: string; taxRate: number; taxAmount: number;
  }) => prisma.taxTransaction.create({ data })),

  // ── BillingAddress ────────────────────────────────────────────────────────
  setBillingAddress: catchServiceAsync(async (paymentId: number, data: {
    customerName: string; phone?: string; email?: string; address?: string;
    city?: string; district?: string; division?: string; postalCode?: string; country?: string;
  }) => prisma.billingAddress.upsert({
    where: { paymentId }, create: { paymentId, ...data }, update: data,
  })),

  // ── History & Log ─────────────────────────────────────────────────────────
  addHistory: catchServiceAsync(async (data: {
    paymentId: number; action: string; performedBy?: number; oldStatus?: string; newStatus?: string; remarks?: string;
  }) => prisma.paymentHistory.create({ data })),

  addLog: catchServiceAsync(async (data: {
    paymentId: number; logType?: string; description?: string;
    gatewayResponse?: object; ipAddress?: string; deviceInfo?: string;
  }) => prisma.paymentLog.create({ data })),

  // ── PaymentSetting ────────────────────────────────────────────────────────
  getSetting: catchServiceAsync(async () =>
    prisma.paymentSetting.findFirst()),

  upsertSetting: catchServiceAsync(async (data: Partial<{
    allowPartialPayment: boolean; allowRefund: boolean; allowCOD: boolean;
    allowOnlinePayment: boolean; autoGenerateInvoice: boolean; autoSettlement: boolean; status: string;
  }>) => {
    const existing = await prisma.paymentSetting.findFirst();
    if (existing) return prisma.paymentSetting.update({ where: { id: existing.id }, data });
    return prisma.paymentSetting.create({ data: { ...data } });
  }),
};
