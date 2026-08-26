import type { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  {
    id: "p1",
    name: "Margherita Classica",
    slug: "margherita-classica",
    category: "pizza",
    description:
      "San Marzano tomato, fior di latte, fresh basil, extra-virgin olive oil, and a touch of sea salt on our slow-fermented dough.",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900&q=80",
    featured: true,
    popular: true,
    variants: [
      { name: "Small", price: 650 },
      { name: "Medium", price: 1200 },
      { name: "Large", price: 1800 },
      { name: "XL", price: 2400 },
    ],
  },
  {
    id: "p2",
    name: "Pepperoni Inferno",
    slug: "pepperoni-inferno",
    category: "pizza",
    description:
      "Spicy cup-and-char pepperoni, smoked mozzarella, chili honey drizzle, and oregano on a blistered crust.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&q=80",
    featured: true,
    popular: true,
    variants: [
      { name: "Small", price: 650 },
      { name: "Medium", price: 1200 },
      { name: "Large", price: 1800 },
      { name: "XL", price: 2400 },
    ],
  },
  {
    id: "p3",
    name: "Truffle Forest",
    slug: "truffle-forest",
    category: "pizza",
    description:
      "Wild mushrooms, white truffle oil, fontina, thyme, and a soft-cooked egg finished at the pass.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=80",
    featured: true,
    variants: [
      { name: "Small", price: 650 },
      { name: "Medium", price: 1200 },
      { name: "Large", price: 1800 },
      { name: "XL", price: 2400 },
    ],
  },
  {
    id: "p4",
    name: "Prosciutto & Fig",
    slug: "prosciutto-fig",
    category: "pizza",
    description:
      "Paper-thin prosciutto, roasted figs, gorgonzola dolce, arugula, and aged balsamic reduction.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80",
    popular: true,
    variants: [
      { name: "Small", price: 650 },
      { name: "Medium", price: 1200 },
      { name: "Large", price: 1800 },
      { name: "XL", price: 2400 },
    ],
  },
  {
    id: "p5",
    name: "Four Cheese Al Forno",
    slug: "four-cheese-al-forno",
    category: "pizza",
    description:
      "Mozzarella, fontina, pecorino, and gorgonzola melted into a golden, bubbling canvas.",
    image:
      "https://images.unsplash.com/photo-1702716059239-385baacdabdc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { name: "Small", price: 650 },
      { name: "Medium", price: 1200 },
      { name: "Large", price: 1800 },
      { name: "XL", price: 2400 },
    ],
  },

  {
    id: "pa1",
    name: "Cacio e Pepe",
    slug: "cacio-e-pepe",
    category: "pasta",
    description:
      "Tonnarelli with pecorino romano, cracked black pepper, and a silken emulsion of pasta water.",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80",
    featured: true,
    popular: true,
    variants: [
      { name: "Regular", price: 599 },
      { name: "Large", price: 799 },
    ],
  },
  {
    id: "pa2",
    name: "Lobster Tagliatelle",
    slug: "lobster-tagliatelle",
    category: "pasta",
    description:
      "Hand-cut tagliatelle, sweet lobster, cherry tomatoes, chili, and a light shellfish bisque.",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80",
    featured: true,
    variants: [
      { name: "Regular", price: 599 },
      { name: "Large", price: 799 },
    ],
  },
  {
    id: "pa3",
    name: "Ragu Bolognese",
    slug: "ragu-bolognese",
    category: "pasta",
    description:
      "Slow-braised beef and pork ragu over pappardelle, finished with aged parmigiano.",
    image:
      "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=900&q=80",
    popular: true,
    variants: [
      { name: "Regular", price: 599 },
      { name: "Large", price: 799 },
    ],
  },

  {
    id: "b1",
    name: "Ember Smash Burger",
    slug: "ember-smash-burger",
    category: "burgers",
    description:
      "Double smash patty, American cheese, pickles, onion, special sauce, on a toasted brioche bun.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
    featured: true,
    popular: true,
    variants: [
      { name: "Single", price: 599 },
      { name: "Double", price: 899 },
    ],
  },
  {
    id: "b2",
    name: "Truffle Mushroom Burger",
    slug: "truffle-mushroom-burger",
    category: "burgers",
    description:
      "Angus patty, wild mushrooms, truffle aioli, aged cheddar, and arugula on brioche.",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=900&q=80",
    variants: [{ name: "Regular", price: 599 }],
  },

  {
    id: "f1",
    name: "Truffle Parmesan Fries",
    slug: "truffle-parmesan-fries",
    category: "fries",
    description:
      "Hand-cut fries tossed with white truffle oil, grated parmesan, and chives.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=80",
    popular: true,
    variants: [
      { name: "Regular", price: 299 },
      { name: "Large", price: 399 },
    ],
  },
  {
    id: "f2",
    name: "Loaded Ember Fries",
    slug: "loaded-ember-fries",
    category: "fries",
    description:
      "Crispy fries piled with pulled short rib, melted cheddar, jalapeños, and house aioli.",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=80",
    featured: true,
    variants: [
      { name: "Regular", price: 399 },
      { name: "Large", price: 499 },
    ],
  },

  {
    id: "r1",
    name: "Chicken Spin Roll",
    slug: "chicken-spin-roll",
    category: "rolls",
    description:
      "Tender chicken, melted mozzarella, peppers, and herbs wrapped in a golden, flaky roll.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&q=80",
    popular: true,
    variants: [
      { name: "Half", price: 699 },
      { name: "Full", price: 899 },
    ],
  },
  {
    id: "r2",
    name: "Pepperoni Cheese Roll",
    slug: "pepperoni-cheese-roll",
    category: "rolls",
    description:
      "Spicy pepperoni and stretchy mozzarella baked into a crisp, buttery roll with marinara on the side.",
    image:
      "https://images.unsplash.com/photo-1673238104201-00540ebda905?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { name: "Half", price: 699 },
      { name: "Full", price: 899 },
    ],
  },

  {
    id: "d1",
    name: "Tiramisu Al Forno",
    slug: "tiramisu-al-forno",
    category: "desserts",
    description:
      "Espresso-soaked ladyfingers, mascarpone cream, cocoa, and a hint of amaretto.",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=900&q=80",
    featured: true,
    popular: true,
    variants: [{ name: "Slice", price: 299 }],
  },
  {
    id: "d2",
    name: "Chocolate Lava Cake",
    slug: "chocolate-lava-cake",
    category: "desserts",
    description:
      "Warm dark chocolate cake with a molten center, served with vanilla gelato.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&q=80",
    variants: [{ name: "Individual", price: 299 }],
  },

  {
    id: "dr1",
    name: "House Lemonade",
    slug: "house-lemonade",
    category: "drinks",
    description:
      "Fresh-squeezed lemons, a touch of honey, and sparkling water over ice.",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=900&q=80",
    variants: [
      { name: "Glass", price: 150 },
      { name: "Pitcher", price: 300 },
    ],
  },
  {
    id: "dr2",
    name: "Blood Orange Spritz",
    slug: "blood-orange-spritz",
    category: "drinks",
    description:
      "Blood orange, sparkling water, a splash of bitters, and a rosemary sprig.",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=900&q=80",
    featured: true,
    variants: [{ name: "Glass", price: 150 }],
  },
  {
    id: "dr3",
    name: "Espresso Martini (NA)",
    slug: "espresso-martini-na",
    category: "drinks",
    description:
      "Rich espresso, vanilla, and a silky foam — zero alcohol, full ritual.",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&q=80",
    variants: [{ name: "Glass", price: 300 }],
  },
];
