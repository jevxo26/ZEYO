"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorScheduleController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const vendorScheduleService_1 = require("../../services/vendor/vendorScheduleService");
class VendorScheduleController {
}
exports.VendorScheduleController = VendorScheduleController;
_a = VendorScheduleController;
VendorScheduleController.adminSetAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { availableFrom, availableTo, status, remarks } = req.body;
    if (!availableFrom || !availableTo) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'availableFrom and availableTo are required' });
    }
    const availability = await vendorScheduleService_1.VendorScheduleService.setAvailability(id, { availableFrom, availableTo, status, remarks });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Availability added successfully',
        data: availability,
    });
});
VendorScheduleController.adminGetAvailability = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const availabilities = await vendorScheduleService_1.VendorScheduleService.getAvailability(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: availabilities });
});
VendorScheduleController.adminAddCalendarBlock = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { bookingDate, startTime, endTime, availabilityStatus, bookingId } = req.body;
    if (!bookingDate) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'bookingDate is required' });
    }
    const block = await vendorScheduleService_1.VendorScheduleService.addCalendarBlock(id, {
        bookingDate,
        startTime,
        endTime,
        availabilityStatus,
        bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Calendar slot configured successfully',
        data: block,
    });
});
VendorScheduleController.adminGetCalendar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const calendar = await vendorScheduleService_1.VendorScheduleService.getCalendar(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: calendar });
});
VendorScheduleController.adminRemoveCalendarBlock = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const blockId = parseInt(req.params['blockId'], 10);
    if (isNaN(blockId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid calendar block ID' });
    }
    await vendorScheduleService_1.VendorScheduleService.removeCalendarBlock(blockId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Calendar slot removed successfully',
    });
});
