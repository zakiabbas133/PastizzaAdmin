import React, { useRef, useState } from "react";
import { Box, Typography, IconButton, alpha, useTheme } from "@mui/material";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const MultipleImagePicker = ({
  value = [],
  onChange,
  error,
  helperText,
  maxImages = 10,
  maxFileSize = 5 * 1024 * 1024, // 5MB
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  // =========================================================
  // HANDLE FILES
  // =========================================================

  const handleFiles = (files) => {
    const selectedFiles = Array.from(files);

    if (!selectedFiles.length) {
      return;
    }

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    const validFiles = imageFiles.filter((file) => file.size <= maxFileSize);

    const remainingSlots = maxImages - value.length;

    const filesToAdd = validFiles.slice(0, Math.max(remainingSlots, 0));

    if (!filesToAdd.length) {
      return;
    }

    const newImages = filesToAdd.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    onChange([...value, ...newImages]);
  };

  // =========================================================
  // FILE INPUT
  // =========================================================

  const handleFileInputChange = (event) => {
    handleFiles(event.target.files);

    // Reset input so selecting the same file again works
    event.target.value = "";
  };

  // =========================================================
  // DRAG EVENTS
  // =========================================================

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Prevent flickering when moving over children
    if (event.currentTarget === event.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    const files = event.dataTransfer.files;

    handleFiles(files);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const handleRemoveImage = (imageId) => {
    const imageToRemove = value.find((image) => image.id === imageId);

    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const updatedImages = value.filter((image) => image.id !== imageId);

    onChange(updatedImages);
  };

  // =========================================================
  // OPEN FILE PICKER
  // =========================================================

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <Box>
      {/* =====================================================
          LABEL
      ===================================================== */}

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Product Images
      </Typography>

      {/* =====================================================
          DRAG & DROP AREA
      ===================================================== */}

      <Box
        onClick={handleBrowse}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          position: "relative",

          minHeight: 150,

          border: `2px dashed ${error
              ? theme.palette.error.main
              : isDragging
                ? theme.palette.primary.main
                : theme.palette.divider
            }`,

          borderRadius: 3,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          textAlign: "center",

          cursor: "pointer",

          px: 2,
          py: 3,

          backgroundColor: isDragging
            ? alpha(theme.palette.primary.main, 0.08)
            : "transparent",

          transition: "all 0.2s ease",

          "&:hover": {
            borderColor: theme.palette.primary.main,

            backgroundColor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileInputChange}
        />

        <CloudUploadOutlinedIcon
          sx={{
            fontSize: 42,
            color: isDragging ? "primary.main" : "text.secondary",
            mb: 1,
          }}
        />

        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
          }}
        >
          {isDragging
            ? "Drop your images here"
            : "Drag & drop your images here"}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          or click to browse
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          PNG, JPG, JPEG, WEBP • Max 5MB each
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {value.length}/{maxImages} images selected
        </Typography>
      </Box>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            display: "block",
            mt: 0.75,
            ml: 1.75,
          }}
        >
          {helperText}
        </Typography>
      )}

      {/* =====================================================
          IMAGE PREVIEWS
      ===================================================== */}

      {value.length > 0 && (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },

            gap: 1.5,

            mt: 2,
          }}
        >
          {value.map((image) => (
            <Box
              key={image.id}
              sx={{
                position: "relative",

                height: {
                  xs: 120,
                  sm: 140,
                },

                borderRadius: 2,

                overflow: "hidden",

                border: `1px solid ${theme.palette.divider}`,

                backgroundColor: theme.palette.background.default,

                "&:hover .remove-button": {
                  opacity: 1,
                },
              }}
            >
              {/* IMAGE */}

              <Box
                component="img"
                src={image.preview}
                alt={image.file?.name}
                sx={{
                  width: "100%",
                  height: "100%",

                  objectFit: "cover",

                  display: "block",
                }}
              />

              {/* REMOVE BUTTON */}

              <IconButton
                className="remove-button"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();

                  handleRemoveImage(image.id);
                }}
                sx={{
                  position: "absolute",

                  top: 6,
                  right: 6,

                  width: 28,
                  height: 28,

                  opacity: {
                    xs: 1,
                    sm: 0,
                  },

                  color: "#fff",

                  backgroundColor: "rgba(0,0,0,0.65)",

                  backdropFilter: "blur(4px)",

                  transition: "all 0.2s ease",

                  "&:hover": {
                    backgroundColor: theme.palette.error.main,
                  },
                }}
              >
                <CloseIcon
                  sx={{
                    fontSize: 17,
                  }}
                />
              </IconButton>

              {/* FILE NAME */}

              <Box
                sx={{
                  position: "absolute",

                  left: 0,
                  right: 0,
                  bottom: 0,

                  px: 1,
                  py: 0.75,

                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#fff",

                    display: "block",

                    overflow: "hidden",

                    textOverflow: "ellipsis",

                    whiteSpace: "nowrap",
                  }}
                >
                  {image.file?.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* =====================================================
          MAX IMAGE MESSAGE
      ===================================================== */}

      {value.length >= maxImages && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 1,
          }}
        >
          Maximum of {maxImages} images reached.
        </Typography>
      )}
    </Box>
  );
};

export default MultipleImagePicker;
