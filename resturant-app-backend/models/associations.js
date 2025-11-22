const Meal = require("./meal");
const Tag = require("./tag");
const MealTag = require("./mealTag");

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
}

// Call the initialization function
initializeAssociations();

module.exports = {
  Meal,
  Tag,
  MealTag,
};
