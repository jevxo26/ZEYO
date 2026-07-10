"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdentityVerificationService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserIdentityVerificationService {
}
exports.UserIdentityVerificationService = UserIdentityVerificationService;
_a = UserIdentityVerificationService;
UserIdentityVerificationService.getVerification = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userIdentityVerification.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserIdentityVerificationService.submitVerification = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    // Cancel any previous pending submissions
    await prisma.userIdentityVerification.updateMany({
        where: { userId, verificationStatus: 'pending' },
        data: { verificationStatus: 'rejected', rejectionReason: 'Superseded by new submission' },
    });
    return prisma.userIdentityVerification.create({
        data: Object.assign(Object.assign({ userId }, data), { verificationStatus: 'pending' }),
    });
});
// Admin only
UserIdentityVerificationService.reviewVerification = (0, catchServiceAsync_1.catchServiceAsync)(async (id, adminId, status, reason) => {
    return prisma.userIdentityVerification.update({
        where: { id },
        data: Object.assign({ verificationStatus: status, verifiedBy: adminId, verifiedAt: new Date() }, (reason ? { rejectionReason: reason } : {})),
    });
});
// Admin: get all pending verifications
UserIdentityVerificationService.getPendingVerifications = (0, catchServiceAsync_1.catchServiceAsync)(async (skip = 0, take = 20) => {
    return prisma.userIdentityVerification.findMany({
        where: { verificationStatus: 'pending' },
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'asc' },
        skip,
        take,
    });
});
