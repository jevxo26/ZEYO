"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddressService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserAddressService {
}
exports.UserAddressService = UserAddressService;
_a = UserAddressService;
UserAddressService.getAddresses = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userAddress.findMany({
        where: { userId },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
});
UserAddressService.getAddressById = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    return prisma_1.prisma.userAddress.findFirst({ where: { id, userId } });
});
UserAddressService.createAddress = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    // If this is the first address or marked as default, unset others first
    if (data.isDefault) {
        await prisma_1.prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    const count = await prisma_1.prisma.userAddress.count({ where: { userId } });
    return prisma_1.prisma.userAddress.create({
        data: Object.assign(Object.assign({}, data), { userId, isDefault: count === 0 ? true : !!data.isDefault }),
    });
});
UserAddressService.updateAddress = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId, data) => {
    const address = await prisma_1.prisma.userAddress.findFirst({ where: { id, userId } });
    if (!address)
        throw new Error('Address not found');
    if (data.isDefault) {
        await prisma_1.prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma_1.prisma.userAddress.update({ where: { id }, data });
});
UserAddressService.deleteAddress = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const address = await prisma_1.prisma.userAddress.findFirst({ where: { id, userId } });
    if (!address)
        throw new Error('Address not found');
    await prisma_1.prisma.userAddress.delete({ where: { id } });
    // If the deleted address was default, make the most recent one default
    if (address.isDefault) {
        const next = await prisma_1.prisma.userAddress.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } });
        if (next)
            await prisma_1.prisma.userAddress.update({ where: { id: next.id }, data: { isDefault: true } });
    }
    return { message: 'Address deleted' };
});
UserAddressService.setDefault = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const address = await prisma_1.prisma.userAddress.findFirst({ where: { id, userId } });
    if (!address)
        throw new Error('Address not found');
    await prisma_1.prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    return prisma_1.prisma.userAddress.update({ where: { id }, data: { isDefault: true } });
});
