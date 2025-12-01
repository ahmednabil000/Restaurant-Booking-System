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
