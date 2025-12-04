const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { Resturant, WorkingDay, Employee } = require("../models/associations");

// Get the restaurant details with working days and employees (single restaurant)
exports.getResturantDetails = async (req, res) => {
  try {
    const restaurant = await Resturant.findOne({
      where: { isActive: true },
      include: [
        {
          model: WorkingDay,
          as: "workingDays",
          where: { isActive: true },
          required: false,
          attributes: ["id", "name", "startHour", "endHour", "isActive"],
          order: [["name", "ASC"]],
        },
        {
          model: Employee,
          as: "employees",
          where: { isActive: true },
          required: false,
          attributes: ["id", "fullName", "job", "imageUrl", "email", "phone"],
        },
      ],
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
      message: "Restaurant details retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update restaurant details
exports.updateResturant = async (req, res) => {
  try {
    const updateData = req.body;

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const updatedRestaurant = await restaurant.update(updateData);

    res.status(200).json({
      success: true,
      data: updatedRestaurant,
      message: "Restaurant updated successfully",
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update tables count specifically
exports.updateTablesCount = async (req, res) => {
  try {
    const { tablesCount } = req.body;

    if (!tablesCount || tablesCount < 1 || tablesCount > 1000) {
      return res.status(400).json({
        success: false,
        message: "Tables count must be between 1 and 1000",
      });
    }

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const updatedRestaurant = await restaurant.update({ tablesCount });

    res.status(200).json({
      success: true,
      data: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        tablesCount: updatedRestaurant.tablesCount,
      },
      message: "Tables count updated successfully",
    });
  } catch (error) {
    console.error("Error updating tables count:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update basic restaurant information (name, description, cuisine, etc.)
exports.updateBasicInfo = async (req, res) => {
  try {
    const { name, description, cuisine, imageUrl, priceRange } = req.body;

    // Validation
    if (name && (name.length < 2 || name.length > 100)) {
      return res.status(400).json({
        success: false,
        message: "Restaurant name must be between 2 and 100 characters",
      });
    }

    if (cuisine && (cuisine.length < 2 || cuisine.length > 50)) {
      return res.status(400).json({
        success: false,
        message: "Cuisine must be between 2 and 50 characters",
      });
    }

    if (priceRange && !["$", "$$", "$$$", "$$$$"].includes(priceRange)) {
      return res.status(400).json({
        success: false,
        message: "Price range must be one of: $, $$, $$$, $$$$",
      });
    }

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (cuisine !== undefined) updateData.cuisine = cuisine;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (priceRange !== undefined) updateData.priceRange = priceRange;

    const updatedRestaurant = await restaurant.update(updateData);

    res.status(200).json({
      success: true,
      data: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        description: updatedRestaurant.description,
        cuisine: updatedRestaurant.cuisine,
        imageUrl: updatedRestaurant.imageUrl,
        priceRange: updatedRestaurant.priceRange,
      },
      message: "Basic information updated successfully",
    });
  } catch (error) {
    console.error("Error updating basic info:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update contact information (address, phone, email)
exports.updateContactInfo = async (req, res) => {
  try {
    const { address, phone, email } = req.body;

    // Validation
    if (phone && (phone.length < 10 || phone.length > 20)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be between 10 and 20 characters",
      });
    }

    if (email && !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (address && address.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Address cannot be empty",
      });
    }

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const updateData = {};
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;

    const updatedRestaurant = await restaurant.update(updateData);

    res.status(200).json({
      success: true,
      data: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        address: updatedRestaurant.address,
        phone: updatedRestaurant.phone,
        email: updatedRestaurant.email,
      },
      message: "Contact information updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update reservation settings
exports.updateReservationSettings = async (req, res) => {
  try {
    const {
      totalCapacity,
      avgTableCapacity,
      reservationSlotDuration,
      maxReservationsPerDay,
      maxGuestsPerReservation,
      advanceBookingDays,
      allowReservations,
      serviceFees,
    } = req.body;

    // Validation
    if (totalCapacity && (totalCapacity < 1 || totalCapacity > 1000)) {
      return res.status(400).json({
        success: false,
        message: "Total capacity must be between 1 and 1000",
      });
    }

    if (avgTableCapacity && (avgTableCapacity < 1 || avgTableCapacity > 20)) {
      return res.status(400).json({
        success: false,
        message: "Average table capacity must be between 1 and 20",
      });
    }

    if (
      reservationSlotDuration &&
      (reservationSlotDuration < 30 || reservationSlotDuration > 300)
    ) {
      return res.status(400).json({
        success: false,
        message: "Reservation slot duration must be between 30 and 300 minutes",
      });
    }

    if (
      maxReservationsPerDay &&
      (maxReservationsPerDay < 1 || maxReservationsPerDay > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Max reservations per day must be between 1 and 1000",
      });
    }

    if (
      maxGuestsPerReservation &&
      (maxGuestsPerReservation < 1 || maxGuestsPerReservation > 50)
    ) {
      return res.status(400).json({
        success: false,
        message: "Max guests per reservation must be between 1 and 50",
      });
    }

    if (
      advanceBookingDays &&
      (advanceBookingDays < 1 || advanceBookingDays > 365)
    ) {
      return res.status(400).json({
        success: false,
        message: "Advance booking days must be between 1 and 365",
      });
    }

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const updateData = {};
    if (totalCapacity !== undefined) updateData.totalCapacity = totalCapacity;
    if (avgTableCapacity !== undefined)
      updateData.avgTableCapacity = avgTableCapacity;
    if (reservationSlotDuration !== undefined)
      updateData.reservationSlotDuration = reservationSlotDuration;
    if (maxReservationsPerDay !== undefined)
      updateData.maxReservationsPerDay = maxReservationsPerDay;
    if (maxGuestsPerReservation !== undefined)
      updateData.maxGuestsPerReservation = maxGuestsPerReservation;
    if (advanceBookingDays !== undefined)
      updateData.advanceBookingDays = advanceBookingDays;
    if (allowReservations !== undefined)
      updateData.allowReservations = allowReservations;
    if (serviceFees !== undefined) updateData.serviceFees = serviceFees;

    const updatedRestaurant = await restaurant.update(updateData);

    res.status(200).json({
      success: true,
      data: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        totalCapacity: updatedRestaurant.totalCapacity,
        avgTableCapacity: updatedRestaurant.avgTableCapacity,
        reservationSlotDuration: updatedRestaurant.reservationSlotDuration,
        maxReservationsPerDay: updatedRestaurant.maxReservationsPerDay,
        maxGuestsPerReservation: updatedRestaurant.maxGuestsPerReservation,
        advanceBookingDays: updatedRestaurant.advanceBookingDays,
        allowReservations: updatedRestaurant.allowReservations,
        serviceFees: updatedRestaurant.serviceFees,
      },
      message: "Reservation settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating reservation settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update operating hours
exports.updateOperatingHours = async (req, res) => {
  try {
    const { openingTime, closingTime } = req.body;

    // Basic time format validation (HH:MM or HH:MM:SS)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

    if (openingTime && !timeRegex.test(openingTime)) {
      return res.status(400).json({
        success: false,
        message: "Opening time must be in HH:MM or HH:MM:SS format",
      });
    }

    if (closingTime && !timeRegex.test(closingTime)) {
      return res.status(400).json({
        success: false,
        message: "Closing time must be in HH:MM or HH:MM:SS format",
      });
    }

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const updateData = {};
    if (openingTime !== undefined) updateData.openingTime = openingTime;
    if (closingTime !== undefined) updateData.closingTime = closingTime;

    const updatedRestaurant = await restaurant.update(updateData);

    res.status(200).json({
      success: true,
      data: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        openingTime: updatedRestaurant.openingTime,
        closingTime: updatedRestaurant.closingTime,
      },
      message: "Operating hours updated successfully",
    });
  } catch (error) {
    console.error("Error updating operating hours:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update social media information
exports.updateSocialMediaInfo = async (req, res) => {
  try {
    const { facebookUrl, xUrl, instgramUrl } = req.body;

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Validate URLs if provided
    const urlPattern = /^https?:\/\/.+\..+/;
    if (facebookUrl && !urlPattern.test(facebookUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Facebook URL format",
      });
    }
    if (xUrl && !urlPattern.test(xUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid X (Twitter) URL format",
      });
    }
    if (instgramUrl && !urlPattern.test(instgramUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instagram URL format",
      });
    }

    // Update only provided fields
    const updateData = {};
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
    if (xUrl !== undefined) updateData.xUrl = xUrl;
    if (instgramUrl !== undefined) updateData.instgramUrl = instgramUrl;

    const updatedRestaurant = await restaurant.update(updateData);

    res.status(200).json({
      success: true,
      data: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        facebookUrl: updatedRestaurant.facebookUrl,
        xUrl: updatedRestaurant.xUrl,
        instgramUrl: updatedRestaurant.instgramUrl,
      },
      message: "Social media information updated successfully",
    });
  } catch (error) {
    console.error("Error updating social media information:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get working days for restaurant
exports.getWorkingDays = async (req, res) => {
  try {
    const restaurant = await Resturant.findOne({
      where: { isActive: true },
      include: [
        {
          model: WorkingDay,
          as: "workingDays",
          attributes: ["id", "name", "startHour", "endHour", "isActive"],
          order: [["name", "ASC"]],
        },
      ],
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Working days retrieved successfully",
      data: restaurant.workingDays,
    });
  } catch (error) {
    console.error("Error getting working days:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add working day to restaurant
exports.addWorkingDay = async (req, res) => {
  try {
    const { name, startHour, endHour } = req.body;

    if (!name || !startHour || !endHour) {
      return res.status(400).json({
        success: false,
        message: "Day name, start hour, and end hour are required",
      });
    }

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check if working day already exists for this restaurant
    const existingWorkingDay = await WorkingDay.findOne({
      where: { resturantId: restaurant.id, name },
    });

    if (existingWorkingDay) {
      return res.status(409).json({
        success: false,
        message: "Working day already exists for this restaurant",
      });
    }

    const newWorkingDay = await WorkingDay.create({
      id: uuidv4(),
      name,
      startHour,
      endHour,
      resturantId: restaurant.id,
    });

    res.status(201).json({
      success: true,
      data: newWorkingDay,
      message: "Working day added successfully",
    });
  } catch (error) {
    console.error("Error adding working day:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update working day
exports.updateWorkingDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startHour, endHour, isActive } = req.body;

    const workingDay = await WorkingDay.findOne({
      where: { id },
    });

    if (!workingDay) {
      return res.status(404).json({
        success: false,
        message: "Working day not found",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (startHour) updateData.startHour = startHour;
    if (endHour) updateData.endHour = endHour;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedWorkingDay = await workingDay.update(updateData);

    res.status(200).json({
      success: true,
      data: updatedWorkingDay,
      message: "Working day updated successfully",
    });
  } catch (error) {
    console.error("Error updating working day:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get single working day
exports.getWorkingDay = async (req, res) => {
  try {
    const { id } = req.params;

    const workingDay = await WorkingDay.findOne({
      where: { id, isActive: true },
    });

    if (!workingDay) {
      return res.status(404).json({
        success: false,
        message: "Working day not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Working day retrieved successfully",
      data: workingDay,
    });
  } catch (error) {
    console.error("Error getting working day:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Bulk update working days
exports.bulkUpdateWorkingDays = async (req, res) => {
  try {
    const { workingDays } = req.body;

    if (!Array.isArray(workingDays) || workingDays.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Working days array is required",
      });
    }

    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const updatePromises = workingDays.map(async (dayData) => {
      const { id, name, startHour, endHour, isActive } = dayData;

      if (!id) {
        throw new Error("Working day ID is required for bulk update");
      }

      const workingDay = await WorkingDay.findOne({
        where: { id, resturantId: restaurant.id },
      });

      if (!workingDay) {
        throw new Error(`Working day with ID ${id} not found`);
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (startHour !== undefined) updateData.startHour = startHour;
      if (endHour !== undefined) updateData.endHour = endHour;
      if (isActive !== undefined) updateData.isActive = isActive;

      return workingDay.update(updateData);
    });

    const updatedWorkingDays = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Working days updated successfully",
      data: updatedWorkingDays,
    });
  } catch (error) {
    console.error("Error bulk updating working days:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Toggle working day status
exports.toggleWorkingDayStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const workingDay = await WorkingDay.findOne({
      where: { id },
    });

    if (!workingDay) {
      return res.status(404).json({
        success: false,
        message: "Working day not found",
      });
    }

    const updatedWorkingDay = await workingDay.update({
      isActive: !workingDay.isActive,
    });

    res.status(200).json({
      success: true,
      message: `Working day ${
        updatedWorkingDay.isActive ? "activated" : "deactivated"
      } successfully`,
      data: updatedWorkingDay,
    });
  } catch (error) {
    console.error("Error toggling working day status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete working day
exports.deleteWorkingDay = async (req, res) => {
  try {
    const { id } = req.params;

    const workingDay = await WorkingDay.findOne({
      where: { id },
    });

    if (!workingDay) {
      return res.status(404).json({
        success: false,
        message: "Working day not found",
      });
    }

    await workingDay.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: "Working day deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting working day:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get restaurant statistics
exports.getResturantStats = async (req, res) => {
  try {
    const restaurant = await Resturant.findOne({
      where: { isActive: true },
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const totalEmployees = await Employee.count({
      where: { resturantId: restaurant.id, isActive: true },
    });

    const employeesByJob = await Employee.findAll({
      where: { resturantId: restaurant.id, isActive: true },
      attributes: ["job", [require("sequelize").fn("COUNT", "*"), "count"]],
      group: ["job"],
    });

    const workingDaysCount = await WorkingDay.count({
      where: { resturantId: restaurant.id, isActive: true },
    });

    res.status(200).json({
      success: true,
      data: {
        restaurantInfo: {
          id: restaurant.id,
          name: restaurant.name,
          tablesCount: restaurant.tablesCount,
          rating: restaurant.rating,
          cuisine: restaurant.cuisine,
        },
        stats: {
          totalEmployees,
          employeesByJob: employeesByJob.map((item) => ({
            job: item.job,
            count: parseInt(item.dataValues.count),
          })),
          workingDaysCount,
        },
      },
      message: "Restaurant statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching restaurant stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
