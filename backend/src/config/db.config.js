require('dotenv').config({ path: __dirname + '/../.env' }); // Load biến môi trường

module.exports = {
  HOST: process.env.DB_HOST ,
  USER: process.env.DB_USER ,
  PASSWORD: process.env.DB_PASSWORD ,
  DB: process.env.DB_NAME ,
  dialect: process.env.DB_DIALECT || 'mysql',
  pool: {
    max: 5,     // Số kết nối tối đa
    min: 0,     // Số kết nối tối thiểu
    acquire: 30000, // Thời gian tối đa để lấy kết nối (ms)
    idle: 10000     // Thời gian tối đa kết nối rảnh rỗi (ms)
  }
};