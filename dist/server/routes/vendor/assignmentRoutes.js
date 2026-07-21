"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignmentController_1 = require("../../controllers/vendor/assignmentController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('admin', 'manager'));
// ── Assignment CRUD ───────────────────────────────────────────────────────────
router.get('/', assignmentController_1.AssignmentController.getAll);
router.get('/stats', assignmentController_1.AssignmentController.getStats);
router.get('/:id', assignmentController_1.AssignmentController.getById);
router.post('/', assignmentController_1.AssignmentController.create);
router.post('/:id/status', assignmentController_1.AssignmentController.updateStatus);
router.post('/:id/timeline', assignmentController_1.AssignmentController.addTimeline);
router.post('/:id/setting', assignmentController_1.AssignmentController.upsertSetting);
// ── Items & Vendor Assignment ─────────────────────────────────────────────────
router.post('/:id/items', assignmentController_1.AssignmentController.addItem);
router.post('/vendors/assign', assignmentController_1.AssignmentController.assignVendor);
router.post('/vendors/replace', assignmentController_1.AssignmentController.replaceVendor);
router.post('/items/:itemId/cancel', assignmentController_1.AssignmentController.cancelItem);
// ── Service / Schedule ────────────────────────────────────────────────────────
router.post('/service', assignmentController_1.AssignmentController.setService);
router.post('/schedule', assignmentController_1.AssignmentController.setSchedule);
// ── Notes / Attachments ───────────────────────────────────────────────────────
router.post('/notes', assignmentController_1.AssignmentController.addNote);
router.post('/attachments', assignmentController_1.AssignmentController.addAttachment);
// ── Commission ────────────────────────────────────────────────────────────────
router.post('/commission', assignmentController_1.AssignmentController.addCommission);
router.put('/commission/:commissionId/settle', assignmentController_1.AssignmentController.settleCommission);
// ── Performance ───────────────────────────────────────────────────────────────
router.get('/vendors/:vendorId/performance', assignmentController_1.AssignmentController.getPerformance);
router.post('/vendors/:vendorId/performance', assignmentController_1.AssignmentController.upsertPerformance);
exports.default = router;
