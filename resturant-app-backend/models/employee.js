const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    job: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [
          [
            "Manager",
            "Chef",
            "Sous Chef",
            "Cook",
            "Waiter",
            "Waitress",
            "Host",
            "Hostess",
            "Bartender",
            "Cashier",
            "Kitchen Assistant",
            "Dishwasher",
            "Cleaner",
            "Security",
            "Delivery",
            "Other",
          ],
        ],
      },
    },
    birthDay: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString().split("T")[0],
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 20],
      },
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    resturantId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Resturants",
        key: "id",
      },
    },
  },
  {
    tableName: "Employees",
    timestamps: true,
    indexes: [
      {
        fields: ["resturantId"],
      },
      {
        fields: ["job"],
      },
      {
        fields: ["isActive"],
      },
    ],
  }
);

module.exports = Employee;
