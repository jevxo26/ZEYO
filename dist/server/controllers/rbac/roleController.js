"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacRoleController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const roleService_1 = require("../../services/rbac/roleService");
class RbacRoleController {
}
exports.RbacRoleController = RbacRoleController;
_a = RbacRoleController;
// GET /api/rbac/roles
RbacRoleController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status, roleType } = req.query;
    const roles = await roleService_1.RbacRoleService.getAll({ status, roleType });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: roles });
});
// GET /api/rbac/roles/:id
RbacRoleController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const role = await roleService_1.RbacRoleService.getById(Number(req.params.id));
    if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found', data: null });
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: role });
});
// GET /api/rbac/roles/code/:code
RbacRoleController.getByCode = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const role = await roleService_1.RbacRoleService.getByCode(String(req.params.code).toUpperCase());
    if (!role) {
        return res.status(404).json({ success: false, message: 'Role not found', data: null });
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: role });
});
// POST /api/rbac/roles
RbacRoleController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const role = await roleService_1.RbacRoleService.create(Object.assign({}, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Role created successfully', data: role });
});
// PUT /api/rbac/roles/:id
RbacRoleController.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const role = await roleService_1.RbacRoleService.update(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Role updated successfully', data: role });
});
// DELETE /api/rbac/roles/:id
RbacRoleController.delete = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await roleService_1.RbacRoleService.softDelete(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Role deleted successfully', data: null });
});
// GET /api/rbac/roles/:id/permissions
RbacRoleController.getPermissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const permissions = await roleService_1.RbacRoleService.getPermissions(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: permissions });
});
