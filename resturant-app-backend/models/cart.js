const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM("active", "completed", "abandoned"),
    defaultValue: "active",
  },
});

module.exports = Cart;
