import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PermissionService } from '../../services/rbac/permissionService';

export class PermissionController {

  // GET /api/rbac/permissions
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { moduleId, action, status } = req.query as Record<string, string>;
    const permissions = await PermissionService.getAll({
      moduleId: moduleId ? Number(moduleId) : undefined,
      action,
      status,
    });
    sendResponse(res, { statusCode: 200, data: permissions });
  });

  // GET /api/rbac/permissions/:id
  static getById = catchAsync(async (req: Request, res: Response) => {
    const permission = await PermissionService.getById(Number(req.params.id));
    if (!permission) {
      return res.status(404).json({ success: false, message: 'Permission not found', data: null });
    }
    sendResponse(res, { statusCode: 200, data: permission });
  });

  // POST /api/rbac/permissions
  static create = catchAsync(async (req: Request, res: Response) => {
    const permission = await PermissionService.create(req.body);
    sendResponse(res, { statusCode: 201, message: 'Permission created successfully', data: permission });
  });

  // PUT /api/rbac/permissions/:id
  static update = catchAsync(async (req: Request, res: Response) => {
    const permission = await PermissionService.update(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Permission updated successfully', data: permission });
  });

  // DELETE /api/rbac/permissions/:id
  static delete = catchAsync(async (req: Request, res: Response) => {
    await PermissionService.delete(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Permission deleted successfully', data: null });
  });
}
