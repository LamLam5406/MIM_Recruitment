const db = require('../models');

const newsService = {
  createNews: async (data) => {
    return await db.News.create(data);
  },

  getAllNews: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.News.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Tin mới nhất lên đầu
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      news: rows
    };
  },

  getNewsById: async (id) => {
    const news = await db.News.findByPk(id);
    if (!news) throw new Error("Không tìm thấy bài viết!");
    return news;
  },

  updateNews: async (id, data) => {
    const news = await db.News.findByPk(id);
    if (!news) throw new Error("Không tìm thấy bài viết!");
    
    await news.update(data);
    return news;
  },

  deleteNews: async (id) => {
    const news = await db.News.findByPk(id);
    if (!news) throw new Error("Không tìm thấy bài viết!");
    
    await news.destroy();
    return { message: "Đã xóa bài viết thành công" };
  }
};

module.exports = newsService;