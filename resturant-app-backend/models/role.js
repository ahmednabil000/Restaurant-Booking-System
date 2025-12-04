const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequalize");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isSystemRole: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "System roles cannot be deleted",
    },
  },
  {
    tableName: "roles",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
  }
);

module.exports = Role;
