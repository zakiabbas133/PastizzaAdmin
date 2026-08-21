import {
  collection,
  doc,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const initializeFirestore = async () => {
  const batch = writeBatch(db);

  const categories = [
    {
      id: "appetizers",
      name: "Appetizers",
      slug: "appetizers",
      description: "Starters and small bites",
      image: "",
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "main-course",
      name: "Main Course",
      slug: "main-course",
      description: "Main dishes and meals",
      image: "",
      isActive: true,
      sortOrder: 2,
    },
    {
      id: "burgers",
      name: "Burgers",
      slug: "burgers",
      description: "Freshly prepared burgers",
      image: "",
      isActive: true,
      sortOrder: 3,
    },
    {
      id: "pizza",
      name: "Pizza",
      slug: "pizza",
      description: "Freshly baked pizzas",
      image: "",
      isActive: true,
      sortOrder: 4,
    },
    {
      id: "pasta",
      name: "Pasta",
      slug: "pasta",
      description: "Pasta dishes",
      image: "",
      isActive: true,
      sortOrder: 5,
    },
    {
      id: "salads",
      name: "Salads",
      slug: "salads",
      description: "Fresh salads and healthy options",
      image: "",
      isActive: true,
      sortOrder: 6,
    },
    {
      id: "desserts",
      name: "Desserts",
      slug: "desserts",
      description: "Sweet dishes and desserts",
      image: "",
      isActive: true,
      sortOrder: 7,
    },
    {
      id: "beverages",
      name: "Beverages",
      slug: "beverages",
      description: "Hot and cold beverages",
      image: "",
      isActive: true,
      sortOrder: 8,
    },
  ];

  const allergens = [
    {
      id: "gluten",
      name: "Gluten",
      slug: "gluten",
      isActive: true,
    },
    {
      id: "milk",
      name: "Milk",
      slug: "milk",
      isActive: true,
    },
    {
      id: "eggs",
      name: "Eggs",
      slug: "eggs",
      isActive: true,
    },
    {
      id: "peanuts",
      name: "Peanuts",
      slug: "peanuts",
      isActive: true,
    },
    {
      id: "tree-nuts",
      name: "Tree Nuts",
      slug: "tree-nuts",
      isActive: true,
    },
    {
      id: "soy",
      name: "Soy",
      slug: "soy",
      isActive: true,
    },
    {
      id: "fish",
      name: "Fish",
      slug: "fish",
      isActive: true,
    },
    {
      id: "shellfish",
      name: "Shellfish",
      slug: "shellfish",
      isActive: true,
    },
    {
      id: "sesame",
      name: "Sesame",
      slug: "sesame",
      isActive: true,
    },
  ];

  const ingredients = [
    {
      id: "burrata",
      name: "Burrata",
      slug: "burrata",
      isActive: true,
    },
    {
      id: "heirloom-tomatoes",
      name: "Heirloom Tomatoes",
      slug: "heirloom-tomatoes",
      isActive: true,
    },
    {
      id: "basil",
      name: "Fresh Basil",
      slug: "fresh-basil",
      isActive: true,
    },
    {
      id: "mozzarella",
      name: "Mozzarella",
      slug: "mozzarella",
      isActive: true,
    },
    {
      id: "parmesan",
      name: "Parmesan",
      slug: "parmesan",
      isActive: true,
    },
    {
      id: "black-truffle",
      name: "Black Truffle",
      slug: "black-truffle",
      isActive: true,
    },
    {
      id: "mushrooms",
      name: "Wild Mushrooms",
      slug: "wild-mushrooms",
      isActive: true,
    },
    {
      id: "garlic",
      name: "Garlic",
      slug: "garlic",
      isActive: true,
    },
    {
      id: "olive-oil",
      name: "Extra Virgin Olive Oil",
      slug: "extra-virgin-olive-oil",
      isActive: true,
    },
    {
      id: "balsamic-vinegar",
      name: "Balsamic Vinegar",
      slug: "balsamic-vinegar",
      isActive: true,
    },
    {
      id: "arugula",
      name: "Fresh Arugula",
      slug: "fresh-arugula",
      isActive: true,
    },
    {
      id: "honey",
      name: "Honey",
      slug: "honey",
      isActive: true,
    },
    {
      id: "chicken-breast",
      name: "Chicken Breast",
      slug: "chicken-breast",
      isActive: true,
    },
    {
      id: "beef-tenderloin",
      name: "Beef Tenderloin",
      slug: "beef-tenderloin",
      isActive: true,
    },
    {
      id: "salmon",
      name: "Fresh Salmon",
      slug: "fresh-salmon",
      isActive: true,
    },
    {
      id: "shrimp",
      name: "Shrimp",
      slug: "shrimp",
      isActive: true,
    },
    {
      id: "onion",
      name: "Red Onion",
      slug: "red-onion",
      isActive: true,
    },
    {
      id: "bell-pepper",
      name: "Bell Pepper",
      slug: "bell-pepper",
      isActive: true,
    },
    {
      id: "potatoes",
      name: "Potatoes",
      slug: "potatoes",
      isActive: true,
    },
    {
      id: "cream",
      name: "Heavy Cream",
      slug: "heavy-cream",
      isActive: true,
    },
    {
      id: "lemon",
      name: "Fresh Lemon",
      slug: "fresh-lemon",
      isActive: true,
    },
    {
      id: "sea-salt",
      name: "Sea Salt",
      slug: "sea-salt",
      isActive: true,
    },
    {
      id: "black-pepper",
      name: "Black Pepper",
      slug: "black-pepper",
      isActive: true,
    },
  ];

  const tags = [
    {
      id: "chefs-choice",
      name: "Chef's Choice",
      slug: "chefs-choice",
      isActive: true,
    },
    {
      id: "popular",
      name: "Popular",
      slug: "popular",
      isActive: true,
    },
    {
      id: "best-seller",
      name: "Best Seller",
      slug: "best-seller",
      isActive: true,
    },
    {
      id: "new",
      name: "New",
      slug: "new",
      isActive: true,
    },
    {
      id: "spicy",
      name: "Spicy",
      slug: "spicy",
      isActive: true,
    },
    {
      id: "vegetarian",
      name: "Vegetarian",
      slug: "vegetarian",
      isActive: true,
    },
    {
      id: "vegan",
      name: "Vegan",
      slug: "vegan",
      isActive: true,
    },
    {
      id: "gluten-free",
      name: "Gluten Free",
      slug: "gluten-free",
      isActive: true,
    },
    {
      id: "limited-time",
      name: "Limited Time",
      slug: "limited-time",
      isActive: true,
    },
  ];

  const mainMenu = {
    id: "main-menu",
    name: "Main Menu",
    description: "Our main restaurant menu",
    isActive: true,
  };

  const addIfMissing = async (collectionName, items) => {
    const snapshot = await getDocs(collection(db, collectionName));

    const existingIds = new Set(
      snapshot.docs.map((document) => document.id)
    );

    items.forEach((item) => {
      if (!existingIds.has(item.id)) {
        const ref = doc(db, collectionName, item.id);

        batch.set(ref, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    });
  };

  await addIfMissing("categories", categories);
  await addIfMissing("allergens", allergens);
  await addIfMissing("ingredients", ingredients);
  await addIfMissing("tags", tags);

  const menuRef = doc(db, "menus", mainMenu.id);
  const menuSnapshot = await getDocs(collection(db, "menus"));
  const menuExists = menuSnapshot.docs.some(
    (document) => document.id === mainMenu.id
  );

  if (!menuExists) {
    batch.set(menuRef, {
      ...mainMenu,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
};