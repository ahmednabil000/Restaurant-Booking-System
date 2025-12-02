const express = require("express");
const reservationController = require("../controllers/reservation");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

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

// Public routes
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

// Admin routes for reservation management
router.get(
  "/reservations",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.getAllReservations
);

router.put(
  "/reservations/:id/confirm",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.confirmReservation
);

router.put(
  "/reservations/:id/reject",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.rejectReservation
);

router.put(
  "/reservations/:id/cancel",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.cancelReservation
);

router.put(
  "/reservations/:id",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.updateReservation
);

router.put(
  "/reservations/:id/complete",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.completeReservation
);

router.put(
  "/reservations/:id/no-show",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.markNoShow
);

// Bulk operations for reservations
router.put(
  "/reservations/bulk/status",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.bulkUpdateReservationStatus
);

// Send notification endpoints
router.post(
  "/reservations/:id/send-confirmation",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.sendConfirmationNotification
);

router.post(
  "/reservations/:id/send-rejection",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.sendRejectionNotification
);

// Reservation settings endpoints
router.get(
  "/reservation-settings",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.getReservationSettings
);

router.put(
  "/reservation-settings",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.updateReservationSettings
);

router.get(
  "/available-time-slots",
  reservationController.getAvailableTimeSlots
);

router.put(
  "/blocked-dates",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.manageBlockedDates
);

router.get("/blocked-dates", reservationController.getBlockedDates);

// Analytics endpoints (Admin only)
router.get(
  "/analytics/reservation-stats",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.getReservationStats
);

router.get(
  "/analytics/most-demanded-meals",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.getMostDemandedMeals
);

router.get(
  "/analytics/recent-customers",
  authMiddleware.authenticateJWT,
  authMiddleware.requireRole(["admin"]),
  reservationController.getRecentCustomerActivity
);

module.exports = router;
