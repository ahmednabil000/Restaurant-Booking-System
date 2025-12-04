const Role = require("../models/role");
const { v4: uuidv4 } = require("uuid");

// Get all roles
exports.getRoles = async (req, res) => {
  try {
    const { includeInactive = false } = req.query;

    const whereClause = includeInactive === "true" ? {} : { isActive: true };

    const roles = await Role.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      message: "Roles retrieved successfully",
      data: { roles },
    });
  } catch (error) {
    console.error("Error getting roles:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving roles",
      error: error.message,
    });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role retrieved successfully",
      data: { role },
    });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving role",
      error: error.message,
    });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const { name, displayName, description } = req.body;

    // Validation
    if (!name || !displayName) {
      return res.status(400).json({
        success: false,
        message: "Role name and display name are required",
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role with this name already exists",
      });
    }

    const newRole = await Role.create({
      id: uuidv4(),
      name: name.toLowerCase().replace(/\s+/g, "_"),
      displayName,
      description,
      isSystemRole: false,
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: { role: newRole },
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      success: false,
      message: "Error creating role",
      error: error.message,
    });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, displayName, description, isActive } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Prevent updating system roles
    if (role.isSystemRole) {
      return res.status(400).json({
        success: false,
        message: "System roles cannot be modified",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({
        where: { name: name.toLowerCase().replace(/\s+/g, "_") },
      });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Role with this name already exists",
        });
      }
    }

    // Update role
    await role.update({
      name: name ? name.toLowerCase().replace(/\s+/g, "_") : role.name,
      displayName: displayName || role.displayName,
      description: description !== undefined ? description : role.description,
      isActive: isActive !== undefined ? isActive : role.isActive,
    });

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: { role },
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Error updating role",
      error: error.message,
    });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Prevent deletion of system roles
    if (role.isSystemRole) {
      return res.status(400).json({
        success: false,
        message: "System roles cannot be deleted",
      });
    }

    await role.destroy();

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting role",
      error: error.message,
    });
  }
};

// Initialize system roles
exports.initializeSystemRoles = async () => {
  try {
    const systemRoles = [
      {
        name: "customer",
        displayName: "Customer",
        description: "Default customer role with basic access",
        isSystemRole: true,
      },
      {
        name: "staff",
        displayName: "Staff",
        description: "Restaurant staff role",
        isSystemRole: true,
      },
      {
        name: "admin",
        displayName: "Administrator",
        description: "Full administrative access",
        isSystemRole: true,
      },
      {
        name: "owner",
        displayName: "Owner",
        description: "Restaurant owner with full access",
        isSystemRole: true,
      },
    ];

    for (const roleData of systemRoles) {
      const [role, created] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: {
          id: uuidv4(),
          ...roleData,
        },
      });

      if (created) {
        console.log(
          `System role "${roleData.displayName}" created successfully`
        );
      }
    }
  } catch (error) {
    console.error("Error initializing system roles:", error);
  }
};
