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
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Hashed password for manually created users",
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM("customer", "admin", "staff", "owner"),
    defaultValue: "customer",
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = User;
