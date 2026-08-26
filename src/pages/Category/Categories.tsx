import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    Edit3,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    Upload,
    X,
} from "lucide-react";

import { categories as initialCategories } from "../../data/categories";
import type { CategoryMeta } from "../../types";

type ModalMode = "create" | "edit" | null;

interface CategoryForm {
    label: string;
    description: string;
    image: string;
    imageFile: File | null;
}

const EMPTY_FORM: CategoryForm = {
    label: "",
    description: "",
    image: "",
    imageFile: null,
};

export default function Categories() {
    const [categoryList, setCategoryList] =
        useState<CategoryMeta[]>(initialCategories);

    const [searchQuery, setSearchQuery] = useState("");

    const [modalMode, setModalMode] =
        useState<ModalMode>(null);

    const [selectedCategory, setSelectedCategory] =
        useState<CategoryMeta | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<CategoryMeta | null>(null);

    const [form, setForm] =
        useState<CategoryForm>(EMPTY_FORM);

    const [imagePreview, setImagePreview] =
        useState<string>("");

    /*
     * Create local image preview
     */
    useEffect(() => {
        if (!form.imageFile) {
            return;
        }

        const previewUrl = URL.createObjectURL(
            form.imageFile
        );

        setImagePreview(previewUrl);

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [form.imageFile]);

    /*
     * Search categories
     */
    const filteredCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return categoryList;
        }

        return categoryList.filter((category) => {
            return (
                category.label
                    .toLowerCase()
                    .includes(query) ||
                category.id
                    .toLowerCase()
                    .includes(query) ||
                category.description
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [categoryList, searchQuery]);

    /*
     * Open create modal
     */
    const openCreateModal = () => {
        setSelectedCategory(null);
        setForm(EMPTY_FORM);
        setImagePreview("");
        setModalMode("create");
    };

    /*
     * Open edit modal
     */
    const openEditModal = (category: CategoryMeta) => {
        setSelectedCategory(category);

        setForm({
            label: category.label,
            description: category.description ?? "",
            image: category.image ?? "",
            imageFile: null,
        });

        setImagePreview(category.image ?? "");
        setModalMode("edit");
    };

    /*
     * Close modal
     */
    const closeModal = () => {
        setModalMode(null);
        setSelectedCategory(null);
        setForm(EMPTY_FORM);
        setImagePreview("");
    };

    /*
     * Image selection
     */
    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            event.target.value = "";
            return;
        }

        setForm((previous) => ({
            ...previous,
            imageFile: file,
        }));
    };

    /*
     * Remove image
     */
    const removeImage = () => {
        setForm((previous) => ({
            ...previous,
            imageFile: null,
            image: "",
        }));

        setImagePreview("");
    };

    /*
     * Generate category ID
     */
    const createCategoryId = (label: string) => {
        return label
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    /*
     * Save category
     */
    const handleSave = () => {
        const label = form.label.trim();

        if (!label) {
            return;
        }

        /*
         * CREATE
         */
        if (modalMode === "create") {
            const baseId = createCategoryId(label);

            let id = baseId;
            let counter = 1;

            while (
                categoryList.some(
                    (category) => category.id === id
                )
            ) {
                id = `${baseId}-${counter}`;
                counter++;
            }

            /*
             * Temporary browser preview.
             *
             * Replace this with your permanent uploaded
             * image URL when connecting Cloudinary/Firebase/
             * Vercel Blob.
             */
            const imageUrl =
                form.imageFile && imagePreview
                    ? imagePreview
                    : "";

            const newCategory: CategoryMeta = {
                id: id as CategoryMeta["id"],
                label,

                ...(form.description.trim()
                    ? {
                        description:
                            form.description.trim(),
                    }
                    : {}),

                ...(imageUrl
                    ? {
                        image: imageUrl,
                    }
                    : {}),
            };

            setCategoryList((previous) => [
                ...previous,
                newCategory,
            ]);

            closeModal();
            return;
        }

        /*
         * EDIT
         */
        if (
            modalMode === "edit" &&
            selectedCategory
        ) {
            const imageUrl = form.imageFile
                ? imagePreview
                : form.image;

            setCategoryList((previous) =>
                previous.map((category) =>
                    category.id === selectedCategory.id
                        ? {
                            ...category,
                            label,
                            description:
                                form.description.trim() ||
                                undefined,
                            image:
                                imageUrl || undefined,
                        }
                        : category
                )
            );

            closeModal();
        }
    };

    /*
     * Delete category
     */
    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setCategoryList((previous) =>
            previous.filter(
                (category) =>
                    category.id !== deleteTarget.id
            )
        );

        setDeleteTarget(null);
    };

    return (
        <>
            {/* =====================================================
          PAGE HEADER
      ===================================================== */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
                        Categories
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your menu categories and organize
                        your dishes.
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
                            {categoryList.length}{" "}
                            {categoryList.length === 1
                                ? "category"
                                : "categories"}{" "}
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
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-10 text-sm text-gray-800 shadow-theme-xs outline-none transition placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearchQuery("")
                                }
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
                                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:px-6">
                                    Category
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Description
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    ID
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:px-6">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredCategories.map(
                                (category) => (
                                    <tr
                                        key={category.id}
                                        className="transition hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                    >
                                        {/* Category */}
                                        <td className="whitespace-nowrap px-5 py-4 lg:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.label}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                                        {category.label}
                                                    </p>

                                                    {category.id ===
                                                        "all" && (
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
                                                {category.description ||
                                                    "No description"}
                                            </p>
                                        </td>

                                        {/* ID */}
                                        <td className="px-5 py-4">
                                            <span className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                {category.id}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4 lg:px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            category
                                                        )
                                                    }
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                                                >
                                                    <Edit3 size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        category.id === "all"
                                                    }
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            category
                                                        )
                                                    }
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-error-600 transition hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-error-400 dark:hover:bg-error-500/10"
                                                >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}

                            {/* Empty */}
                            {filteredCategories.length ===
                                0 && (
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
                                                    Try changing your search
                                                    or create a new category.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =====================================================
          ADD / EDIT MODAL
          90% OF VIEWPORT HEIGHT
      ===================================================== */}
            {modalMode && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 p-3 backdrop-blur-[2px] sm:p-4">
                    <div className="flex h-[90vh] max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
                        {/* =================================================
                MODAL HEADER
            ================================================= */}
                        <div className="flex shrink-0 items-start justify-between border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5 dark:border-gray-800">
                            <div className="min-w-0 pr-4">
                                <h2 className="truncate text-lg font-semibold text-gray-800 dark:text-white/90">
                                    {modalMode === "create"
                                        ? "Add Category"
                                        : "Edit Category"}
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
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* =================================================
                MODAL BODY
                SCROLLABLE
            ================================================= */}
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                                {/* =============================================
                    CATEGORY NAME
                ============================================= */}
                                <div>
                                    <label
                                        htmlFor="category-label"
                                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Category Name{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="category-label"
                                        type="text"
                                        value={form.label}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                label:
                                                    event.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Pizza"
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
                                    />
                                </div>

                                {/* =============================================
                    DESCRIPTION
                ============================================= */}
                                <div>
                                    <label
                                        htmlFor="category-description"
                                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="category-description"
                                        rows={4}
                                        value={form.description}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                description:
                                                    event.target.value,
                                            }))
                                        }
                                        placeholder="Describe this category..."
                                        className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
                                    />
                                </div>

                                {/* =============================================
                    IMAGE UPLOAD
                ============================================= */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category Image
                                    </label>

                                    {imagePreview ? (
                                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                            {/* Image */}
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Category preview"
                                                    className="h-48 w-full object-cover sm:h-56"
                                                />

                                                {/* Image overlay */}
                                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-12">
                                                    <span className="min-w-0 truncate text-xs font-medium text-white">
                                                        {form.imageFile
                                                            ? form.imageFile
                                                                .name
                                                            : "Current image"}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            removeImage
                                                        }
                                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-error-600 transition hover:bg-white"
                                                    >
                                                        <Trash2
                                                            size={14}
                                                        />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="category-image"
                                            className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-8 text-center transition hover:border-brand-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-white/[0.02]"
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
                                                Recommended: 800 × 600px
                                            </p>

                                            <input
                                                id="category-image"
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                onChange={
                                                    handleImageChange
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    )}

                                    {/* Change image */}
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
                                                onChange={
                                                    handleImageChange
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* =============================================
                    MOBILE IMAGE INFO
                ============================================= */}
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

                        {/* =================================================
                MODAL FOOTER
                ALWAYS VISIBLE
            ================================================= */}
                        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!form.label.trim()}
                                onClick={handleSave}
                                className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {modalMode === "create"
                                    ? "Create Category"
                                    : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}
            {deleteTarget && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900">
                        <div className="px-5 py-7 text-center sm:px-6">
                            {/* Warning */}
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
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
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
                    </div>
                </div>
            )}
        </>
    );
}