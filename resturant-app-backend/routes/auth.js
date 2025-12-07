const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { route } = require("./mealsRoutes");

// JWT secret key - in production, store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Error redirect URL for failed authentication
const errorLoginUrl = "https://restaurant-booking-system-3.onrender.com/login/error";

// Generate JWT token for authenticated user
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" } // Token expires in 24 hours
  );
};

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureMessage: "Cannot login please try again later!",
    failureRedirect: errorLoginUrl,
    session: false, // Disable session since we're using JWT
  }),
  (req, res) => {
    try {
      console.log("User authenticated: ", req.user);

      // Generate JWT token
      console.log("recieved now");
      const token = generateToken(req.user);
      console.log(token);
      // Send token back to client (you have several options here)

      // Option 1: Redirect to frontend with token in URL params
      res.redirect(`https://restaurant-booking-system-3.onrender.com/login/success?token=${token}`);

      // Option 2: Send JSON response (uncomment if you want JSON response)
      // res.status(200).json({
      //   success: true,
      //   message: "Authentication successful",
      //   token: token,
      //   user: {
      //     id: req.user.id,
      //     email: req.user.email,
      //     fullName: req.user.fullName,
      //     role: req.user.role,
      //   },
      // });
    } catch (error) {
      console.error("Error generating token:", error);
      res.redirect(errorLoginUrl);
    }
  }
);

// Route to verify JWT token
router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Route to refresh token
router.post("/refresh", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = generateToken(decoded);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      token: newToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;
