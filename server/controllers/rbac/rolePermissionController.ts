import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { RolePermissionService } from '../../services/rbac/rolePermissionService';

export class RolePermissionController {

  // GET /api/rbac/role-permissions/:roleId
  static getByRole = catchAsync(async (req: Request, res: Response) => {
    const permissions = await RolePermissionService.getByRole(Number(req.params.roleId));
    sendResponse(res, { statusCode: 200, data: permissions });
  });

  // POST /api/rbac/role-permissions/assign
  // Body: { roleId, permissionId, canCreate?, canRead?, ... }
  static assign = catchAsync(async (req: Request, res: Response) => {
    const result = await RolePermissionService.assign(req.body);
    sendResponse(res, { statusCode: 200, message: 'Permission assigned to role', data: result });
  });

  // POST /api/rbac/role-permissions/bulk-assign
  // Body: { roleId, permissionIds: number[] }
  static bulkAssign = catchAsync(async (req: Request, res: Response) => {
    const { roleId, permissionIds } = req.body;
    const result = await RolePermissionService.bulkAssign(Number(roleId), permissionIds);
    sendResponse(res, { statusCode: 200, message: 'Permissions bulk-assigned to role', data: result });
  });

  // DELETE /api/rbac/role-permissions/revoke
  // Body: { roleId, permissionId }
  static revoke = catchAsync(async (req: Request, res: Response) => {
    const { roleId, permissionId } = req.body;
    await RolePermissionService.revoke(Number(roleId), Number(permissionId));
    sendResponse(res, { statusCode: 200, message: 'Permission revoked from role', data: null });
  });

  // DELETE /api/rbac/role-permissions/revoke-all/:roleId
  static revokeAll = catchAsync(async (req: Request, res: Response) => {
    await RolePermissionService.revokeAll(Number(req.params.roleId));
    sendResponse(res, { statusCode: 200, message: 'All permissions revoked from role', data: null });
  });
}
