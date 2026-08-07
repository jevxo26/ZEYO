import { prisma } from '../../config/prisma';
import { PrismaClient } from '@prisma/client';
import { catchServiceAsync } from '../../utils/catchServiceAsync';



export class VendorPortfolioService {
  // ─── Portfolios ──────────────────────────────────────────────────────────
  static createPortfolio = catchServiceAsync(async (vendorId: number, data: {
    title: string;
    description?: string;
    thumbnail?: string;
    coverImage?: string;
  }) => {
    return prisma.vendorPortfolio.create({
      data: {
        vendorId,
        title: data.title,
        description: data.description || null,
        thumbnail: data.thumbnail || null,
        coverImage: data.coverImage || null,
      },
    });
  });

  static getPortfolios = catchServiceAsync(async (vendorId: number) => {
    return prisma.vendorPortfolio.findMany({
      where: { vendorId },
      include: {
        gallery: true,
      },
    });
  });

  static updatePortfolio = catchServiceAsync(async (id: number, data: {
    title?: string;
    description?: string;
    thumbnail?: string;
    coverImage?: string;
  }) => {
    return prisma.vendorPortfolio.update({
      where: { id },
      data,
    });
  });

  static deletePortfolio = catchServiceAsync(async (id: number) => {
    return prisma.vendorPortfolio.delete({
      where: { id },
    });
  });

  // ─── Gallery ─────────────────────────────────────────────────────────────
  static addToGallery = catchServiceAsync(async (vendorId: number, data: {
    portfolioId?: number;
    imageUrl?: string;
    videoUrl?: string;
    displayOrder?: number;
  }) => {
    return prisma.vendorGallery.create({
      data: {
        vendorId,
        portfolioId: data.portfolioId || null,
        imageUrl: data.imageUrl || null,
        videoUrl: data.videoUrl || null,
        displayOrder: data.displayOrder || 0,
      },
    });
  });

  static getGallery = catchServiceAsync(async (vendorId: number, portfolioId?: number) => {
    return prisma.vendorGallery.findMany({
      where: {
        vendorId,
        portfolioId: portfolioId !== undefined ? portfolioId : undefined,
      },
      orderBy: { displayOrder: 'asc' },
    });
  });

  static removeFromGallery = catchServiceAsync(async (id: number) => {
    return prisma.vendorGallery.delete({
      where: { id },
    });
  });
}
