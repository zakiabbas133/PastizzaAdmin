import type { Deal } from "../types";

export const deals: Deal[] = [
  {
    id: "deal1",
    title: "Fire Duo",
    description:
      "Two large wood-fired pizzas of your choice plus a 1.5L craft lemonade. Built for the table.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80",
    price: 4200,
    originalPrice: 5200,
    badge: "Best Value",
    items: ["2× Large Pizza", "1.5L House Lemonade"],
    featured: true,
  },
  {
    id: "deal2",
    title: "Pasta Night",
    description:
      "Any two pastas and a shared order of truffle parmesan fries. Comfort, elevated.",
    image:
      "https://images.unsplash.com/photo-1644704001249-0d9dbb842238?w=900&q=80",
    price: 3800,
    originalPrice: 4800,
    badge: "Popular",
    items: ["2× Pasta", "Truffle Parmesan Fries"],
    featured: true,
  },
  {
    id: "deal3",
    title: "Ember Feast",
    description:
      "One large pizza, one pasta, loaded fries, and two soft drinks. The full experience.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80",
    price: 5500,
    originalPrice: 6800,
    badge: "Family",
    items: ["1× Large Pizza", "1× Pasta", "Loaded Fries", "2× Soft Drinks"],
    featured: true,
  },
  {
    id: "deal4",
    title: "Late Fire",
    description:
      "Available 11pm–2am only. One large pizza and any dessert at a night-owl price.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=80",
    price: 2400,
    originalPrice: 3200,
    badge: "Midnight",
    items: ["1× Large Pizza", "1× Dessert"],
  },
  {
    id: "deal5",
    title: "Burger & Fries",
    description:
      "Any smash burger with a side of truffle or loaded fries. Lunch or late night.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
    price: 2200,
    originalPrice: 2800,
    items: ["1× Burger", "1× Fries"],
  },
];
