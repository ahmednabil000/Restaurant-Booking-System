const express = require("express");
const tagsController = require("../controllers/tags");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Public routes
router.get("/tags", tagsController.getTags);
router.get("/tags/meals", tagsController.getMealsByTag);

// ===== ADMIN/OWNER-ONLY ROUTES =====
// All routes below require admin or owner role authentication

// Admin routes for tag management
router.post(
  "/tags",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  tagsController.addMealTag
);

router.post(
  "/tags/create",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  tagsController.createTag
);

router.put(
  "/tags/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  tagsController.updateTag
);

router.delete(
  "/tags/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  tagsController.removeTag
);

router.delete(
  "/tags/meals/:mealId/:tagId",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  tagsController.removeMealTag
);

module.exports = router;
