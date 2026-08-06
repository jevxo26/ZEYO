import { Request, Response } from 'express';
import { CustomerService } from '../../services/customer/customerService';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class CustomerController {
  // ─── Self-Service Core Profile ─────────────────────────────────────────────
  static getMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
    }

    const customer = await CustomerService.getCustomerByUserId(userId);
    if (!customer) {
      return sendResponse(res, { statusCode: 404, message: 'Customer profile not found' });
    }

    await CustomerService.logActivity(
      customer.id,
      'view_profile',
      'Customer viewed their own profile details',
      req.ip || req.socket.remoteAddress || undefined
    );

    sendResponse(res, { statusCode: 200, data: customer });
  });

  static createMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
    }

    const customer = await CustomerService.createCustomer(userId, req.body);

    await CustomerService.logActivity(
      customer!.id,
      'create_profile',
      'Customer profile initialized and created',
      req.ip || req.socket.remoteAddress || undefined
    );

    sendResponse(res, {
      statusCode: 201,
      message: 'Customer profile created successfully',
      data: customer,
    });
  });

  static updateMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
    }

    const customer = await CustomerService.getCustomerByUserId(userId);
    if (!customer) {
      return sendResponse(res, { statusCode: 404, message: 'Customer profile not found' });
    }

    const updated = await CustomerService.updateCustomer(customer.id, req.body);

    await CustomerService.logActivity(
      customer.id,
      'update_profile',
      'Customer updated their profile settings/preferences',
      req.ip || req.socket.remoteAddress || undefined
    );

    sendResponse(res, {
      statusCode: 200,
      message: 'Customer profile updated successfully',
      data: updated,
    });
  });

  static deleteMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
    }

    const customer = await CustomerService.getCustomerByUserId(userId);
    if (!customer) {
      return sendResponse(res, { statusCode: 404, message: 'Customer profile not found' });
    }

    await CustomerService.deleteCustomer(customer.id);

    sendResponse(res, {
      statusCode: 200,
      message: 'Customer profile deactivated successfully',
    });
  });

  static getMyActivities = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = parseInt(String(req.user?.userId), 10);
    if (isNaN(userId)) {
      return sendResponse(res, { statusCode: 401, message: 'Unauthorized' });
    }

    const customer = await CustomerService.getCustomerByUserId(userId);
    if (!customer) {
      return sendResponse(res, { statusCode: 404, message: 'Customer profile not found' });
    }

    const activities = await CustomerService.getActivities(customer.id);
    sendResponse(res, { statusCode: 200, data: activities });
  });

  // ─── Admin Customer Management ─────────────────────────────────────────────
  static adminGetAllCustomers = catchAsync(async (req: Request, res: Response) => {
    const customers = await CustomerService.getAllCustomers();
    sendResponse(res, { statusCode: 200, data: customers });
  });

  static adminGetCustomerById = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid customer id' });
    }

    const customer = await CustomerService.getCustomerById(id);
    if (!customer) {
      return sendResponse(res, { statusCode: 404, message: 'Customer not found' });
    }

    sendResponse(res, { statusCode: 200, data: customer });
  });

  static adminCreateCustomer = catchAsync(async (req: Request, res: Response) => {
    const { userId, ...customerData } = req.body;
    if (!userId || isNaN(parseInt(userId, 10))) {
      return sendResponse(res, { statusCode: 400, message: 'Valid userId is required' });
    }

    const customer = await CustomerService.createCustomer(parseInt(userId, 10), customerData);
    sendResponse(res, {
      statusCode: 201,
      message: 'Customer created by administrator',
      data: customer,
    });
  });

  static adminUpdateCustomer = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid customer id' });
    }

    const updated = await CustomerService.updateCustomer(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'Customer updated by administrator',
      data: updated,
    });
  });

  static adminDeleteCustomer = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid customer id' });
    }

    await CustomerService.deleteCustomer(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'Customer deactivated by administrator',
    });
  });
}
