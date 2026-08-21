import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { deleteImagesFromCloudinary, uploadImageToCloudinary } from "../utils/uploadImage";


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

    const dishRef = doc(
      db,
      "dishes",
      dishId
    );

    const dishSnapshot =
      await getDoc(dishRef);

    const dish = dishSnapshot.data();

    const publicIds = Array.isArray(dish.images)
      ? dish.images
        .map((image) => image?.publicId)
        .filter(Boolean)
      : [];

    if (publicIds.length > 0) {
      await deleteImagesFromCloudinary(
        publicIds
      );
    }

    if (!dishSnapshot.exists()) {
      return {
        success: false,
        error: "Dish not found.",
      };
    }

    await deleteDoc(dishRef);

    return {
      success: true,
      message:
        "Dish and its images deleted successfully.",
    };
  } catch (error) {
    console.error(
      "Error deleting dish:",
      error
    );

    return {
      success: false,
      error:
        error.message ||
        "Failed to delete dish.",
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

    // ------------------------------------------------
    // 1. Get existing dish
    // ------------------------------------------------

    const existingSnapshot = await getDoc(dishRef);

    if (!existingSnapshot.exists()) {
      return {
        success: false,
        error: "Dish not found.",
      };
    }

    const existingDish = existingSnapshot.data();

    const existingImages = Array.isArray(existingDish.images)
      ? existingDish.images
      : [];

    // ------------------------------------------------
    // 2. Determine whether images are being replaced
    // ------------------------------------------------

    const imagesChanged =
      Array.isArray(dish.images);

    let uploadedImages = existingImages;

    // ------------------------------------------------
    // 3. Delete previous Cloudinary images
    // ------------------------------------------------

    if (imagesChanged) {
      const previousPublicIds = existingImages
        .map((image) => image?.publicId)
        .filter(Boolean);

      if (previousPublicIds.length > 0) {
        const deleteResponse = await fetch(
          "/api/cloudinary/delete",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              publicIds: previousPublicIds,
            }),
          }
        );

        if (!deleteResponse.ok) {
          throw new Error(
            "Failed to remove previous images from Cloudinary."
          );
        }
      }

      // ------------------------------------------------
      // 4. Upload new images
      // ------------------------------------------------

      uploadedImages = [];

      for (const image of dish.images) {
        if (!(image?.file instanceof File)) {
          continue;
        }

        const uploaded = await uploadImageToCloudinary(
          image.file,
          dishId
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
    // 5. Update Firestore
    // ------------------------------------------------

    await updateDoc(dishRef, {
      name: dish.name?.trim() || "",

      category: dish.category || "",

      price: dish.price || "",

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

      updatedAt:
        serverTimestamp(),
    });

    return {
      success: true,

      id: dishId,

      images: uploadedImages,

      message:
        "Dish updated successfully.",
    };
  } catch (error) {
    console.error(
      "Error updating dish:",
      error
    );

    return {
      success: false,

      error:
        error.message ||
        "Failed to update dish.",
    };
  }
};