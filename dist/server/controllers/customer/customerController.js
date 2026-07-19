"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customerService_1 = require("../../services/customer/customerService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class CustomerController {
}
exports.CustomerController = CustomerController;
_a = CustomerController;
// ─── Self-Service Core Profile ─────────────────────────────────────────────
CustomerController.getMyProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (isNaN(userId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
    }
    const customer = await customerService_1.CustomerService.getCustomerByUserId(userId);
    if (!customer) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Customer profile not found' });
    }
    await customerService_1.CustomerService.logActivity(customer.id, 'view_profile', 'Customer viewed their own profile details', req.ip || req.socket.remoteAddress || undefined);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: customer });
});
CustomerController.createMyProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (isNaN(userId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
    }
    const customer = await customerService_1.CustomerService.createCustomer(userId, req.body);
    await customerService_1.CustomerService.logActivity(customer.id, 'create_profile', 'Customer profile initialized and created', req.ip || req.socket.remoteAddress || undefined);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Customer profile created successfully',
        data: customer,
    });
});
CustomerController.updateMyProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (isNaN(userId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
    }
    const customer = await customerService_1.CustomerService.getCustomerByUserId(userId);
    if (!customer) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Customer profile not found' });
    }
    const updated = await customerService_1.CustomerService.updateCustomer(customer.id, req.body);
    await customerService_1.CustomerService.logActivity(customer.id, 'update_profile', 'Customer updated their profile settings/preferences', req.ip || req.socket.remoteAddress || undefined);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Customer profile updated successfully',
        data: updated,
    });
});
CustomerController.deleteMyProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (isNaN(userId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
    }
    const customer = await customerService_1.CustomerService.getCustomerByUserId(userId);
    if (!customer) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Customer profile not found' });
    }
    await customerService_1.CustomerService.deleteCustomer(customer.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Customer profile deactivated successfully',
    });
});
CustomerController.getMyActivities = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    if (isNaN(userId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 401, message: 'Unauthorized' });
    }
    const customer = await customerService_1.CustomerService.getCustomerByUserId(userId);
    if (!customer) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Customer profile not found' });
    }
    const activities = await customerService_1.CustomerService.getActivities(customer.id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: activities });
});
// ─── Admin Customer Management ─────────────────────────────────────────────
CustomerController.adminGetAllCustomers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const customers = await customerService_1.CustomerService.getAllCustomers();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: customers });
});
CustomerController.adminGetCustomerById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid customer id' });
    }
    const customer = await customerService_1.CustomerService.getCustomerById(id);
    if (!customer) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Customer not found' });
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: customer });
});
CustomerController.adminCreateCustomer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const _b = req.body, { userId } = _b, customerData = __rest(_b, ["userId"]);
    if (!userId || isNaN(parseInt(userId, 10))) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Valid userId is required' });
    }
    const customer = await customerService_1.CustomerService.createCustomer(parseInt(userId, 10), customerData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Customer created by administrator',
        data: customer,
    });
});
CustomerController.adminUpdateCustomer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid customer id' });
    }
    const updated = await customerService_1.CustomerService.updateCustomer(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Customer updated by administrator',
        data: updated,
    });
});
CustomerController.adminDeleteCustomer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid customer id' });
    }
    await customerService_1.CustomerService.deleteCustomer(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Customer deactivated by administrator',
    });
});
