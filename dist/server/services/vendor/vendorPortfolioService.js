"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorPortfolioService = void 0;
const client_1 = require("@prisma/client");
const catchServiceAsync_1 = require("../../utils/catchServiceAsync");
const prisma = new client_1.PrismaClient();
class VendorPortfolioService {
}
exports.VendorPortfolioService = VendorPortfolioService;
_a = VendorPortfolioService;
// ─── Portfolios ──────────────────────────────────────────────────────────
VendorPortfolioService.createPortfolio = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
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
VendorPortfolioService.getPortfolios = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId) => {
    return prisma.vendorPortfolio.findMany({
        where: { vendorId },
        include: {
            gallery: true,
        },
    });
});
VendorPortfolioService.updatePortfolio = (0, catchServiceAsync_1.catchServiceAsync)(async (id, data) => {
    return prisma.vendorPortfolio.update({
        where: { id },
        data,
    });
});
VendorPortfolioService.deletePortfolio = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.vendorPortfolio.delete({
        where: { id },
    });
});
// ─── Gallery ─────────────────────────────────────────────────────────────
VendorPortfolioService.addToGallery = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, data) => {
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
VendorPortfolioService.getGallery = (0, catchServiceAsync_1.catchServiceAsync)(async (vendorId, portfolioId) => {
    return prisma.vendorGallery.findMany({
        where: {
            vendorId,
            portfolioId: portfolioId !== undefined ? portfolioId : undefined,
        },
        orderBy: { displayOrder: 'asc' },
    });
});
VendorPortfolioService.removeFromGallery = (0, catchServiceAsync_1.catchServiceAsync)(async (id) => {
    return prisma.vendorGallery.delete({
        where: { id },
    });
});
