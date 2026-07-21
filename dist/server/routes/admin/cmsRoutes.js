"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const cmsController_1 = require("../../controllers/admin/cmsController");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.requireRole)('ADMIN', 'SUPER_ADMIN'));
// Banners
router.get('/banners', cmsController_1.CMSController.getBanners);
router.post('/banners', cmsController_1.CMSController.createBanner);
// FAQs
router.get('/faqs', cmsController_1.CMSController.getFAQs);
router.post('/faqs', cmsController_1.CMSController.createFAQ);
// Blogs
router.get('/blogs', cmsController_1.CMSController.getBlogs);
router.post('/blogs', cmsController_1.CMSController.createBlog);
// Static Pages
router.get('/pages', cmsController_1.CMSController.getStaticPages);
router.post('/pages', cmsController_1.CMSController.createStaticPage);
exports.default = router;
