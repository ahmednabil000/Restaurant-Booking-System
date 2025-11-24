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
});

module.exports = Meal;
