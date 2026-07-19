"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAddressService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class CustomerAddressService {
}
exports.CustomerAddressService = CustomerAddressService;
_a = CustomerAddressService;
CustomerAddressService.getAddresses = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId) => {
    return prisma.customerAddress.findMany({
        where: { customerId },
        orderBy: { isDefault: 'desc' },
    });
});
CustomerAddressService.getAddressById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma.customerAddress.findFirst({
        where: { id, customerId },
    });
});
CustomerAddressService.createAddress = (0, catchServiceAsync_1.catchServiceAsync)(async (customerId, data) => {
    return prisma.$transaction(async (tx) => {
        // If setting this one to default, clear previous default addresses
        if (data.isDefault) {
            await tx.customerAddress.updateMany({
                where: { customerId, isDefault: true },
                data: { isDefault: false },
            });
        }
        // Check if this is the first address. If so, make it default regardless
        const count = await tx.customerAddress.count({ where: { customerId } });
        const isDefault = count === 0 ? true : !!data.isDefault;
        return tx.customerAddress.create({
            data: Object.assign(Object.assign({}, data), { customerId,
                isDefault }),
        });
    });
});
CustomerAddressService.updateAddress = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId, data) => {
    return prisma.$transaction(async (tx) => {
        if (data.isDefault) {
            await tx.customerAddress.updateMany({
                where: { customerId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return tx.customerAddress.update({
            where: { id, customerId },
            data,
        });
    });
});
CustomerAddressService.deleteAddress = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma.$transaction(async (tx) => {
        const address = await tx.customerAddress.findFirst({
            where: { id, customerId },
        });
        if (!address)
            throw new Error('Address not found');
        await tx.customerAddress.delete({
            where: { id },
        });
        // If we deleted the default address, nominate a new default if possible
        if (address.isDefault) {
            const nextAddress = await tx.customerAddress.findFirst({
                where: { customerId },
                orderBy: { createdAt: 'desc' },
            });
            if (nextAddress) {
                await tx.customerAddress.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true },
                });
            }
        }
        return true;
    });
});
CustomerAddressService.setDefaultAddress = (0, catchServiceAsync_1.catchServiceAsync)(async (id, customerId) => {
    return prisma.$transaction(async (tx) => {
        // Clear default status of existing default addresses
        await tx.customerAddress.updateMany({
            where: { customerId, isDefault: true },
            data: { isDefault: false },
        });
        // Set default status on selected address
        return tx.customerAddress.update({
            where: { id, customerId },
            data: { isDefault: true },
        });
    });
});
