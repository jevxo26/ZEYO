import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserRoleService } from '../../services/rbac/userRoleService';

export class UserRoleController {

  // GET /api/rbac/user-roles/:userId
  static getByUser = catchAsync(async (req: Request, res: Response) => {
    const roles = await UserRoleService.getByUser(Number(req.params.userId));
    sendResponse(res, { statusCode: 200, data: roles });
  });

  // GET /api/rbac/user-roles/role/:roleId/users
  static getUsersByRole = catchAsync(async (req: Request, res: Response) => {
    const users = await UserRoleService.getUsersByRole(Number(req.params.roleId));
    sendResponse(res, { statusCode: 200, data: users });
  });

  // POST /api/rbac/user-roles/assign
  // Body: { userId, roleId, assignedBy?, expiresAt? }
  static assign = catchAsync(async (req: Request, res: Response) => {
    const { userId, roleId, assignedBy, expiresAt } = req.body;
    const result = await UserRoleService.assign({
      userId:      Number(userId),
      roleId:      Number(roleId),
      assignedBy:  assignedBy ? Number(assignedBy) : undefined,
      expiresAt:   expiresAt  ? new Date(expiresAt) : undefined,
    });
    sendResponse(res, { statusCode: 200, message: 'Role assigned to user', data: result });
  });

  // DELETE /api/rbac/user-roles/revoke
  // Body: { userId, roleId }
  static revoke = catchAsync(async (req: Request, res: Response) => {
    const { userId, roleId } = req.body;
    await UserRoleService.revoke(Number(userId), Number(roleId));
    sendResponse(res, { statusCode: 200, message: 'Role revoked from user', data: null });
  });
}
