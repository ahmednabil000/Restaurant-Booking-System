const { Meal } = require("./models/associations");

async function updateMealsWithImages() {
  try {
    console.log("Updating existing meals with image URLs...");

    // Define image mappings for existing meals
    const mealImageMappings = [
      // Arabic Main Dishes
      {
        title: "منسف أردني",
        imageUrl:
          "https://images.unsplash.com/photo-1574653163889-7b9c20dd2e45?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "كبسة دجاج",
        imageUrl:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "مقلوبة باذنجان",
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "شاورما لحم",
        imageUrl:
          "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "فلافل",
        imageUrl:
          "https://images.unsplash.com/photo-1593504049359-74330189a345?w=400&h=300&fit=crop&auto=format",
      },

      // Grilled Items
      {
        title: "مشكل مشاوي",
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "شيش طاووق",
        imageUrl:
          "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "كباب حلبي",
        imageUrl:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&auto=format",
      },

      // Appetizers
      {
        title: "حمص بطحينة",
        imageUrl:
          "https://images.unsplash.com/photo-1571197119282-7c4a31ff85db?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "بابا غنوج",
        imageUrl:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "تبولة",
        imageUrl:
          "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "فتوش",
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format",
      },

      // Breakfast Items
      {
        title: "فول مدمس",
        imageUrl:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "حمص بالطحينة",
        imageUrl:
          "https://images.unsplash.com/photo-1571197119282-7c4a31ff85db?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "لبنة وزيتون",
        imageUrl:
          "https://images.unsplash.com/photo-1560180286-85cf544a7be4?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "منقوشة زعتر",
        imageUrl:
          "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "عجة بقدونس",
        imageUrl:
          "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&h=300&fit=crop&auto=format",
      },

      // Desserts
      {
        title: "كنافة نابلسية",
        imageUrl:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "بقلاوة",
        imageUrl:
          "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "أم علي",
        imageUrl:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&auto=format",
      },

      // Beverages
      {
        title: "شاي بالنعناع",
        imageUrl:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "قهوة عربية",
        imageUrl:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "عصير ليمون بالنعناع",
        imageUrl:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop&auto=format",
      },
      {
        title: "لبن عيران",
        imageUrl:
          "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&auto=format",
      },

      // Default images for common meal types in case we have other meals
      {
        pattern: "pizza",
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "burger",
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "pasta",
        imageUrl:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "salad",
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "soup",
        imageUrl:
          "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "chicken",
        imageUrl:
          "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "beef",
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "fish",
        imageUrl:
          "https://images.unsplash.com/photo-1559847844-d05ce0e7e6e3?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "rice",
        imageUrl:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "bread",
        imageUrl:
          "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "dessert",
        imageUrl:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "coffee",
        imageUrl:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "tea",
        imageUrl:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format",
      },
      {
        pattern: "juice",
        imageUrl:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop&auto=format",
      },
    ];

    // Get all meals that don't have image URLs
    const mealsWithoutImages = await Meal.findAll({
      where: {
        imageUrl: null,
      },
    });

    console.log(`Found ${mealsWithoutImages.length} meals without images`);

    let updatedCount = 0;

    for (const meal of mealsWithoutImages) {
      let imageUrl = null;

      // Try to find exact title match first
      const exactMatch = mealImageMappings.find(
        (mapping) => mapping.title === meal.title
      );
      if (exactMatch) {
        imageUrl = exactMatch.imageUrl;
      } else {
        // Try to find pattern match based on meal title/description
        const title = meal.title.toLowerCase();
        const description = meal.description.toLowerCase();

        const patternMatch = mealImageMappings.find((mapping) => {
          if (mapping.pattern) {
            return (
              title.includes(mapping.pattern) ||
              description.includes(mapping.pattern)
            );
          }
          return false;
        });

        if (patternMatch) {
          imageUrl = patternMatch.imageUrl;
        } else {
          // Default food image based on category
          if (
            meal.category.includes("مشروبات") ||
            meal.category.includes("beverage")
          ) {
            imageUrl =
              "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format";
          } else if (
            meal.category.includes("حلويات") ||
            meal.category.includes("dessert")
          ) {
            imageUrl =
              "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&auto=format";
          } else if (
            meal.category.includes("إفطار") ||
            meal.category.includes("breakfast")
          ) {
            imageUrl =
              "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&auto=format";
          } else if (
            meal.category.includes("مشاوي") ||
            meal.category.includes("grill")
          ) {
            imageUrl =
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&auto=format";
          } else if (
            meal.category.includes("مقبلات") ||
            meal.category.includes("appetizer")
          ) {
            imageUrl =
              "https://images.unsplash.com/photo-1571197119282-7c4a31ff85db?w=400&h=300&fit=crop&auto=format";
          } else {
            // Generic delicious food image
            imageUrl =
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format";
          }
        }
      }

      if (imageUrl) {
        await meal.update({ imageUrl });
        console.log(`Updated image for meal: ${meal.title}`);
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} meals with image URLs`);
  } catch (error) {
    console.error("Error updating meals with images:", error);
  }
}

module.exports = { updateMealsWithImages };
