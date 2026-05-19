const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Trích xuất đuôi file để phân loại
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    // 1. Nếu là file Word (Bắt buộc phải tải về)
    if (['doc', 'docx'].includes(ext)) {
      return {
        folder: 'uniconnect_uploads',
        resource_type: 'raw', 
        format: ext
      };
    }
    
    // 2. Nếu là PDF hoặc Ảnh (Cho phép xem trực tiếp trên trình duyệt)
    return {
      folder: 'uniconnect_uploads',
      resource_type: 'auto', // Auto sẽ tự nhận diện PDF như một hình ảnh
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'] 
    };
  },
});

const upload = multer({ storage: storage });
module.exports = upload;