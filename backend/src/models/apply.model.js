module.exports = (sequelize, DataTypes) => {
  const ApplyJob = sequelize.define("ApplyJob", {
    cover_letter: { type: DataTypes.TEXT }, // Thư giới thiệu
    cv_snapshot: { type: DataTypes.STRING }, // Link CV tại thời điểm nộp
    status: { 
      type: DataTypes.ENUM("pending", "accepted", "rejected"), 
      defaultValue: "pending" 
    },
    applied_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return ApplyJob;
};