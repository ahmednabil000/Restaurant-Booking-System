const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Session-based authentication middleware (legacy)
exports.isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "You must log in first",
    });
  }
};

// JWT-based authentication middleware
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware to check user roles
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

// Convenience middleware for admin-only routes
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin" && req.user.role !== "owner") {
    return res.status(403).json({
      success: false,
      message: "Admin or owner access required",
    });
  }

  next();
};

// Middleware specifically for dashboard access (admin or owner)
exports.requireDashboardAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin" && req.user.role !== "owner") {
    return res.status(403).json({
      success: false,
      message: "Dashboard access requires admin or owner role",
    });
  }

  next();
};

// Combined middleware for admin authentication (JWT + Admin role)
exports.authenticateAdmin = [exports.authenticateJWT, exports.requireAdmin];

// Combined middleware for dashboard authentication (JWT + Admin or Owner role)
exports.authenticateDashboard = [
  exports.authenticateJWT,
  exports.requireDashboardAccess,
];
