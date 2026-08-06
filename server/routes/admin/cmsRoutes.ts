import { Router } from 'express';
import { verifyToken, requireRole } from '../../middlewares/authMiddleware';
import { CMSController } from '../../controllers/admin/cmsController';

const router = Router();

router.use(verifyToken, requireRole('ADMIN', 'SUPER_ADMIN'));

// Banners
router.get('/banners', CMSController.getBanners);
router.post('/banners', CMSController.createBanner);

// FAQs
router.get('/faqs', CMSController.getFAQs);
router.post('/faqs', CMSController.createFAQ);

// Blogs
router.get('/blogs', CMSController.getBlogs);
router.post('/blogs', CMSController.createBlog);

// Static Pages
router.get('/pages', CMSController.getStaticPages);
router.post('/pages', CMSController.createStaticPage);

export default router;
