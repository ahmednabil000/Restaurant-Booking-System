const { v4: uuidv4 } = require("uuid");
const {
  Meal,
  Tag,
  MealTag,
  Resturant,
  WorkingDay,
  Employee,
} = require("./models/associations");

async function createArabicMockData() {
  try {
    console.log("Creating Arabic mock data...");

    // Create Arabic food tags
    const arabicTags = [
      { title: "حار", bgColor: "#ff4444" }, // Spicy
      { title: "حلال", bgColor: "#00aa00" }, // Halal
      { title: "نباتي", bgColor: "#44aa44" }, // Vegetarian
      { title: "شعبي", bgColor: "#ff8800" }, // Popular/Traditional
      { title: "مشويات", bgColor: "#8B4513" }, // Grilled
      { title: "مقبلات", bgColor: "#9370DB" }, // Appetizers
      { title: "حلويات", bgColor: "#FFB6C1" }, // Desserts
      { title: "مشروبات", bgColor: "#4169E1" }, // Beverages
    ];

    // Insert tags (skip if already exists)
    for (const tag of arabicTags) {
      try {
        await Tag.findOrCreate({
          where: { title: tag.title },
          defaults: {
            id: uuidv4(),
            ...tag,
          },
        });
        console.log(`Tag processed: ${tag.title}`);
      } catch (error) {
        console.error(`Error creating tag ${tag.title}:`, error.message);
      }
    }

    console.log("Arabic tags created successfully.");

    // Create Arabic meals
    const arabicMeals = [
      // Main Dishes
      {
        title: "منسف أردني",
        description: "طبق تقليدي أردني مع لحم الضأن واللبن الجميد والأرز",
        price: 25.99,
        category: "الأطباق الرئيسية",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1574653163889-7b9c20dd2e45?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلال", "شعبي"],
      },
      {
        title: "كبسة دجاج",
        description: "أرز بالتوابل مع الدجاج المطبوخ على الطريقة الخليجية",
        price: 18.99,
        category: "الأطباق الرئيسية",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلال", "شعبي"],
      },
      {
        title: "مقلوبة باذنجان",
        description: "أرز مقلوب مع الباذنجان ولحم الضأن والخضار",
        price: 22.5,
        category: "الأطباق الرئيسية",
        type: "عشاء",
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلال", "شعبي"],
      },
      {
        title: "شاورما لحم",
        description: "لحم مشوي ملفوف في الخبز العربي مع الخضار والطحينة",
        price: 12.99,
        category: "الوجبات السريعة",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلال", "مشويات"],
      },
      {
        title: "فلافل",
        description: "كرات الحمص المقلية مع الخضار والطحينة",
        price: 8.99,
        category: "الوجبات السريعة",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1593504049359-74330189a345?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "شعبي"],
      },

      // Grilled Items
      {
        title: "مشكل مشاوي",
        description: "تشكيلة من الكباب والشيش طاووق والكفتة المشوية",
        price: 28.99,
        category: "المشاوي",
        type: "عشاء",
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلال", "مشويات"],
      },
      {
        title: "شيش طاووق",
        description: "قطع الدجاج المتبلة والمشوية على الفحم",
        price: 16.99,
        category: "المشاوي",
        type: "عشاء",
        imageUrl:
          "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلال", "مشويات"],
      },
      {
        title: "كباب حلبي",
        description: "كباب اللحم المتبل بالتوابل الحلبية المميزة",
        price: 19.99,
        category: "المشاوي",
        type: "عشاء",
        imageUrl:
          "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلال", "مشويات", "حار"],
      },

      // Appetizers
      {
        title: "حمص بطحينة",
        description: "حمص مسلوق ومهروس مع الطحينة وزيت الزيتون",
        price: 6.99,
        category: "المقبلات",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1571197119282-7c4a31ff85db?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "مقبلات"],
      },
      {
        title: "بابا غنوج",
        description: "سلطة الباذنجان المشوي مع الطحينة والثوم",
        price: 7.99,
        category: "المقبلات",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "مقبلات"],
      },
      {
        title: "تبولة",
        description: "سلطة البقدونس مع البندورة والبرغل وعصير الليمون",
        price: 8.99,
        category: "السلطات",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "مقبلات"],
      },
      {
        title: "فتوش",
        description: "سلطة الخضار المشكلة مع الخبز المحمص والسماق",
        price: 9.99,
        category: "السلطات",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "مقبلات"],
      },

      // Breakfast Items
      {
        title: "فول مدمس",
        description: "فول مطبوخ مع زيت الزيتون والطحينة والطماطم",
        price: 6.99,
        category: "الإفطار",
        type: "افطار",
        imageUrl:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "شعبي"],
      },
      {
        title: "حمص بالطحينة",
        description: "حمص مسلوق مع الطحينة وزيت الزيتون للإفطار",
        price: 5.99,
        category: "الإفطار",
        type: "افطار",
        imageUrl:
          "https://images.unsplash.com/photo-1571197119282-7c4a31ff85db?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "شعبي"],
      },
      {
        title: "لبنة وزيتون",
        description: "لبنة طازجة مع الزيتون الأخضر وزيت الزيتون",
        price: 7.99,
        category: "الإفطار",
        type: "افطار",
        imageUrl:
          "https://images.unsplash.com/photo-1560180286-85cf544a7be4?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["شعبي"],
      },
      {
        title: "منقوشة زعتر",
        description: "خبز مسطح مع الزعتر وزيت الزيتون",
        price: 4.99,
        category: "الإفطار",
        type: "افطار",
        imageUrl:
          "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["نباتي", "شعبي"],
      },
      {
        title: "عجة بقدونس",
        description: "عجة البيض مع البقدونس والبصل الأخضر",
        price: 8.99,
        category: "الإفطار",
        type: "افطار",
        imageUrl:
          "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["شعبي"],
      },

      // Desserts
      {
        title: "كنافة نابلسية",
        description: "حلوى شرقية بالجبن والشعيرية والقطر",
        price: 12.99,
        category: "الحلويات",
        type: "عشاء",
        imageUrl:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلويات"],
      },
      {
        title: "بقلاوة",
        description: "طبقات الفيلو مع المكسرات والعسل",
        price: 4.99,
        category: "الحلويات",
        type: "عشاء",
        imageUrl:
          "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلويات"],
      },
      {
        title: "أم علي",
        description: "حلوى باللبن والمكسرات وجوز الهند",
        price: 8.99,
        category: "الحلويات",
        type: "عشاء",
        imageUrl:
          "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["حلويات"],
      },

      // Beverages
      {
        title: "شاي بالنعناع",
        description: "شاي أحمر طازج بأوراق النعناع الطبيعية",
        price: 3.99,
        category: "المشروبات",
        type: "افطار",
        imageUrl:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["مشروبات"],
      },
      {
        title: "قهوة عربية",
        description: "قهوة عربية تقليدية بالحليب والهيل",
        price: 4.99,
        category: "المشروبات",
        type: "افطار",
        imageUrl:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["مشروبات"],
      },
      {
        title: "عصير ليمون بالنعناع",
        description: "عصير ليمون طازج مع النعناع والثلج",
        price: 5.99,
        category: "المشروبات",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["مشروبات", "نباتي"],
      },
      {
        title: "لبن عيران",
        description: "مشروب اللبن المملح التقليدي",
        price: 3.99,
        category: "المشروبات",
        type: "غذاء",
        imageUrl:
          "https://images.unsplash.com/photo-1571197119282-7c4a31ff85db?w=400&h=300&fit=crop",
        isAvailable: true,
        tags: ["مشروبات"],
      },
    ];

    // Insert meals and associate with tags
    let createdMealsCount = 0;
    for (const mealData of arabicMeals) {
      try {
        const { tags: tagNames, ...mealInfo } = mealData;

        // Create or find meal
        const [meal, created] = await Meal.findOrCreate({
          where: { title: mealInfo.title },
          defaults: {
            id: uuidv4(),
            ...mealInfo,
          },
        });

        if (created) {
          console.log(`Created meal: ${mealInfo.title}`);
          createdMealsCount++;

          // Associate tags
          for (const tagName of tagNames) {
            const tag = await Tag.findOne({ where: { title: tagName } });
            if (tag) {
              await MealTag.findOrCreate({
                where: { MealId: meal.id, TagId: tag.id },
                defaults: {
                  id: uuidv4(),
                  MealId: meal.id,
                  TagId: tag.id,
                },
              });
            } else {
              console.warn(`Tag not found: ${tagName}`);
            }
          }
        } else {
          console.log(`Meal already exists: ${mealInfo.title}`);
        }
      } catch (error) {
        console.error(`Error creating meal ${mealData.title}:`, error.message);
      }
    }

    console.log("Arabic mock data created successfully!");
    console.log(
      `Created ${createdMealsCount} new Arabic meals with ${arabicTags.length} tags.`
    );
  } catch (error) {
    console.error("Error creating Arabic mock data:", error);
  }
}

