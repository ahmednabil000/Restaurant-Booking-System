const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} = require("../controllers/employees");
const { authenticateJWT, requireRole } = require("../middlewares/auth");

// Base route: /api/employees

// Get all employees with pagination and filtering
router.get("/employees", authenticateJWT, getAllEmployees);

// Get employee statistics
router.get(
  "/employees/stats",
  authenticateJWT,
  requireRole(["admin", "manager"]),
  getEmployeeStats
);

// Get employee by ID
router.get("/employees/:id", authenticateJWT, getEmployeeById);

// Create new employee (admin and manager only)
router.post(
  "/employees",
  authenticateJWT,
  requireRole(["admin", "manager"]),
  createEmployee
);

// Update employee (admin and manager only)
router.put(
  "/employees/:id",
  authenticateJWT,
  requireRole(["admin", "manager"]),
  updateEmployee
);

// Delete/deactivate employee (admin and manager only)
router.delete(
  "/employees/:id",
  authenticateJWT,
  requireRole(["admin", "manager"]),
  deleteEmployee
);

module.exports = router;
