"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const roleService_1 = require("../services/roleService");
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
class RoleController {
}
exports.RoleController = RoleController;
_a = RoleController;
RoleController.getAllRoles = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const roles = await roleService_1.RoleService.getAllRoles();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        data: roles,
    });
});
