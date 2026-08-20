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
import { upload } from "@vercel/blob/client";
import { db } from "../firebase/firebase";
import { uploadImageToCloudinary } from "../utils/uploadImage";

const uploadImageToBlob = async (file, dishId) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid image file.");
  }

  const safeFileName = file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  const pathname =
    `dishes/${dishId}/${Date.now()}_${safeFileName}`;

  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
};

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
    // ------------------------------------------------
    // 1. Check duplicate dish
    // ------------------------------------------------

    const dishesRef = collection(
      db,
      "dishes"
    );

    const duplicateQuery = query(
      dishesRef,
      where(
        "name",
        "==",
        dish.name.trim()
      )
    );

    const duplicateSnapshot =
      await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {
      throw new Error(
        `A dish named "${dish.name}" already exists. Please use a different name.`
      );
    }

    // ------------------------------------------------
    // 2. Upload images to Cloudinary
    // ------------------------------------------------

    const uploadedImages = [];

    if (
      Array.isArray(dish.images) &&
      dish.images.length > 0
    ) {
      for (const image of dish.images) {
        if (
          !(image?.file instanceof File)
        ) {
          console.warn(
            "Skipping image because File is missing:",
            image
          );

          continue;
        }

        const uploaded =
          await uploadImageToCloudinary(
            image.file,
            dish.id
          );

        uploadedImages.push({
          id: image.id,
          src: uploaded.url,
          name:
            image.name ||
            image.file.name,

          publicId:
            uploaded.publicId,

          width:
            uploaded.width,

          height:
            uploaded.height,

          format:
            uploaded.format,
        });
      }
    }

    // ------------------------------------------------
    // 3. Save dish to Firestore
    // ------------------------------------------------

    const dishRef = doc(
      db,
      "dishes",
      dish.id
    );

    await setDoc(dishRef, {
      name: dish.name.trim(),

      category: dish.category,

      price: dish.price,

      dealPrice:
        dish.dealPrice || null,

      hotDeal:
        dish.hotDeal || false,

      featured:
        dish.featured || false,

      shortDescription:
        dish.shortDescription || "",

      description:
        dish.description || "",

      ingredients:
        dish.ingredients || [],

      allergens:
        dish.allergens || [],

      images:
        uploadedImages,

      tags:
        dish.tags || [],

      chefRecommendation:
        dish.chefRecommendation || null,

      dealItems:
        dish.dealItems || [],

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    });

    return {
      success: true,
      id: dish.id,
      images: uploadedImages,
      message:
        "Dish added successfully.",
    };
  } catch (error) {
    console.error(
      "Error adding dish:",
      error
    );

    return {
      success: false,
      error:
        error.message ||
        "Failed to add dish.",
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