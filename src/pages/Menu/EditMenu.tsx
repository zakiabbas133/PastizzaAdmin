import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Image as ImageIcon,
  Plus,
  Save,
  Star,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

import type { MenuItem } from "../../types";
import {
  useGetMenuItemsQuery,
  useUpdateMenuItemMutation,
} from "../../services/menuApi";
import { useGetCategoriesQuery } from "../../services/categoriesApi";
import DashboardLoader from "../../components/loaders/DashboardLoader";
import { baseUrl } from "../../services/api";

/* ========================================================================= */
/* TYPES                                                                     */
/* ========================================================================= */

type Variant = {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
};

type FormState = {
  name: string;
  slug: string;
  price: string;
  categoryId: string;
  description: string;
  image: string;
  featured: boolean;
  popular: boolean;
  variants: Variant[];
  displayOrder: number;
  isActive: boolean;
};

/* ========================================================================= */
/* CONSTANTS                                                                 */
/* ========================================================================= */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
];

/* ========================================================================= */
/* COMPONENT                                                                 */
/* ========================================================================= */

export default function EditMenu() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /* ----------------------------------------------------------------------- */
  /* API                                                                     */
  /* ----------------------------------------------------------------------- */

  const {
    data: menuItems = [],
    isLoading: menuItemsLoading,
    isFetching: menuItemsFetching,
  } = useGetMenuItemsQuery();

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const [updateMenuItem, { isLoading: isUpdating }] =
    useUpdateMenuItemMutation();

  /* ----------------------------------------------------------------------- */
  /* FIND CURRENT ITEM                                                       */
  /* ----------------------------------------------------------------------- */

  const existingItem = useMemo(() => {
    if (!id || !Array.isArray(menuItems)) {
      return null;
    }

    return menuItems.find((item) => item.id === id) || null;
  }, [menuItems, id]) as MenuItem;

  /* ----------------------------------------------------------------------- */
  /* FORM                                                                    */
  /* ----------------------------------------------------------------------- */

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    price: "",
    categoryId: "",
    description: "",
    image: "",
    featured: false,
    popular: false,
    displayOrder: 0,
    isActive: false,
    variants: [
      {
        id: "",
        name: "",
        price: 0,
        displayOrder: 0,
        isActive: false,
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ----------------------------------------------------------------------- */
  /* IMAGE                                                                   */
  /* ----------------------------------------------------------------------- */

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  const [imageInputKey, setImageInputKey] = useState(0);

  /* ----------------------------------------------------------------------- */
  /* SUCCESS                                                                 */
  /* ----------------------------------------------------------------------- */

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* ----------------------------------------------------------------------- */
  /* INITIALIZE FORM                                                         */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    if (!existingItem) {
      return;
    }

    setForm({
      name: existingItem.name ?? "",
      slug: existingItem.slug ?? "",
      price: existingItem.price ?? "",
      categoryId: existingItem?.categoryId ?? "",
      description: existingItem.description ?? "",
      image: existingItem.image ?? "",
      featured: existingItem.featured ?? false,
      popular: existingItem.popular ?? false,
      displayOrder: existingItem.displayOrder ?? 0,
      isActive: existingItem.isActive ?? false,
      variants:
        existingItem.variants?.length > 0
          ? existingItem.variants.map((variant) => ({
              id: variant.id || "",
              name: variant.name ?? "",
              price: Number(variant.price) || 0,
              displayOrder: variant.displayOrder || 0,
              isActive: variant.isActive || false,
            }))
          : [],
    });

    setImagePreview(baseUrl + existingItem.image || "");
    setSelectedImage(null);
    setErrors({});
  }, [existingItem]);

  /* ----------------------------------------------------------------------- */
  /* IMAGE PREVIEW CLEANUP                                                   */
  /* ----------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* ----------------------------------------------------------------------- */
  /* LOADING                                                                 */
  /* ----------------------------------------------------------------------- */

  if (menuItemsLoading || categoriesLoading) {
    return <DashboardLoader message="Loading menu item..." />;
  }

  /* ----------------------------------------------------------------------- */
  /* NOT FOUND                                                               */
  /* ----------------------------------------------------------------------- */

  if (!existingItem) {
    return <MenuItemNotFound />;
  }

  /* ========================================================================= */
  /* HANDLE CHANGE                                                             */
  /* ========================================================================= */

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => {
      const updated = { ...previous };
      delete updated[field];
      return updated;
    });
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (value: string) => {
    setForm((previous) => ({
      ...previous,
      ["name"]: value,
    }));

    setForm((previous) => ({
      ...previous,
      ["slug"]: generateSlug(value),
    }));
  };

  /* ========================================================================= */
  /* IMAGE HANDLER                                                             */
  /* ========================================================================= */

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        image: "Please select a valid PNG, JPG, WEBP or AVIF image.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((previous) => ({
        ...previous,
        image: "Image size must be less than 5 MB.",
      }));

      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);

    setErrors((previous) => {
      const updated = { ...previous };
      delete updated.image;
      return updated;
    });
  };

  /* ========================================================================= */
  /* REMOVE SELECTED IMAGE                                                    */
  /* ========================================================================= */

  const removeSelectedImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);

    setImagePreview(form.image);

    setImageInputKey((previous) => previous + 1);

    setErrors((previous) => {
      const updated = { ...previous };
      delete updated.image;
      return updated;
    });
  };

  /* ========================================================================= */
  /* VARIANT HANDLERS                                                          */
  /* ========================================================================= */

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | number,
  ) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    }));

    setErrors((previous) => {
      const updated = { ...previous };

      delete updated[`variant-${index}-name`];
      delete updated[`variant-${index}-price`];
      delete updated.variants;

      return updated;
    });
  };

  const addVariant = () => {
    setForm((previous) => ({
      ...previous,
      variants: [
        ...previous.variants,
        {
          id: "",
          name: "",
          price: 0,
          displayOrder: 0,
          isActive: false,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    if (form.variants.length === 1) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      variants: previous.variants.filter(
        (_, variantIndex) => variantIndex !== index,
      ),
    }));

    setErrors((previous) => {
      const updated: Record<string, string> = {};

      Object.entries(previous).forEach(([key, value]) => {
        if (key === `variant-${index}-name`) return;
        if (key === `variant-${index}-price`) return;

        updated[key] = value;
      });

      return updated;
    });
  };

  /* ========================================================================= */
  /* VALIDATION                                                                */
  /* ========================================================================= */

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    /* --------------------------------------------------------------------- */
    /* NAME                                                                  */
    /* --------------------------------------------------------------------- */

    if (!form.name.trim()) {
      newErrors.name = "Menu item name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Menu item name must be at least 2 characters.";
    } else if (form.name.trim().length > 100) {
      newErrors.name = "Menu item name must not exceed 100 characters.";
    }

    /* --------------------------------------------------------------------- */
    /* SLUG                                                                  */
    /* --------------------------------------------------------------------- */

    if (!form.slug.trim()) {
      newErrors.slug = "Slug is required.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers and hyphens.";
    }

    if (form.price == "0") {
      newErrors.slug = "Price is required.";
    }

    /* --------------------------------------------------------------------- */
    /* CATEGORY                                                              */
    /* --------------------------------------------------------------------- */

    if (!form.categoryId.trim()) {
      newErrors.category = "Please select a category.";
    }

    /* --------------------------------------------------------------------- */
    /* DESCRIPTION                                                           */
    /* --------------------------------------------------------------------- */

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    } else if (form.description.trim().length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters.";
    }

    /* --------------------------------------------------------------------- */
    /* IMAGE                                                                 */
    /* --------------------------------------------------------------------- */

    if (!form.image.trim() && !selectedImage) {
      newErrors.image = "Please select an image.";
    }

    /* --------------------------------------------------------------------- */
    /* VARIANTS                                                              */
    /* --------------------------------------------------------------------- */

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ========================================================================= */
  /* SUBMIT                                                                    */
  /* ========================================================================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      // ========================================================
      // Menu item
      // ========================================================

      formData.append("Id", existingItem.id);
      formData.append("Name", form.name.trim());
      formData.append("Slug", form.slug.trim());
      formData.append("Price", form.price);

      // IMPORTANT:
      // Backend expects CategoryId, not Category
      formData.append("CategoryId", form.categoryId);

      formData.append("Description", form.description.trim());

      formData.append("Featured", String(form.featured));

      formData.append("Popular", String(form.popular));

      formData.append("IsActive", String(form.isActive));

      formData.append("DisplayOrder", String(form.displayOrder));

      // ========================================================
      // Existing image
      // ========================================================

      if (existingItem.image) {
        formData.append("Image", existingItem.image);
      }

      // ========================================================
      // New image
      // ========================================================

      if (selectedImage) {
        formData.append("ImageFile", selectedImage);
      }

      // ========================================================
      // Variants
      // ========================================================
      form.variants.forEach((variant, index) => {
        formData.append(`Variants[${index}].Id`, variant.id || "");

        formData.append(`Variants[${index}].Name`, variant.name.trim());

        formData.append(`Variants[${index}].Price`, String(variant.price));

        formData.append(
          `Variants[${index}].DisplayOrder`,
          String(variant.displayOrder),
        );

        formData.append(
          `Variants[${index}].IsActive`,
          String(variant.isActive),
        );
      });

      // ========================================================
      // API
      // ========================================================

      const response = await updateMenuItem({
        id: existingItem.id,
        formData,
      }).unwrap();

      if (response?.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error updating menu item:", error);

      let message = "Unable to update the menu item. Please try again.";

      if (typeof error === "object" && error !== null && "data" in error) {
        const apiError = error as {
          data?: {
            message?: string;
            title?: string;
            errors?: Record<string, string[]>;
          };
        };

        if (apiError.data?.message) {
          message = apiError.data.message;
        } else if (apiError.data?.title) {
          message = apiError.data.title;
        }

        if (apiError.data?.errors) {
          const backendErrors: Record<string, string> = {};

          Object.entries(apiError.data.errors).forEach(([key, messages]) => {
            if (messages?.length) {
              backendErrors[key.toLowerCase()] = messages[0];
            }
          });

          setErrors((previous) => ({
            ...previous,
            ...backendErrors,
          }));
        }
      }

      setErrors((previous) => ({
        ...previous,
        submit: message,
      }));
    }
  };

  /* ========================================================================= */
  /* RESET                                                                     */
  /* ========================================================================= */

  const handleReset = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm({
      name: existingItem.name ?? "",
      slug: existingItem.slug ?? "",
      price: existingItem.price ?? "",
      categoryId: existingItem.category ?? "",
      description: existingItem.description ?? "",
      image: existingItem.image ?? "",
      featured: existingItem.featured ?? false,
      popular: existingItem.popular ?? false,
      displayOrder: existingItem.displayOrder ?? 0,
      isActive: existingItem.isActive ?? false,
      variants:
        existingItem.variants?.length > 0
          ? existingItem.variants.map((variant) => ({
              id: variant.id || "",
              name: variant.name ?? "",
              price: Number(variant.price) || 0,
              displayOrder: variant.displayOrder || 0,
              isActive: variant.isActive || false,
            }))
          : [],
    });

    setSelectedImage(null);
    setImagePreview(existingItem.image ?? "");
    setImageInputKey((previous) => previous + 1);
    setErrors({});
  };

  /* ========================================================================= */
  /* SUCCESS                                                                    */
  /* ========================================================================= */

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  /* ========================================================================= */
  /* RENDER                                                                    */
  /* ========================================================================= */

  return (
    <>
      {menuItemsFetching && !existingItem && (
        <DashboardLoader message="Loading menu item..." />
      )}

      <div className="space-y-6">
        {/* ================================================================== */}
        {/* BREADCRUMBS                                                         */}
        {/* ================================================================== */}

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="transition hover:text-brand-500">
            Menu Items
          </Link>

          <ChevronRight size={15} />

          <span className="text-gray-800 dark:text-white/90">
            Edit Menu Item
          </span>
        </div>

        {/* ================================================================== */}
        {/* HEADER                                                              */}
        {/* ================================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Menu Item
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update {existingItem.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isUpdating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <X size={16} />
              Reset
            </button>

            <button
              type="submit"
              form="edit-menu-form"
              disabled={isUpdating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* SUBMIT ERROR                                                        */}
        {/* ================================================================== */}

        {errors.submit && (
          <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-500 dark:border-error-500/20 dark:bg-error-500/10">
            {errors.submit}
          </div>
        )}

        {/* ================================================================== */}
        {/* FORM                                                                */}
        {/* ================================================================== */}

        <form id="edit-menu-form" onSubmit={handleSubmit} className="space-y-6">
          {/* ================================================================ */}
          {/* BASIC INFORMATION                                                 */}
          {/* ================================================================ */}

          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-100 p-5 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update the basic information of your menu item.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
              {/* NAME */}

              <FormField label="Menu Item Name" required error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="e.g. Margherita Classica"
                  className={inputClass(Boolean(errors.name))}
                />
              </FormField>

              {/* SLUG */}

              <FormField label="Slug" required error={errors.slug}>
                <input
                  contentEditable="false"
                  type="text"
                  value={form.slug}
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      slud: event.target.value,
                    }));

                    setErrors((previous) => {
                      const updated = { ...previous };
                      delete updated["slug"];
                      return updated;
                    });
                  }}
                  placeholder="margherita-classica"
                  className={inputClass(Boolean(errors.slug))}
                />
              </FormField>

              {/* CATEGORY */}

              <FormField label="Category" required error={errors.category}>
                <select
                  value={form.categoryId || existingItem.category}
                  onChange={(event) => {
                    handleChange("categoryId", event.target.value);
                  }}
                  className={inputClass(Boolean(errors.category))}
                >
                  <option value="">Select category</option>

                  {categories.slice(1, categories.length).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Price" required error={errors.price}>
                <input
                  id="price"
                  value={form.price}
                  onChange={(event) =>
                    handleChange("price", event.target.value)
                  }
                  placeholder="99"
                  className={inputClass(Boolean(errors.price))}
                  required
                />
              </FormField>

              {/* DESCRIPTION */}

              <div className="lg:col-span-2">
                <FormField
                  label="Description"
                  required
                  error={errors.description}
                >
                  <textarea
                    cols={5}
                    value={form.description}
                    onChange={(event) =>
                      handleChange("description", event.target.value)
                    }
                    placeholder="Describe your menu item..."
                    className={
                      "py-2 h-30 " + inputClass(Boolean(errors.description))
                    }
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* IMAGE                                                             */}
          {/* ================================================================ */}

          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-100 p-5 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Item Image
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a new image if you want to replace the current image.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[1fr_280px]">
              {/* UPLOAD */}

              <FormField label="Menu Item Image" required error={errors.image}>
                <input
                  key={imageInputKey}
                  id="menu-item-image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <label
                  htmlFor="menu-item-image"
                  className={`group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
                    errors.image
                      ? "border-error-500 bg-error-50/30 dark:bg-error-500/5"
                      : "border-gray-200 bg-gray-50 hover:border-brand-400 hover:bg-brand-50/30 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-500/5"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm transition group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800">
                    <ImageIcon size={22} />
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Click to choose an image
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, WEBP or AVIF
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Maximum file size: 5 MB
                  </p>
                </label>

                {/* SELECTED IMAGE */}

                {selectedImage && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 dark:border-brand-500/20 dark:bg-brand-500/10">
                    <div className="flex min-w-0 items-center gap-2">
                      <Check size={16} className="shrink-0 text-brand-500" />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                          {selectedImage.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-error-500 dark:hover:bg-gray-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-400">
                  Leave the existing image unchanged if you don't want to
                  replace it.
                </p>
              </FormField>

              {/* PREVIEW */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image Preview
                </label>

                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt={form.name}
                        className="h-full w-full object-cover"
                        onError={() => {
                          setImagePreview("");
                        }}
                      />

                      {selectedImage && (
                        <div className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
                          New Image
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={28} />

                      <span className="mt-2 text-xs">No image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* VARIANTS                                                          */}
          {/* ================================================================ */}

          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Variants & Pricing
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update sizes, portions, and prices.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-brand-200 px-3 text-sm font-medium text-brand-500 transition hover:bg-brand-50 dark:border-brand-500/20 dark:hover:bg-brand-500/10"
              >
                <Plus size={16} />
                Add Variant
              </button>
            </div>

            <div className="space-y-4 p-5">
              {errors.variants && (
                <p className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-500 dark:bg-error-500/10">
                  {errors.variants}
                </p>
              )}

              {form.variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                        <Utensils size={15} />
                      </div>

                      <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                        Variant {index + 1}
                      </span>
                    </div>

                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* VARIANT NAME */}

                    <FormField
                      label="Variant Name"
                      required
                      error={errors[`variant-${index}-name`]}
                    >
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(event) =>
                          updateVariant(index, "name", event.target.value)
                        }
                        placeholder="e.g. Medium"
                        className={inputClass(
                          Boolean(errors[`variant-${index}-name`]),
                        )}
                      />
                    </FormField>

                    {/* PRICE */}

                    <FormField
                      label="Price"
                      required
                      error={errors[`variant-${index}-price`]}
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-3.5 text-sm text-gray-400">
                          Rs.
                        </span>

                        <input
                          type="number"
                          min="1"
                          value={variant.price || ""}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              "price",
                              event.target.value === ""
                                ? 0
                                : Number(event.target.value),
                            )
                          }
                          placeholder="1200"
                          className={`${inputClass(
                            Boolean(errors[`variant-${index}-price`]),
                          )} pl-11`}
                        />
                      </div>
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================================================================ */}
          {/* VISIBILITY                                                        */}
          {/* ================================================================ */}

          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-100 p-5 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Visibility & Features
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Control how this item appears throughout your website.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <ToggleCard
                icon={
                  <Star
                    size={18}
                    fill={form.featured ? "currentColor" : "none"}
                  />
                }
                title="Featured Item"
                description="Display this item in your featured menu section."
                checked={form.featured}
                onChange={(checked) => handleChange("featured", checked)}
              />

              <ToggleCard
                icon={<Check size={18} />}
                title="Popular Item"
                description="Mark this item as popular for customers."
                checked={form.popular}
                onChange={(checked) => handleChange("popular", checked)}
              />
            </div>
          </div>

          {/* ================================================================ */}
          {/* FORM ACTIONS                                                      */}
          {/* ================================================================ */}

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isUpdating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={16} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ==================================================================== */}
      {/* SUCCESS MODAL                                                        */}
      {/* ==================================================================== */}

      {showSuccessModal && (
        <SuccessModal itemName={form.name} onDone={handleSuccessDone} />
      )}
    </>
  );
}

/* ========================================================================= */
/* FORM FIELD                                                                */
/* ========================================================================= */

function FormField({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}

        {required && <span className="ml-1 text-error-500">*</span>}
      </label>

      {children}

      {error && <p className="mt-1.5 text-xs text-error-500">{error}</p>}
    </div>
  );
}

/* ========================================================================= */
/* INPUT CLASS                                                               */
/* ========================================================================= */

function inputClass(hasError: boolean) {
  return `h-11 w-full rounded-lg border bg-transparent px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 ${
    hasError
      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
      : "border-gray-200 dark:border-gray-700"
  }`;
}

/* ========================================================================= */
/* TOGGLE CARD                                                               */
/* ========================================================================= */

function ToggleCard({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
        checked
          ? "border-brand-300 bg-brand-50/50 dark:border-brand-500/30 dark:bg-brand-500/5"
          : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          checked
            ? "bg-brand-500 text-white"
            : "bg-gray-100 text-gray-400 dark:bg-gray-800"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
      </div>

      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </div>
    </button>
  );
}

/* ========================================================================= */
/* SUCCESS MODAL                                                             */
/* ========================================================================= */

function SuccessModal({
  itemName,
  onDone,
}: {
  itemName: string;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        onClick={onDone}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="absolute inset-x-0 top-0 h-1 bg-brand-500" />

        <div className="p-7 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/25">
              <Check size={24} strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-800 dark:text-white">
            Menu Item Updated
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {itemName}
            </span>{" "}
            has been successfully updated.
          </p>

          <button
            type="button"
            onClick={onDone}
            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            <Check size={17} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* NOT FOUND                                                                 */
/* ========================================================================= */

function MenuItemNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
          <Utensils size={26} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-gray-800 dark:text-white/90">
          Menu item not found
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The menu item you're trying to edit doesn't exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/menu-items")}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          <ArrowLeft size={16} />
          Back to Menu Items
        </button>
      </div>
    </div>
  );
}
