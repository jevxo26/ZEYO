"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSController = void 0;
const cmsService_1 = require("../../services/admin/cmsService");
class CMSController {
    // Banners
    static async getBanners(req, res) {
        try {
            const data = await cmsService_1.CMSService.getBanners();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createBanner(req, res) {
        try {
            const data = await cmsService_1.CMSService.createBanner(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // FAQs
    static async getFAQs(req, res) {
        try {
            const data = await cmsService_1.CMSService.getFAQs();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createFAQ(req, res) {
        try {
            const data = await cmsService_1.CMSService.createFAQ(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Blogs
    static async getBlogs(req, res) {
        try {
            const data = await cmsService_1.CMSService.getBlogs();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createBlog(req, res) {
        try {
            const authorId = req.user.userId;
            const data = await cmsService_1.CMSService.createBlog(authorId, req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    // Static Pages
    static async getStaticPages(req, res) {
        try {
            const data = await cmsService_1.CMSService.getStaticPages();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createStaticPage(req, res) {
        try {
            const data = await cmsService_1.CMSService.createStaticPage(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.CMSController = CMSController;
