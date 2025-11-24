const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Reservation = sequelize.define("Reservation", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  partySize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.ENUM(
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "no-show"
    ),
    defaultValue: "pending",
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tableNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cartId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: "Carts",
      key: "id",
    },
  },
});

module.exports = Reservation;
