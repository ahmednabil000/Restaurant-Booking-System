const User = require("../models/user");
const Role = require("../models/role");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const sequelize = require("../database/sequalize");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (role && role !== "all") {
      whereClause.role = role;
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["googleId"] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users: users.rows,
        pagination: {
          total: users.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(users.count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["googleId"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, role = "customer", password } = req.body;

    // Validation
    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Validate role
    const validRoles = ["customer", "admin", "staff", "owner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    // Generate user ID and password hash if provided
    const userId = uuidv4();
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const newUser = await User.create({
      id: userId,
      fullName,
      email,
      role,
      password: hashedPassword,
    });

    // Remove sensitive data from response
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;
    delete userResponse.googleId;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ["customer", "admin", "staff", "owner"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role specified",
        });
      }
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
    }

    // Update user
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email,
      role: role || user.role,
    });

    // Remove sensitive data from response
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;
    delete userResponse.googleId;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deletion of the current user
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Assign role to user
exports.assignRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate role
    const validRoles = ["customer", "admin", "staff", "owner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    await user.update({ role });

    // Remove sensitive data from response
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;
    delete userResponse.googleId;

    res.status(200).json({
      success: true,
      message: `Role "${role}" assigned to user successfully`,
      data: { user: userResponse },
    });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning role to user",
      error: error.message,
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("role")), "count"],
      ],
      group: ["role"],
      raw: true,
    });

    const totalUsers = await User.count();

    res.status(200).json({
      success: true,
      message: "User statistics retrieved successfully",
      data: {
        total: totalUsers,
        byRole: stats,
        roles: stats.map((stat) => ({
          role: stat.role,
          count: parseInt(stat.count),
          percentage: ((parseInt(stat.count) / totalUsers) * 100).toFixed(1),
        })),
      },
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user statistics",
      error: error.message,
    });
  }
};
