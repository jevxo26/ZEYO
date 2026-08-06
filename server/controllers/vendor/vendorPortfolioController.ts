import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { VendorPortfolioService } from '../../services/vendor/vendorPortfolioService';

export class VendorPortfolioController {
  static adminCreatePortfolio = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { title, description, thumbnail, coverImage } = req.body;
    if (!title) {
      return sendResponse(res, { statusCode: 400, message: 'Title is required' });
    }

    const portfolio = await VendorPortfolioService.createPortfolio(id, { title, description, thumbnail, coverImage });
    sendResponse(res, {
      statusCode: 201,
      message: 'Portfolio item created successfully',
      data: portfolio,
    });
  });

  static adminGetPortfolios = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const portfolios = await VendorPortfolioService.getPortfolios(id);
    sendResponse(res, { statusCode: 200, data: portfolios });
  });

  static adminUpdatePortfolio = catchAsync(async (req: Request, res: Response) => {
    const portfolioId = parseInt(req.params['portfolioId'] as string, 10);
    if (isNaN(portfolioId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid portfolio ID' });
    }

    const updated = await VendorPortfolioService.updatePortfolio(portfolioId, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'Portfolio item updated successfully',
      data: updated,
    });
  });

  static adminDeletePortfolio = catchAsync(async (req: Request, res: Response) => {
    const portfolioId = parseInt(req.params['portfolioId'] as string, 10);
    if (isNaN(portfolioId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid portfolio ID' });
    }

    await VendorPortfolioService.deletePortfolio(portfolioId);
    sendResponse(res, {
      statusCode: 200,
      message: 'Portfolio item deleted successfully',
    });
  });

  // ─── Gallery ─────────────────────────────────────────────────────────────
  static adminAddToGallery = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { portfolioId, imageUrl, videoUrl, displayOrder } = req.body;
    if (!imageUrl && !videoUrl) {
      return sendResponse(res, { statusCode: 400, message: 'imageUrl or videoUrl is required' });
    }

    const media = await VendorPortfolioService.addToGallery(id, {
      portfolioId: portfolioId ? parseInt(portfolioId, 10) : undefined,
      imageUrl,
      videoUrl,
      displayOrder: displayOrder ? parseInt(displayOrder, 10) : undefined,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Asset added to gallery successfully',
      data: media,
    });
  });

  static adminGetGallery = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const portfolioId = req.query['portfolioId'] ? parseInt(req.query['portfolioId'] as string, 10) : undefined;
    const gallery = await VendorPortfolioService.getGallery(id, portfolioId);
    sendResponse(res, { statusCode: 200, data: gallery });
  });

  static adminRemoveFromGallery = catchAsync(async (req: Request, res: Response) => {
    const galleryId = parseInt(req.params['galleryId'] as string, 10);
    if (isNaN(galleryId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid gallery item ID' });
    }

    await VendorPortfolioService.removeFromGallery(galleryId);
    sendResponse(res, {
      statusCode: 200,
      message: 'Asset removed from gallery successfully',
    });
  });
}
