module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define("Job", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false }, // Mô tả công việc
    requirements: { type: DataTypes.TEXT },                  // Yêu cầu ứng viên
    salary_range: { type: DataTypes.STRING },                // VD: "10-15 triệu"
    location: { type: DataTypes.STRING },
    level: { type: DataTypes.ENUM("Intern", "Fresher", "Junior", "Senior") },                    // Địa điểm làm việc
    job_type: { type: DataTypes.ENUM("Full-time", "Part-time", "Remote") },
    deadline: { type: DataTypes.DATEONLY },                  // Hạn nộp hồ sơ
    status: { type: DataTypes.ENUM("open", "closed"), defaultValue: "open" }
  });
  return Job;
};