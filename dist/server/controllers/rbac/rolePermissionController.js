"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const rolePermissionService_1 = require("../../services/rbac/rolePermissionService");
class RolePermissionController {
}
exports.RolePermissionController = RolePermissionController;
_a = RolePermissionController;
// GET /api/rbac/role-permissions/:roleId
RolePermissionController.getByRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const permissions = await rolePermissionService_1.RolePermissionService.getByRole(Number(req.params.roleId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: permissions });
});
// POST /api/rbac/role-permissions/assign
// Body: { roleId, permissionId, canCreate?, canRead?, ... }
RolePermissionController.assign = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await rolePermissionService_1.RolePermissionService.assign(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Permission assigned to role', data: result });
});
// POST /api/rbac/role-permissions/bulk-assign
// Body: { roleId, permissionIds: number[] }
RolePermissionController.bulkAssign = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { roleId, permissionIds } = req.body;
    const result = await rolePermissionService_1.RolePermissionService.bulkAssign(Number(roleId), permissionIds);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Permissions bulk-assigned to role', data: result });
});
// DELETE /api/rbac/role-permissions/revoke
// Body: { roleId, permissionId }
RolePermissionController.revoke = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { roleId, permissionId } = req.body;
    await rolePermissionService_1.RolePermissionService.revoke(Number(roleId), Number(permissionId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Permission revoked from role', data: null });
});
// DELETE /api/rbac/role-permissions/revoke-all/:roleId
RolePermissionController.revokeAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await rolePermissionService_1.RolePermissionService.revokeAll(Number(req.params.roleId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'All permissions revoked from role', data: null });
});
