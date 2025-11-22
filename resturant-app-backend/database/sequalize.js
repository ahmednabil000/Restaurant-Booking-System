const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("resturant", "postgres", "ahmed3500", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
