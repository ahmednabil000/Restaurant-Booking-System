const { Op, fn, col, literal } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const {
  Reservation,
  Resturant,
  User,
  Cart,
  CartItem,
  Meal,
} = require("../models/associations");
const {
  sendReservationPendingEmail,
  sendReservationConfirmationEmail,
} = require("../utils/emailService");

// Reserve a table
exports.reserveTable = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      peopleNum,
      date,
      startTime,
      endTime,
      notes,
      tableNumber,
    } = req.body;

    // Get userId from authenticated user
    const userId = req.user.id;

    // Get user info for email
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validation
    if (!fullName || !phone || !peopleNum || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, phone, party size, date, and start time are required",
      });
    }

    // Validate party size
    if (peopleNum < 1 || peopleNum > 20) {
      return res.status(400).json({
        success: false,
        message: "Party size must be between 1 and 20 people",
      });
    }

    // Check if the reservation date is in the future
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return res.status(400).json({
        success: false,
        message: "Reservation date cannot be in the past",
      });
    }

    // Check for conflicting reservations for the same time slot
    const conflictingReservations = await Reservation.findAll({
      where: {
        date,
        status: { [Op.in]: ["pending", "confirmed"] },
        [Op.or]: [
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: startTime } },
            ],
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: endTime || startTime } },
              { endTime: { [Op.gte]: endTime || startTime } },
            ],
          },
        ],
      },
    });

    // Get restaurant table capacity
    const restaurant = await Resturant.findOne({ where: { isActive: true } });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check if we have available tables
    const reservedTables = conflictingReservations.length;
    if (reservedTables >= restaurant.tablesCount) {
      return res.status(409).json({
        success: false,
        message: "No tables available for the selected time slot",
      });
    }

    // Calculate end time if not provided (default 2 hours)
    let calculatedEndTime = endTime;
    if (!calculatedEndTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      start.setHours(start.getHours() + 2);
      calculatedEndTime = start.toTimeString().slice(0, 5);
    }

    // Use provided table number or generate one (simple sequential assignment)
    const assignedTableNumber =
      tableNumber || `T${(reservedTables + 1).toString().padStart(2, "0")}`;

    // Create reservation
    const newReservation = await Reservation.create({
      id: uuidv4(),
      userId: userId,
      fullName,
      email: user.email, // Add user email to reservation
      phone,
      date,
      startTime,
      endTime: calculatedEndTime,
      partySize: peopleNum,
      specialRequests: notes,
      tableNumber: assignedTableNumber,
      status: "confirmed", // Directly confirmed for authenticated users
    });

    // Mark user's active cart as completed
    try {
      const activeCart = await Cart.findOne({
        where: {
          userId: userId,
          status: "active",
        },
      });

      if (activeCart) {
        await activeCart.update({ status: "completed" });
        console.log(
          `Cart ${activeCart.id} marked as completed for user ${userId}`
        );
      }
    } catch (cartError) {
      console.error("Failed to update cart status:", cartError);
      // Don't fail the reservation if cart update fails
    }

    // Send confirmation email
    try {
      await sendReservationConfirmationEmail(newReservation);
      console.log("Confirmation email sent to:", newReservation.email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the reservation if email fails, just log the error
    }

    res.status(201).json({
      success: true,
      data: newReservation,
      message:
        "Reservation created and confirmed successfully! Check your email for confirmation details.",
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Confirm reservation
exports.confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm reservation with status: ${reservation.status}`,
      });
    }

    const updatedReservation = await reservation.update({
      status: "confirmed",
    });

    // Send confirmation email
    try {
      await sendReservationConfirmationEmail(updatedReservation);
      console.log("Confirmation email sent to:", updatedReservation.email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the confirmation if email fails
    }

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message:
        "Reservation confirmed successfully. Check your email for confirmation details.",
    });
  } catch (error) {
    console.error("Error confirming reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Reservation is already cancelled",
      });
    }

    if (reservation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed reservation",
      });
    }

    const updateData = { status: "cancelled" };
    if (reason) {
      updateData.specialRequests = reservation.specialRequests
        ? `${reservation.specialRequests}\n\nCancellation reason: ${reason}`
        : `Cancellation reason: ${reason}`;
    }

    const updatedReservation = await reservation.update(updateData);

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get available dates for a specific time range
exports.getAvailableTablesForDate = async (req, res) => {
  try {
    const { date, startTime, endTime, days = 30 } = req.query;
    console.log(date);
    console.log(startTime);
    console.log(endTime);
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time and end time are required",
      });
    }

    // Get restaurant info
    const restaurant = await Resturant.findOne({ where: { isActive: true } });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // If specific date is provided, check only that date
    if (date) {
      // Validate the provided date
      const checkDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Allow checking dates in the past for availability lookup (but not for reservations)
      if (checkDate < new Date("2020-01-01")) {
        return res.status(400).json({
          success: false,
          message: "Invalid date provided",
        });
      }

      // Get conflicting reservations for the specific date and time
      const conflictingReservations = await Reservation.findAll({
        where: {
          date,
          status: { [Op.in]: ["pending", "confirmed"] },
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lte]: startTime } },
                { endTime: { [Op.gte]: startTime } },
              ],
            },
            {
              [Op.and]: [
                { startTime: { [Op.lte]: endTime } },
                { endTime: { [Op.gte]: endTime } },
              ],
            },
            {
              [Op.and]: [
                { startTime: { [Op.gte]: startTime } },
                { endTime: { [Op.lte]: endTime } },
              ],
            },
          ],
        },
      });

      const reservedTables = conflictingReservations.length;
      const availableTables = restaurant.tablesCount - reservedTables;

      // Generate list of available and reserved table numbers
      const reservedTableNumbers = conflictingReservations
        .map((res) => res.tableNumber)
        .filter(Boolean);
      const allTableNumbers = Array.from(
        { length: restaurant.tablesCount },
        (_, i) => `T${(i + 1).toString().padStart(2, "0")}`
      );
      const availableTableNumbers = allTableNumbers.filter(
        (table) => !reservedTableNumbers.includes(table)
      );

      return res.status(200).json({
        success: true,
        data: {
          date,
          dayOfWeek: checkDate.toLocaleDateString("en-US", { weekday: "long" }),
          requestedTimeSlot: {
            startTime,
            endTime,
          },
          availability: {
            totalTables: restaurant.tablesCount,
            availableTables,
            reservedTables,
            isAvailable: availableTables > 0,
            availableTableNumbers,
            reservedTableNumbers,
          },
          reservations: conflictingReservations.map((res) => ({
            id: res.id,
            fullName: res.fullName,
            startTime: res.startTime,
            endTime: res.endTime,
            tableNumber: res.tableNumber,
            partySize: res.partySize,
            status: res.status,
          })),
        },
        message: `Availability for ${date} retrieved successfully`,
      });
    }

    // If no specific date, check multiple days (original functionality)
    const today = new Date();
    const availableDates = [];
    const unavailableDates = [];

    for (let i = 0; i < parseInt(days); i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dateString = checkDate.toISOString().split("T")[0];

      // Get conflicting reservations for this date and time
      const conflictingReservations = await Reservation.findAll({
        where: {
          date: dateString,
          status: { [Op.in]: ["pending", "confirmed"] },
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lte]: startTime } },
                { endTime: { [Op.gte]: startTime } },
              ],
            },
            {
              [Op.and]: [
                { startTime: { [Op.lte]: endTime } },
                { endTime: { [Op.gte]: endTime } },
              ],
            },
            {
              [Op.and]: [
                { startTime: { [Op.gte]: startTime } },
                { endTime: { [Op.lte]: endTime } },
              ],
            },
          ],
        },
      });

      const reservedTables = conflictingReservations.length;
      const availableTables = restaurant.tablesCount - reservedTables;

      const dateInfo = {
        date: dateString,
        dayOfWeek: checkDate.toLocaleDateString("en-US", { weekday: "long" }),
        availableTables,
        totalTables: restaurant.tablesCount,
        reservedTables,
        isAvailable: availableTables > 0,
      };

      if (availableTables > 0) {
        availableDates.push(dateInfo);
      } else {
        unavailableDates.push(dateInfo);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        requestedTimeSlot: {
          startTime,
          endTime,
        },
        searchPeriod: {
          days: parseInt(days),
          from: today.toISOString().split("T")[0],
          to: new Date(
            today.getTime() + (parseInt(days) - 1) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        },
        availability: {
          totalDatesChecked: parseInt(days),
          availableDatesCount: availableDates.length,
          unavailableDatesCount: unavailableDates.length,
        },
        availableDates,
        unavailableDates: unavailableDates.slice(0, 5), // Limit unavailable dates shown
      },
      message: "Available dates retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting available dates:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all reservations with filtering
exports.getAllReservations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      date,
      startDate,
      endDate,
      userId,
      userEmail,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};
    const userWhereClause = {};

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by specific date
    if (date) {
      whereClause.date = date;
    }

    // Filter by date range
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Filter by userId
    if (userId) {
      whereClause.userId = userId;
    }

    // Filter by user email
    if (userEmail) {
      userWhereClause.email = { [Op.iLike]: `%${userEmail}%` };
    }

    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
          where:
            Object.keys(userWhereClause).length > 0
              ? userWhereClause
              : undefined,
          required: false, // LEFT JOIN to include reservations even if user is null
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ["date", "DESC"],
        ["startTime", "DESC"],
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        reservations,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit),
        },
      },
      message: "Reservations retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
      message: "Reservation retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update reservation details
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Prevent updating completed or cancelled reservations
    if (reservation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a completed reservation",
      });
    }

    // If updating date/time, check for conflicts
    if (updateData.date || updateData.startTime || updateData.endTime) {
      const checkDate = updateData.date || reservation.date;
      const checkStartTime = updateData.startTime || reservation.startTime;
      const checkEndTime = updateData.endTime || reservation.endTime;

      const conflictingReservations = await Reservation.findAll({
        where: {
          id: { [Op.ne]: id }, // Exclude current reservation
          date: checkDate,
          status: { [Op.in]: ["pending", "confirmed"] },
          [Op.or]: [
            {
              [Op.and]: [
                { startTime: { [Op.lte]: checkStartTime } },
                { endTime: { [Op.gte]: checkStartTime } },
              ],
            },
            {
              [Op.and]: [
                { startTime: { [Op.lte]: checkEndTime } },
                { endTime: { [Op.gte]: checkEndTime } },
              ],
            },
          ],
        },
      });

      const restaurant = await Resturant.findOne({ where: { isActive: true } });
      if (conflictingReservations.length >= restaurant.tablesCount) {
        return res.status(409).json({
          success: false,
          message: "No tables available for the updated time slot",
        });
      }
    }

    const updatedReservation = await reservation.update(updateData);

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation updated successfully",
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Mark reservation as completed
exports.completeReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed reservations can be marked as completed",
      });
    }

    const updatedReservation = await reservation.update({
      status: "completed",
    });

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation marked as completed",
    });
  } catch (error) {
    console.error("Error completing reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Mark reservation as no-show
exports.markNoShow = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed reservations can be marked as no-show",
      });
    }

    const updatedReservation = await reservation.update({ status: "no-show" });

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation marked as no-show",
    });
  } catch (error) {
    console.error("Error marking reservation as no-show:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Customer self-confirmation via email link (public endpoint)
exports.confirmReservationByToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Confirmation token is required",
      });
    }

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.confirmationToken !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid confirmation token",
      });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Reservation is already ${reservation.status}`,
      });
    }

    // Check if reservation date is still in the future
    const reservationDate = new Date(reservation.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot confirm past reservations",
      });
    }

    const updatedReservation = await reservation.update({
      status: "confirmed",
    });

    // Send confirmation email
    try {
      await sendReservationConfirmationEmail(updatedReservation);
      console.log("Confirmation email sent to:", updatedReservation.email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the confirmation if email fails
    }

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message:
        "Reservation confirmed successfully! A confirmation email has been sent.",
    });
  } catch (error) {
    console.error("Error confirming reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Customer self-cancellation via email link (public endpoint)
exports.cancelReservationByToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Confirmation token is required",
      });
    }

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.confirmationToken !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid confirmation token",
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Reservation is already cancelled",
      });
    }

    if (reservation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed reservation",
      });
    }

    const updatedReservation = await reservation.update({
      status: "cancelled",
      specialRequests: reservation.specialRequests
        ? `${reservation.specialRequests}\n\nCancelled by customer via email link`
        : "Cancelled by customer via email link",
    });

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get reservations for the current authenticated user
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, upcoming = false } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { userId };

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter for upcoming reservations only
    if (upcoming === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      whereClause.date = {
        [Op.gte]: today.toISOString().split("T")[0],
      };
      whereClause.status = { [Op.in]: ["confirmed", "pending"] };
    }

    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "email"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ["date", "DESC"],
        ["startTime", "DESC"],
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        reservations,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit),
        },
      },
      message: "User reservations retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Cancel user's own reservation
