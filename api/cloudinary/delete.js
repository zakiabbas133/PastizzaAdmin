import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  console.log("=================================");
  console.log("Cloudinary delete API started");
  console.log("=================================");

  try {
    // -----------------------------------------------
    // 1. Check request method
    // -----------------------------------------------

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed.",
      });
    }

    // -----------------------------------------------
    // 2. Check environment variables
    // -----------------------------------------------

    const cloudName = "hwsulryt";
    const apiKey = "276131442533931";
    const apiSecret = "MZrST220JS0BwJJpU_PfEMpIsW4";

    console.log(
      "CLOUDINARY_CLOUD_NAME exists:",
      Boolean(cloudName)
    );

    console.log(
      "CLOUDINARY_API_KEY exists:",
      Boolean(apiKey)
    );

    console.log(
      "CLOUDINARY_API_SECRET exists:",
      Boolean(apiSecret)
    );

    if (!cloudName) {
      return res.status(500).json({
        success: false,
        error:
          "CLOUDINARY_CLOUD_NAME is missing.",
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error:
          "CLOUDINARY_API_KEY is missing.",
      });
    }

    if (!apiSecret) {
      return res.status(500).json({
        success: false,
        error:
          "CLOUDINARY_API_SECRET is missing.",
      });
    }

    // -----------------------------------------------
    // 3. Configure Cloudinary
    // -----------------------------------------------

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // -----------------------------------------------
    // 4. Read request body
    // -----------------------------------------------

    const { publicIds } = req.body || {};

    console.log(
      "Received public IDs:",
      publicIds
    );

    if (
      !Array.isArray(publicIds) ||
      publicIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "No Cloudinary public IDs provided.",
      });
    }

    // -----------------------------------------------
    // 5. Delete images
    // -----------------------------------------------

    const results = [];

    for (const publicId of publicIds) {
      if (!publicId) {
        continue;
      }

      console.log(
        "Deleting:",
        publicId
      );

      const result =
        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );

      console.log(
        "Delete result:",
        result
      );

      results.push({
        publicId,
        result: result.result,
      });
    }

    // -----------------------------------------------
    // 6. Return success
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "CLOUDINARY DELETE ERROR"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Failed to delete Cloudinary images.",
    });
  }
}