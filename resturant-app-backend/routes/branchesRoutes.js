const express = require("express");
const branchesController = require("../controllers/branches");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Public routes
router.get("/branches", branchesController.getBranches);
router.get("/branches/:id", branchesController.getBranchById);
router.get("/branches/nearby", branchesController.getNearbyBranches);
router.get("/branches/search", branchesController.searchBranches);

// ===== ADMIN/OWNER-ONLY ROUTES =====
// All routes below require admin or owner role authentication

// Admin routes for branch management
router.post(
  "/branches",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  branchesController.createBranch
);

router.put(
  "/branches/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  branchesController.updateBranch
);

router.put(
  "/branches/:id/location",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  branchesController.updateBranchLocation
);

router.delete(
  "/branches/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  branchesController.deleteBranch
);

module.exports = router;
