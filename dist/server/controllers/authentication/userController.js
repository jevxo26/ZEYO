"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../../services/authentication/userService");
const roleService_1 = require("../../services/roleService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const allowedStatuses = ['active', 'inactive', 'suspended', 'deleted'];
const allowedGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
const isValidDate = (value) => {
    if (value === undefined || value === null || value === '') {
        return true;
    }
    const parsedDate = new Date(value);
    return !Number.isNaN(parsedDate.getTime());
};
const validateUserPayload = async (payload) => {
    if (payload.roleId !== undefined && payload.roleId !== null && payload.roleId !== '') {
        const parsedRoleId = Number(payload.roleId);
        if (!Number.isInteger(parsedRoleId) || parsedRoleId < 1) {
            return 'Invalid roleId value';
        }
        const role = await roleService_1.RoleService.getRoleById(parsedRoleId);
        if (!role) {
            return 'Role not found';
        }
    }
    if (payload.status && !allowedStatuses.includes(String(payload.status))) {
        return 'Invalid status value';
    }
    if (payload.gender && !allowedGenders.includes(String(payload.gender))) {
        return 'Invalid gender value';
    }
    if (!isValidDate(payload.dateOfBirth)) {
        return 'Invalid dateOfBirth value';
    }
    return null;
};
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const users = await userService_1.UserService.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        data: users,
    });
});
UserController.getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params['id'];
    if (!id) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid user id' });
        return;
    }
    const user = await userService_1.UserService.getUserById(id);
    if (user) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: user });
    }
    else {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'User not found' });
    }
});
UserController.createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.body || !req.body.email) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Email is required' });
        return;
    }
    const validationError = await validateUserPayload(req.body);
    if (validationError) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: validationError });
        return;
    }
    const user = await userService_1.UserService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'User created successfully',
        data: user,
    });
});
UserController.updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params['id'];
    if (!id) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid user id' });
        return;
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Update data is required' });
        return;
    }
    const validationError = await validateUserPayload(req.body);
    if (validationError) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: validationError });
        return;
    }
    const user = await userService_1.UserService.updateUser(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'User updated successfully',
        data: user,
    });
});
UserController.deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params['id'];
    if (!id) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid user id' });
        return;
    }
    await userService_1.UserService.deleteUser(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'User deleted successfully' });
});
UserController.getUserProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (!userId || isNaN(userId)) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
        return;
    }
    const profile = await userService_1.UserService.getUserProfile(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: profile || {} });
});
UserController.updateUserProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (!userId || isNaN(userId)) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
        return;
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Update data is required' });
        return;
    }
    const profile = await userService_1.UserService.upsertUserProfile(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Profile updated successfully',
        data: profile,
    });
});
