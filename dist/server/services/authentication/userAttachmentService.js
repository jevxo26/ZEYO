"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAttachmentService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class UserAttachmentService {
}
exports.UserAttachmentService = UserAttachmentService;
_a = UserAttachmentService;
UserAttachmentService.getAttachments = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, context) => {
    return prisma.userAttachment.findMany({
        where: Object.assign({ userId }, (context ? { context } : {})),
        orderBy: { uploadedAt: 'desc' },
    });
});
UserAttachmentService.createAttachment = (0, catchServiceAsync_1.catchServiceAsync)(async (userId, data) => {
    return prisma.userAttachment.create({ data: Object.assign({ userId }, data) });
});
UserAttachmentService.deleteAttachment = (0, catchServiceAsync_1.catchServiceAsync)(async (id, userId) => {
    const attachment = await prisma.userAttachment.findFirst({ where: { id, userId } });
    if (!attachment)
        throw new Error('Attachment not found');
    await prisma.userAttachment.delete({ where: { id } });
    return { message: 'Attachment deleted', fileUrl: attachment.fileUrl };
});
