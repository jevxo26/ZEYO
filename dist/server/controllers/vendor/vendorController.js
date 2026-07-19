"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const vendorService_1 = require("../../services/vendor/vendorService");
class VendorController {
}
exports.VendorController = VendorController;
_a = VendorController;
VendorController.adminCreateVendor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const vendor = await vendorService_1.VendorService.createVendor(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Vendor profile created successfully',
        data: vendor,
    });
});
VendorController.adminGetVendorById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const vendor = await vendorService_1.VendorService.getVendorById(id);
    if (!vendor) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 404, message: 'Vendor not found' });
    }
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: vendor });
});
VendorController.adminGetAllVendors = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const vendors = await vendorService_1.VendorService.getAllVendors();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: vendors });
});
VendorController.adminUpdateVendor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const updated = await vendorService_1.VendorService.updateVendor(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Vendor profile updated successfully',
        data: updated,
    });
});
VendorController.adminDeleteVendor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    await vendorService_1.VendorService.deleteVendor(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Vendor deactivated successfully',
    });
});
// ─── Verification ────────────────────────────────────────────────────────
VendorController.adminVerifyVendor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    const verifiedBy = 1; // Defaulting to system admin user for demonstration. In prod, this can be retrieved from authenticated user req.user.userId
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { verificationType, status, remarks } = req.body;
    if (!verificationType || !status) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'verificationType and status are required' });
    }
    const log = await vendorService_1.VendorService.verifyVendor(id, verifiedBy, { verificationType, status, remarks });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Vendor verification logged successfully',
        data: log,
    });
});
// ─── Compliance Documents ────────────────────────────────────────────────
VendorController.adminUploadDocument = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const { documentType, documentName, documentUrl, expiryDate } = req.body;
    if (!documentType || !documentName || !documentUrl) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Missing document fields' });
    }
    const doc = await vendorService_1.VendorService.uploadDocument(id, { documentType, documentName, documentUrl, expiryDate });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        message: 'Vendor document uploaded successfully',
        data: doc,
    });
});
VendorController.adminGetDocuments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = parseInt(req.params['id'], 10);
    if (isNaN(id)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }
    const docs = await vendorService_1.VendorService.getDocuments(id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data: docs });
});
VendorController.adminVerifyDocument = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const docId = parseInt(req.params['docId'], 10);
    const verifiedBy = 1; // System Admin ID or req.user.userId
    if (isNaN(docId)) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Invalid document ID' });
    }
    const { status } = req.body;
    if (!status) {
        return (0, sendResponse_1.sendResponse)(res, { statusCode: 400, message: 'Status is required' });
    }
    const doc = await vendorService_1.VendorService.verifyDocument(docId, verifiedBy, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        message: 'Document status updated',
        data: doc,
    });
});
