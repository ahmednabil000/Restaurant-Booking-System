const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const MealTag = sequelize.define(
  "MealTag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    MealId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Meals",
        key: "id",
      },
    },
    TagId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Tags",
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["MealId", "TagId"],
      },
    ],
  }
);

module.exports = MealTag;

module.exports = MealTag;
