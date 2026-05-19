const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Lấy secret từ .env
const SECRET_KEY = process.env.JWT_SECRET;

const authService = {
  login: async (email, password) => {
    // 1. Tìm trong MySQL
    const user = await db.User.findOne({ where: { email } });
    
    if (!user) throw new Error("Email không tồn tại");

    // 2. So sánh pass
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    // 3. Tạo token
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    
    // Trả về data (bỏ password đi)
    const userInfo = user.toJSON();
    delete userInfo.password;
    
    return { user: userInfo, token };
  },

  // Hàm lấy profile chi tiết kèm quan hệ
  getProfile: async (userId) => {
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: db.StudentProfile },
        { model: db.CompanyProfile },
        { 
          model: db.ApplyJob,
          include: [{ model: db.Job, as: 'job' }]
        }
      ]
    });
    if (!user) throw new Error("User not found");
    return user;
  },

  updateProfile: async (userId, role, updateData) => {
    // Tùy vào role mà update bảng tương ứng
    if (role === 'student') {
      // updateData chứa: full_name, cv_url, skills...
      await db.StudentProfile.update(updateData, { where: { user_id: userId } });
    } else if (role === 'company') {
      // updateData chứa: company_name, address...
      await db.CompanyProfile.update(updateData, { where: { user_id: userId } });
    }
    
    return { message: "Cập nhật hồ sơ thành công!" };
  }
};

module.exports = authService;