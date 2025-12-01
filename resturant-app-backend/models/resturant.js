const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Resturant = sequelize.define(
  "Resturant",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    tablesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 1000,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 20],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    cuisine: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 50],
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    priceRange: {
      type: DataTypes.ENUM("$", "$$", "$$$", "$$$$"),
      allowNull: true,
    },
  },
  {
    tableName: "Resturants",
    timestamps: true,
    indexes: [
      {
        fields: ["name"],
      },
      {
        fields: ["cuisine"],
      },
      {
        fields: ["isActive"],
      },
    ],
  }
);

module.exports = Resturant;
