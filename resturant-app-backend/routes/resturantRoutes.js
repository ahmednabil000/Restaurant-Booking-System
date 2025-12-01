const express = require("express");
const resturantController = require("../controllers/resturant");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Public routes
router.get("/restaurant/details", resturantController.getResturantDetails);
router.get("/restaurant/stats", resturantController.getResturantStats);

// Admin routes for restaurant management
router.put(
  "/restaurant",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  resturantController.updateResturant
);

router.put(
  "/restaurant/tables",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  resturantController.updateTablesCount
);

router.post(
  "/restaurant/working-days",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  resturantController.addWorkingDay
);

router.put(
  "/restaurant/working-days/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  resturantController.updateWorkingDay
);

router.delete(
  "/restaurant/working-days/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  resturantController.deleteWorkingDay
);

module.exports = router;
