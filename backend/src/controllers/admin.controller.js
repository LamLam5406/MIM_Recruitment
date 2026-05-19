const adminService = require('../services/admin.service');

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Từ chối truy cập!" });
      }
      const users = await adminService.getAllUsers();
      res.status(200).json(users);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  createUser: async (req, res) => {
    try {
      // Bảo mật: Phải đảm bảo người đang gọi API này có role là 'admin'
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Từ chối truy cập. Chỉ Admin mới có quyền tạo tài khoản!" });
      }

      const newUser = await adminService.createUser(req.body);
      res.status(201).json({ 
        message: "Tạo tài khoản và khởi tạo hồ sơ thành công!", 
        user: newUser 
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      // Kiểm tra quyền Admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Từ chối truy cập. Chỉ Admin mới có quyền sửa tài khoản!" });
      }

      const userId = req.params.id;
      const updatedUser = await adminService.updateUser(userId, req.body);
      
      res.status(200).json({ 
        message: "Cập nhật tài khoản thành công!", 
        user: updatedUser 
      });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      // Kiểm tra quyền Admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Từ chối truy cập. Chỉ Admin mới có quyền xóa tài khoản!" });
      }

      const userId = req.params.id;
      await adminService.deleteUser(userId);
      
      res.status(200).json({ message: "Xóa tài khoản thành công!" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
};

module.exports = adminController;