"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConsentService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserConsentService {
}
exports.UserConsentService = UserConsentService;
_a = UserConsentService;
UserConsentService.getConsents = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userConsent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
});
UserConsentService.acceptConsent = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, consentType, ipAddress) => {
    return prisma.userConsent.upsert({
        where: { userId_consentType: { userId, consentType } },
        update: { status: 'accepted', acceptedAt: new Date(), withdrawnAt: null, ipAddress },
        create: { userId, consentType, status: 'accepted', acceptedAt: new Date(), ipAddress },
    });
});
UserConsentService.withdrawConsent = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, consentType) => {
    const consent = await prisma.userConsent.findUnique({
        where: { userId_consentType: { userId, consentType } },
    });
    if (!consent)
        throw new Error('Consent record not found');
    return prisma.userConsent.update({
        where: { userId_consentType: { userId, consentType } },
        data: { status: 'withdrawn', withdrawnAt: new Date() },
    });
});
