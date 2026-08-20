// Mock API service for demonstration
// This can easily be replaced with real API calls

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Users
  users: {
    getList: async (params = {}) => {
      await sleep(500);
      return {
        data: [
          { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
          { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Editor', status: 'Active', joinDate: '2024-01-14' },
          { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'Viewer', status: 'Inactive', joinDate: '2024-01-13' },
        ],
        total: 3,
      };
    },
    get: async (id) => {
      await sleep(300);
      return {
        id,
        name: 'John Smith',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active',
      };
    },
    create: async (data) => {
      await sleep(500);
      return { id: Date.now(), ...data };
    },
    update: async (id, data) => {
      await sleep(500);
      return { id, ...data };
    },
    delete: async (id) => {
      await sleep(500);
      return { success: true };
    },
  },

  // Orders
  orders: {
    getList: async (params = {}) => {
      await sleep(500);
      return {
        data: [
          { id: 'ORD-10294', customer: 'John Smith', product: 'Product A', amount: '$2,450', status: 'Completed', date: '2024-01-15' },
          { id: 'ORD-10293', customer: 'Sarah Williams', product: 'Product B', amount: '$1,890', status: 'Pending', date: '2024-01-14' },
        ],
        total: 2,
      };
    },
  },

  // Products
  products: {
    getList: async (params = {}) => {
      await sleep(500);
      return {
        data: [
          { id: 1, name: 'Product A', category: 'Electronics', price: '$299', stock: 45 },
          { id: 2, name: 'Product B', category: 'Accessories', price: '$49', stock: 120 },
        ],
        total: 2,
      };
    },
  },

  // Analytics
  analytics: {
    getDashboard: async () => {
      await sleep(800);
      return {
        revenue: 128430,
        orders: 1240,
        users: 8542,
        conversionRate: 3.2,
      };
    },
  },
};

export const menuItems = [
  {
    id: "burrata-garden",
    name: "Burrata & Heirloom Garden",
    category: "Starters",
    price: "$18",
    dealPrice: "$14",
    hotDeal: true,
    shortDescription:
      "Creamy burrata with seasonal heirloom tomatoes and basil oil.",
    description:
      "Hand-pulled burrata resting on a canvas of heirloom tomatoes, finished with aged balsamic reduction, Sicilian olive oil, and fresh basil harvested daily from our rooftop garden.",
    ingredients: [
      "Burrata",
      "Heirloom tomatoes",
      "Basil oil",
      "Aged balsamic",
      "Maldon salt",
    ],
    allergens: ["Dairy"],
    image:
      "https://images.unsplash.com/photo-1580638149300-65f0b9e8fbff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1580638149300-65f0b9e8fbff?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b8?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600507843537-38c1ec357ebb?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Popular"],
    chefRecommendation: "Pair with our Vermentino di Sardegna.",
    featured: true,
  },
  {
    id: "truffle-arancini",
    name: "Truffle Arancini",
    category: "Starters",
    price: "$16",
    shortDescription:
      "Crispy saffron risotto spheres with black truffle aioli.",
    description:
      "Golden saffron-infused risotto balls, delicately fried until crisp, served with house-made black truffle aioli and micro herbs.",
    ingredients: [
      "Arborio rice",
      "Saffron",
      "Black truffle",
      "Parmigiano",
      "Panko",
    ],
    allergens: ["Dairy", "Gluten", "Eggs"],
    image:
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587103514545-63ac13b88fd3?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533139502113-6f3ee44c3467?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568403949066-1b2c5ee32c0a?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Chef's Choice"],
  },
  {
    id: "octopus-char",
    name: "Charred Octopus",
    category: "Starters",
    price: "$22",
    shortDescription: "Slow-braised octopus with smoked paprika and lemon.",
    description:
      "Tender octopus braised for hours, then charred over open flame. Served with fingerling potatoes, smoked paprika emulsion, and preserved lemon.",
    ingredients: [
      "Octopus",
      "Fingerling potatoes",
      "Smoked paprika",
      "Preserved lemon",
    ],
    allergens: ["Shellfish"],
    image:
      "https://plus.unsplash.com/premium_photo-1719530305720-6d38151dafac?q=80&w=1171&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: [],
  },
  {
    id: "wild-mushroom-carpaccio",
    name: "Wild Mushroom Carpaccio",
    category: "Starters",
    price: "$15",
    shortDescription: "Paper-thin mushrooms with truffle vinaigrette.",
    description:
      "Delicate slices of foraged mushrooms dressed in white truffle vinaigrette, topped with shaved pecorino and cracked pepper.",
    ingredients: [
      "Mixed wild mushrooms",
      "Truffle vinaigrette",
      "Pecorino",
      "Arugula",
    ],
    allergens: ["Dairy"],
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590080876352-cd97e57b1b3e?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624690206400-cfb2665c3342?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536621533223-fca106bab47f?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: [],
  },
  {
    id: "truffle-risotto",
    name: "Truffle Risotto",
    category: "Main Course",
    price: "$34",
    dealPrice: "$28",
    hotDeal: true,
    shortDescription: "Carnaroli rice with black truffle and aged Parmigiano.",
    description:
      "Silky Carnaroli risotto finished tableside with shaved black truffle, 36-month Parmigiano-Reggiano, and a whisper of butter.",
    ingredients: [
      "Carnaroli rice",
      "Black truffle",
      "Parmigiano-Reggiano",
      "White wine",
      "Butter",
    ],
    allergens: ["Dairy"],
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e4e9a?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1482099772064-9a15b5338da6?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Chef's Choice", "Popular"],
    chefRecommendation: "Our signature dish — order with confidence.",
    featured: true,
  },
  {
    id: "wood-fired-margherita",
    name: "Wood-Fired Margherita",
    category: "Main Course",
    price: "$24",
    dealPrice: "$19",
    hotDeal: true,
    shortDescription: "San Marzano tomatoes, fior di latte, fresh basil.",
    description:
      "Our namesake pastizza — a 72-hour fermented dough baked in our Acunto oven at 900°F, topped with DOP San Marzano, fior di latte, and basil.",
    ingredients: [
      "San Marzano tomatoes",
      "Fior di latte",
      "Basil",
      "Extra virgin olive oil",
    ],
    allergens: ["Dairy", "Gluten"],
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571407614592-e2b4e9e0c0d0?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527804050349-3bda9b47fdf7?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Popular"],
    featured: true,
  },
  {
    id: "braised-short-rib",
    name: "Braised Short Rib",
    category: "Main Course",
    price: "$38",
    shortDescription: "12-hour braised rib with polenta and gremolata.",
    description:
      "Beef short rib braised for twelve hours in Barolo wine, served over creamy polenta with bright gremolata and roasted root vegetables.",
    ingredients: [
      "Beef short rib",
      "Barolo wine",
      "Polenta",
      "Gremolata",
      "Root vegetables",
    ],
    allergens: ["Dairy"],
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1432225097387-0b0e3d5f9bf3?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1432195969906-5ebcb74a9e1e?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1432899573221-8d8ff9e8ba48?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: [],
  },
  {
    id: "lobster-linguine",
    name: "Lobster Linguine",
    category: "Main Course",
    price: "$42",
    shortDescription: "Fresh lobster with cherry tomatoes and saffron butter.",
    description:
      "Half Maine lobster tossed with house-made linguine, cherry tomatoes, chili, and saffron-infused butter — a celebration of the sea.",
    ingredients: [
      "Maine lobster",
      "House linguine",
      "Cherry tomatoes",
      "Saffron butter",
      "Garlic",
    ],
    allergens: ["Shellfish", "Gluten", "Dairy"],
    image:
      "https://images.unsplash.com/photo-1665109896200-716653ed827b?q=80&w=1170&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473093295203-cad00df16e50?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617883383717-7ba1ddd62b77?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Chef's Choice"],
  },
  {
    id: "tiramisu-classico",
    name: "Tiramisu Classico",
    category: "Desserts",
    price: "$14",
    shortDescription: "Espresso-soaked ladyfingers with mascarpone cloud.",
    description:
      "Our nonna's recipe — layers of espresso-dipped savoiardi and whipped mascarpone, dusted with Valrhona cocoa.",
    ingredients: [
      "Mascarpone",
      "Espresso",
      "Savoiardi",
      "Marsala wine",
      "Cocoa",
    ],
    allergens: ["Dairy", "Gluten", "Eggs"],
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586080876963-8a8daffa60d4?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567720590868-78206b8e7c3f?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Popular"],
  },
  {
    id: "panna-cotta",
    name: "Vanilla Bean Panna Cotta",
    category: "Desserts",
    price: "$12",
    shortDescription: "Silken panna cotta with macerated berries.",
    description:
      "Madagascar vanilla panna cotta with a mirror of macerated seasonal berries and a touch of aged balsamic.",
    ingredients: ["Cream", "Madagascar vanilla", "Mixed berries", "Gelatin"],
    allergens: ["Dairy"],
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624353365286-3216c0ae4b3e?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488520494047-921916979fe1?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551024506-5623ee06fdf4?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: [],
  },
  {
    id: "amaretto-semifreddo",
    name: "Amaretto Semifreddo",
    category: "Desserts",
    price: "$13",
    shortDescription: "Frozen almond cream with amaretti crumble.",
    description:
      "Light and airy semifreddo infused with amaretto, crowned with crushed amaretti cookies and toasted almonds.",
    ingredients: ["Cream", "Amaretto", "Amaretti cookies", "Almonds", "Eggs"],
    allergens: ["Dairy", "Eggs", "Nuts", "Gluten"],
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470571509603-39414d93acd1?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585080199519-35b4af4412de?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624353365286-3216c0ae4b3e?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: [],
  },
  {
    id: "negroni-sbagliato",
    name: "Negroni Sbagliato",
    category: "Drinks",
    price: "$16",
    shortDescription: "Campari, sweet vermouth, prosecco.",
    description:
      'The beloved "mistaken" Negroni — Campari and sweet vermouth topped with Prosecco di Valdobbiadene. Effervescent and bittersweet.',
    ingredients: ["Campari", "Sweet vermouth", "Prosecco", "Orange peel"],
    allergens: [],
    image:
      "https://images.unsplash.com/photo-1625166447326-bd5085a6ec32?q=80&w=1170&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1625166447326-bd5085a6ec32?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdf?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561370?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561370?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625166447326-bd5085a6ec32?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Popular"],
  },
  {
    id: "barolo-riserva",
    name: "Barolo Riserva 2018",
    category: "Drinks",
    price: "$28",
    shortDescription: "Glass of Barolo from Piedmont hills.",
    description:
      "A structured Barolo Riserva with notes of cherry, rose, and tar — the perfect companion to our braised dishes.",
    ingredients: ["Nebbiolo grapes"],
    allergens: ["Sulfites"],
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553361371-9fbc6fca4487?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553361371-9fbc6fca4487?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608270861620-7d9ec85b99d2?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: [],
  },
  {
    id: "espresso-roman",
    name: "Espresso Roman Style",
    category: "Drinks",
    price: "$6",
    shortDescription: "Double shot, Roman tradition.",
    description:
      "Pull of our house blend — a dark roast from Naples, served in the Roman tradition with a glass of sparkling water.",
    ingredients: ["Espresso blend"],
    allergens: [],
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b8d0?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b8d0?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506619216547-f1ef5ff89f51?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: [],
  },
  {
    id: "pastizza-tasting",
    name: "Pastizza Tasting Menu",
    category: "Chef's Specials",
    price: "$95",
    shortDescription: "Seven courses curated by Chef Alessandro.",
    description:
      "An immersive journey through our kitchen — seven courses showcasing seasonal ingredients, wood-fired pastizza, and a finale chosen by Chef Alessandro each evening.",
    ingredients: ["Seasonal selection"],
    allergens: ["Varies — please inquire"],
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495195134817-aeb325be8e5e?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577003833535-08175e352556?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Chef's Choice", "Popular"],
    chefRecommendation: "Reserve 48 hours in advance. Wine pairing available.",
    featured: true,
  },
  {
    id: "truffle-pastizza",
    name: "Truffle & Burrata Pastizza",
    category: "Chef's Specials",
    price: "$32",
    shortDescription: "White pastizza with black truffle shavings.",
    description:
      "Our signature white pastizza — fior di latte, burrata, and generous shavings of black truffle, finished with honey drizzle and micro arugula.",
    ingredients: [
      "72-hour dough",
      "Burrata",
      "Black truffle",
      "Honey",
      "Fior di latte",
    ],
    allergens: ["Dairy", "Gluten"],
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580638149300-65f0b9e8fbff?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1170&auto=format&fit=crop",
    ],
    tags: ["Chef's Choice"],
    featured: true,
  },
];

export default mockApi;
