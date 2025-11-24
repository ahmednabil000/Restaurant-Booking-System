const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null temporarily
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("customer", "admin", "staff"),
    defaultValue: "customer",
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;
