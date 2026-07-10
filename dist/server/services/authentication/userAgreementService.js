"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgreementService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserAgreementService {
}
exports.UserAgreementService = UserAgreementService;
_a = UserAgreementService;
UserAgreementService.getAgreements = (0, catchServiceAsync_1.catchServiceAsync)(async (userId) => {
    return prisma.userAgreement.findMany({
        where: { userId },
        orderBy: { acceptedAt: 'desc' },
    });
});
UserAgreementService.acceptAgreement = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    return prisma.userAgreement.create({
        data: Object.assign(Object.assign({ userId }, data), { acceptedAt: new Date() }),
    });
});
UserAgreementService.hasAccepted = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, agreementType, version) => {
    const agreement = await prisma.userAgreement.findFirst({
        where: { userId, agreementType, version },
    });
    return !!agreement;
});
