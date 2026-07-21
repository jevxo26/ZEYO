"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorPortfolioService = void 0;
const prisma_1 = require("../../config/prisma");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
class VendorPortfolioService {
}
exports.VendorPortfolioService = VendorPortfolioService;
_a = VendorPortfolioService;
// ─── Portfolios ──────────────────────────────────────────────────────────
VendorPortfolioService.createPortfolio = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
    return prisma_1.prisma.vendorPortfolio.create({
        data: {
            vendorId,
            title: data.title,
            description: data.description || null,
            thumbnail: data.thumbnail || null,
            coverImage: data.coverImage || null,
        },
    });
});
VendorPortfolioService.getPortfolios = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => {
    return prisma_1.prisma.vendorPortfolio.findMany({
        where: { vendorId },
        include: {
            gallery: true,
        },
    });
});
VendorPortfolioService.updatePortfolio = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma_1.prisma.vendorPortfolio.update({
        where: { id },
        data,
    });
});
VendorPortfolioService.deletePortfolio = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.vendorPortfolio.delete({
        where: { id },
    });
});
// ─── Gallery ─────────────────────────────────────────────────────────────
VendorPortfolioService.addToGallery = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
    return prisma_1.prisma.vendorGallery.create({
        data: {
            vendorId,
            portfolioId: data.portfolioId || null,
            imageUrl: data.imageUrl || null,
            videoUrl: data.videoUrl || null,
            displayOrder: data.displayOrder || 0,
        },
    });
});
VendorPortfolioService.getGallery = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, portfolioId) => {
    return prisma_1.prisma.vendorGallery.findMany({
        where: {
            vendorId,
            portfolioId: portfolioId !== undefined ? portfolioId : undefined,
        },
        orderBy: { displayOrder: 'asc' },
    });
});
VendorPortfolioService.removeFromGallery = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma_1.prisma.vendorGallery.delete({
        where: { id },
    });
});
