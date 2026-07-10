"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDeviceController = void 0;
const userDeviceService_1 = require("../../services/authentication/userDeviceService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserDeviceController {
}
exports.UserDeviceController = UserDeviceController;
_a = UserDeviceController;
UserDeviceController.getDevices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const devices = await userDeviceService_1.UserDeviceService.getDevices(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: devices });
});
UserDeviceController.getDeviceById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const device = await userDeviceService_1.UserDeviceService.getDeviceById(id, userId);
    if (!device)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Device not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: device });
});
UserDeviceController.blockDevice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const device = await userDeviceService_1.UserDeviceService.blockDevice(id, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Device blocked', data: device });
});
UserDeviceController.removeDevice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const result = await userDeviceService_1.UserDeviceService.removeDevice(id, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: result.message });
});
