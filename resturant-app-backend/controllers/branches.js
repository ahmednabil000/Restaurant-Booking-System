const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../database/sequalize");
const Branch = require("../models/branch");

// Public: get all branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll({ where: { isActive: true } });
    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Public: get branch by id
exports.getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);
    if (!branch)
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    res.status(200).json({ success: true, data: branch });
  } catch (error) {
    console.error("Error fetching branch:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: create branch
exports.createBranch = async (req, res) => {
  try {
    const { name, address, phone, openingHours, isActive, meta } = req.body;
    if (!name || !address)
      return res
        .status(400)
        .json({ success: false, message: "name and address are required" });
    const branch = await Branch.create({
      id: uuidv4(),
      name,
      address,
      phone,
      openingHours,
      isActive: isActive !== undefined ? isActive : true,
      meta,
    });
    res.status(201).json({
      success: true,
      data: branch,
      message: "Branch created successfully",
    });
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: update branch
exports.updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const branch = await Branch.findByPk(id);
    if (!branch)
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    await branch.update(updateData);
    res.status(200).json({
      success: true,
      data: branch,
      message: "Branch updated successfully",
    });
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: delete branch
exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);
    if (!branch)
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });
    await branch.destroy();
    res
      .status(200)
      .json({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Error deleting branch:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin: update branch location
exports.updateBranchLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      zipCode,
      landmark,
    } = req.body;

    const branch = await Branch.findByPk(id);
    if (!branch)
      return res
        .status(404)
        .json({ success: false, message: "Branch not found" });

    const locationData = {};
    if (latitude !== undefined) locationData.latitude = latitude;
    if (longitude !== undefined) locationData.longitude = longitude;
    if (address !== undefined) locationData.address = address;
    if (city !== undefined) locationData.city = city;
    if (state !== undefined) locationData.state = state;
    if (country !== undefined) locationData.country = country;
    if (zipCode !== undefined) locationData.zipCode = zipCode;
    if (landmark !== undefined) locationData.landmark = landmark;

    await branch.update(locationData);
    res.status(200).json({
      success: true,
      data: branch,
      message: "Branch location updated successfully",
    });
  } catch (error) {
    console.error("Error updating branch location:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Public: get nearby branches
exports.getNearbyBranches = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    // Using Haversine formula for nearby calculation
    const branches = await Branch.findAll({
      where: {
        isActive: true,
        latitude: { [Op.not]: null },
        longitude: { [Op.not]: null },
      },
      attributes: {
        include: [
          [
            sequelize.literal(
              `(
                6371 * acos(
                  cos(radians(${latitude})) 
                  * cos(radians(latitude)) 
                  * cos(radians(longitude) - radians(${longitude})) 
                  + sin(radians(${latitude})) 
                  * sin(radians(latitude))
                )
              )`
            ),
            "distance",
          ],
        ],
      },
      having: sequelize.literal(`distance <= ${radius}`),
      order: sequelize.literal("distance"),
    });

    res.status(200).json({ success: true, data: branches });
  } catch (error) {
    console.error("Error fetching nearby branches:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Public: search branches by city/area
exports.searchBranches = async (req, res) => {
  try {
    const { city, state, country, search } = req.query;

    const whereClause = { isActive: true };

    if (city) {
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }
    if (state) {
      whereClause.state = { [Op.iLike]: `%${state}%` };
    }
    if (country) {
      whereClause.country = { [Op.iLike]: `%${country}%` };
    }
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { landmark: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const branches = await Branch.findAll({ where: whereClause });

    res.status(200).json({
      success: true,
      data: branches,
      total: branches.length,
    });
  } catch (error) {
    console.error("Error searching branches:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
