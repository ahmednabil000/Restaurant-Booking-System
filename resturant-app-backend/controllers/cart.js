const { UUIDV4 } = require("sequelize");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const Meal = require("../models/meal");
const { v4: uuidv4 } = require("uuid");

exports.addToCart = async (req, res) => {
  try {
    const { mealId, quantity = 1, specialInstructions } = req.body;
    const user = req.user;

    // Validate input
    if (!mealId) {
      return res.status(400).json({
        success: false,
        message: "Meal ID is required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Check if meal exists and is available
    const meal = await Meal.findByPk(mealId);
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    if (!meal.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Meal is not available",
      });
    }

    // Find or create an active cart for the user
    let cart = await Cart.findOne({
      where: {
        userId: user.id,
        status: "active",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        id: uuidv4(),
        userId: user.id,
        status: "active",
        totalAmount: 0.0,
      });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        mealId: mealId,
      },
    });

    if (cartItem) {
      // Update existing cart item
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * meal.price;
      if (specialInstructions) {
        cartItem.specialInstructions = specialInstructions;
      }
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        id: uuidv4(),
        cartId: cart.id,
        mealId: mealId,
        quantity: quantity,
        unitPrice: meal.price,
        totalPrice: quantity * meal.price,
        specialInstructions: specialInstructions || null,
      });
    }

    // Update cart total amount
    const allCartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const newTotalAmount = allCartItems.reduce((total, item) => {
      return total + parseFloat(item.totalPrice);
    }, 0);

    await cart.update({ totalAmount: newTotalAmount });

    // Return success response with cart item details
    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cartItem: {
        id: cartItem.id,
        mealId: cartItem.mealId,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        totalPrice: cartItem.totalPrice,
        specialInstructions: cartItem.specialInstructions,
      },
      cart: {
        id: cart.id,
        totalAmount: cart.totalAmount,
        itemCount: allCartItems.length,
      },
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getCart = async (req, res) => {
  try {
    const user = req.user;

    // Find user's active cart with all items and meal details
    const cart = await Cart.findOne({
      where: {
        userId: user.id,
        status: "active",
      },
      include: [
        {
          model: CartItem,
          as: "cartItems",
          include: [
            {
              model: Meal,
              as: "meal",
              attributes: [
                "id",
                "title",
                "description",
                "price",
                "category",
                "type",
                "isAvailable",
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: {
          items: [],
          totalAmount: 0,
          itemCount: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart: {
        id: cart.id,
        totalAmount: cart.totalAmount,
        itemCount: cart.cartItems.length,
        items: cart.cartItems.map((item) => ({
          id: item.id,
          meal: item.meal,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          specialInstructions: item.specialInstructions,
        })),
      },
    });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const user = req.user;

    // Find the cart item and verify it belongs to the user's cart
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: {
            userId: user.id,
            status: "active",
          },
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const cart = cartItem.cart;

    // Remove the cart item
    await cartItem.destroy();

    // Recalculate cart total
    const remainingItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const newTotalAmount = remainingItems.reduce((total, item) => {
      return total + parseFloat(item.totalPrice);
    }, 0);

    await cart.update({ totalAmount: newTotalAmount });

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart: {
        id: cart.id,
        totalAmount: newTotalAmount,
        itemCount: remainingItems.length,
      },
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateItemQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Find the cart item and verify it belongs to the user's cart
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: {
            userId: user.id,
            status: "active",
          },
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const cart = cartItem.cart;

    // Update quantity and total price
    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.unitPrice;
    await cartItem.save();

    // Recalculate cart total
    const allCartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const newTotalAmount = allCartItems.reduce((total, item) => {
      return total + parseFloat(item.totalPrice);
    }, 0);

    await cart.update({ totalAmount: newTotalAmount });

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      cartItem: {
        id: cartItem.id,
        quantity: cartItem.quantity,
        totalPrice: cartItem.totalPrice,
      },
      cart: {
        id: cart.id,
        totalAmount: newTotalAmount,
        itemCount: allCartItems.length,
      },
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
