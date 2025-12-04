const express = require("express");
const reservationController = require("../controllers/reservation");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

// ===== AUTHENTICATED USER ROUTES =====
// Routes that require user authentication but no specific role

// Protected customer routes (require authentication)
router.post(
  "/reservations",
  authMiddleware.authenticateJWT,
  reservationController.reserveTable
);

router.get(
  "/my-reservations",
  authMiddleware.authenticateJWT,
  reservationController.getMyReservations
);

router.put(
  "/my-reservations/:id/cancel",
  authMiddleware.authenticateJWT,
  reservationController.cancelMyReservation
);

// ===== PUBLIC ROUTES =====
// No authentication required
router.get(
  "/reservations/available",
  reservationController.getAvailableTablesForDate
);

router.get("/reservations/:id", reservationController.getReservationById);

// Customer self-service routes (public, token-based)
router.get(
  "/reservations/confirm/:id",
  reservationController.confirmReservationByToken
);
router.get(
  "/reservations/cancel/:id",
  reservationController.cancelReservationByToken
);

// ===== ADMIN-ONLY ROUTES =====
// All routes below require admin or owner role authentication

// Admin routes for reservation management
router.get(
  "/reservations",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.getAllReservations
);

router.put(
  "/reservations/:id/confirm",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.confirmReservation
);

router.put(
  "/reservations/:id/reject",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.rejectReservation
);

router.put(
  "/reservations/:id/cancel",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.cancelReservation
);

router.put(
  "/reservations/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.updateReservation
);

router.put(
  "/reservations/:id/complete",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.completeReservation
);

router.put(
  "/reservations/:id/no-show",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.markNoShow
);

// Bulk operations for reservations
router.put(
  "/reservations/bulk/status",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.bulkUpdateReservationStatus
);

// Send notification endpoints
router.post(
  "/reservations/:id/send-confirmation",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.sendConfirmationNotification
);

router.post(
  "/reservations/:id/send-rejection",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.sendRejectionNotification
);

// Reservation settings endpoints
router.get(
  "/reservation-settings",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.getReservationSettings
);

router.put(
  "/reservation-settings",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.updateReservationSettings
);

router.get(
  "/available-time-slots",
  reservationController.getAvailableTimeSlots
);

router.put(
  "/blocked-dates",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.manageBlockedDates
);

router.get("/blocked-dates", reservationController.getBlockedDates);

// ===== ADMIN-ONLY ROUTES =====
// All routes below require admin or owner role authentication

// Analytics endpoints (Admin only)
router.get(
  "/analytics/reservation-stats",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.getReservationStats
);

router.get(
  "/analytics/most-demanded-meals",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.getMostDemandedMeals
);

router.get(
  "/analytics/recent-customers",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin", "owner"]),
  reservationController.getRecentCustomerActivity
);

module.exports = router;
