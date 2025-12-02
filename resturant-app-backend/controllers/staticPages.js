const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const Page = require("../models/page");

// Get public page by slug
exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ where: { slug, isActive: true } });
    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll({ order: [["slug", "ASC"]] });
    res.status(200).json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: create page
exports.createPage = async (req, res) => {
  try {
    const {
      slug,
      title,
      content,
      heroImage,
      featuredItems,
      featuredReviews,
      chefs,
      meta,
      isActive,
    } = req.body;
    if (!slug) {
      return res
        .status(400)
        .json({ success: false, message: "Slug is required" });
    }
    const existing = await Page.findOne({ where: { slug } });
    if (existing) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Page with this slug already exists",
        });
    }
    const page = await Page.create({
      id: uuidv4(),
      slug,
      title,
      content,
      heroImage,
      featuredItems,
      featuredReviews,
      chefs,
      meta,
      isActive: isActive !== undefined ? isActive : true,
    });
    res
      .status(201)
      .json({
        success: true,
        data: page,
        message: "Page created successfully",
      });
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: update page
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const page = await Page.findByPk(id);
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    await page.update(updateData);
    res
      .status(200)
      .json({
        success: true,
        data: page,
        message: "Page updated successfully",
      });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: delete page
exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findByPk(id);
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    await page.destroy();
    res
      .status(200)
      .json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: update hero image
exports.updateHeroImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { heroImage } = req.body;
    if (!heroImage)
      return res
        .status(400)
        .json({ success: false, message: "heroImage is required" });
    const page = await Page.findByPk(id);
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    await page.update({ heroImage });
    res
      .status(200)
      .json({ success: true, data: page, message: "Hero image updated" });
  } catch (error) {
    console.error("Error updating hero image:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: set featured items
exports.setFeaturedItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { featuredItems } = req.body; // expect array of meal ids or objects
    const page = await Page.findByPk(id);
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    await page.update({ featuredItems });
    res
      .status(200)
      .json({ success: true, data: page, message: "Featured items updated" });
  } catch (error) {
    console.error("Error setting featured items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: set featured reviews
exports.setFeaturedReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { featuredReviews } = req.body; // expect array
    const page = await Page.findByPk(id);
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    await page.update({ featuredReviews });
    res
      .status(200)
      .json({ success: true, data: page, message: "Featured reviews updated" });
  } catch (error) {
    console.error("Error setting featured reviews:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
