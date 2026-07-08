import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

export class RoleController {
  static getAllRoles = catchAsync(async (req: Request, res: Response) => {
    const roles = await RoleService.getAllRoles();
    sendResponse(res, {
      statusCode: 200,
      data: roles,
    });
  });
}