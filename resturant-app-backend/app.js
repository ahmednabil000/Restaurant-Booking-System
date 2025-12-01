require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const db = require("./database/sequalize");
const passport = require("passport");
require("./passport"); // Import passport configuration
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/auth");
const mealsRoutes = require("./routes/mealsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const resturantRoutes = require("./routes/resturantRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const {
  createArabicMockData,
  createRestaurantMockData,
  createMockMealTagRelationships,
} = require("./mockData");
const { updateMealsWithImages } = require("./updateMealImages");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Your frontend URL
    credentials: true, // Allow credentials (cookies, sessions)
  })
);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Add session regenerate method if it doesn't exist (compatibility fix for newer Passport versions)
app.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = function (cb) {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = function (cb) {
      cb();
    };
  }
  next();
});
app.use(express.static(__dirname)); // Serve static files for testing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(tagsRoutes);
app.use("/auth", authRoutes);
app.use(mealsRoutes);
app.use(reservationRoutes);
app.use(resturantRoutes);
app.use(cartRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
async function startServer() {
  try {
    console.log("Starting server...");
    await db.authenticate();
    console.log("Database authenticated successfully.");

    await db.sync({ alter: true }); // Preserve existing data
    console.log("Database synchronized successfully.");

    // Update existing users without fullName
    const User = require("./models/user");
    await User.update(
      { fullName: "Unknown User" },
      {
        where: {
          fullName: null,
        },
      }
    );
    console.log("Updated existing users with default fullName.");

    // Create Arabic mock data (temporary)
    await createArabicMockData();

    // Create restaurant mock data
    await createRestaurantMockData();
    await createMockMealTagRelationships();
    // Update existing meals with image URLs
    await updateMealsWithImages();

    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
