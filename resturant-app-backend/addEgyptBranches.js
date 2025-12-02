const { v4: uuidv4 } = require("uuid");
const Branch = require("./models/branch");
const sequelize = require("./database/sequalize");

const egyptBranches = [
  {
    id: uuidv4(),
    name: "فرع التجمع الخامس",
    address: "شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة",
    phone: "+201234567890",
    latitude: 30.0254, // New Cairo coordinates
    longitude: 31.4782,
    city: "القاهرة",
    state: "القاهرة",
    country: "Egypt",
    zipCode: "11835",
    landmark: "بجوار مول كايرو فيستيفال سيتي",
    openingHours: {
      sunday: { open: "10:00", close: "23:00" },
      monday: { open: "10:00", close: "23:00" },
      tuesday: { open: "10:00", close: "23:00" },
      wednesday: { open: "10:00", close: "23:00" },
      thursday: { open: "10:00", close: "23:00" },
      friday: { open: "10:00", close: "00:00" },
      saturday: { open: "10:00", close: "00:00" },
    },
    isActive: true,
    meta: {
      deliveryAvailable: true,
      parkingAvailable: true,
      wifiAvailable: true,
      mapUrl: "https://maps.google.com/?q=30.0254,31.4782",
      description:
        "فرع حديث في قلب التجمع الخامس مع إطلالة مميزة وخدمة توصيل سريعة",
    },
  },
  {
    id: uuidv4(),
    name: "فرع الشيخ زايد",
    address: "مدينة الشيخ زايد، البوابة الثانية، الجيزة",
    phone: "+201987654321",
    latitude: 30.0778, // Sheikh Zayed coordinates
    longitude: 30.9717,
    city: "الجيزة",
    state: "الجيزة",
    country: "Egypt",
    zipCode: "12588",
    landmark: "بجوار مول العرب",
    openingHours: {
      sunday: { open: "09:00", close: "22:30" },
      monday: { open: "09:00", close: "22:30" },
      tuesday: { open: "09:00", close: "22:30" },
      wednesday: { open: "09:00", close: "22:30" },
      thursday: { open: "09:00", close: "22:30" },
      friday: { open: "09:00", close: "23:30" },
      saturday: { open: "09:00", close: "23:30" },
    },
    isActive: true,
    meta: {
      deliveryAvailable: true,
      parkingAvailable: true,
      wifiAvailable: true,
      terrace: true,
      mapUrl: "https://maps.google.com/?q=30.0778,30.9717",
      description:
        "فرع فاخر في الشيخ زايد مع تراس خارجي جميل ومنطقة عائلية مريحة",
    },
  },
];

async function addEgyptBranches() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("Database models synchronized.");

    // Add branches
    for (const branchData of egyptBranches) {
      // Check if branch already exists
      const existingBranch = await Branch.findOne({
        where: { name: branchData.name },
      });

      if (existingBranch) {
        console.log(`Branch "${branchData.name}" already exists, skipping...`);
        continue;
      }

      // Create new branch
      const newBranch = await Branch.create(branchData);
      console.log(`✅ Created branch: ${newBranch.name} (ID: ${newBranch.id})`);
    }

    console.log("\n🎉 All Egyptian branches added successfully!");

    // Display created branches
    console.log("\n📍 Created branches:");
    const branches = await Branch.findAll({
      where: { country: "Egypt" },
      attributes: ["id", "name", "city", "address", "phone"],
    });

    branches.forEach((branch) => {
      console.log(`- ${branch.name} in ${branch.city}`);
      console.log(`  Address: ${branch.address}`);
      console.log(`  Phone: ${branch.phone}`);
      console.log(`  ID: ${branch.id}\n`);
    });
  } catch (error) {
    console.error("❌ Error adding Egyptian branches:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
}

// Run the script
addEgyptBranches();
