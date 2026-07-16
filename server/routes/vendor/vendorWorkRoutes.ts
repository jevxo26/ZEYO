// Vendor-facing assignment routes — vendor can see own assignments & update work
import { Router } from 'express';
import { AssignmentController } from '../../controllers/vendor/assignmentController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();
router.use(verifyToken);

// Vendor accepts/rejects assignments
router.post('/acceptance',    AssignmentController.recordAcceptance);

// Vendor reports work progress
router.post('/progress',      AssignmentController.addProgress);

// Checklist management
router.post('/checklist',                                AssignmentController.addChecklist);
router.put('/checklist/:checklistId/complete',           AssignmentController.completeChecklist);

// Deliverables upload
router.post('/deliverables',  AssignmentController.addDeliverable);

// Completion report
router.post('/completion',    AssignmentController.submitCompletionReport);

export default router;
