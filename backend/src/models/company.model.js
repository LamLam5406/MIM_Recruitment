module.exports = (sequelize, DataTypes) => {
  const CompanyProfile = sequelize.define("CompanyProfile", {
    company_name: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    size: { type: DataTypes.STRING },       // Quy mô (VD: 50-100 nhân viên)
    industry: { type: DataTypes.STRING },   // Lĩnh vực (VD: IT, Marketing)
    logo_url: { type: DataTypes.STRING },   // Link Logo
    description: { type: DataTypes.TEXT, allowNull: false } // Mô tả công ty
  });
  return CompanyProfile;
};