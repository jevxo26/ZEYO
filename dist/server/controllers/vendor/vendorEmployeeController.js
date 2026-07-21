"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorEmployeeController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const vendorEmployeeService_1 = require("../../services/vendor/vendorEmployeeService");
class VendorEmployeeController {
}
exports.VendorEmployeeController = VendorEmployeeController;
_a = VendorEmployeeController;
VendorEmployeeController.adminAddEmployee = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { employeeName, phone, email, designation, status, joinedAt } = req.body;
    if (!employeeName || !phone || !designation) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'employeeName, phone, and designation are required' });
    }
    const employee = await vendorEmployeeService_1.VendorEmployeeService.addEmployee(id, {
        employeeName,
        phone,
        email,
        designation,
        status,
        joinedAt,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Employee registered to vendor successfully',
        data: employee,
    });
});
VendorEmployeeController.adminGetEmployees = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const employees = await vendorEmployeeService_1.VendorEmployeeService.getEmployees(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: employees });
});
VendorEmployeeController.adminUpdateEmployee = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const employeeId = parseInt(req.params['employeeId'], 10);
    if (isNaN(employeeId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid employee ID' });
    }
    const updated = await vendorEmployeeService_1.VendorEmployeeService.updateEmployee(employeeId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Employee details updated successfully',
        data: updated,
    });
});
VendorEmployeeController.adminDeleteEmployee = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const employeeId = parseInt(req.params['employeeId'], 10);
    if (isNaN(employeeId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid employee ID' });
    }
    await vendorEmployeeService_1.VendorEmployeeService.deleteEmployee(employeeId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Employee deleted successfully',
    });
});
