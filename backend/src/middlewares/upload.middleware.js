const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đường dẫn tới thư mục lưu trữ: public/uploads
const uploadPath = path.join(process.cwd(), 'uploads');

// Tự động tạo thư mục nếu chưa tồn tại trên server
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Trích xuất đuôi file gốc (vd: .pdf, .docx, .png)
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Đổi tên file để tránh trùng lặp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Kiểm tra định dạng file an toàn
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.doc', '.docx', '.jpg', '.png', '.jpeg', '.pdf'];

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Định dạng file không được hỗ trợ. Chỉ nhận doc, docx, jpg, png, jpeg, pdf'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

module.exports = upload;
