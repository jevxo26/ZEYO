import { Router } from 'express';
import { AssignmentController } from '../../controllers/vendor/assignmentController';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';

const router = Router();
router.use(verifyToken, requireRole('admin', 'manager'));

// ── Assignment CRUD ───────────────────────────────────────────────────────────
router.get('/',         AssignmentController.getAll);
router.get('/stats',    AssignmentController.getStats);
router.get('/:id',      AssignmentController.getById);
router.post('/',        AssignmentController.create);
router.post('/:id/status',   AssignmentController.updateStatus);
router.post('/:id/timeline', AssignmentController.addTimeline);
router.post('/:id/setting',  AssignmentController.upsertSetting);

// ── Items & Vendor Assignment ─────────────────────────────────────────────────
router.post('/:id/items',          AssignmentController.addItem);
router.post('/vendors/assign',      AssignmentController.assignVendor);
router.post('/vendors/replace',     AssignmentController.replaceVendor);
router.post('/items/:itemId/cancel', AssignmentController.cancelItem);

// ── Service / Schedule ────────────────────────────────────────────────────────
router.post('/service',   AssignmentController.setService);
router.post('/schedule',  AssignmentController.setSchedule);

// ── Notes / Attachments ───────────────────────────────────────────────────────
router.post('/notes',       AssignmentController.addNote);
router.post('/attachments', AssignmentController.addAttachment);

// ── Commission ────────────────────────────────────────────────────────────────
router.post('/commission',                           AssignmentController.addCommission);
router.put('/commission/:commissionId/settle',       AssignmentController.settleCommission);

// ── Performance ───────────────────────────────────────────────────────────────
router.get('/vendors/:vendorId/performance',         AssignmentController.getPerformance);
router.post('/vendors/:vendorId/performance',        AssignmentController.upsertPerformance);

export default router;
