module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define("StudentProfile", {
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(15) },
    gender: { type: DataTypes.ENUM("Nam", "Nữ", "Khác") },
    university: { type: DataTypes.STRING }, // Trường đang học
    major: { type: DataTypes.STRING },      // Chuyên ngành
    gpa: { type: DataTypes.FLOAT },         // Điểm trung bình
    skills: { type: DataTypes.TEXT },       // Kỹ năng (VD: "NodeJS, React")
    cv_url: { type: DataTypes.STRING },     // Link CV (PDF)
    bio: { type: DataTypes.TEXT }           // Giới thiệu bản thân
  });
  return StudentProfile;
};