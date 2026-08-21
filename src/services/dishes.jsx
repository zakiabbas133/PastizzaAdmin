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

import {
  deleteImagesFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/uploadImage";

/**
 * ----------------------------------------------------
 * GET ALL DISHES
 * ----------------------------------------------------
 */
export const getDishes = async () => {
  try {
    const dishesRef = collection(
      db,
      "dishes"
    );

    const snapshot =
      await getDocs(dishesRef);

    const dishes = snapshot.docs.map(
      (document) => ({
        id: document.id,
        ...document.data(),
      })
    );

    return {
      success: true,
      data: dishes,
    };
  } catch (error) {
    console.error(
      "Error fetching dishes:",
      error
    );

    return {
      success: false,
      data: [],
      error:
        error.message ||
        "Failed to fetch dishes.",
    };
  }
};

/**
 * ----------------------------------------------------
 * ADD DISH
 * ----------------------------------------------------
 */
export const addDish = async (dish) => {
  try {
    if (!dish) {
      return {
        success: false,
        error: "Dish data is required.",
      };
    }

    if (!dish.id) {
      return {
        success: false,
        error: "Dish ID is required.",
      };
    }

    if (!dish.name?.trim()) {
      return {
        success: false,
        error: "Dish name is required.",
      };
    }

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
      await getDocs(
        duplicateQuery
      );

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

      category:
        dish.category || "",

      price:
        dish.price || "",

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
        dish.chefRecommendation ||
        null,

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

      images:
        uploadedImages,

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

/**
 * ----------------------------------------------------
 * DELETE DISH
 * ----------------------------------------------------
 */
export const deleteDish = async (
  dishId
) => {
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

    // ------------------------------------------------
    // 1. Get existing dish
    // ------------------------------------------------

    const dishSnapshot =
      await getDoc(dishRef);

    // ------------------------------------------------
    // 2. Check if dish exists BEFORE accessing data
    // ------------------------------------------------

    if (!dishSnapshot.exists()) {
      return {
        success: false,
        error: "Dish not found.",
      };
    }

    const dish =
      dishSnapshot.data();

    // ------------------------------------------------
    // 3. Get Cloudinary public IDs
    // ------------------------------------------------

    const publicIds =
      Array.isArray(dish.images)
        ? dish.images
          .map(
            (image) =>
              image?.publicId
          )
          .filter(Boolean)
        : [];

    // ------------------------------------------------
    // 4. Delete Cloudinary images
    // ------------------------------------------------

    if (publicIds.length > 0) {
      await deleteImagesFromCloudinary(
        publicIds
      );
    }

    // ------------------------------------------------
    // 5. Delete Firestore document
    // ------------------------------------------------

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

/**
 * ----------------------------------------------------
 * UPDATE DISH
 * ----------------------------------------------------
 */
export const updateDish = async (
  dishId,
  dish
) => {
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

    const dishRef = doc(
      db,
      "dishes",
      dishId
    );

    // ------------------------------------------------
    // 2. Get existing dish
    // ------------------------------------------------

    const existingSnapshot =
      await getDoc(dishRef);

    if (!existingSnapshot.exists()) {
      return {
        success: false,
        error: "Dish not found.",
      };
    }

    const existingDish =
      existingSnapshot.data();

    const existingImages =
      Array.isArray(
        existingDish.images
      )
        ? existingDish.images
        : [];

    // ------------------------------------------------
    // 3. Determine whether images changed
    // ------------------------------------------------
    //
    // undefined = don't modify images
    //
    // [] = remove all images
    //
    // [files] = replace images
    //
    // ------------------------------------------------

    const imagesChanged =
      dish.images !== undefined &&
      Array.isArray(dish.images);

    let uploadedImages =
      existingImages;

    // Keep track of old images so we can delete
    // them AFTER the new images are uploaded.
    const previousPublicIds =
      existingImages
        .map(
          (image) =>
            image?.publicId
        )
        .filter(Boolean);

    // ------------------------------------------------
    // 4. Handle images
    // ------------------------------------------------

    if (imagesChanged) {
      uploadedImages = [];

      // ----------------------------------------------
      // Upload new images
      // ----------------------------------------------

      for (const image of dish.images) {
        if (
          !(image?.file instanceof File)
        ) {
          if (
            image?.publicId &&
            image?.src
          ) {
            uploadedImages.push({
              id: image.id,

              src: image.src,

              name:
                image.name || "",

              publicId:
                image.publicId,

              width:
                image.width ||
                null,

              height:
                image.height ||
                null,

              format:
                image.format ||
                null,
            });
          }

          continue;
        }

        // --------------------------------------------
        // Upload NEW image
        // --------------------------------------------

        const uploaded =
          await uploadImageToCloudinary(
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


    if (
      imagesChanged &&
      previousPublicIds.length > 0
    ) {
      try {
        await deleteImagesFromCloudinary(
          previousPublicIds
        );
      } catch (deleteError) {
        // Firestore has already been updated with
        // the new images.
        //
        // Don't report the whole update as failed
        // because the dish itself was successfully
        // updated.
        console.error(
          "New images saved, but old Cloudinary images could not be deleted:",
          deleteError
        );

        return {
          success: true,

          id: dishId,

          images:
            uploadedImages,

          warning:
            "Dish updated successfully, but some previous Cloudinary images could not be deleted.",

          message:
            "Dish updated successfully.",
        };
      }
    }

    // ------------------------------------------------
    // 5. Update Firestore
    // ------------------------------------------------

    await updateDoc(dishRef, {
      name:
        dish.name?.trim() ||
        "",

      category:
        dish.category || "",

      price:
        dish.price || "",

      dealPrice:
        dish.dealPrice || null,

      hotDeal:
        dish.hotDeal || false,

      featured:
        dish.featured || false,

      shortDescription:
        dish.shortDescription ||
        "",

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
        dish.chefRecommendation ||
        null,

      dealItems:
        dish.dealItems || [],

      updatedAt:
        serverTimestamp(),
    });

    // ------------------------------------------------
    // 7. Success
    // ------------------------------------------------

    return {
      success: true,

      id: dishId,

      images:
        uploadedImages,

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