async function createRestaurantMockData() {
  try {
    console.log("Creating restaurant mock data...");

    // Create the main restaurant
    const restaurantData = {
      id: uuidv4(),
      name: "مطعم الأصالة العربية",
      tablesCount: 15,
      address: "شارع الملك عبدالله، وسط البلد، عمان، الأردن",
      phone: "+962-6-123-4567",
      email: "info@alasala-restaurant.com",
      description:
        "مطعم عربي أصيل يقدم أشهى المأكولات التقليدية والحديثة في أجواء راقية ومريحة. نفتخر بتقديم أطباق محضرة بعناية من أجود المكونات الطازجة.",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      cuisine: "عربي / شرق أوسطي",
      isActive: true,
      rating: 4.7,
      priceRange: "$$",
    };

    const [restaurant, created] = await Resturant.findOrCreate({
      where: { name: restaurantData.name },
      defaults: restaurantData,
    });

    if (created) {
      console.log("Restaurant created successfully:", restaurant.name);
    } else {
      console.log("Restaurant already exists:", restaurant.name);
    }

    // Create working days
    const workingDaysData = [
      { name: "الأحد", startHour: "09:00", endHour: "23:00", isActive: true }, // Sunday
      { name: "الإثنين", startHour: "09:00", endHour: "23:00", isActive: true }, // Monday
      {
        name: "الثلاثاء",
        startHour: "09:00",
        endHour: "23:00",
        isActive: true,
      }, // Tuesday
      {
        name: "الأربعاء",
        startHour: "09:00",
        endHour: "23:00",
        isActive: true,
      }, // Wednesday
      { name: "الخميس", startHour: "09:00", endHour: "23:00", isActive: true }, // Thursday
      { name: "الجمعة", startHour: "14:00", endHour: "23:30", isActive: true }, // Friday - prayer time
      { name: "السبت", startHour: "09:00", endHour: "23:00", isActive: true }, // Saturday
    ];

    for (const dayData of workingDaysData) {
      const [workingDay, dayCreated] = await WorkingDay.findOrCreate({
        where: {
          resturantId: restaurant.id,
          name: dayData.name,
        },
        defaults: {
          id: uuidv4(),
          ...dayData,
          resturantId: restaurant.id,
        },
      });

      if (dayCreated) {
        console.log(`Working day created: ${dayData.name}`);
      }
    }

    // Create employees
    const employeesData = [
      {
        fullName: "أحمد محمد الخطيب",
        job: "Manager",
        email: "ahmed.khatib@alasala.com",
        phone: "+962-79-123-4567",
        birthDay: "1985-03-15",
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        salary: 1200.0,
        hireDate: "2020-01-15",
        isActive: true,
      },
      {
        fullName: "فاطمة علي السلمان",
        job: "Chef",
        email: "fatima.salman@alasala.com",
        phone: "+962-77-234-5678",
        birthDay: "1990-07-22",
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
        salary: 900.0,
        hireDate: "2021-03-01",
        isActive: true,
      },
      {
        fullName: "محمد عبدالله النجار",
        job: "Sous Chef",
        email: "mohammed.najjar@alasala.com",
        phone: "+962-78-345-6789",
        birthDay: "1988-11-08",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
        salary: 750.0,
        hireDate: "2021-06-15",
        isActive: true,
      },
      {
        fullName: "سارة خالد المومني",
        job: "Waitress",
        email: "sara.momani@alasala.com",
        phone: "+962-79-456-7890",
        birthDay: "1995-01-30",
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
        salary: 450.0,
        hireDate: "2022-02-01",
        isActive: true,
      },
      {
        fullName: "عمر يوسف الزعبي",
        job: "Waiter",
        email: "omar.zoubi@alasala.com",
        phone: "+962-77-567-8901",
        birthDay: "1993-09-12",
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        salary: 450.0,
        hireDate: "2022-05-10",
        isActive: true,
      },
      {
        fullName: "ليلى أحمد الحمود",
        job: "Host",
        email: "layla.hammoud@alasala.com",
        phone: "+962-78-678-9012",
        birthDay: "1996-04-18",
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
        salary: 400.0,
        hireDate: "2022-08-20",
        isActive: true,
      },
      {
        fullName: "خالد سمير العبدلي",
        job: "Cook",
        email: "khalid.abdali@alasala.com",
        phone: "+962-79-789-0123",
        birthDay: "1992-12-05",
        imageUrl:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
        salary: 600.0,
        hireDate: "2021-11-01",
        isActive: true,
      },
      {
        fullName: "نور الدين قاسم",
        job: "Kitchen Assistant",
        email: "nour.qasem@alasala.com",
        phone: "+962-77-890-1234",
        birthDay: "1998-06-25",
        imageUrl:
          "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&h=300&fit=crop&crop=face",
        salary: 350.0,
        hireDate: "2023-01-15",
        isActive: true,
      },
    ];

    let createdEmployeesCount = 0;
    for (const empData of employeesData) {
      const [employee, empCreated] = await Employee.findOrCreate({
        where: {
          email: empData.email,
        },
        defaults: {
          id: uuidv4(),
          ...empData,
          resturantId: restaurant.id,
        },
      });

      if (empCreated) {
        createdEmployeesCount++;
        console.log(`Employee created: ${empData.fullName}`);
      }
    }

    console.log("Restaurant mock data created successfully!");
    console.log(`Restaurant: ${restaurant.name}`);
    console.log(`Working days: 7 days configured`);
    console.log(`Employees: ${createdEmployeesCount} new employees created`);
  } catch (error) {
    console.error("Error creating restaurant mock data:", error);
  }
}
// Create mock relationships between meals and tags
const createMockMealTagRelationships = async () => {
  try {
    console.log("Creating mock meal-tag relationships...");

    // Get all existing meals and tags
    const meals = await Meal.findAll({
      attributes: ["id", "title", "category"],
    });
    const tags = await Tag.findAll({ attributes: ["id", "title"] });

    if (meals.length === 0) {
      console.log("No meals found. Please create meals first.");
      return;
    }

    if (tags.length === 0) {
      console.log("No tags found. Please create tags first.");
      return;
    }

    // Clear existing relationships
    await MealTag.destroy({ where: {} });

    let createdRelationships = 0;
    const relationshipsToCreate = [];

    // Create smart relationships based on meal and tag content
    for (const meal of meals) {
      const mealTitle = meal.title.toLowerCase();
      const mealCategory = meal.category ? meal.category.toLowerCase() : "";

      for (const tag of tags) {
        const tagTitle = tag.title.toLowerCase();
        let shouldAssociate = false;

        // Smart association logic
        if (tagTitle.includes("حار") || tagTitle.includes("spicy")) {
          if (
            mealTitle.includes("حار") ||
            mealTitle.includes("spicy") ||
            mealTitle.includes("فلفل")
          ) {
            shouldAssociate = true;
          }
        }

        if (tagTitle.includes("نباتي") || tagTitle.includes("vegetarian")) {
          if (
            mealTitle.includes("نباتي") ||
            mealTitle.includes("vegetarian") ||
            mealTitle.includes("سلطة") ||
            mealTitle.includes("salad") ||
            mealTitle.includes("خضار") ||
            mealTitle.includes("vegetable")
          ) {
            shouldAssociate = true;
          }
        }

        if (tagTitle.includes("حلال") || tagTitle.includes("halal")) {
          // Most meals can be halal except pork dishes
          if (!mealTitle.includes("pork") && !mealTitle.includes("خنزير")) {
            shouldAssociate = Math.random() > 0.3; // 70% chance
          }
        }

        if (tagTitle.includes("مشويات") || tagTitle.includes("grilled")) {
          if (
            mealTitle.includes("مشوي") ||
            mealTitle.includes("grilled") ||
            mealTitle.includes("شواء") ||
            mealTitle.includes("bbq")
          ) {
            shouldAssociate = true;
          }
        }

        if (tagTitle.includes("مقبلات") || tagTitle.includes("appetizer")) {
          if (
            mealCategory.includes("appetizer") ||
            mealTitle.includes("مقبل") ||
            mealTitle.includes("starter") ||
            mealTitle.includes("حمص") ||
            mealTitle.includes("hummus")
          ) {
            shouldAssociate = true;
          }
        }

        if (tagTitle.includes("حلويات") || tagTitle.includes("dessert")) {
          if (
            mealCategory.includes("dessert") ||
            mealTitle.includes("حلو") ||
            mealTitle.includes("dessert") ||
            mealTitle.includes("كيك") ||
            mealTitle.includes("cake") ||
            mealTitle.includes("آيس كريم")
          ) {
            shouldAssociate = true;
          }
        }

        if (tagTitle.includes("مشروبات") || tagTitle.includes("beverage")) {
          if (
            mealCategory.includes("beverage") ||
            mealTitle.includes("عصير") ||
            mealTitle.includes("juice") ||
            mealTitle.includes("شاي") ||
            mealTitle.includes("قهوة") ||
            mealTitle.includes("coffee")
          ) {
            shouldAssociate = true;
          }
        }

        if (tagTitle.includes("شعبي") || tagTitle.includes("popular")) {
          // Random popular items
          if (Math.random() > 0.6) {
            // 40% chance
            shouldAssociate = true;
          }
        }

        // Add some random associations for variety (10% chance)
        if (!shouldAssociate && Math.random() > 0.9) {
          shouldAssociate = true;
        }

        if (shouldAssociate) {
          relationshipsToCreate.push({
            MealId: meal.id,
            TagId: tag.id,
          });
        }
      }
    }

    // Bulk create relationships
    if (relationshipsToCreate.length > 0) {
      await MealTag.bulkCreate(relationshipsToCreate);
      createdRelationships = relationshipsToCreate.length;
    }

    console.log(`Created ${createdRelationships} meal-tag relationships`);
    console.log(`Mock meal-tag relationships created successfully!`);
    console.log(
      `Meals: ${meals.length}, Tags: ${tags.length}, Relationships: ${createdRelationships}`
    );
  } catch (error) {
    console.error("Error creating mock meal-tag relationships:", error);
    throw error;
  }
};

module.exports = {
  createArabicMockData,
  createMockMealTagRelationships,
  createRestaurantMockData,
};
