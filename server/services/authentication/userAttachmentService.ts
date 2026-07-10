import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';

const prisma = new PrismaClient();

export class UserAttachmentService {
  static getAttachments = catchServiceAsync(async (userId: number, context?: string) => {
    return prisma.userAttachment.findMany({
      where: { userId, ...(context ? { context } : {}) },
      orderBy: { uploadedAt: 'desc' },
    });
  });

  static createAttachment = catchServiceAsync(async (userId: number, data: {
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize: number;
    mimeType?: string;
    context?: string;
  }) => {
    return prisma.userAttachment.create({ data: { userId, ...data } });
  });

  static deleteAttachment = catchServiceAsync(async (id: number, userId: number) => {
    const attachment = await prisma.userAttachment.findFirst({ where: { id, userId } });
    if (!attachment) throw new Error('Attachment not found');
    await prisma.userAttachment.delete({ where: { id } });
    return { message: 'Attachment deleted', fileUrl: attachment.fileUrl };
  });
}
