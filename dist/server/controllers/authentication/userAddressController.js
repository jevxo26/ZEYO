"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddressController = void 0;
const userAddressService_1 = require("../../services/authentication/userAddressService");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserAddressController {
}
exports.UserAddressController = UserAddressController;
_a = UserAddressController;
UserAddressController.getAddresses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const addresses = await userAddressService_1.UserAddressService.getAddresses(userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: addresses });
});
UserAddressController.getAddressById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const address = await userAddressService_1.UserAddressService.getAddressById(id, userId);
    if (!address)
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Address not found' });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: address });
});
UserAddressController.createAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const address = await userAddressService_1.UserAddressService.createAddress(userId, Object.assign(Object.assign({}, req.body), { userId }));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Address created', data: address });
});
UserAddressController.updateAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const address = await userAddressService_1.UserAddressService.updateAddress(id, userId, req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Address updated', data: address });
});
UserAddressController.deleteAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const result = await userAddressService_1.UserAddressService.deleteAddress(id, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: result.message });
});
UserAddressController.setDefault = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = parseInt(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId), 10);
    const id = parseInt(req.params['id'], 10);
    const address = await userAddressService_1.UserAddressService.setDefault(id, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Default address updated', data: address });
});
