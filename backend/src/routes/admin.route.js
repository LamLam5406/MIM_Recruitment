const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Lấy danh sách tài khoản: GET /api/admin/users
router.get('/users', verifyToken, adminController.getAllUsers);
// Tuyến đường Admin tạo tài khoản mới: POST /api/admin/users
router.post('/users', verifyToken, adminController.createUser);
// Sửa tài khoản theo ID: PUT /api/admin/users/:id
router.put('/users/:id', verifyToken, adminController.updateUser);

// Xóa tài khoản theo ID: DELETE /api/admin/users/:id
router.delete('/users/:id', verifyToken, adminController.deleteUser);

module.exports = router;