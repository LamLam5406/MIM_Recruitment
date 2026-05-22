const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors'); // 1. Import cors
const authRoute = require('./routes/auth.route');
const jobRoute = require('./routes/job.route');
const adminRoute = require('./routes/admin.route');
const newsRoute = require('./routes/news.route');
const interviewRoutes = require('./routes/interview.routes');
const db = require('./models');
const PORT = process.env.PORT;

const app = express();

// 2. Kích hoạt CORS (Nên đặt trước các middleware khác)
app.use(cors());
app.use(express.json());

// 3. Cho phép client truy cập các file trong thư mục 'uploads'
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

db.sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Đã kết nối PostgreSQL thành công!");
}).catch((err) => {
  console.error("❌ Lỗi kết nối DB:", err.message);
});

app.use('/api/auth', authRoute);
app.use('/api/jobs', jobRoute);
app.use('/api/admin', adminRoute);
app.use('/api/news', newsRoute);
app.use('/api/interviews', interviewRoutes);

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});

// 3. Bắt tất cả các request còn lại và trả về file index.html của React
// Phục vụ các file tĩnh (CSS, JS, hình ảnh) từ thư mục dist
app.use(express.static(path.join(__dirname, '../dist')));

// Bắt mọi request còn lại và trả về file index.html trong dist
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});
