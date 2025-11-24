const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Carts",
      key: "id",
    },
  },
  mealId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Meals",
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = CartItem;
