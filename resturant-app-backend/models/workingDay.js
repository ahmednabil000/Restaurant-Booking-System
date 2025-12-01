const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const WorkingDay = sequelize.define(
  "WorkingDay",
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
        isIn: [
          [
            // English days
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
            // Arabic days
            "الإثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
            "الأحد",
          ],
        ],
      },
    },
    startHour: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    endHour: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
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
    tableName: "WorkingDays",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["resturantId", "name"],
      },
    ],
    validate: {
      endTimeAfterStartTime() {
        if (this.startHour >= this.endHour) {
          throw new Error("End hour must be after start hour");
        }
      },
    },
  }
);

module.exports = WorkingDay;
