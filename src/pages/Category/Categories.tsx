import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Edit3,
  GripVertical,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { CategoryMeta } from "../../types";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryOrderMutation,
} from "../../services/categoriesApi";
import { baseUrl } from "../../services/api";
import CategoryShimmer from "../../components/loaders/CategoryShimmer";
import Toast from "../../components/toast/Toast";

type ModalMode = "create" | "edit" | null;

interface CategoryForm {
  label: string;
  description: string;
  image: string;
  imageFile: File | null;
  removeImage: boolean;
}

interface FormErrors {
  label?: string;
  description?: string;
  image?: string;
  general?: string;
}

const EMPTY_FORM: CategoryForm = {
  label: "",
  description: "",
  image: "",
  imageFile: null,
  removeImage: false,
};

const EMPTY_ERRORS: FormErrors = {};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export default function Categories() {
  const {
    data = [],
    isLoading: categoriesLoading,
    refetch,
  } = useGetCategoriesQuery();

  const [createCategory, { isLoading: createCategoryLoading }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();

  const [deleteCategory, { isLoading: deleteCategoryLoading }] =
    useDeleteCategoryMutation();

  const [updateCategoryOrder, { isLoading: updateOrderLoading }] =
    useUpdateCategoryOrderMutation();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<CategoryMeta | null>(
    null,
  );

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const [deleteTarget, setDeleteTarget] = useState<CategoryMeta | null>(null);

  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);

  const [imagePreview, setImagePreview] = useState("");

  const [draggedCategory, setDraggedCategory] = useState<CategoryMeta | null>(
    null,
  );

  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  /*
   * ============================================================
   * IMAGE PREVIEW
   * ============================================================
   */

  useEffect(() => {
    if (!form.imageFile) {
      return;
    }

    const previewUrl = URL.createObjectURL(form.imageFile);

    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [form.imageFile]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  /*
   * ============================================================
   * SORT + FILTER
   * ============================================================
   */

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const categories = query
      ? data.filter((category) => {
          return (
            category.label.toLowerCase().includes(query) ||
            category.id.toLowerCase().includes(query) ||
            category.description?.toLowerCase().includes(query)
          );
        })
      : data;

    return [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [data, searchQuery]);

  /*
   * ============================================================
   * TOAST
   * ============================================================
   */

  const showToast = (message: string, type: "success" | "error") => {
    // Clear previous timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({
      show: true,
      message,
      type,
    });

    toastTimeoutRef.current = setTimeout(() => {
      setToast((previous) => ({
        ...previous,
        show: false,
      }));

      toastTimeoutRef.current = null;
    }, 3000);
  };

  const hideToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }

    setToast((previous) => ({
      ...previous,
      show: false,
    }));
  };

  /*
   * ============================================================
   * VALIDATION
   * ============================================================
   */

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const label = form.label.trim();
    const description = form.description.trim();

    /*
     * Category name
     */
    if (!label) {
      newErrors.label = "Category name is required.";
    } else if (label.length < 2) {
      newErrors.label = "Category name must be at least 2 characters.";
    } else if (label.length > 100) {
      newErrors.label = "Category name cannot exceed 100 characters.";
    }

    /*
     * Description
     */
    if (!description) {
      newErrors.description = "Description is required.";
    } else if (description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
    } else if (description.length < 10) {
      newErrors.description =
        "Description cannot have less than 10 characters.";
    }

    /*
     * Image
     */
    if (!selectedCategory?.image) {
      if (!form.imageFile) {
        newErrors.image = "Image is required.";
      } else if (!ALLOWED_IMAGE_TYPES.includes(form?.imageFile?.type)) {
        newErrors.image = "Only PNG, JPG, JPEG, and WEBP images are allowed.";
      } else if (form?.imageFile?.size > MAX_IMAGE_SIZE) {
        newErrors.image = "Image size must not exceed 5 MB.";
      }
    } else if (selectedCategory?.image) {
      return Object.keys(newErrors).length === 0;
    } else {
      newErrors.image = "Image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * ============================================================
   * OPEN CREATE MODAL
   * ============================================================
   */

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setErrors(EMPTY_ERRORS);
    setSelectedCategory(null);
    setImagePreview("");
    setModalMode("create");
  };

  /*
   * ============================================================
   * OPEN EDIT MODAL
   * ============================================================
   */

  const openEditModal = (category: CategoryMeta) => {
    // Default "All" category cannot be edited.
    if (category.description === "all") {
      return;
    }

    setSelectedCategory(category);

    setForm({
      label: category.label,
      description: category.description ?? "",
      image: category.image ?? "",
      imageFile: null,
      removeImage: false,
    });

    setErrors(EMPTY_ERRORS);
    setImagePreview(category.image ?? "");
    setModalMode("edit");
  };

  /*
   * ============================================================
   * CLOSE MODAL
   * ============================================================
   */

  const closeModal = () => {
    setModalMode(null);
    setSelectedCategory(null);
    setForm(EMPTY_FORM);
    setErrors(EMPTY_ERRORS);
    setImagePreview("");
  };

  /*
   * ============================================================
   * IMAGE SELECTION
   * ============================================================
   */

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Validate type
     */
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        image: "Only PNG, JPG, JPEG, and WEBP images are allowed.",
      }));

      event.target.value = "";
      return;
    }

    /*
     * Validate size
     */
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((previous) => ({
        ...previous,
        image: "Image size must not exceed 5 MB.",
      }));

      event.target.value = "";
      return;
    }

    setErrors((previous) => ({
      ...previous,
      image: undefined,
    }));

    setForm((previous) => ({
      ...previous,
      imageFile: file,
      removeImage: false,
    }));

    /*
     * Reset input so selecting the same file again works.
     */
    event.target.value = "";
  };

  /*
   * ============================================================
   * REMOVE IMAGE
   * ============================================================
   */

  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      imageFile: null,
      image: "",
      removeImage: modalMode === "edit",
    }));

    setImagePreview("");

    setErrors((previous) => ({
      ...previous,
      image: undefined,
    }));
  };

  /*
   * ============================================================
   * CREATE CATEGORY
   * ============================================================
   */

  const handleCreate = async () => {
    if (createCategoryLoading || updateCategoryLoading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();

    formData.append("Label", form.label.trim());

    if (form.description.trim()) {
      formData.append("Description", form.description.trim());
    }

    formData.append("IsActive", "true");

    /*
     * Always keep "All" at displayOrder 1.
     *
     * New categories get the next available order.
     */
    const maxDisplayOrder = data.reduce(
      (max, category) => Math.max(max, category.displayOrder),
      1,
    );

    formData.append("DisplayOrder", String(maxDisplayOrder + 1));

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    try {
      const response = await createCategory(formData).unwrap();
      if (response.success) {
        closeModal();

        showToast("Category created successfully.", "success");

        refetch();
      } else {
        showToast(
          response.message || "Failed to create category. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Create category failed:", error);

      showToast("Failed to create category. Please try again.", "error");
    }
  };

  /*
   * ============================================================
   * UPDATE CATEGORY
   * ============================================================
   */

  const handleUpdate = async () => {
    if (!selectedCategory) {
      return;
    }

    if (createCategoryLoading || updateCategoryLoading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();

    formData.append("Id", selectedCategory.id.toString());
    formData.append("Label", form.label.trim());

    if (form.description.trim()) {
      formData.append("Description", form.description.trim());
    }

    formData.append("IsActive", String(selectedCategory.isActive));

    formData.append("DisplayOrder", String(selectedCategory.displayOrder));

    if (form.imageFile) {
      formData.append("Image", form.imageFile);
    } else {
      formData.append("Image", String(null));
    }

    if (form.removeImage) {
      formData.append("RemoveImage", String(true));
    } else {
      formData.append("RemoveImage", String(false));
    }

    try {
      const response = await updateCategory({
        category: formData,
      }).unwrap();

      if (response.success) {
        closeModal();

        showToast("Category updated successfully.", "success");

        refetch();
      } else {
        showToast(
          response.message || "Failed to update category. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Update category failed:", error);

      showToast("Failed to update category. Please try again later.", "error");
    }
  };

  /*
   * ============================================================
   * DRAG START
   * ============================================================
   */

  const handleDragStart = (
    event: React.DragEvent<HTMLTableRowElement>,
    category: CategoryMeta,
  ) => {
    /*
     * "All" cannot be dragged.
     */
    if (category.description === "all") {
      event.preventDefault();
      return;
    }

    /*
     * displayOrder 1 is reserved for "All".
     */
    if (category.displayOrder === 1) {
      event.preventDefault();
      return;
    }

    setDraggedCategory(category);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", category.id);
  };

  /*
   * ============================================================
   * DRAG OVER
   * ============================================================
   */

  const handleDragOver = (
    event: React.DragEvent<HTMLTableRowElement>,
    category: CategoryMeta,
  ) => {
    event.preventDefault();

    /*
     * Cannot drop onto "All".
     */
    if (category.description === "all") {
      setDragOverCategory(null);
      event.dataTransfer.dropEffect = "none";
      return;
    }

    /*
     * displayOrder 1 cannot be targeted.
     */
    if (category.displayOrder === 1) {
      setDragOverCategory(null);
      event.dataTransfer.dropEffect = "none";
      return;
    }

    /*
     * Cannot drop onto itself.
     */
    if (!draggedCategory || draggedCategory.id === category.id) {
      return;
    }

    event.dataTransfer.dropEffect = "move";

    setDragOverCategory(category.id);
  };

  /*
   * ============================================================
   * DRAG LEAVE
   * ============================================================
   */

  const handleDragLeave = () => {
    setDragOverCategory(null);
  };

  /*
   * ============================================================
   * DROP
   * ============================================================
   */

  const handleDrop = (
    event: React.DragEvent<HTMLTableRowElement>,
    targetCategory: CategoryMeta,
  ) => {
    event.preventDefault();

    if (!draggedCategory) {
      return;
    }

    /*
     * "All" cannot be target.
     */
    if (targetCategory.description === "all") {
      handleDragEnd();
      return;
    }

    /*
     * displayOrder 1 is protected.
     */
    if (
      draggedCategory.displayOrder === 1 ||
      targetCategory.displayOrder === 1
    ) {
      handleDragEnd();
      return;
    }

    /*
     * Cannot drop onto itself.
     */
    if (draggedCategory.id === targetCategory.id) {
      handleDragEnd();
      return;
    }

    const draggedOrder = draggedCategory.displayOrder;

    const targetOrder = targetCategory.displayOrder;

    updateOrder(
      draggedCategory.id,
      targetCategory.id,
      draggedOrder as number,
      targetOrder as number,
    );

    handleDragEnd();
  };

  const updateOrder = async (
    draggedCategoryId: string,
    targetCategoryId: string,
    targetOrder: number,
    draggedOrder: number,
  ) => {
    try {
      await updateCategoryOrder({
        draggedCategoryId,
        targetCategoryId,
        draggedOrder,
        targetOrder,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update category order:", error);
    }
  };

  /*
   * ============================================================
   * DRAG END
   * ============================================================
   */

  const handleDragEnd = () => {
    setDraggedCategory(null);
    setDragOverCategory(null);
  };

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  const handleDelete = async () => {
    if (!deleteTarget || deleteCategoryLoading) {
      return;
    }

    /*
     * "All" cannot be deleted.
     */
    if (deleteTarget.description === "all") {
      setDeleteTarget(null);
      return;
    }

    try {
      const response = await deleteCategory(deleteTarget.id).unwrap();

      if (response.success) {
        setDeleteTarget(null);

        showToast(response.data || "Category removed successfully.", "success");

        refetch();
      } else {
        showToast(
          response.message || "Failed to delete category. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Delete category failed:", error);

      showToast("Failed to delete category. Please try again.", "error");
    }
  };

  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  const isSaving = createCategoryLoading || updateCategoryLoading;

  return (
    <>
      {/* =====================================================
          TOAST
      ===================================================== */}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your menu categories and organize your dishes.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Card Header */}

        <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 lg:px-6">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              All Categories
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {data.length} {data.length === 1 ? "category" : "categories"}{" "}
              total
            </p>
          </div>

          {/* Search */}

          <div className="relative w-full sm:w-[280px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-10 text-sm text-gray-800 shadow-theme-xs outline-none transition placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="custom-scrollbar overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="px-5 py-4"></th>

                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:px-6">
                  Category
                </th>

                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Description
                </th>

                <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:px-6">
                  Actions
                </th>
              </tr>
            </thead>

            {categoriesLoading ? (
              <tbody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CategoryShimmer key={index} />
                ))}
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredCategories.map((category) => {
                  const isDefault =
                    category.description === "all" || updateOrderLoading;

                  const isDragged = draggedCategory?.id === category.id;

                  const isDragOver = dragOverCategory === category.id;

                  return (
                    <tr
                      key={category.id}
                      draggable={!isDefault}
                      onDragStart={(event) =>
                        handleDragStart(event, category as CategoryMeta)
                      }
                      onDragOver={(event) =>
                        handleDragOver(event, category as CategoryMeta)
                      }
                      onDragLeave={handleDragLeave}
                      onDrop={(event) =>
                        handleDrop(event, category as CategoryMeta)
                      }
                      onDragEnd={handleDragEnd}
                      className={`
                          transition
                          ${
                            !isDefault
                              ? "cursor-grab active:cursor-grabbing"
                              : "cursor-default"
                          }
                          hover:bg-gray-50
                          dark:hover:bg-white/[0.02]
                          ${isDragged ? "opacity-40" : ""}
                          ${
                            isDragOver && !isDefault
                              ? "bg-brand-50 ring-2 ring-inset ring-brand-500 dark:bg-brand-500/10"
                              : ""
                          }
                        `}
                    >
                      {/* Drag handle */}

                      <td className="px-4 py-4">
                        <div
                          className={`
                              shrink-0
                              ${
                                isDefault
                                  ? "text-gray-200 dark:text-gray-700"
                                  : "cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing dark:text-gray-600 dark:hover:text-gray-400"
                              }
                            `}
                          title={
                            isDefault
                              ? "Default category cannot be moved"
                              : "Drag to reorder"
                          }
                        >
                          <GripVertical size={18} />
                        </div>
                      </td>

                      {/* Category */}

                      <td className="whitespace-nowrap px-5 py-4 lg:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            {category.image ? (
                              <img
                                src={baseUrl + category.image}
                                alt={category.label}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon size={20} className="text-gray-400" />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-800 dark:text-white/90">
                              {category.label}
                            </p>

                            {isDefault && (
                              <span className="mt-1 inline-flex rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Description */}

                      <td className="px-5 py-4">
                        <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                          {category.description || "No description"}
                        </p>
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4 lg:px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isDefault}
                            onClick={() =>
                              openEditModal(category as CategoryMeta)
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
                          >
                            <Edit3 size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={isDefault}
                            onClick={() =>
                              setDeleteTarget(category as CategoryMeta)
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-error-600 transition hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-error-400 dark:hover:bg-error-500/10"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Empty */}

                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          <Search size={21} />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                          No categories found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Try changing your search or create a new category.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      <AnimatePresence>
        {modalMode && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/50 p-3 backdrop-blur-[2px] sm:p-4"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={
              !createCategoryLoading && !updateCategoryLoading
                ? closeModal
                : () => {}
            }
          >
            <motion.div
              className="flex h-[90vh] max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900"
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              {/* Header */}

              <div className="flex shrink-0 items-start justify-between border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5 dark:border-gray-800">
                <div className="min-w-0 pr-4">
                  <h2 className="truncate text-lg font-semibold text-gray-800 dark:text-white/90">
                    {modalMode === "create" ? "Add Category" : "Edit Category"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {modalMode === "create"
                      ? "Create a new menu category."
                      : "Update the category information."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                  {/* Category Name */}

                  <div>
                    <label
                      htmlFor="category-label"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Category Name <span className="text-error-500">*</span>
                    </label>

                    <input
                      id="category-label"
                      type="text"
                      maxLength={100}
                      value={form.label}
                      onChange={(event) => {
                        setForm((previous) => ({
                          ...previous,
                          label: event.target.value,
                        }));

                        if (errors.label) {
                          setErrors((previous) => ({
                            ...previous,
                            label: undefined,
                          }));
                        }
                      }}
                      placeholder="e.g. Pizza"
                      className={`
                        h-11 w-full rounded-lg border bg-transparent px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400
                        focus:ring-3
                        dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500
                        ${
                          errors.label
                            ? "border-error-500 focus:border-error-500 focus:ring-error-500/10 dark:border-error-500"
                            : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700"
                        }
                      `}
                    />

                    {errors.label && (
                      <p className="mt-1.5 text-xs text-error-500">
                        {errors.label}
                      </p>
                    )}
                  </div>

                  {/* Description */}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="category-description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>

                      <span className="text-xs text-gray-400">
                        {form.description.length}
                        /500
                      </span>
                    </div>

                    <textarea
                      id="category-description"
                      rows={4}
                      maxLength={500}
                      value={form.description}
                      onChange={(event) => {
                        setForm((previous) => ({
                          ...previous,
                          description: event.target.value,
                        }));

                        if (errors.description) {
                          setErrors((previous) => ({
                            ...previous,
                            description: undefined,
                          }));
                        }
                      }}
                      placeholder="Describe this category..."
                      className={`
                        w-full resize-none rounded-lg border bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500
                        ${
                          errors.description
                            ? "border-error-500 focus:border-error-500 focus:ring-error-500/10 dark:border-error-500"
                            : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700"
                        }
                      `}
                    />

                    {errors.description && (
                      <p className="text-xs text-error-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Image */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category Image
                    </label>

                    {imagePreview ? (
                      <div
                        className={`overflow-hidden rounded-xl border ${
                          errors.image
                            ? "border-error-500"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={
                              modalMode === "create" || form.imageFile
                                ? imagePreview
                                : baseUrl + imagePreview
                            }
                            alt="Category preview"
                            className="h-48 w-full object-cover sm:h-56"
                          />

                          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-12">
                            <span className="min-w-0 truncate text-xs font-medium text-white">
                              {form.imageFile
                                ? form.imageFile.name
                                : "Current image"}
                            </span>

                            <button
                              type="button"
                              onClick={removeImage}
                              disabled={isSaving}
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-error-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="category-image"
                        className={`
                          flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-8 text-center transition
                          ${
                            errors.image
                              ? "border-error-500 bg-error-50/30 dark:border-error-500 dark:bg-error-500/5"
                              : "border-gray-300 hover:border-brand-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-white/[0.02]"
                          }
                        `}
                      >
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          <Upload size={22} />
                        </div>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Click to upload an image
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, JPEG or WEBP
                        </p>

                        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                          Maximum size: 5 MB
                        </p>

                        <input
                          id="category-image"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isSaving}
                        />
                      </label>
                    )}

                    {errors.image && (
                      <p className="mt-1.5 text-xs text-error-500">
                        {errors.image}
                      </p>
                    )}

                    {imagePreview && (
                      <label
                        htmlFor="category-image-change"
                        className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-500 transition hover:text-brand-600"
                      >
                        <Upload size={16} />
                        Change image
                        <input
                          id="category-image-change"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isSaving}
                        />
                      </label>
                    )}
                  </div>

                  {/* Selected image info */}

                  {form.imageFile && (
                    <div className="rounded-lg bg-success-50 px-3 py-2.5 dark:bg-success-500/10">
                      <p className="break-all text-xs text-success-700 dark:text-success-400">
                        Selected:{" "}
                        <span className="font-medium">
                          {form.imageFile.name}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}

              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={closeModal}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={modalMode === "create" ? handleCreate : handleUpdate}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSaving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {modalMode === "create"
                    ? isSaving
                      ? "Creating..."
                      : "Create Category"
                    : isSaving
                      ? "Saving..."
                      : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-[2px]"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900"
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 10,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="px-5 py-7 text-center sm:px-6">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400">
                  <AlertTriangle size={26} />
                </div>

                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Delete Category?
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete{" "}
                  <strong className="font-semibold text-gray-700 dark:text-gray-300">
                    {deleteTarget.label}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-error-600 sm:w-auto"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
