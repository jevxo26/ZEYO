import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { VendorService } from '../../services/vendor/vendorService';

export class VendorController {
  static adminCreateVendor = catchAsync(async (req: Request, res: Response) => {
    const vendor = await VendorService.createVendor(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'Vendor profile created successfully',
      data: vendor,
    });
  });

  static adminGetVendorById = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const vendor = await VendorService.getVendorById(id);
    if (!vendor) {
      return sendResponse(res, { statusCode: 404, message: 'Vendor not found' });
    }

    sendResponse(res, { statusCode: 200, data: vendor });
  });

  static adminGetAllVendors = catchAsync(async (req: Request, res: Response) => {
    const vendors = await VendorService.getAllVendors();
    sendResponse(res, { statusCode: 200, data: vendors });
  });

  static adminUpdateVendor = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const updated = await VendorService.updateVendor(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'Vendor profile updated successfully',
      data: updated,
    });
  });

  static adminDeleteVendor = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    await VendorService.deleteVendor(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'Vendor deactivated successfully',
    });
  });

  // ─── Verification ────────────────────────────────────────────────────────
  static adminVerifyVendor = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    const verifiedBy = 1; // Defaulting to system admin user for demonstration. In prod, this can be retrieved from authenticated user req.user.userId
    
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { verificationType, status, remarks } = req.body;
    if (!verificationType || !status) {
      return sendResponse(res, { statusCode: 400, message: 'verificationType and status are required' });
    }

    const log = await VendorService.verifyVendor(id, verifiedBy, { verificationType, status, remarks });
    sendResponse(res, {
      statusCode: 200,
      message: 'Vendor verification logged successfully',
      data: log,
    });
  });

  // ─── Compliance Documents ────────────────────────────────────────────────
  static adminUploadDocument = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const { documentType, documentName, documentUrl, expiryDate } = req.body;
    if (!documentType || !documentName || !documentUrl) {
      return sendResponse(res, { statusCode: 400, message: 'Missing document fields' });
    }

    const doc = await VendorService.uploadDocument(id, { documentType, documentName, documentUrl, expiryDate });
    sendResponse(res, {
      statusCode: 201,
      message: 'Vendor document uploaded successfully',
      data: doc,
    });
  });

  static adminGetDocuments = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid vendor ID' });
    }

    const docs = await VendorService.getDocuments(id);
    sendResponse(res, { statusCode: 200, data: docs });
  });

  static adminVerifyDocument = catchAsync(async (req: Request, res: Response) => {
    const docId = parseInt(req.params['docId'] as string, 10);
    const verifiedBy = 1; // System Admin ID or req.user.userId

    if (isNaN(docId)) {
      return sendResponse(res, { statusCode: 400, message: 'Invalid document ID' });
    }

    const { status } = req.body;
    if (!status) {
      return sendResponse(res, { statusCode: 400, message: 'Status is required' });
    }

    const doc = await VendorService.verifyDocument(docId, verifiedBy, status);
    sendResponse(res, {
      statusCode: 200,
      message: 'Document status updated',
      data: doc,
    });
  });
}
