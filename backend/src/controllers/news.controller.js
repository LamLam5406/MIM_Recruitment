const newsService = require('../services/news.service');
const db = require('../models');

const newsController = {
  // Public: Ai cũng xem được danh sách
  getAllNews: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await newsService.getAllNews(page, limit);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // Public: Ai cũng xem được chi tiết
  getNewsById: async (req, res) => {
    try {
      const news = await newsService.getNewsById(req.params.id);
      res.json(news);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },

  // Admin: Tạo bài viết mới
  createNews: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Chỉ Admin mới có quyền tạo tin tức!" });
      }

      const { title, content, author } = req.body;
      const data = { title, content, author };

      if (req.file) {
        data.cover_image = req.file.path; // Không cần xóa ảnh cũ local nữa
      }

      const news = await newsService.createNews(data);
      res.status(201).json({ message: "Tạo tin tức thành công", news });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  // Admin: Sửa bài viết
  updateNews: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Chỉ Admin mới có quyền sửa tin tức!" });
      }

      const id = req.params.id;
      const { title, content, author } = req.body;
      const data = { title, content, author };

      if (req.file) {
        data.cover_image = req.file.path; // Không cần xóa ảnh cũ local nữa
      }

      // Lọc bỏ các trường undefined
      Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

      const updatedNews = await newsService.updateNews(id, data);
      res.json({ message: "Cập nhật thành công", news: updatedNews });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  // Admin: Xóa bài viết
  deleteNews: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Chỉ Admin mới có quyền xóa tin tức!" });
      }

      const id = req.params.id;

      const result = await newsService.deleteNews(id);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
};

module.exports = newsController;