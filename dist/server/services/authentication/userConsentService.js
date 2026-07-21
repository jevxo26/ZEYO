"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConsentService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class UserConsentService {
}
exports.UserConsentService = UserConsentService;
_a = UserConsentService;
UserConsentService.getConsents = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma_1.prisma.userConsent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserConsentService.acceptConsent = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, consentType, ipAddress) => {
    return prisma_1.prisma.userConsent.upsert({
        where: { userId_consentType: { userId, consentType } },
        update: { status: 'accepted', acceptedAt: new Date(), withdrawnAt: null, ipAddress },
        create: { userId, consentType, status: 'accepted', acceptedAt: new Date(), ipAddress },
    });
});
UserConsentService.withdrawConsent = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, consentType) => {
    const consent = await prisma_1.prisma.userConsent.findUnique({
        where: { userId_consentType: { userId, consentType } },
    });
    if (!consent)
        throw new Error('Consent record not found');
    return prisma_1.prisma.userConsent.update({
        where: { userId_consentType: { userId, consentType } },
        data: { status: 'withdrawn', withdrawnAt: new Date() },
    });
});
