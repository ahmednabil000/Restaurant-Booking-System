const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Tag = sequelize.define("Tag", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  bgColor: {
    type: DataTypes.STRING,
    defaultValue: "#007bff",
  },
});

module.exports = Tag;
