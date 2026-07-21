import { Request, Response } from 'express';
import { CMSService } from '../../services/admin/cmsService';

export class CMSController {
  // Banners
  static async getBanners(req: Request, res: Response) {
    try {
      const data = await CMSService.getBanners();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
  static async createBanner(req: Request, res: Response) {
    try {
      const data = await CMSService.createBanner(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // FAQs
  static async getFAQs(req: Request, res: Response) {
    try {
      const data = await CMSService.getFAQs();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
  static async createFAQ(req: Request, res: Response) {
    try {
      const data = await CMSService.createFAQ(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // Blogs
  static async getBlogs(req: Request, res: Response) {
    try {
      const data = await CMSService.getBlogs();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
  static async createBlog(req: Request, res: Response) {
    try {
      const authorId = (req as any).user.userId;
      const data = await CMSService.createBlog(authorId, req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }

  // Static Pages
  static async getStaticPages(req: Request, res: Response) {
    try {
      const data = await CMSService.getStaticPages();
      res.json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
  static async createStaticPage(req: Request, res: Response) {
    try {
      const data = await CMSService.createStaticPage(req.body);
      res.status(201).json({ success: true, data });
    } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  }
}
