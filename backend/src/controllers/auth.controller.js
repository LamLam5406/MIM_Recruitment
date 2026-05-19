const authService = require('../services/auth.service');
const db = require('../models');

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password); // Thêm await
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const result = await authService.getProfile(req.user.id); // Gọi service
      res.json(result);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id; 
      const role = req.user.role;
      let data = {}; 

      if (role === 'student') {
        const { full_name, phone, gender, university, major, gpa, skills, bio } = req.body;
        data = { full_name, phone, gender, university, major, gpa, skills, bio };
      } else if (role === 'company') {
        const { company_name, website, address, size, industry, description } = req.body;
        data = { company_name, website, address, size, industry, description };
      }

      // Xử lý file upload lên Cloudinary
      if (req.file) {
        if (role === 'student') {
          data.cv_url = req.file.path; // Lấy thẳng URL từ Cloudinary
        } 
        if (role === 'company') {
          data.logo_url = req.file.path;
        }
      }

      Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

      const result = await authService.updateProfile(userId, role, data);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};

module.exports = authController;