import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { publicIds } = req.body || {};

    if (
      !Array.isArray(publicIds) ||
      publicIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "No Cloudinary public IDs provided.",
      });
    }

    const results = [];

    for (const publicId of publicIds) {
      if (!publicId) {
        continue;
      }

      const result =
        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );


      results.push({
        publicId,
        result: result.result,
      });
    }

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(
      "Cloudinary deletion failed:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Cloudinary deletion failed.",
    });
  }
}