"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Vendor-facing assignment routes — vendor can see own assignments & update work
const express_1 = require("express");
const assignmentController_1 = require("../../controllers/vendor/assignmentController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken);
// Vendor accepts/rejects assignments
router.post('/acceptance', assignmentController_1.AssignmentController.recordAcceptance);
// Vendor reports work progress
router.post('/progress', assignmentController_1.AssignmentController.addProgress);
// Checklist management
router.post('/checklist', assignmentController_1.AssignmentController.addChecklist);
router.put('/checklist/:checklistId/complete', assignmentController_1.AssignmentController.completeChecklist);
// Deliverables upload
router.post('/deliverables', assignmentController_1.AssignmentController.addDeliverable);
// Completion report
router.post('/completion', assignmentController_1.AssignmentController.submitCompletionReport);
exports.default = router;
