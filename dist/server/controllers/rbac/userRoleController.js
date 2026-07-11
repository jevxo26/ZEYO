"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const userRoleService_1 = require("../../services/rbac/userRoleService");
class UserRoleController {
}
exports.UserRoleController = UserRoleController;
_a = UserRoleController;
// GET /api/rbac/user-roles/:userId
UserRoleController.getByUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roles = await userRoleService_1.UserRoleService.getByUser(Number(req.params.userId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: roles });
});
// GET /api/rbac/user-roles/role/:roleId/users
UserRoleController.getUsersByRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await userRoleService_1.UserRoleService.getUsersByRole(Number(req.params.roleId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: users });
});
// POST /api/rbac/user-roles/assign
// Body: { userId, roleId, assignedBy?, expiresAt? }
UserRoleController.assign = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId, roleId, assignedBy, expiresAt } = req.body;
    const result = await userRoleService_1.UserRoleService.assign({
        userId: Number(userId),
        roleId: Number(roleId),
        assignedBy: assignedBy ? Number(assignedBy) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Role assigned to user', data: result });
});
// DELETE /api/rbac/user-roles/revoke
// Body: { userId, roleId }
UserRoleController.revoke = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId, roleId } = req.body;
    await userRoleService_1.UserRoleService.revoke(Number(userId), Number(roleId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Role revoked from user', data: null });
});
