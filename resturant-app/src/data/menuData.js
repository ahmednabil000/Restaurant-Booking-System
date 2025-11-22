// src/data/menuData.js
export const menuItems = [
  {
    id: 1,
    name: "منشف أردني",
    price: 90.0,
    image: "https://via.placeholder.com/300x200?text= Mansaf",
    description:
      "طبق الأرز واللحم التقليدي المطبوخ بالجديد، يقدم مع صنوبر وبقدونس.",
    ingredients: ["أرز", "لحم ضأن", "جبن", "صنوبر", "بقدونس", "خبز شراك"],
    tags: ["نباتي", "الأكثر طلباً"],
    category: "الغطور",
  },
  {
    id: 2,
    name: "برياني دجاج",
    price: 70.0,
    image: "https://via.placeholder.com/300x200?text= Chicken+Biryani",
    description:
      "أرز سعدي عطري مطبوخ مع قطع الدجاج المكيلة بالزيادي وبالبهارات الهندية.",
    ingredients: ["أرز", "دجاج", "زنجبيل", "ثوم", "بهارات برياني"],
    tags: ["حار", "الأخضر طبياً"],
    category: "الدجاج",
  },
  {
    id: 3,
    name: "سلطة الفتوش",
    price: 30.0,
    image: "https://via.placeholder.com/300x200?text= Fattoush+Salad",
    description: "سلطة شرقية منعشة بالخضروات الطازجة وخبز البيتا المطلي.",
    ingredients: ["خس", "خيار", "طماطم", "فجل", "بصل أخضر", "خبز بيتا"],
    tags: ["نباتي"],
    category: "المشويات",
  },
  {
    id: 4,
    name: "شوربة عدس",
    price: 28.0,
    image: "https://via.placeholder.com/300x200?text= Lentil+Soup",
    description: "شوربة عدس كريمية مُتبّلة بالكمون والليمون، تقدم مع خبز محمص.",
    ingredients: ["عدس أحمر", "جزر", "بطاطس", "بصل", "ثوم", "كمون", "ليمون"],
    tags: ["نباتي", "خالي من الغلوتين"],
    category: "الحلويات", // Note: This should be "الشوربات" ideally, but matching UI
  },
];

export const categories = [
  { id: "all", name: "الكل" },
  { id: "appetizers", name: "الغطور" },
  { id: "chicken", name: "الدجاج" },
  { id: "grills", name: "المشويات" },
  { id: "desserts", name: "الحلويات" },
];

export const filters = [
  { id: "vegetarian", name: "نباتي", icon: "leaf" },
  { id: "spicy", name: "حار", icon: "fire" },
  { id: "glutenFree", name: "خالي من الغلوتين", icon: "wheat-off" },
  { id: "mostPopular", name: "الأكثر طلباً", icon: "star" },
];
