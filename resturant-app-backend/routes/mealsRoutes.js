const express = require("express");
const mealsController = require("../controllers/meals");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.get("/meals", mealsController.getMeals);
router.get("/meals/:id", mealsController.getMealById);

// Example route using session-based auth (legacy)
router.get("/test", authMiddleware.isAuthenticated, (req, res) => {
  res.status(200).send("Hello im the spoooderman!");
});

// Example route using JWT auth
router.get("/protected", authMiddleware.authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "This is a protected route!",
    user: req.user, // This will contain the user info from JWT
  });
});

// Example route that requires specific role
router.get(
  "/admin-only",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted!",
      user: req.user,
    });
  }
);

module.exports = router;
