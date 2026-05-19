const db = require('../models');
const bcrypt = require('bcrypt');

const adminService = {
  getAllUsers: async () => {
    // Lấy danh sách user, không trả về password
    const users = await db.User.findAll({
      attributes: ['id', 'email', 'role', 'is_active', 'createdAt'],
      order: [['createdAt', 'DESC']] // Sắp xếp mới nhất lên đầu
    });
    return users;
  },

  createUser: async (userData) => {
    const { email, password, role, ...profileData } = userData;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) throw new Error("Email này đã được sử dụng!");

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu
    const t = await db.sequelize.transaction();

    try {
      // Tạo User
      const newUser = await db.User.create({
        email,
        password: hashedPassword,
        role: role || 'student'
      }, { transaction: t });

      // Tự động tạo Profile tương ứng dựa vào role
      // Lưu ý: Tên khóa ngoại (ví dụ: UserId) phụ thuộc vào cách bạn thiết lập quan hệ trong index.js của models.
      // Nếu bạn dùng mặc định của Sequelize, nó thường là tên Model + Id (VD: UserId).
      if (newUser.role === 'student') {
        await db.StudentProfile.create({
          user_id: newUser.id, 
          // Cột full_name trong student.model.js là allowNull: false, nên phải có giá trị mặc định
          full_name: profileData.full_name || 'Chưa cập nhật' 
        }, { transaction: t });
      } 
      else if (newUser.role === 'company') {
        await db.CompanyProfile.create({
          user_id: newUser.id,
          // Các cột này trong company.model.js là allowNull: false
          company_name: profileData.company_name || 'Chưa cập nhật',
          description: profileData.description || 'Chưa cập nhật'
        }, { transaction: t });
      }

      // Nếu mọi thứ thành công, lưu vào DB
      await t.commit();

      // Xóa password trước khi trả data về cho client
      const result = newUser.toJSON();
      delete result.password;
      return result;

    } catch (error) {
      // Nếu có lỗi ở bất kỳ bước nào, hủy toàn bộ thao tác
      await t.rollback();
      throw error;
    }
  },
  updateUser: async (userId, updateData) => {
    const { email, password, role, is_active } = updateData;
    
    const user = await db.User.findByPk(userId);
    if (!user) throw new Error("Không tìm thấy người dùng!");

    // Nếu có cập nhật email, kiểm tra xem email mới đã bị ai khác dùng chưa
    if (email && email !== user.email) {
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) throw new Error("Email này đã được sử dụng!");
      user.email = email;
    }

    // Nếu Admin muốn đổi mật khẩu cho user, tiếp tục băm bằng bcrypt
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (role) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;

    await user.save();

    // Ẩn password trước khi trả về
    const result = user.toJSON();
    delete result.password;
    return result;
  },

  deleteUser: async (userId) => {
    const user = await db.User.findByPk(userId);
    if (!user) throw new Error("Không tìm thấy người dùng!");

    const t = await db.sequelize.transaction();

    try {
      // Xóa Profile tương ứng trước để tránh lỗi Foreign Key
      if (user.role === 'student') {
        await db.StudentProfile.destroy({ where: { user_id: userId }, transaction: t });
        // Nếu sinh viên có dữ liệu trong bảng applyjob, bạn có thể cân nhắc xóa hoặc xử lý thêm ở đây
      } else if (user.role === 'company') {
        await db.CompanyProfile.destroy({ where: { user_id: userId }, transaction: t });
        // Tương tự, nếu công ty có bài đăng trong bảng job, cần xử lý để không bị lỗi khóa ngoại
      }

      // Xóa user chính
      await user.destroy({ transaction: t });
      
      await t.commit();
      return { message: "Xóa tài khoản thành công!" };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
};

module.exports = adminService;