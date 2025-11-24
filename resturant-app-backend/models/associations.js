const Meal = require("./meal");
const Tag = require("./tag");
const MealTag = require("./mealTag");
const Cart = require("./cart");
const CartItem = require("./cartItem");
const Reservation = require("./reservation");
const User = require("./user");

// Initialize associations after all models are loaded
function initializeAssociations() {
  // Define many-to-many associations between Meal and Tag through MealTag
  Meal.belongsToMany(Tag, {
    through: MealTag,
    foreignKey: "MealId",
    otherKey: "TagId",
    as: "tags",
  });

  Tag.belongsToMany(Meal, {
    through: MealTag,
    foreignKey: "TagId",
    otherKey: "MealId",
    as: "meals",
  });

  // Direct associations with the junction table
  Meal.hasMany(MealTag, {
    foreignKey: "MealId",
    as: "mealTags",
  });

  Tag.hasMany(MealTag, {
    foreignKey: "TagId",
    as: "tagMeals",
  });

  MealTag.belongsTo(Meal, {
    foreignKey: "MealId",
    as: "meal",
  });

  MealTag.belongsTo(Tag, {
    foreignKey: "TagId",
    as: "tag",
  });

  // Cart associations
  Cart.hasMany(CartItem, {
    foreignKey: "cartId",
    as: "cartItems",
    onDelete: "CASCADE",
  });

  CartItem.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
  });

  // Meal and CartItem associations
  Meal.hasMany(CartItem, {
    foreignKey: "mealId",
    as: "cartItems",
  });

  CartItem.belongsTo(Meal, {
    foreignKey: "mealId",
    as: "meal",
  });

  // Cart and Reservation associations
  Cart.hasOne(Reservation, {
    foreignKey: "cartId",
    as: "reservation",
  });

  Reservation.belongsTo(Cart, {
    foreignKey: "cartId",
    as: "cart",
  });

  // User associations
  User.hasMany(Cart, {
    foreignKey: "userId",
    as: "carts",
  });

  Cart.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(Reservation, {
    foreignKey: "userId",
    as: "reservations",
  });

  Reservation.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
}

// Call the initialization function
initializeAssociations();

module.exports = {
  Meal,
  Tag,
  MealTag,
  Cart,
  CartItem,
  Reservation,
  User,
};
