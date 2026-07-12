import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { VendorServiceService } from '../../services/vendor/vendorServiceService';

export class VendorServiceController {
  static adminAddService = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { serviceId, serviceName, status } = req.body;
    if (!serviceId || !serviceName) {
      return sendResponse(res, { statusCode: 400, message: 'serviceId and serviceName are required' });
    }

    const service = await VendorServiceService.addService(id, { serviceId: parseInt(serviceId, 10), serviceName, status });
    sendResponse(res, {
      statusCode: 201,
      message: 'Service registered to vendor successfully',
      data: service,
    });
  });

  static adminGetServices = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const services = await VendorServiceService.getServicesByVendor(id);
    sendResponse(res, { statusCode: 200, data: services });
  });

  static adminUpdateService = catchAsync(async (req: Request, res: Response) => {
    const serviceId = parseInt(req.params['serviceId'] as string, 10);
    if (isNaN(serviceId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid service ID' });
    }

    const service = await VendorServiceService.updateService(serviceId, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'Vendor service updated successfully',
      data: service,
    });
  });

  static adminDeleteService = catchAsync(async (req: Request, res: Response) => {
    const serviceId = parseInt(req.params['serviceId'] as string, 10);
    if (isNaN(serviceId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid service ID' });
    }

    await VendorServiceService.deleteService(serviceId);
    sendResponse(res, {
      statusCode: 200,
      message: 'Vendor service deleted successfully',
    });
  });

  // ─── Service Zones ────────────────────────────────────────────────────────
  static adminAddServiceZone = catchAsync(async (req: Request, res: Response) => {
    const serviceId = parseInt(req.params['serviceId'] as string, 10);
    if (isNaN(serviceId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid service ID' });
    }

    const { zoneId, status } = req.body;
    if (!zoneId) {
      return sendResponse(res, { statusCode: 400, message: 'zoneId is required' });
    }

    const zone = await VendorServiceService.addServiceZone(serviceId, { zoneId: parseInt(zoneId, 10), status });
    sendResponse(res, {
      statusCode: 201,
      message: 'Zone added to vendor service successfully',
      data: zone,
    });
  });

  static adminRemoveServiceZone = catchAsync(async (req: Request, res: Response) => {
    const zoneId = parseInt(req.params['zoneId'] as string, 10);
    if (isNaN(zoneId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid service zone ID' });
    }

    await VendorServiceService.removeServiceZone(zoneId);
    sendResponse(res, {
      statusCode: 200,
      message: 'Zone removed from service successfully',
    });
  });

  // ─── Internal Pricing ──────────────────────────────────────────────────────
  static adminSetPricing = catchAsync(async (req: Request, res: Response) => {
    const serviceId = parseInt(req.params['serviceId'] as string, 10);
    if (isNaN(serviceId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid service ID' });
    }

    const { zoneId, basePrice, minimumPrice, maximumPrice, priceType, status } = req.body;
    if (!zoneId || basePrice === undefined || !priceType) {
      return sendResponse(res, { statusCode: 400, message: 'zoneId, basePrice, and priceType are required' });
    }

    const pricing = await VendorServiceService.setPricing(serviceId, {
      zoneId: parseInt(zoneId, 10),
      basePrice: parseFloat(basePrice),
      minimumPrice: minimumPrice ? parseFloat(minimumPrice) : undefined,
      maximumPrice: maximumPrice ? parseFloat(maximumPrice) : undefined,
      priceType,
      status,
    });

    sendResponse(res, {
      statusCode: 200,
      message: 'Pricing matrix configured successfully',
      data: pricing,
    });
  });

  static adminGetPricing = catchAsync(async (req: Request, res: Response) => {
    const serviceId = parseInt(req.params['serviceId'] as string, 10);
    if (isNaN(serviceId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid service ID' });
    }

    const pricing = await VendorServiceService.getPricingByService(serviceId);
    sendResponse(res, { statusCode: 200, data: pricing });
  });
}
