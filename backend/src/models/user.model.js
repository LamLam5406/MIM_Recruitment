module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Lưu hash password
    },
    role: {
      type: DataTypes.ENUM("student", "company", "admin"),
      defaultValue: "student"
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
  return User;
};