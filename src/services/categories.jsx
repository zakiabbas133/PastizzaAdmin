import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, "categories");

    const snapshot = await getDocs(categoriesRef);

    const categories = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);

    return {
      success: false,
      data: [],
      error: error.message || "Failed to fetch categories.",
    };
  }
};