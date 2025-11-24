const db = require("../database/sequalize");
const { Meal, Tag } = require("../models/associations");
const { Op } = require("sequelize");

exports.getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findOne({
      where: { id: id },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "title", "bgColor"],
        },
      ],
    });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (error) {
    console.error("Error fetching meal:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getMeals = async (req, res) => {
  try {
    // Extract parameters from request body with defaults
    const {
      page = 1,
      pageSize = 10,
      category,
      type,
      isAvailable,
      minPrice,
      maxPrice,
      search,
      sortBy,
      sortOrder,
    } = req.query;
    console.log("recieved");
    // Convert to appropriate types
    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);

    // Calculate offset for pagination
    const offset = (pageNumber - 1) * pageSizeNumber;

    // Build where clause based on filters
    const whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    if (type) {
      whereClause.type = type;
    }

    if (isAvailable !== undefined) {
      whereClause.isAvailable = isAvailable === "true";
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Build query options
    const queryOptions = {
      where: whereClause,
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "title", "bgColor"],
        },
      ],
      limit: pageSizeNumber,
      offset: offset,
      distinct: true, // Important for accurate count with includes
    };

    // Add sorting only if both sortBy and sortOrder are provided
    if (sortBy && sortOrder) {
      queryOptions.order = [[sortBy, sortOrder.toUpperCase()]];
    }

    // Fetch meals with pagination and filters
    const { count, rows: meals } = await Meal.findAndCountAll(queryOptions);

    // Calculate pagination info
    const totalPages = Math.ceil(count / pageSizeNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;

    res.status(200).json({
      success: true,
      data: {
        meals,
        pagination: {
          currentPage: pageNumber,
          pageSize: pageSizeNumber,
          totalItems: count,
          totalPages,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? pageNumber + 1 : null,
          prevPage: hasPrevPage ? pageNumber - 1 : null,
        },
        filters: {
          category,
          type,
          isAvailable,
          minPrice,
          maxPrice,
          search,
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
