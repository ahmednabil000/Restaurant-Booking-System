const express = require("express");
const tagsController = require("../controllers/tags");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Public routes
router.get("/tags", tagsController.getTags);
router.get("/tags/meals", tagsController.getMealsByTag);

// Admin routes for tag management
router.post(
  "/tags",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  tagsController.addMealTag
);

router.post(
  "/tags/create",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  tagsController.createTag
);

router.put(
  "/tags/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  tagsController.updateTag
);

router.delete(
  "/tags/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  tagsController.removeTag
);

router.delete(
  "/tags/meals/:mealId/:tagId",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  tagsController.removeMealTag
);

module.exports = router;
