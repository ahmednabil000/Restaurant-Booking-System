const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Page = sequelize.define("Page", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  heroImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  featuredItems: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  featuredReviews: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  chefs: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Page;
