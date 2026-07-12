import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { VendorScheduleService } from '../../services/vendor/vendorScheduleService';

export class VendorScheduleController {
  static adminSetAvailability = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { availableFrom, availableTo, status, remarks } = req.body;
    if (!availableFrom || !availableTo) {
      return sendResponse(res, { statusCode: 400, message: 'availableFrom and availableTo are required' });
    }

    const availability = await VendorScheduleService.setAvailability(id, { availableFrom, availableTo, status, remarks });
    sendResponse(res, {
      statusCode: 201,
      message: 'Availability added successfully',
      data: availability,
    });
  });

  static adminGetAvailability = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const availabilities = await VendorScheduleService.getAvailability(id);
    sendResponse(res, { statusCode: 200, data: availabilities });
  });

  static adminAddCalendarBlock = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { bookingDate, startTime, endTime, availabilityStatus, bookingId } = req.body;
    if (!bookingDate) {
      return sendResponse(res, { statusCode: 400, message: 'bookingDate is required' });
    }

    const block = await VendorScheduleService.addCalendarBlock(id, {
      bookingDate,
      startTime,
      endTime,
      availabilityStatus,
      bookingId: bookingId ? parseInt(bookingId, 10) : undefined,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Calendar slot configured successfully',
      data: block,
    });
  });

  static adminGetCalendar = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const calendar = await VendorScheduleService.getCalendar(id);
    sendResponse(res, { statusCode: 200, data: calendar });
  });

  static adminRemoveCalendarBlock = catchAsync(async (req: Request, res: Response) => {
    const blockId = parseInt(req.params['blockId'] as string, 10);
    if (isNaN(blockId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid calendar block ID' });
    }

    await VendorScheduleService.removeCalendarBlock(blockId);
    sendResponse(res, {
      statusCode: 200,
      message: 'Calendar slot removed successfully',
    });
  });
}
