const express = require("express");
const cartController = require("../controllers/cart");
const { authenticateJWT } = require("../middlewares/auth");
const router = express.Router();

// All cart routes require authentication
router.use(authenticateJWT);

// Add item to cart
router.post("/cart/add", cartController.addToCart);

// Get user's cart
router.get("/cart", cartController.getCart);

// Remove item from cart
router.delete("/cart/item/:cartItemId", cartController.removeFromCart);

// Update item quantity in cart
router.put(
  "/cart/item/:cartItemId/quantity",
  cartController.updateItemQuantity
);

// Clear all items from cart
router.delete("/cart/clear", cartController.clearCart);

module.exports = router;
