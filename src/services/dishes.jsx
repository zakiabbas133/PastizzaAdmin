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
import { uploadImageToCloudinary } from "../utils/uploadImage";


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
  console.log("Updating dish:", dish);

  try {
    // ------------------------------------------------
    // 1. Validate
    // ------------------------------------------------

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

    // ------------------------------------------------
    // 2. Get existing dish from Firestore
    // ------------------------------------------------

    const dishRef = doc(db, "dishes", dishId);

    const existingDishSnapshot = await getDoc(dishRef);

    if (!existingDishSnapshot.exists()) {
      return {
        success: false,
        error: "Dish not found.",
      };
    }

    // ------------------------------------------------
    // 3. Process images
    // ------------------------------------------------

    const finalImages = [];

    if (Array.isArray(dish.images)) {
      for (const image of dish.images) {
        // --------------------------------------------
        // Existing Cloudinary image
        // --------------------------------------------

        if (
          image &&
          typeof image === "object" &&
          !image.file &&
          image.src
        ) {
          finalImages.push({
            id: image.id,
            src: image.src,
            name: image.name || "",
            publicId: image.publicId || null,
            width: image.width || null,
            height: image.height || null,
            format: image.format || null,
          });

          continue;
        }

        // --------------------------------------------
        // New image selected from device
        // --------------------------------------------

        if (
          image?.file instanceof File
        ) {
          try {
            const uploaded = await uploadImageToCloudinary(
              image.file,
              dishId
            );

            finalImages.push({
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
          } catch (uploadError) {
            console.error(
              "Failed to upload image:",
              image,
              uploadError
            );

            throw new Error(
              `Failed to upload image "${image.file.name}".`
            );
          }
        }
      }
    }

    // ------------------------------------------------
    // 4. Update Firestore
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
        finalImages,

      tags:
        dish.tags || [],

      chefRecommendation:
        dish.chefRecommendation || null,

      dealItems:
        dish.dealItems || [],

      updatedAt:
        serverTimestamp(),
    });

    // ------------------------------------------------
    // 5. Return updated data
    // ------------------------------------------------

    return {
      success: true,

      id: dishId,

      images: finalImages,

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