import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { RbacRoleService } from '../../services/rbac/roleService';

export class RbacRoleController {

  // GET /api/rbac/roles
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { status, roleType } = req.query as Record<string, string>;
    const roles = await RbacRoleService.getAll({ status, roleType });
    sendResponse(res, { statusCode: 200, data: roles });
  });

  // GET /api/rbac/roles/:id
  static getById = catchAsync(async (req: Request, res: Response) => {
    const role = await RbacRoleService.getById(Number(req.params.id));
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found', data: null });
    }
    sendResponse(res, { statusCode: 200, data: role });
  });

  // GET /api/rbac/roles/code/:code
  static getByCode = catchAsync(async (req: Request, res: Response) => {
    const role = await RbacRoleService.getByCode(String(req.params.code).toUpperCase());
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found', data: null });
    }
    sendResponse(res, { statusCode: 200, data: role });
  });

  // POST /api/rbac/roles
  static create = catchAsync(async (req: Request, res: Response) => {
    const role = await RbacRoleService.create({ ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Role created successfully', data: role });
  });

  // PUT /api/rbac/roles/:id
  static update = catchAsync(async (req: Request, res: Response) => {
    const role = await RbacRoleService.update(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Role updated successfully', data: role });
  });

  // DELETE /api/rbac/roles/:id
  static delete = catchAsync(async (req: Request, res: Response) => {
    await RbacRoleService.softDelete(Number(req.params.id));
    sendResponse(res, { statusCode: 200, message: 'Role deleted successfully', data: null });
  });

  // GET /api/rbac/roles/:id/permissions
  static getPermissions = catchAsync(async (req: Request, res: Response) => {
    const permissions = await RbacRoleService.getPermissions(Number(req.params.id));
    sendResponse(res, { statusCode: 200, data: permissions });
  });
}
