module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define("News", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT, // Dùng TEXT vì nội dung bài viết thường rất dài
      allowNull: false
    },
    cover_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: 'Ban Quản Trị'
    }
  });

  // Nếu muốn liên kết tác giả với bảng User (Admin), bạn có thể định nghĩa associate ở đây
  // News.associate = (models) => {
  //   News.belongsTo(models.User, { foreignKey: 'author_id', as: 'admin' });
  // };

  return News;
};