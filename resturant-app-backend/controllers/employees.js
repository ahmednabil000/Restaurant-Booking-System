const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { Employee, Resturant } = require("../models/associations");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      job,
      isActive,
      resturantId,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Add job filter - handle Arabic text with multiple search methods
    if (job) {
      if (whereClause[Op.or]) {
        // If search already exists, add job search to it
        whereClause[Op.and] = [
          { [Op.or]: whereClause[Op.or] },
          {
            [Op.or]: [
              { job: { [Op.iLike]: `%${job}%` } },
              { job: { [Op.like]: `%${job}%` } },
              { job: job },
            ],
          },
        ];
        delete whereClause[Op.or];
      } else {
        // If no search, just add job filter
        whereClause[Op.or] = [
          { job: { [Op.iLike]: `%${job}%` } },
          { job: { [Op.like]: `%${job}%` } },
          { job: job },
        ];
      }
    }

    // Add active status filter
    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    // Add restaurant filter
    if (resturantId) {
      whereClause.resturantId = resturantId;
    }

    const employees = await Employee.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Resturant,
          as: "restaurant",
          attributes: ["id", "name", "address"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: {
        employees: employees.rows,
        totalCount: employees.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(employees.count / limit),
        hasNextPage: page * limit < employees.count,
        hasPreviousPage: page > 1,
      },
      message: "Employees retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving employees:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: Resturant,
          as: "restaurant",
          attributes: ["id", "name", "address"],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
      message: "Employee retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving employee:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      job,
      birthDay,
      imageUrl,
      email,
      phone,
      salary,
      hireDate,
      isActive = true,
      resturantId,
    } = req.body;

    // Validation
    if (!fullName || !job || !resturantId) {
      return res.status(400).json({
        success: false,
        message: "Full name, job, and restaurant ID are required",
      });
    }

    // Validate restaurant exists
    const restaurant = await Resturant.findByPk(resturantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmployee = await Employee.findOne({ where: { email } });
      if (existingEmployee) {
        return res.status(409).json({
          success: false,
          message: "An employee with this email already exists",
        });
      }
    }

    // Create employee
    const newEmployee = await Employee.create({
      id: uuidv4(),
      fullName,
      job,
      birthDay,
      imageUrl,
      email,
      phone,
      salary,
      hireDate: hireDate || new Date(),
      isActive,
      resturantId,
    });

    // Fetch the created employee with restaurant details
    const createdEmployee = await Employee.findByPk(newEmployee.id, {
      include: [
        {
          model: Resturant,
          as: "restaurant",
          attributes: ["id", "name", "address"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: createdEmployee,
      message: "Employee created successfully",
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    // Handle validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    // Handle unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      job,
      birthDay,
      imageUrl,
      email,
      phone,
      salary,
      hireDate,
      isActive,
      resturantId,
    } = req.body;

    // Find employee
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Validate restaurant exists (if being updated)
    if (resturantId && resturantId !== employee.resturantId) {
      const restaurant = await Resturant.findByPk(resturantId);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found",
        });
      }
    }

    // Check if email already exists (if being updated and different from current)
    if (email && email !== employee.email) {
      const existingEmployee = await Employee.findOne({
        where: {
          email,
          id: { [Op.ne]: id },
        },
      });
      if (existingEmployee) {
        return res.status(409).json({
          success: false,
          message: "An employee with this email already exists",
        });
      }
    }

    // Update employee
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (job !== undefined) updateData.job = job;
    if (birthDay !== undefined) updateData.birthDay = birthDay;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (salary !== undefined) updateData.salary = salary;
    if (hireDate !== undefined) updateData.hireDate = hireDate;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (resturantId !== undefined) updateData.resturantId = resturantId;

    await employee.update(updateData);

    // Fetch updated employee with restaurant details
    const updatedEmployee = await Employee.findByPk(id, {
      include: [
        {
          model: Resturant,
          as: "restaurant",
          attributes: ["id", "name", "address"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: updatedEmployee,
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Error updating employee:", error);

    // Handle validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    // Handle unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete employee (soft delete - mark as inactive)
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (permanent === "true") {
      // Permanent deletion
      await employee.destroy();
      res.status(200).json({
        success: true,
        message: "Employee permanently deleted",
      });
    } else {
      // Soft delete - mark as inactive
      await employee.update({ isActive: false });
      res.status(200).json({
        success: true,
        message: "Employee deactivated successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get employee statistics
exports.getEmployeeStats = async (req, res) => {
  try {
    const { resturantId } = req.query;

    const whereClause = {};
    if (resturantId) {
      whereClause.resturantId = resturantId;
    }

    const totalEmployees = await Employee.count({ where: whereClause });
    const activeEmployees = await Employee.count({
      where: { ...whereClause, isActive: true },
    });
    const inactiveEmployees = await Employee.count({
      where: { ...whereClause, isActive: false },
    });

    // Get employee count by job
    const employeesByJob = await Employee.findAll({
      where: whereClause,
      attributes: [
        "job",
        [
          Employee.sequelize.fn("COUNT", Employee.sequelize.col("job")),
          "count",
        ],
      ],
      group: ["job"],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        employeesByJob,
      },
      message: "Employee statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving employee statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
