"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorServiceController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const vendorServiceService_1 = require("../../services/vendor/vendorServiceService");
class VendorServiceController {
}
exports.VendorServiceController = VendorServiceController;
_a = VendorServiceController;
VendorServiceController.adminAddService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { serviceId, serviceName, status } = req.body;
    if (!serviceId || !serviceName) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'serviceId and serviceName are required' });
    }
    const service = await vendorServiceService_1.VendorServiceService.addService(id, { serviceId: parseInt(serviceId, 10), serviceName, status });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Service registered to vendor successfully',
        data: service,
    });
});
VendorServiceController.adminGetServices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const services = await vendorServiceService_1.VendorServiceService.getServicesByVendor(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: services });
});
VendorServiceController.adminUpdateService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const serviceId = parseInt(req.params['serviceId'], 10);
    if (isNaN(serviceId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid service ID' });
    }
    const service = await vendorServiceService_1.VendorServiceService.updateService(serviceId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Vendor service updated successfully',
        data: service,
    });
});
VendorServiceController.adminDeleteService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const serviceId = parseInt(req.params['serviceId'], 10);
    if (isNaN(serviceId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid service ID' });
    }
    await vendorServiceService_1.VendorServiceService.deleteService(serviceId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Vendor service deleted successfully',
    });
});
// ─── Service Zones ────────────────────────────────────────────────────────
VendorServiceController.adminAddServiceZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const serviceId = parseInt(req.params['serviceId'], 10);
    if (isNaN(serviceId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid service ID' });
    }
    const { zoneId, status } = req.body;
    if (!zoneId) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'zoneId is required' });
    }
    const zone = await vendorServiceService_1.VendorServiceService.addServiceZone(serviceId, { zoneId: parseInt(zoneId, 10), status });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Zone added to vendor service successfully',
        data: zone,
    });
});
VendorServiceController.adminRemoveServiceZone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const zoneId = parseInt(req.params['zoneId'], 10);
    if (isNaN(zoneId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid service zone ID' });
    }
    await vendorServiceService_1.VendorServiceService.removeServiceZone(zoneId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Zone removed from service successfully',
    });
});
// ─── Internal Pricing ──────────────────────────────────────────────────────
VendorServiceController.adminSetPricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const serviceId = parseInt(req.params['serviceId'], 10);
    if (isNaN(serviceId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid service ID' });
    }
    const { zoneId, basePrice, minimumPrice, maximumPrice, priceType, status } = req.body;
    if (!zoneId || basePrice === undefined || !priceType) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'zoneId, basePrice, and priceType are required' });
    }
    const pricing = await vendorServiceService_1.VendorServiceService.setPricing(serviceId, {
        zoneId: parseInt(zoneId, 10),
        basePrice: parseFloat(basePrice),
        minimumPrice: minimumPrice ? parseFloat(minimumPrice) : undefined,
        maximumPrice: maximumPrice ? parseFloat(maximumPrice) : undefined,
        priceType,
        status,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Pricing matrix configured successfully',
        data: pricing,
    });
});
VendorServiceController.adminGetPricing = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const serviceId = parseInt(req.params['serviceId'], 10);
    if (isNaN(serviceId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid service ID' });
    }
    const pricing = await vendorServiceService_1.VendorServiceService.getPricingByService(serviceId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: pricing });
});
