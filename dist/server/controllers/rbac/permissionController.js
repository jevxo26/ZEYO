"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const permissionService_1 = require("../../services/rbac/permissionService");
class PermissionController {
}
exports.PermissionController = PermissionController;
_a = PermissionController;
// GET /api/rbac/permissions
PermissionController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { moduleId, action, status } = req.query;
    const permissions = await permissionService_1.PermissionService.getAll({
        moduleId: moduleId ? Number(moduleId) : undefined,
        action,
        status,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: permissions });
});
// GET /api/rbac/permissions/:id
PermissionController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const permission = await permissionService_1.PermissionService.getById(Number(req.params.id));
    if (!permission) {
        return res.status(404).json({ success: false, message: 'Permission not found', data: null });
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: permission });
});
// POST /api/rbac/permissions
PermissionController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const permission = await permissionService_1.PermissionService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Permission created successfully', data: permission });
});
// PUT /api/rbac/permissions/:id
PermissionController.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const permission = await permissionService_1.PermissionService.update(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Permission updated successfully', data: permission });
});
// DELETE /api/rbac/permissions/:id
PermissionController.delete = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await permissionService_1.PermissionService.delete(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Permission deleted successfully', data: null });
});
