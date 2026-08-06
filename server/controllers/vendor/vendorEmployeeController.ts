import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { VendorEmployeeService } from '../../services/vendor/vendorEmployeeService';

export class VendorEmployeeController {
  static adminAddEmployee = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { employeeName, phone, email, designation, status, joinedAt } = req.body;
    if (!employeeName || !phone || !designation) {
      return sendResponse(res, { statusCode: 400, message: 'employeeName, phone, and designation are required' });
    }

    const employee = await VendorEmployeeService.addEmployee(id, {
      employeeName,
      phone,
      email,
      designation,
      status,
      joinedAt,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Employee registered to vendor successfully',
      data: employee,
    });
  });

  static adminGetEmployees = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const employees = await VendorEmployeeService.getEmployees(id);
    sendResponse(res, { statusCode: 200, data: employees });
  });

  static adminUpdateEmployee = catchAsync(async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params['employeeId'] as string, 10);
    if (isNaN(employeeId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid employee ID' });
    }

    const updated = await VendorEmployeeService.updateEmployee(employeeId, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'Employee details updated successfully',
      data: updated,
    });
  });

  static adminDeleteEmployee = catchAsync(async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params['employeeId'] as string, 10);
    if (isNaN(employeeId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid employee ID' });
    }

    await VendorEmployeeService.deleteEmployee(employeeId);
    sendResponse(res, {
      statusCode: 200,
      message: 'Employee deleted successfully',
    });
  });
}
