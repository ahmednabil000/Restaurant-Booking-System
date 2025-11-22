const express = require("express");
const db = require("./database/sequalize");
const { Meal, Tag, MealTag } = require("./models/associations");

const app = express();

app.use(express.json());

async function startServer() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    // Sync the model with the database
    await db.sync();
    console.log("Database synchronized successfully.");

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
