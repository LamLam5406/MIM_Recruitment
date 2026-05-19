const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js"); // <-- Import config

// Khởi tạo kết nối với thông tin từ file config
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: process.env.DB_PORT || 3306,
  dialect: dbConfig.dialect,
  // 👉 THÊM ĐOẠN NÀY: Bật SSL bắt buộc cho các dịch vụ Cloud như Aiven
  dialectOptions: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com') ? {
    ssl: {
      require: true,
      rejectUnauthorized: false // Bỏ qua xác thực chứng chỉ tự ký (phổ biến khi kết nối Cloud DB)
    }
  } : {},
  operatorsAliases: 0, // Tắt cảnh báo an toàn cũ của Sequelize
  logging: false, // Tắt log SQL nếu muốn console sạch sẽ

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import các model (Giữ nguyên như cũ)
db.User = require("./user.model")(sequelize, Sequelize);
db.StudentProfile = require("./student.model")(sequelize, Sequelize);
db.CompanyProfile = require("./company.model")(sequelize, Sequelize);
db.Job = require("./job.model")(sequelize, Sequelize);
db.ApplyJob = require("./apply.model")(sequelize, Sequelize);
db.News = require("./news.model")(sequelize, Sequelize);

// === THIẾT LẬP MỐI QUAN HỆ (Giữ nguyên như cũ) ===
db.User.hasOne(db.StudentProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
db.StudentProfile.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.CompanyProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
db.CompanyProfile.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Job, { as: "postedJobs", foreignKey: "company_id" });
db.Job.belongsTo(db.User, { as: "company", foreignKey: "company_id" });

db.User.hasMany(db.ApplyJob, { foreignKey: "student_id" });
db.ApplyJob.belongsTo(db.User, { as: "student", foreignKey: "student_id" });

db.Job.hasMany(db.ApplyJob, { foreignKey: "job_id" });
db.ApplyJob.belongsTo(db.Job, { as: "job", foreignKey: "job_id" });

module.exports = db;