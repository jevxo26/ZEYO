import { Router } from 'express';
import { PackageController } from '../../controllers/package/packageController';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

// ─── Public Read-Only Catalog Routes ─────────────────────────────────────────

// Categories & SubCategories
router.get('/categories',             PackageController.getAllCategories);
router.get('/subcategories',          PackageController.getAllSubCategories);

// Packages Catalog
router.get('/',                       PackageController.getAllPackages);
router.get('/:id',                    PackageController.getPackageById);
router.get('/:id/reviews',             PackageController.getReviewsByPackage);

// ─── Protected Customer Interactions ──────────────────────────────────────────
router.post('/:id/reviews',           verifyToken, PackageController.submitReview);

export default router;
