"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const packageController_1 = require("../../controllers/package/packageController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// ─── Public Read-Only Catalog Routes ─────────────────────────────────────────
// Categories & SubCategories
router.get('/categories', packageController_1.PackageController.getAllCategories);
router.get('/subcategories', packageController_1.PackageController.getAllSubCategories);
// Packages Catalog
router.get('/', packageController_1.PackageController.getAllPackages);
router.get('/:id', packageController_1.PackageController.getPackageById);
router.get('/:id/reviews', packageController_1.PackageController.getReviewsByPackage);
// ─── Protected Customer Interactions ──────────────────────────────────────────
router.post('/:id/reviews', authMiddleware_1.verifyToken, packageController_1.PackageController.submitReview);
exports.default = router;
