const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");
const mealTypes = require("../constants/mealTypes");

const Meal = sequelize.define("Meal", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
});

module.exports = Meal;