exports.cancelMyReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { reason } = req.body;

    const reservation = await Reservation.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message:
          "Reservation not found or you don't have permission to cancel it",
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Reservation is already cancelled",
      });
    }

    if (reservation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed reservation",
      });
    }

    // Check if reservation is within cancellation window (e.g., at least 2 hours before)
    const reservationDateTime = new Date(
      `${reservation.date}T${reservation.startTime}`
    );
    const now = new Date();
    const timeDifference = reservationDateTime.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);

    if (hoursDifference < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Reservations can only be cancelled at least 2 hours in advance",
      });
    }

    const updatedReservation = await reservation.update({
      status: "cancelled",
      specialRequests: reservation.specialRequests
        ? `${reservation.specialRequests}\n\nCancelled by customer: ${
            reason || "No reason provided"
          }`
        : `Cancelled by customer: ${reason || "No reason provided"}`,
    });

    res.status(200).json({
      success: true,
      data: updatedReservation,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling user reservation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get reservation statistics (daily, weekly, monthly counts)
exports.getReservationStats = async (req, res) => {
  try {
    const { period = "day" } = req.query;
    const now = new Date();

    let startDate, endDate, dateFormat;

    switch (period.toLowerCase()) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        dateFormat = "%Y-%m-%d";
        break;
      case "week":
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        dateFormat = "%Y-%u";
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        dateFormat = "%Y-%m";
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid period. Use 'day', 'week', or 'month'",
        });
    }

    // Get total reservations for the period
    const totalReservations = await Reservation.count({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    // Get reservations by status
    const reservationsByStatus = await Reservation.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      attributes: ["status", [fn("COUNT", col("id")), "count"]],
      group: ["status"],
      raw: true,
    });

    // Get daily breakdown for the period
    const dailyBreakdown = await Reservation.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]],
      raw: true,
    });

    // Calculate average party size
    const avgPartySize = await Reservation.findOne({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      attributes: [[fn("AVG", col("partySize")), "avgPartySize"]],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: {
          start: startDate.toISOString().split("T")[0],
          end: new Date(endDate.getTime() - 1).toISOString().split("T")[0],
        },
        totalReservations,
        reservationsByStatus: reservationsByStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        dailyBreakdown,
        averagePartySize: parseFloat(avgPartySize?.avgPartySize || 0).toFixed(
          1
        ),
      },
      message: "Reservation statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching reservation stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get most demanded meals based on completed orders
exports.getMostDemandedMeals = async (req, res) => {
  try {
    const { limit = 10, period = "month" } = req.query;
    const now = new Date();

    let startDate;
    switch (period.toLowerCase()) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get most ordered meals from completed carts associated with reservations
    const mostDemandedMeals = await CartItem.findAll({
      include: [
        {
          model: Cart,
          as: "cart",
          where: {
            status: "completed",
            updatedAt: {
              [Op.gte]: startDate,
            },
          },
          attributes: [], // Don't select cart fields to avoid GROUP BY issues
          include: [
            {
              model: Reservation,
              as: "reservation",
              where: {
                status: { [Op.in]: ["completed", "confirmed"] },
              },
              attributes: [], // Don't select reservation fields to avoid GROUP BY issues
            },
          ],
        },
        {
          model: Meal,
          as: "meal",
          attributes: ["id", "title", "price", "description", "imageUrl"],
        },
      ],
      attributes: [
        "mealId",
        [fn("SUM", col("quantity")), "totalOrdered"],
        [fn("COUNT", col("CartItem.id")), "orderCount"],
      ],
      group: [
        "mealId",
        "meal.id",
        "meal.title",
        "meal.price",
        "meal.description",
        "meal.imageUrl",
      ],
      order: [[fn("SUM", col("quantity")), "DESC"]],
      limit: parseInt(limit),
    });

    // Also get total revenue per meal
    const mealsWithRevenue = await Promise.all(
      mostDemandedMeals.map(async (item) => {
        const totalRevenue =
          parseFloat(item.dataValues.totalOrdered) *
          parseFloat(item.meal.price);
        return {
          meal: item.meal,
          totalOrdered: parseInt(item.dataValues.totalOrdered),
          orderCount: parseInt(item.dataValues.orderCount),
          totalRevenue: totalRevenue.toFixed(2),
          averageOrderSize: (
            parseInt(item.dataValues.totalOrdered) /
            parseInt(item.dataValues.orderCount)
          ).toFixed(1),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: {
          start: startDate.toISOString().split("T")[0],
          end: now.toISOString().split("T")[0],
        },
        mostDemandedMeals: mealsWithRevenue,
      },
      message: "Most demanded meals retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching most demanded meals:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get recent customer activity and engagement
exports.getRecentCustomerActivity = async (req, res) => {
  try {
    const { limit = 20, days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get recent customers with their reservation activity
    const recentCustomers = await User.findAll({
      include: [
        {
          model: Reservation,
          as: "reservations",
          where: {
            createdAt: {
              [Op.gte]: startDate,
            },
          },
          attributes: ["id", "status", "date", "partySize", "createdAt"],
          separate: true,
          order: [["createdAt", "DESC"]],
        },
        {
          model: Cart,
          as: "carts",
          where: {
            status: "completed",
            updatedAt: {
              [Op.gte]: startDate,
            },
          },
          include: [
            {
              model: CartItem,
              as: "cartItems",
              include: [
                {
                  model: Meal,
                  as: "meal",
                  attributes: ["title", "price"],
                },
              ],
            },
          ],
          required: false,
        },
      ],
      limit: parseInt(limit),
      order: [["updatedAt", "DESC"]],
    });

    // Filter out users who don't have any reservations
    const customersWithReservations = recentCustomers.filter(
      (customer) => customer.reservations && customer.reservations.length > 0
    );

    // Calculate customer metrics
    const customersWithMetrics = await Promise.all(
      customersWithReservations.map(async (customer) => {
        const totalReservations = customer.reservations.length;
        const completedReservations = customer.reservations.filter(
          (r) => r.status === "completed"
        ).length;
        const cancelledReservations = customer.reservations.filter(
          (r) => r.status === "cancelled"
        ).length;

        const totalSpent = customer.carts.reduce((total, cart) => {
          return (
            total +
            cart.cartItems.reduce((cartTotal, item) => {
              return cartTotal + parseFloat(item.meal.price) * item.quantity;
            }, 0)
          );
        }, 0);

        const averagePartySize =
          customer.reservations.reduce((sum, r) => sum + r.partySize, 0) /
            totalReservations || 0;

        // Calculate customer "rating" based on activity (simple scoring system)
        let customerScore = 0;
        customerScore += completedReservations * 10; // Completed reservations
        customerScore += totalSpent * 0.1; // Spending
        customerScore -= cancelledReservations * 5; // Cancelled reservations penalty

        return {
          customer: {
            id: customer.id,
            fullName: customer.fullName,
            email: customer.email,
            createdAt: customer.createdAt,
          },
          metrics: {
            totalReservations,
            completedReservations,
            cancelledReservations,
            completionRate:
              totalReservations > 0
                ? ((completedReservations / totalReservations) * 100).toFixed(1)
                : "0",
            totalSpent: totalSpent.toFixed(2),
            averagePartySize: averagePartySize.toFixed(1),
            customerScore: customerScore.toFixed(1),
            lastReservation: customer.reservations[0]?.createdAt || null,
          },
          recentReservations: customer.reservations.slice(0, 3),
        };
      })
    );

    // Sort by customer score (highest first)
    customersWithMetrics.sort(
      (a, b) =>
        parseFloat(b.metrics.customerScore) -
        parseFloat(a.metrics.customerScore)
    );

    res.status(200).json({
      success: true,
      data: {
        period: `Last ${days} days`,
        totalCustomers: customersWithMetrics.length,
        customers: customersWithMetrics,
      },
      message: "Recent customer activity retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching customer activity:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
