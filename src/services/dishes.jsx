import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const getDishes = async () => {
  try {
    const dishesRef = collection(db, "dishes");

    const snapshot = await getDocs(dishesRef);

    const dishes = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    return {
      success: true,
      data: dishes,
    };
  } catch (error) {
    console.error("Error fetching dishes:", error);

    return {
      success: false,
      data: [],
      error: error.message || "Failed to fetch dishes.",
    };
  }
};

export const addDish = async (dish) => {
  try {
    // Check if a dish with the same name already exists
    const dishesRef = collection(db, "dishes");

    const duplicateQuery = query(
      dishesRef,
      where("name", "==", dish.name.trim())
    );

    const duplicateSnapshot = await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {
      throw new Error(
        `A dish named "${dish.name}" already exists. Please use a different name.`
      );
    }

    // Create the new dish
    const dishRef = doc(db, "dishes", dish.id);

    await setDoc(dishRef, {
      name: dish.name.trim(),
      category: dish.category,

      price: dish.price,
      dealPrice: dish.dealPrice || null,

      hotDeal: dish.hotDeal || false,
      featured: dish.featured || false,

      shortDescription: dish.shortDescription || "",
      description: dish.description || "",

      ingredients: dish.ingredients || [],
      allergens: dish.allergens || [],
      images: dish.images || [],
      tags: dish.tags || [],

      dealItems: dish.dealItems || [],

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      id: dish.id,
      message: "Dish added successfully.",
    };
  } catch (error) {
    console.error("Error adding dish:", error);

    return {
      success: false,
      error: error.message || "Failed to add dish.",
    };
  }
};

export const deleteDish = async (dishId) => {
  try {
    if (!dishId) {
      return {
        success: false,
        error: "Dish ID is required.",
      };
    }

    const dishRef = doc(db, "dishes", dishId);

    await deleteDoc(dishRef);

    return {
      success: true,
      message: "Dish deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting dish:", error);

    return {
      success: false,
      error: error.message || "Failed to delete dish.",
    };
  }
};

export const updateDish = async (dishId, dish) => {
  try {
    if (!dishId) {
      return {
        success: false,
        error: "Dish ID is required.",
      };
    }

    if (!dish) {
      return {
        success: false,
        error: "Dish data is required.",
      };
    }

    const dishRef = doc(db, "dishes", dishId);

    await updateDoc(dishRef, {
      name: dish.name?.trim() || "",
      category: dish.category || "",

      price: dish.price || "",
      dealPrice: dish.dealPrice || null,

      hotDeal: dish.hotDeal || false,
      featured: dish.featured || false,

      shortDescription: dish.shortDescription || "",
      description: dish.description || "",

      ingredients: dish.ingredients || [],
      allergens: dish.allergens || [],
      images: dish.images || [],
      tags: dish.tags || [],

      dealItems: dish.dealItems || [],

      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Dish updated successfully.",
    };
  } catch (error) {
    console.error("Error updating dish:", error);

    return {
      success: false,
      error: error.message || "Failed to update dish.",
    };
  }
};