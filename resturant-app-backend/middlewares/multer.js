const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      file.originalname.split(".")[0] +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
    fieldSize: 1024 * 1024 * 2, // 2MB for text fields
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
}).single("myFile"); // Changed back to "myFile"

// Wrapper to handle multer errors
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 5MB.",
          });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            success: false,
            message: 'Unexpected file field. Use "myFile" as the field name.',
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }
    next();
  });
};

module.exports = uploadMiddleware;
