const { Tag, Meal, MealTag } = require("../models/associations");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

// Get all tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      attributes: ["id", "title", "titleColor", "bgColor"],
      order: [["title", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: tags,
      message: "Tags retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create a new tag
exports.createTag = async (req, res) => {
  try {
    const { title, titleColor, bgColor } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Tag title is required",
      });
    }

    // Check if tag with same title already exists
    const existingTag = await Tag.findOne({
      where: { title: { [Op.iLike]: title.trim() } },
    });

    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: "Tag with this title already exists",
      });
    }

    const newTag = await Tag.create({
      id: uuidv4(),
      title: title.trim(),
      titleColor: titleColor || "#fff",
      bgColor: bgColor || "#007bff",
    });

    res.status(201).json({
      success: true,
      data: newTag,
      message: "Tag created successfully",
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add new tag to database
exports.addMealTag = async (req, res) => {
  try {
    const { title, titleColor, bgColor } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Tag title is required",
      });
    }

    // Check if tag with same title already exists
    const existingTag = await Tag.findOne({
      where: { title: { [Op.iLike]: title.trim() } },
    });

    if (existingTag) {
      return res.status(409).json({
        success: false,
        message: "Tag with this title already exists",
      });
    }

    const newTag = await Tag.create({
      id: uuidv4(),
      title: title.trim(),
      titleColor: titleColor || "#fff",
      bgColor: bgColor || "#007bff",
    });

    res.status(201).json({
      success: true,
      data: newTag,
      message: "New tag added successfully",
    });
  } catch (error) {
    console.error("Error adding new tag:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update tag
exports.updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleColor, bgColor } = req.body;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // Check if new title already exists (if title is being updated)
    if (title && title.trim() !== tag.title) {
      const existingTag = await Tag.findOne({
        where: {
          title: { [Op.iLike]: title.trim() },
          id: { [Op.ne]: id },
        },
      });

      if (existingTag) {
        return res.status(409).json({
          success: false,
          message: "Tag with this title already exists",
        });
      }
    }

    // Update the tag
    const updatedTag = await tag.update({
      ...(title && { title: title.trim() }),
      ...(titleColor && { titleColor }),
      ...(bgColor && { bgColor }),
    });

    res.status(200).json({
      success: true,
      data: updatedTag,
      message: "Tag updated successfully",
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Remove tag
exports.removeTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    // Remove all meal-tag associations first
    await MealTag.destroy({
      where: { TagId: id },
    });

    // Remove the tag
    await tag.destroy();

    res.status(200).json({
      success: true,
      message: "Tag removed successfully",
    });
  } catch (error) {
    console.error("Error removing tag:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Remove tag from a specific meal
exports.removeMealTag = async (req, res) => {
  try {
    const { mealId, tagId } = req.params;

    const mealTag = await MealTag.findOne({
      where: { MealId: mealId, TagId: tagId },
    });

    if (!mealTag) {
      return res.status(404).json({
        success: false,
        message: "Tag association with meal not found",
      });
    }

    await mealTag.destroy();

    res.status(200).json({
      success: true,
      message: "Tag removed from meal successfully",
    });
  } catch (error) {
    console.error("Error removing tag from meal:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all meals for specific tags (accepts space-separated tag names)
exports.getMealsByTag = async (req, res) => {
  try {
    const { tags } = req.query; // Change from req.params to req.query to get tags parameter

    if (!tags) {
      return res.status(400).json({
        success: false,
        message: "Tags parameter is required",
      });
    }

    // Split space-separated tag IDs and trim whitespace
    const tagIds = tags
      .split(" ")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tagIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid tag ID is required",
      });
    }

    // Find all meals that have at least one of the specified tags
    const meals = await Meal.findAll({
      include: [
        {
          model: Tag,
          as: "tags",
          where: {
            id: {
              [Op.in]: tagIds,
            },
          },
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
      distinct: true, // Ensure unique meals even if they match multiple tags
    });

    // Also get the tag information for the requested tag IDs
    const foundTags = await Tag.findAll({
      where: {
        id: {
          [Op.in]: tagIds,
        },
      },
      attributes: ["id", "title", "titleColor", "bgColor"],
    });

    res.status(200).json({
      success: true,
      data: {
        requestedTagIds: tagIds,
        foundTags: foundTags,
        meals: meals,
        totalMeals: meals.length,
      },
      message: `Found ${meals.length} meals containing at least one of the specified tags`,
    });
  } catch (error) {
    console.error("Error fetching meals by tags:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

