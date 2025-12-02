const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Branch = sequelize.define("Branch", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90,
    },
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180,
    },
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Saudi Arabia",
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  landmark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  openingHours: {
    type: DataTypes.JSON,
    allowNull: true,
    // example: { monday: { open: '09:00', close: '22:00' }, ... }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Branch;
