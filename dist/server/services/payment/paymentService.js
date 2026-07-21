"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
async function generatePaymentNumber() {
    const count = await prisma_1.prisma.payment.count();
    const year = new Date().getFullYear();
    return `PAY-${year}-${String(count + 1).padStart(6, '0')}`;
}
async function generateInvoiceNumber() {
    const count = await prisma_1.prisma.paymentInvoice.count();
    const year = new Date().getFullYear();
    return `INV-${year}-${String(count + 1).padStart(6, '0')}`;
}
async function generateReceiptNumber() {
    const count = await prisma_1.prisma.paymentReceipt.count();
    const year = new Date().getFullYear();
    return `RCP-${year}-${String(count + 1).padStart(6, '0')}`;
}
exports.PaymentService = {
    // ── Payment CRUD ──────────────────────────────────────────────────────────
    create: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const paymentNumber = await generatePaymentNumber();
        return prisma_1.prisma.payment.create({ data: Object.assign({ paymentNumber, paidAmount: 0 }, data) });
    }),
    getAll: (0, catchServiceAsync_1.catchServiceAsync)(async (filters = {}) => {
        const { paymentStatus, customerId, page = 1, limit = 20 } = filters;
        const where = {};
        if (paymentStatus)
            where.paymentStatus = paymentStatus;
        if (customerId)
            where.customerId = customerId;
        const [data, total] = await Promise.all([
            prisma_1.prisma.payment.findMany({
                where, skip: (page - 1) * limit, take: limit,
                orderBy: { createdAt: 'desc' },
                include: { transactions: { orderBy: { createdAt: 'desc' }, take: 1 }, receipt: true, verification: true },
            }),
            prisma_1.prisma.payment.count({ where }),
        ]);
        return { data, total, page, limit };
    }),
    getById: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.payment.findUnique({
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
    updateStatus: (0, catchServiceAsync_1.catchServiceAsync)(async (id, paymentStatus, paidAmount, performedBy) => {
        const payment = await prisma_1.prisma.payment.update({
            where: { id },
            data: Object.assign({ paymentStatus }, (paidAmount !== undefined ? { paidAmount } : {})),
        });
        await prisma_1.prisma.paymentHistory.create({
            data: { paymentId: id, action: 'status_update', performedBy, newStatus: paymentStatus },
        });
        return payment;
    }),
    getStats: (0, catchServiceAsync_1.catchServiceAsync)(async () => {
        var _a;
        const [total, pending, partial, paid, overdue, refunded] = await Promise.all([
            prisma_1.prisma.payment.count(),
            prisma_1.prisma.payment.count({ where: { paymentStatus: 'pending' } }),
            prisma_1.prisma.payment.count({ where: { paymentStatus: 'partial' } }),
            prisma_1.prisma.payment.count({ where: { paymentStatus: 'paid' } }),
            prisma_1.prisma.payment.count({ where: { paymentStatus: 'overdue' } }),
            prisma_1.prisma.payment.count({ where: { paymentStatus: 'refunded' } }),
        ]);
        const totalRevenue = await prisma_1.prisma.payment.aggregate({ _sum: { paidAmount: true } });
        return { total, pending, partial, paid, overdue, refunded, totalRevenue: (_a = totalRevenue._sum.paidAmount) !== null && _a !== void 0 ? _a : 0 };
    }),
    // ── PaymentMethod ─────────────────────────────────────────────────────────
    createMethod: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentMethod.create({ data })),
    getMethods: (0, catchServiceAsync_1.catchServiceAsync)(async () => prisma_1.prisma.paymentMethod.findMany({ where: { status: 'active' }, include: { gateways: true } })),
    // ── PaymentGateway ────────────────────────────────────────────────────────
    createGateway: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentGateway.create({ data })),
    // ── PaymentTransaction ────────────────────────────────────────────────────
    recordTransaction: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentTransaction.create({ data })),
    updateTransaction: (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => prisma_1.prisma.paymentTransaction.update({ where: { id }, data })),
    // ── PaymentInstallment ────────────────────────────────────────────────────
    addInstallment: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentInstallment.create({ data })),
    payInstallment: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.paymentInstallment.update({ where: { id }, data: { status: 'paid', paidDate: new Date() } })),
    // ── PaymentSchedule ───────────────────────────────────────────────────────
    addSchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentSchedule.create({ data })),
    paySchedule: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.paymentSchedule.update({ where: { id }, data: { status: 'paid' } })),
    // ── PaymentInvoice ────────────────────────────────────────────────────────
    createInvoice: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const { items } = data, invoiceData = __rest(data, ["items"]);
        const invoiceNumber = await generateInvoiceNumber();
        return prisma_1.prisma.paymentInvoice.create({
            data: Object.assign(Object.assign({ invoiceNumber }, invoiceData), (items ? { items: { create: items } } : {})),
            include: { items: true },
        });
    }),
    getInvoice: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.paymentInvoice.findUnique({ where: { id }, include: { items: true, payments: true } })),
    updateInvoiceStatus: (0, catchServiceAsync_1.catchServiceAsync)(async (id, status) => prisma_1.prisma.paymentInvoice.update({ where: { id }, data: { status } })),
    // ── PaymentReceipt ────────────────────────────────────────────────────────
    generateReceipt: (0, catchServiceAsync_1.catchServiceAsync)(async (paymentId, receiptUrl) => {
        const receiptNumber = await generateReceiptNumber();
        return prisma_1.prisma.paymentReceipt.create({ data: { paymentId, receiptNumber, receiptUrl } });
    }),
    // ── PaymentVerification ───────────────────────────────────────────────────
    verify: (0, catchServiceAsync_1.catchServiceAsync)(async (paymentId, verifiedBy, verificationStatus, verificationNote) => prisma_1.prisma.paymentVerification.upsert({
        where: { paymentId },
        create: { paymentId, verifiedBy, verificationStatus, verificationNote, verifiedAt: new Date() },
        update: { verifiedBy, verificationStatus, verificationNote, verifiedAt: new Date() },
    })),
    // ── PaymentWebhook ────────────────────────────────────────────────────────
    saveWebhook: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentWebhook.create({ data })),
    // ── Refund ────────────────────────────────────────────────────────────────
    requestRefund: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.refund.create({ data })),
    approveRefund: (0, catchServiceAsync_1.catchServiceAsync)(async (refundId, approvedBy) => prisma_1.prisma.refund.update({ where: { id: refundId }, data: { refundStatus: 'approved', approvedBy } })),
    recordRefundTransaction: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.refundTransaction.create({ data })),
    // ── Settlement ────────────────────────────────────────────────────────────
    createSettlement: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.settlement.create({ data, include: { vendorSettlements: true } })),
    addVendorSettlement: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.vendorSettlement.create({ data })),
    settleVendor: (0, catchServiceAsync_1.catchServiceAsync)(async (id) => prisma_1.prisma.vendorSettlement.update({ where: { id }, data: { paymentStatus: 'paid', paidAt: new Date() } })),
    // ── PlatformCommission ────────────────────────────────────────────────────
    recordCommission: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.platformCommission.create({ data })),
    // ── TaxTransaction ────────────────────────────────────────────────────────
    addTax: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.taxTransaction.create({ data })),
    // ── BillingAddress ────────────────────────────────────────────────────────
    setBillingAddress: (0, catchServiceAsync_1.catchServiceAsync)(async (paymentId, data) => prisma_1.prisma.billingAddress.upsert({
        where: { paymentId }, create: Object.assign({ paymentId }, data), update: data,
    })),
    // ── History & Log ─────────────────────────────────────────────────────────
    addHistory: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentHistory.create({ data })),
    addLog: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => prisma_1.prisma.paymentLog.create({ data })),
    // ── PaymentSetting ────────────────────────────────────────────────────────
    getSetting: (0, catchServiceAsync_1.catchServiceAsync)(async () => prisma_1.prisma.paymentSetting.findFirst()),
    upsertSetting: (0, catchServiceAsync_1.catchServiceAsync)(async (data) => {
        const existing = await prisma_1.prisma.paymentSetting.findFirst();
        if (existing)
            return prisma_1.prisma.paymentSetting.update({ where: { id: existing.id }, data });
        return prisma_1.prisma.paymentSetting.create({ data: Object.assign({}, data) });
    }),
};
