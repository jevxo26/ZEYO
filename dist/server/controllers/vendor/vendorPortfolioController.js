"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorPortfolioController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const vendorPortfolioService_1 = require("../../services/vendor/vendorPortfolioService");
class VendorPortfolioController {
}
exports.VendorPortfolioController = VendorPortfolioController;
_a = VendorPortfolioController;
VendorPortfolioController.adminCreatePortfolio = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { title, description, thumbnail, coverImage } = req.body;
    if (!title) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Title is required' });
    }
    const portfolio = await vendorPortfolioService_1.VendorPortfolioService.createPortfolio(id, { title, description, thumbnail, coverImage });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Portfolio item created successfully',
        data: portfolio,
    });
});
VendorPortfolioController.adminGetPortfolios = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const portfolios = await vendorPortfolioService_1.VendorPortfolioService.getPortfolios(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: portfolios });
});
VendorPortfolioController.adminUpdatePortfolio = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const portfolioId = parseInt(req.params['portfolioId'], 10);
    if (isNaN(portfolioId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid portfolio ID' });
    }
    const updated = await vendorPortfolioService_1.VendorPortfolioService.updatePortfolio(portfolioId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Portfolio item updated successfully',
        data: updated,
    });
});
VendorPortfolioController.adminDeletePortfolio = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const portfolioId = parseInt(req.params['portfolioId'], 10);
    if (isNaN(portfolioId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid portfolio ID' });
    }
    await vendorPortfolioService_1.VendorPortfolioService.deletePortfolio(portfolioId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Portfolio item deleted successfully',
    });
});
// ─── Gallery ─────────────────────────────────────────────────────────────
VendorPortfolioController.adminAddToGallery = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { portfolioId, imageUrl, videoUrl, displayOrder } = req.body;
    if (!imageUrl && !videoUrl) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'imageUrl or videoUrl is required' });
    }
    const media = await vendorPortfolioService_1.VendorPortfolioService.addToGallery(id, {
        portfolioId: portfolioId ? parseInt(portfolioId, 10) : undefined,
        imageUrl,
        videoUrl,
        displayOrder: displayOrder ? parseInt(displayOrder, 10) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Asset added to gallery successfully',
        data: media,
    });
});
VendorPortfolioController.adminGetGallery = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const portfolioId = req.query['portfolioId'] ? parseInt(req.query['portfolioId'], 10) : undefined;
    const gallery = await vendorPortfolioService_1.VendorPortfolioService.getGallery(id, portfolioId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: gallery });
});
VendorPortfolioController.adminRemoveFromGallery = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const galleryId = parseInt(req.params['galleryId'], 10);
    if (isNaN(galleryId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid gallery item ID' });
    }
    await vendorPortfolioService_1.VendorPortfolioService.removeFromGallery(galleryId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Asset removed from gallery successfully',
    });
});
