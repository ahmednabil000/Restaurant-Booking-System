const db = require("../database/sequalize");
const { Meal, Tag, MealTag } = require("../models/associations");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

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

exports.addMeal = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      imageUrl,
      category,
      type,
      isAvailable = true,
      tagIds = [],
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, category, and type are required",
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    // Create the meal
    const mealId = uuidv4();
    const meal = await Meal.create({
      id: mealId,
      title,
      description,
      price: parseFloat(price),
      imageUrl,
      category,
      type,
      isAvailable,
    });

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      // Validate that all tag IDs exist
      const existingTags = await Tag.findAll({
        where: { id: tagIds },
      });

      if (existingTags.length !== tagIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more tag IDs are invalid",
        });
      }

      // Create meal-tag associations
      const mealTagPromises = tagIds.map((tagId) =>
        MealTag.create({
          id: uuidv4(),
          MealId: mealId,
          TagId: tagId,
        })
      );
      await Promise.all(mealTagPromises);
    }

    // Fetch the created meal with tags
    const createdMeal = await Meal.findOne({
      where: { id: mealId },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "title", "bgColor"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: createdMeal,
    });
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      imageUrl,
      category,
      type,
      isAvailable,
      tagIds,
    } = req.body;

    // Check if meal exists
    const meal = await Meal.findByPk(id);
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    // Validate price if provided
    if (price !== undefined && (isNaN(price) || parseFloat(price) <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    // Prepare update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (type !== undefined) updateData.type = type;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    // Update the meal
    await meal.update(updateData);

    // Update tags if provided
    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        // Validate that all tag IDs exist
        const existingTags = await Tag.findAll({
          where: { id: tagIds },
        });

        if (existingTags.length !== tagIds.length) {
          return res.status(400).json({
            success: false,
            message: "One or more tag IDs are invalid",
          });
        }
      }

      // Remove existing meal-tag associations
      await MealTag.destroy({
        where: { MealId: id },
      });

      // Create new meal-tag associations
      if (tagIds.length > 0) {
        const mealTagPromises = tagIds.map((tagId) =>
          MealTag.create({
            id: uuidv4(),
            MealId: id,
            TagId: tagId,
          })
        );
        await Promise.all(mealTagPromises);
      }
    }

    // Fetch updated meal with tags
    const updatedMeal = await Meal.findOne({
      where: { id },
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "title", "bgColor"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: updatedMeal,
    });
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.removeMealById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if meal exists
    const meal = await Meal.findByPk(id);
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    // Check if meal is in any active carts
    const { CartItem } = require("../models/associations");
    const cartItems = await CartItem.findAll({
      where: { mealId: id },
      include: [
        {
          model: require("../models/cart"),
          as: "cart",
          where: { status: "active" },
        },
      ],
    });

    if (cartItems.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete meal that is currently in active carts. Please remove from carts first or mark as unavailable.",
      });
    }

    // Remove meal-tag associations first
    await MealTag.destroy({
      where: { MealId: id },
    });

    // Delete the meal
    await meal.destroy();

    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meal:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Search meals by query
exports.searchMeals = async (req, res) => {
  try {
    const { searchQuery, page = 1, pageSize = 10 } = req.query;

    if (!searchQuery || searchQuery.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchTerm = searchQuery.trim();
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    // Search in meal title, description, and category
    const whereCondition = {
      [Op.and]: [
        {
          isAvailable: true, // Only show available meals
        },
        {
          [Op.or]: [
            {
              title: {
                [Op.iLike]: `%${searchTerm}%`, // Case-insensitive search
              },
            },
            {
              description: {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
            {
              category: {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
          ],
        },
      ],
    };

    const { count, rows: meals } = await Meal.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Tag,
          as: "tags",
          attributes: ["id", "title", "titleColor", "bgColor"],
          through: { attributes: [] }, // Exclude junction table attributes
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "price",
        "imageUrl",
        "category",
        "type",
        "isAvailable",
      ],
      offset,
      limit,
      order: [
        // Prioritize exact matches in title
        [
          db.literal(
            `CASE WHEN LOWER(title) LIKE LOWER('%${searchTerm}%') THEN 1 ELSE 2 END`
          ),
          "ASC",
        ],
        ["title", "ASC"],
      ],
      distinct: true, // Ensure unique meals
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        meals,
        pagination: {
          currentPage: parseInt(page),
          pageSize: limit,
          totalItems: count,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        searchQuery: searchTerm,
      },
      message: `Found ${count} meals matching "${searchTerm}"`,
    });
  } catch (error) {
    console.error("Error searching meals:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
