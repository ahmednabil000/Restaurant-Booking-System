const express = require("express");
const branchesController = require("../controllers/branches");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Public
router.get("/branches", branchesController.getBranches);
router.get("/branches/:id", branchesController.getBranchById);
router.get("/branches/nearby", branchesController.getNearbyBranches);
router.get("/branches/search", branchesController.searchBranches);

// Admin
router.post(
  "/branches",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  branchesController.createBranch
);

router.put(
  "/branches/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  branchesController.updateBranch
);

router.put(
  "/branches/:id/location",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  branchesController.updateBranchLocation
);

router.delete(
  "/branches/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  branchesController.deleteBranch
);

module.exports = router;
