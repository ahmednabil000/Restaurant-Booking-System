const express = require("express");
const resturantController = require("../controllers/resturant");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// Public routes
router.get("/restaurant/details", resturantController.getResturantDetails);

// ===== ADMIN/OWNER-ONLY ROUTES =====
// All routes below require admin or owner role authentication

// Admin routes - restaurant stats may contain sensitive business data
router.get(
  "/restaurant/stats",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.getResturantStats
);

// Admin routes for restaurant management
router.put(
  "/restaurant",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateResturant
);

router.patch(
  "/restaurant/basic-info",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateBasicInfo
);

router.patch(
  "/restaurant/contact-info",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateContactInfo
);

router.patch(
  "/restaurant/reservation-settings",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateReservationSettings
);

router.patch(
  "/restaurant/operating-hours",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateOperatingHours
);

router.patch(
  "/restaurant/social-media",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateSocialMediaInfo
);

router.put(
  "/restaurant/tables",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateTablesCount
);

router.get(
  "/restaurant/working-days",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.getWorkingDays
);

router.get(
  "/restaurant/working-days/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.getWorkingDay
);

router.post(
  "/restaurant/working-days",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.addWorkingDay
);

router.put(
  "/restaurant/working-days/bulk",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.bulkUpdateWorkingDays
);

router.put(
  "/restaurant/working-days/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.updateWorkingDay
);

router.patch(
  "/restaurant/working-days/:id/toggle",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.toggleWorkingDayStatus
);

router.delete(
  "/restaurant/working-days/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  resturantController.deleteWorkingDay
);

module.exports = router;
