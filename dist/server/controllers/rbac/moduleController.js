"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const moduleService_1 = require("../../services/rbac/moduleService");
class ModuleController {
}
exports.ModuleController = ModuleController;
_a = ModuleController;
// GET /api/rbac/modules
ModuleController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { status } = req.query;
    const modules = await moduleService_1.ModuleService.getAll(status);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: modules });
});
// GET /api/rbac/modules/with-permissions
ModuleController.getAllWithPermissions = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const modules = await moduleService_1.ModuleService.getAllWithPermissions();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: modules });
});
// GET /api/rbac/modules/:id
ModuleController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const mod = await moduleService_1.ModuleService.getById(Number(req.params.id));
    if (!mod) {
        return res.status(404).json({ success: false, message: 'Module not found', data: null });
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: mod });
});
// POST /api/rbac/modules
ModuleController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const mod = await moduleService_1.ModuleService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Module created successfully', data: mod });
});
// PUT /api/rbac/modules/:id
ModuleController.update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const mod = await moduleService_1.ModuleService.update(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Module updated successfully', data: mod });
});
// DELETE /api/rbac/modules/:id
ModuleController.delete = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await moduleService_1.ModuleService.delete(Number(req.params.id));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Module deleted successfully', data: null });
});
