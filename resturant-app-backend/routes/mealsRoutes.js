const express = require("express");
const mealsController = require("../controllers/meals");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/multer");
const router = express.Router();

router.get("/meals", mealsController.getMeals);
router.get("/meals/top-demanded", mealsController.getTopDemandedMeals);
router.get("/meals/search", mealsController.searchMeals);
router.get("/meals/:id", mealsController.getMealById);

// ===== ADMIN/OWNER-ONLY ROUTES =====
// All routes below require admin or owner role authentication

// Admin routes for meal management
router.post(
  "/meals",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  upload,
  mealsController.addMeal
);

router.put(
  "/meals/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  upload,
  mealsController.updateMealById
);

router.delete(
  "/meals/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  mealsController.removeMealById
);

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

// Example route that requires admin or owner role
router.get(
  "/admin-only",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin or owner access granted!",
      user: req.user,
    });
  }
);

module.exports = router;
