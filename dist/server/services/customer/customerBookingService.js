"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerBookingService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class CustomerBookingService {
}
exports.CustomerBookingService = CustomerBookingService;
_a = CustomerBookingService;
// ─── Favorite Packages ────────────────────────────────────────────────────
CustomerBookingService.getFavorites = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerFavoritePackage.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerBookingService.addFavorite = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, packageId) => {
    const existing = await prisma_1.prisma.customerFavoritePackage.findFirst({
        where: { customerId, packageId },
    });
    if (existing)
        return existing;
    return prisma_1.prisma.customerFavoritePackage.create({
        data: { customerId, packageId },
    });
});
CustomerBookingService.removeFavorite = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, packageId) => {
    const favorite = await prisma_1.prisma.customerFavoritePackage.findFirst({
        where: { customerId, packageId },
    });
    if (!favorite)
        throw new Error('Favorite package not found');
    await prisma_1.prisma.customerFavoritePackage.delete({
        where: { id: favorite.id },
    });
    return true;
});
// ─── Saved Calculator Calculations ────────────────────────────────────────
CustomerBookingService.getCalculations = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerSavedCalculation.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerBookingService.saveCalculation = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    return prisma_1.prisma.customerSavedCalculation.create({
        data: Object.assign(Object.assign({}, data), { customerId }),
    });
});
CustomerBookingService.deleteCalculation = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    const calc = await prisma_1.prisma.customerSavedCalculation.findFirst({
        where: { id, customerId },
    });
    if (!calc)
        throw new Error('Saved calculation not found');
    await prisma_1.prisma.customerSavedCalculation.delete({
        where: { id },
    });
    return true;
});
// ─── Quotations ───────────────────────────────────────────────────────────
CustomerBookingService.getQuotations = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerQuotation.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
    });
});
CustomerBookingService.getQuotationById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma_1.prisma.customerQuotation.findFirst({
        where: { id, customerId },
    });
});
CustomerBookingService.createQuotation = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    const num = `QT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    return prisma_1.prisma.customerQuotation.create({
        data: Object.assign(Object.assign({}, data), { customerId, quotationNumber: num, validUntil: data.validUntil ? new Date(data.validUntil) : null }),
    });
});
CustomerBookingService.updateQuotationStatus = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId, status) => {
    return prisma_1.prisma.customerQuotation.update({
        where: { id, customerId },
        data: { status },
    });
});
// ─── Booking History ──────────────────────────────────────────────────────
CustomerBookingService.getBookings = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerBookingHistory.findMany({
        where: { customerId },
        orderBy: { bookingDate: 'desc' },
    });
});
CustomerBookingService.addBookingRecord = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    const existing = await prisma_1.prisma.customerBookingHistory.findUnique({
        where: { bookingId: data.bookingId },
    });
    if (existing) {
        return prisma_1.prisma.customerBookingHistory.update({
            where: { bookingId: data.bookingId },
            data: {
                bookingStatus: data.bookingStatus,
                paymentStatus: data.paymentStatus,
                totalAmount: data.totalAmount,
            },
        });
    }
    return prisma_1.prisma.customerBookingHistory.create({
        data: Object.assign(Object.assign({}, data), { customerId, bookingDate: new Date(data.bookingDate) }),
    });
});
// ─── Saved Payment Methods ────────────────────────────────────────────────
CustomerBookingService.getPaymentMethods = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma_1.prisma.customerPaymentMethod.findMany({
        where: { customerId },
        orderBy: { isDefault: 'desc' },
    });
});
CustomerBookingService.addPaymentMethod = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        if (data.isDefault) {
            await tx.customerPaymentMethod.updateMany({
                where: { customerId, isDefault: true },
                data: { isDefault: false },
            });
        }
        const count = await tx.customerPaymentMethod.count({ where: { customerId } });
        const isDefault = count === 0 ? true : !!data.isDefault;
        return tx.customerPaymentMethod.create({
            data: Object.assign(Object.assign({}, data), { customerId,
                isDefault }),
        });
    });
});
CustomerBookingService.deletePaymentMethod = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        const pm = await tx.customerPaymentMethod.findFirst({
            where: { id, customerId },
        });
        if (!pm)
            throw new Error('Payment method not found');
        await tx.customerPaymentMethod.delete({
            where: { id },
        });
        if (pm.isDefault) {
            const nextPm = await tx.customerPaymentMethod.findFirst({
                where: { customerId },
                orderBy: { createdAt: 'desc' },
            });
            if (nextPm) {
                await tx.customerPaymentMethod.update({
                    where: { id: nextPm.id },
                    data: { isDefault: true },
                });
            }
        }
        return true;
    });
});
