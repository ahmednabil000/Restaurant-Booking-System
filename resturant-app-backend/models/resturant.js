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
    serviceFees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    facebookUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    xUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instgramUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priceRange: {
      type: DataTypes.ENUM("$", "$$", "$$$", "$$$$"),
      allowNull: true,
    },
    // Reservation settings
    totalCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 50,
      validate: {
        min: 1,
        max: 1000,
      },
    },
    avgTableCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 4,
      validate: {
        min: 1,
        max: 20,
      },
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "09:00:00",
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "22:00:00",
    },
    reservationSlotDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 120, // minutes
      validate: {
        min: 30,
        max: 300,
      },
    },
    maxReservationsPerDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100,
      validate: {
        min: 1,
        max: 1000,
      },
    },
    maxGuestsPerReservation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 20,
      validate: {
        min: 1,
        max: 50,
      },
    },
    advanceBookingDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 30,
      validate: {
        min: 1,
        max: 365,
      },
    },
    allowReservations: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
