"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const assignmentService_1 = require("../../services/vendor/assignmentService");
class AssignmentController {
}
exports.AssignmentController = AssignmentController;
_a = AssignmentController;
// ── VendorAssignment ───────────────────────────────────────────────────────
AssignmentController.create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.create(Object.assign({ assignedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Assignment created', data });
});
AssignmentController.getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { assignmentStatus, page, limit } = req.query;
    const data = await assignmentService_1.AssignmentService.getAll({
        assignmentStatus: assignmentStatus,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
    });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
AssignmentController.getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.getById(Number(req.params.id));
    if (!data)
        return res.status(404).json({ success: false, message: 'Assignment not found', data: null });
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
AssignmentController.getStats = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const data = await assignmentService_1.AssignmentService.getStats();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
AssignmentController.updateStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const { currentStatus, remarks } = req.body;
    const data = await assignmentService_1.AssignmentService.updateStatus(Number(req.params.id), currentStatus, userId, remarks);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: `Status → ${currentStatus}`, data });
});
// ── Items ──────────────────────────────────────────────────────────────────
AssignmentController.addItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.addItem(Object.assign({ assignmentId: Number(req.params.id) }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Item added', data });
});
// ── Assign Vendor ──────────────────────────────────────────────────────────
AssignmentController.assignVendor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.assignVendor(Object.assign({ assignedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Vendor assigned', data });
});
// ── Service / Schedule ─────────────────────────────────────────────────────
AssignmentController.setService = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.setService(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Service set', data });
});
AssignmentController.setSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.setSchedule(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Schedule set', data });
});
// ── Vendor Acceptance (vendor-facing) ──────────────────────────────────────
AssignmentController.recordAcceptance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.recordAcceptance(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Response recorded', data });
});
// ── Work Progress (vendor-facing) ──────────────────────────────────────────
AssignmentController.addProgress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.addProgress(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Progress updated', data });
});
// ── Checklist ──────────────────────────────────────────────────────────────
AssignmentController.addChecklist = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.addChecklist(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Checklist item added', data });
});
AssignmentController.completeChecklist = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.completeChecklist(Number(req.params.checklistId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Checklist item completed', data });
});
// ── Deliverables ───────────────────────────────────────────────────────────
AssignmentController.addDeliverable = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.addDeliverable(Object.assign({ uploadedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Deliverable uploaded', data });
});
// ── Completion Report ──────────────────────────────────────────────────────
AssignmentController.submitCompletionReport = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.submitCompletionReport(Object.assign({ completedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Completion report submitted', data });
});
// ── Timeline ───────────────────────────────────────────────────────────────
AssignmentController.addTimeline = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.addTimeline(Object.assign({ assignmentId: Number(req.params.id), createdBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Timeline entry added', data });
});
// ── Notes / Attachments ────────────────────────────────────────────────────
AssignmentController.addNote = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.addNote(Object.assign({ createdBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Note added', data });
});
AssignmentController.addAttachment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.addAttachment(Object.assign({ uploadedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Attachment added', data });
});
// ── Vendor Replacement ─────────────────────────────────────────────────────
AssignmentController.replaceVendor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const data = await assignmentService_1.AssignmentService.replaceVendor(Object.assign({ approvedBy: userId }, req.body));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Vendor replaced', data });
});
// ── Cancellation ───────────────────────────────────────────────────────────
AssignmentController.cancelItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const { reason } = req.body;
    const data = await assignmentService_1.AssignmentService.cancelItem(Number(req.params.itemId), reason, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Assignment item cancelled', data });
});
// ── Performance ────────────────────────────────────────────────────────────
AssignmentController.getPerformance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.getPerformance(Number(req.params.vendorId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, data });
});
AssignmentController.upsertPerformance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.upsertPerformance(Number(req.params.vendorId), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Performance updated', data });
});
// ── Commission ─────────────────────────────────────────────────────────────
AssignmentController.addCommission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.addCommission(req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, message: 'Commission recorded', data });
});
AssignmentController.settleCommission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.settleCommission(Number(req.params.commissionId));
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Commission settled', data });
});
// ── Settings ───────────────────────────────────────────────────────────────
AssignmentController.upsertSetting = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assignmentService_1.AssignmentService.upsertSetting(Number(req.params.id), req.body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, message: 'Settings saved', data });
});
