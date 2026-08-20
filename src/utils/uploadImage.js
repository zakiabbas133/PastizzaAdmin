const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (
  file,
  dishId
) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid image file.");
  }

  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Cloudinary cloud name is missing."
    );
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary upload preset is missing."
    );
  }

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  // Optional folder
  formData.append(
    "folder",
    `pastizza/dishes/${dishId}`
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Cloudinary error:", data);

    throw new Error(
      data?.error?.message ||
      "Failed to upload image."
    );
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
};