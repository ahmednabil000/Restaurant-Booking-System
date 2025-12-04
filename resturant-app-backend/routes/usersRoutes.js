const express = require("express");
const usersController = require("../controllers/users");
const rolesController = require("../controllers/roles");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// ===== USER MANAGEMENT ROUTES =====

// ===== PUBLIC ROUTES =====
// No authentication required for these routes

// ===== AUTHENTICATED USER ROUTES =====
// Routes that require user authentication but no specific role

// Get current user profile
router.get("/profile", authMiddleware.authenticateJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: { user: req.user },
  });
});

// ===== ADMIN/OWNER-ONLY ROUTES =====
// All routes below require admin or owner role authentication

// User management routes
router.get(
  "/users",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  usersController.getUsers
);

router.get(
  "/users/stats",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  usersController.getUserStats
);

router.get(
  "/users/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  usersController.getUserById
);

router.post(
  "/users",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  usersController.createUser
);

router.put(
  "/users/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  usersController.updateUser
);

router.delete(
  "/users/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  usersController.deleteUser
);

// Role assignment route
router.put(
  "/users/:id/role",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  usersController.assignRole
);

// ===== ROLE MANAGEMENT ROUTES =====

// Get all roles (admin/owner only)
router.get(
  "/roles",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  rolesController.getRoles
);

router.get(
  "/roles/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  rolesController.getRoleById
);

router.post(
  "/roles",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  rolesController.createRole
);

router.put(
  "/roles/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  rolesController.updateRole
);

router.delete(
  "/roles/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  rolesController.deleteRole
);

module.exports = router;
