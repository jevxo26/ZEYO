import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AssignmentService } from '../../services/vendor/assignmentService';
import { AuthRequest } from '../../middlewares/authMiddleware';

export class AssignmentController {

  // ── VendorAssignment ───────────────────────────────────────────────────────
  static create = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.create({ assignedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Assignment created', data });
  });

  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { assignmentStatus, page, limit } = req.query;
    const data = await AssignmentService.getAll({
      assignmentStatus: assignmentStatus as string,
      page:  page  ? Number(page)  : 1,
      limit: limit ? Number(limit) : 20,
    });
    sendResponse(res, { statusCode: 200, data });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.getById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false, message: 'Assignment not found', data: null });
    sendResponse(res, { statusCode: 200, data });
  });

  static getStats = catchAsync(async (_req: Request, res: Response) => {
    const data = await AssignmentService.getStats();
    sendResponse(res, { statusCode: 200, data });
  });

  static updateStatus = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const { currentStatus, remarks } = req.body;
    const data = await AssignmentService.updateStatus(Number(req.params.id), currentStatus, userId, remarks);
    sendResponse(res, { statusCode: 200, message: `Status → ${currentStatus}`, data });
  });

  // ── Items ──────────────────────────────────────────────────────────────────
  static addItem = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.addItem({ assignmentId: Number(req.params.id), ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Item added', data });
  });

  // ── Assign Vendor ──────────────────────────────────────────────────────────
  static assignVendor = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.assignVendor({ assignedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Vendor assigned', data });
  });

  // ── Service / Schedule ─────────────────────────────────────────────────────
  static setService = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.setService(req.body);
    sendResponse(res, { statusCode: 200, message: 'Service set', data });
  });

  static setSchedule = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.setSchedule(req.body);
    sendResponse(res, { statusCode: 200, message: 'Schedule set', data });
  });

  // ── Vendor Acceptance (vendor-facing) ──────────────────────────────────────
  static recordAcceptance = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.recordAcceptance(req.body);
    sendResponse(res, { statusCode: 201, message: 'Response recorded', data });
  });

  // ── Work Progress (vendor-facing) ──────────────────────────────────────────
  static addProgress = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.addProgress(req.body);
    sendResponse(res, { statusCode: 201, message: 'Progress updated', data });
  });

  // ── Checklist ──────────────────────────────────────────────────────────────
  static addChecklist = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.addChecklist(req.body);
    sendResponse(res, { statusCode: 201, message: 'Checklist item added', data });
  });

  static completeChecklist = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.completeChecklist(Number(req.params.checklistId));
    sendResponse(res, { statusCode: 200, message: 'Checklist item completed', data });
  });

  // ── Deliverables ───────────────────────────────────────────────────────────
  static addDeliverable = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.addDeliverable({ uploadedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Deliverable uploaded', data });
  });

  // ── Completion Report ──────────────────────────────────────────────────────
  static submitCompletionReport = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.submitCompletionReport({ completedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Completion report submitted', data });
  });

  // ── Timeline ───────────────────────────────────────────────────────────────
  static addTimeline = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.addTimeline({ assignmentId: Number(req.params.id), createdBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Timeline entry added', data });
  });

  // ── Notes / Attachments ────────────────────────────────────────────────────
  static addNote = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.addNote({ createdBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Note added', data });
  });

  static addAttachment = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.addAttachment({ uploadedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Attachment added', data });
  });

  // ── Vendor Replacement ─────────────────────────────────────────────────────
  static replaceVendor = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const data = await AssignmentService.replaceVendor({ approvedBy: userId, ...req.body });
    sendResponse(res, { statusCode: 201, message: 'Vendor replaced', data });
  });

  // ── Cancellation ───────────────────────────────────────────────────────────
  static cancelItem = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const { reason } = req.body;
    const data = await AssignmentService.cancelItem(Number(req.params.itemId), reason, userId);
    sendResponse(res, { statusCode: 200, message: 'Assignment item cancelled', data });
  });

  // ── Performance ────────────────────────────────────────────────────────────
  static getPerformance = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.getPerformance(Number(req.params.vendorId));
    sendResponse(res, { statusCode: 200, data });
  });

  static upsertPerformance = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.upsertPerformance(Number(req.params.vendorId), req.body);
    sendResponse(res, { statusCode: 200, message: 'Performance updated', data });
  });

  // ── Commission ─────────────────────────────────────────────────────────────
  static addCommission = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.addCommission(req.body);
    sendResponse(res, { statusCode: 201, message: 'Commission recorded', data });
  });

  static settleCommission = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.settleCommission(Number(req.params.commissionId));
    sendResponse(res, { statusCode: 200, message: 'Commission settled', data });
  });

  // ── Settings ───────────────────────────────────────────────────────────────
  static upsertSetting = catchAsync(async (req: Request, res: Response) => {
    const data = await AssignmentService.upsertSetting(Number(req.params.id), req.body);
    sendResponse(res, { statusCode: 200, message: 'Settings saved', data });
  });
}
