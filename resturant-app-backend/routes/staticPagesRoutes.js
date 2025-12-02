const express = require("express");
const staticController = require("../controllers/staticPages");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Public
router.get("/pages/:slug", staticController.getPageBySlug);

// Admin
router.get(
  "/pages",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  staticController.getAllPages
);

router.post(
  "/pages",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  staticController.createPage
);

router.put(
  "/pages/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  staticController.updatePage
);

router.delete(
  "/pages/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  staticController.deletePage
);

router.put(
  "/pages/:id/hero",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  staticController.updateHeroImage
);

router.put(
  "/pages/:id/featured-items",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  staticController.setFeaturedItems
);

router.put(
  "/pages/:id/featured-reviews",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  staticController.setFeaturedReviews
);

module.exports = router;
