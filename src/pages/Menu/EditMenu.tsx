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

import { menuItems } from "../../data/menu";
import type { MenuCategory, MenuItem } from "../../types";

const CATEGORIES: {
    value: MenuCategory;
    label: string;
}[] = [
        { value: "pizza", label: "Pizza" },
        { value: "pasta", label: "Pasta" },
        { value: "burgers", label: "Burgers" },
        { value: "fries", label: "Fries" },
        { value: "rolls", label: "Rolls" },
        { value: "desserts", label: "Desserts" },
        { value: "drinks", label: "Drinks" },
    ];

type Variant = {
    name: string;
    price: number;
};

type FormState = {
    name: string;
    slug: string;
    category: MenuCategory;
    description: string;
    image: string;
    featured: boolean;
    popular: boolean;
    variants: Variant[];
};

export default function EditMenu() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const existingItem = useMemo<MenuItem | undefined>(() => {
        return menuItems.find(
            (item) => item.id === id || item.slug === id,
        );
    }, [id]);

    const [form, setForm] = useState<FormState>(() => {
        if (!existingItem) {
            return {
                name: "",
                slug: "",
                category: "pizza",
                description: "",
                image: "",
                featured: false,
                popular: false,
                variants: [
                    {
                        name: "",
                        price: 0,
                    },
                ],
            };
        }

        return {
            name: existingItem.name,
            slug: existingItem.slug,
            category: existingItem.category,
            description: existingItem.description,
            image: existingItem.image,
            featured: existingItem.featured ?? false,
            popular: existingItem.popular ?? false,
            variants: existingItem.variants.map((variant) => ({
                name: variant.name,
                price: variant.price,
            })),
        };
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    /* ================================================================ */
    /* IMAGE STATE                                                       */
    /* ================================================================ */

    const [selectedImage, setSelectedImage] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string>(existingItem?.image ?? "");

    const [imageInputKey, setImageInputKey] =
        useState(0);

    /* ================================================================ */
    /* SUCCESS MODAL                                                     */
    /* ================================================================ */

    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

    /* ================================================================ */
    /* IMAGE PREVIEW CLEANUP                                             */
    /* ================================================================ */

    useEffect(() => {
        return () => {
            if (imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (!existingItem) {
        return <MenuItemNotFound />;
    }

    /* ================================================================ */
    /* HANDLE INPUT                                                      */
    /* ================================================================ */

    const handleChange = (
        field: keyof FormState,
        value: string | boolean | MenuCategory,
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: "",
        }));
    };

    /* ================================================================ */
    /* IMAGE HANDLER                                                      */
    /* ================================================================ */

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        /* Validate file type */
        if (!file.type.startsWith("image/")) {
            setErrors((previous) => ({
                ...previous,
                image: "Please select a valid image file.",
            }));

            return;
        }

        /* Validate file size - 5 MB */
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            setErrors((previous) => ({
                ...previous,
                image: "Image size must be less than 5 MB.",
            }));

            return;
        }

        /* Revoke previous object URL */
        if (imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        const previewUrl = URL.createObjectURL(file);

        setSelectedImage(file);
        setImagePreview(previewUrl);

        setErrors((previous) => ({
            ...previous,
            image: "",
        }));
    };

    const removeSelectedImage = () => {
        if (imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        setSelectedImage(null);
        setImagePreview(form.image);

        setImageInputKey((previous) => previous + 1);

        setErrors((previous) => ({
            ...previous,
            image: "",
        }));
    };

    /* ================================================================ */
    /* VARIANT HANDLERS                                                  */
    /* ================================================================ */

    const updateVariant = (
        index: number,
        field: keyof Variant,
        value: string | number,
    ) => {
        setForm((previous) => ({
            ...previous,
            variants: previous.variants.map(
                (variant, variantIndex) =>
                    variantIndex === index
                        ? {
                            ...variant,
                            [field]: value,
                        }
                        : variant,
            ),
        }));

        setErrors((previous) => ({
            ...previous,
            variants: "",
        }));
    };

    const addVariant = () => {
        setForm((previous) => ({
            ...previous,
            variants: [
                ...previous.variants,
                {
                    name: "",
                    price: 0,
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
                (_, variantIndex) =>
                    variantIndex !== index,
            ),
        }));
    };

    /* ================================================================ */
    /* VALIDATION                                                        */
    /* ================================================================ */

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) {
            newErrors.name =
                "Menu item name is required.";
        }

        if (!form.slug.trim()) {
            newErrors.slug = "Slug is required.";
        }

        if (!form.description.trim()) {
            newErrors.description =
                "Description is required.";
        }

        /*
         * Image is valid if either:
         * - existing image exists
         * - new image has been selected
         */
        if (!form.image.trim() && !selectedImage) {
            newErrors.image =
                "Please select an image.";
        }

        if (form.variants.length === 0) {
            newErrors.variants =
                "At least one variant is required.";
        }

        form.variants.forEach((variant, index) => {
            if (!variant.name.trim()) {
                newErrors[`variant-${index}-name`] =
                    "Variant name is required.";
            }

            if (
                variant.price === undefined ||
                variant.price === null ||
                Number.isNaN(Number(variant.price)) ||
                Number(variant.price) <= 0
            ) {
                newErrors[`variant-${index}-price`] =
                    "Enter a valid price.";
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* ================================================================ */
    /* SAVE                                                              */
    /* ================================================================ */

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        try {
            /*
             * If a new image was selected, this is where you upload it.
             *
             * Example:
             *
             * const imageUrl = selectedImage
             *     ? await uploadImageToCloudinary(selectedImage)
             *     : form.image;
             *
             * Then save imageUrl to Firestore.
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 700),
            );

            console.log("Updated menu item:", {
                id: existingItem.id,
                ...form,
                imageFile: selectedImage,
            });

            /*
             * Update local form image if a new image was selected.
             *
             * In your real Firestore implementation this should
             * instead be the uploaded image URL.
             */
            if (selectedImage) {
                console.log(
                    "New image selected:",
                    selectedImage,
                );
            }

            setShowSuccessModal(true);
        } catch (error) {
            console.error(
                "Error updating menu item:",
                error,
            );
        } finally {
            setIsSaving(false);
        }
    };

    /* ================================================================ */
    /* RESET                                                              */
    /* ================================================================ */

    const handleReset = () => {
        if (imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        setForm({
            name: existingItem.name,
            slug: existingItem.slug,
            category: existingItem.category,
            description: existingItem.description,
            image: existingItem.image,
            featured: existingItem.featured ?? false,
            popular: existingItem.popular ?? false,
            variants: existingItem.variants.map(
                (variant) => ({
                    name: variant.name,
                    price: variant.price,
                }),
            ),
        });

        setSelectedImage(null);
        setImagePreview(existingItem.image);
        setImageInputKey((previous) => previous + 1);
        setErrors({});
    };

    /* ================================================================ */
    /* SUCCESS MODAL CLOSE                                               */
    /* ================================================================ */

    const handleSuccessDone = () => {
        setShowSuccessModal(false);
        navigate("/");
    };

    return (
        <>
            <div className="space-y-6">
                {/* ============================================================ */}
                {/* BREADCRUMBS                                                   */}
                {/* ============================================================ */}

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link
                        to="/"
                        className="transition hover:text-brand-500"
                    >
                        Home
                    </Link>

                    <ChevronRight size={15} />

                    <Link
                        to="/menu-items"
                        className="transition hover:text-brand-500"
                    >
                        Menu Items
                    </Link>

                    <ChevronRight size={15} />

                    <span className="text-gray-800 dark:text-white/90">
                        Edit Menu Item
                    </span>
                </div>

                {/* ============================================================ */}
                {/* HEADER                                                         */}
                {/* ============================================================ */}

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
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <X size={16} />
                            Reset
                        </button>

                        <button
                            type="submit"
                            form="edit-menu-form"
                            disabled={isSaving}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? (
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

                {/* ============================================================ */}
                {/* FORM                                                           */}
                {/* ============================================================ */}

                <form
                    id="edit-menu-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* ========================================================== */}
                    {/* BASIC INFORMATION                                           */}
                    {/* ========================================================== */}

                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Update the basic information of your
                                menu item.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                            {/* NAME */}
                            <FormField
                                label="Menu Item Name"
                                required
                                error={errors.name}
                            >
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(event) =>
                                        handleChange(
                                            "name",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. Margherita Classica"
                                    className={inputClass(
                                        Boolean(errors.name),
                                    )}
                                />
                            </FormField>

                            {/* SLUG */}
                            <FormField
                                label="Slug"
                                required
                                error={errors.slug}
                            >
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(event) =>
                                        handleChange(
                                            "slug",
                                            event.target.value
                                                .toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    "-",
                                                ),
                                        )
                                    }
                                    placeholder="margherita-classica"
                                    className={inputClass(
                                        Boolean(errors.slug),
                                    )}
                                />
                            </FormField>

                            {/* CATEGORY */}
                            <FormField
                                label="Category"
                                required
                            >
                                <select
                                    value={form.category}
                                    onChange={(event) =>
                                        handleChange(
                                            "category",
                                            event.target
                                                .value as MenuCategory,
                                        )
                                    }
                                    className={inputClass(false)}
                                >
                                    {CATEGORIES.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.value
                                                }
                                                value={
                                                    category.value
                                                }
                                            >
                                                {
                                                    category.label
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </FormField>

                            {/* DESCRIPTION */}
                            <div className="lg:col-span-2">
                                <FormField
                                    label="Description"
                                    required
                                    error={
                                        errors.description
                                    }
                                >
                                    <textarea
                                        rows={5}
                                        value={
                                            form.description
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                "description",
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="Describe your menu item..."
                                        className={inputClass(
                                            Boolean(
                                                errors.description,
                                            ),
                                        )}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* IMAGE                                                        */}
                    {/* ========================================================== */}

                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Item Image
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Select a new image from your
                                computer to update this menu item.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[1fr_280px]">
                            {/* IMAGE UPLOAD */}
                            <FormField
                                label="Menu Item Image"
                                required
                                error={errors.image}
                            >
                                <input
                                    key={imageInputKey}
                                    id="menu-item-image"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                                    className="hidden"
                                    onChange={
                                        handleImageChange
                                    }
                                />

                                <label
                                    htmlFor="menu-item-image"
                                    className={`group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${errors.image
                                            ? "border-error-500 bg-error-50/30 dark:bg-error-500/5"
                                            : "border-gray-200 bg-gray-50 hover:border-brand-400 hover:bg-brand-50/30 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-brand-500 dark:hover:bg-brand-500/5"
                                        }`}
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm transition group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800">
                                        <ImageIcon
                                            size={22}
                                        />
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

                                {/* SELECTED FILE */}
                                {selectedImage && (
                                    <div className="mt-3 flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 dark:border-brand-500/20 dark:bg-brand-500/10">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <Check
                                                size={16}
                                                className="shrink-0 text-brand-500"
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {
                                                        selectedImage.name
                                                    }
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {(
                                                        selectedImage.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(
                                                        2,
                                                    )}{" "}
                                                    MB
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                removeSelectedImage
                                            }
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-error-500 dark:hover:bg-gray-800"
                                            title="Remove selected image"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                <p className="mt-2 text-xs text-gray-400">
                                    Leave the existing image unchanged
                                    if you don't want to replace it.
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
                                                    setImagePreview(
                                                        "",
                                                    );
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
                                            <ImageIcon
                                                size={28}
                                            />

                                            <span className="mt-2 text-xs">
                                                No image
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* VARIANTS                                                     */}
                    {/* ========================================================== */}

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

                            {form.variants.map(
                                (variant, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                                                    <Utensils
                                                        size={15}
                                                    />
                                                </div>

                                                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    Variant{" "}
                                                    {index +
                                                        1}
                                                </span>
                                            </div>

                                            {form.variants
                                                .length >
                                                1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeVariant(
                                                                index,
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10"
                                                        title="Remove variant"
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <FormField
                                                label="Variant Name"
                                                required
                                                error={
                                                    errors[
                                                    `variant-${index}-name`
                                                    ]
                                                }
                                            >
                                                <input
                                                    type="text"
                                                    value={
                                                        variant.name
                                                    }
                                                    onChange={(
                                                        event,
                                                    ) =>
                                                        updateVariant(
                                                            index,
                                                            "name",
                                                            event
                                                                .target
                                                                .value,
                                                        )
                                                    }
                                                    placeholder="e.g. Medium"
                                                    className={inputClass(
                                                        Boolean(
                                                            errors[
                                                            `variant-${index}-name`
                                                            ],
                                                        ),
                                                    )}
                                                />
                                            </FormField>

                                            <FormField
                                                label="Price"
                                                required
                                                error={
                                                    errors[
                                                    `variant-${index}-price`
                                                    ]
                                                }
                                            >
                                                <div className="relative">
                                                    <span className="absolute left-3 top-3.5 text-sm text-gray-400">
                                                        Rs.
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={
                                                            variant.price
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            updateVariant(
                                                                index,
                                                                "price",
                                                                Number(
                                                                    event
                                                                        .target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        placeholder="1200"
                                                        className={`${inputClass(
                                                            Boolean(
                                                                errors[
                                                                `variant-${index}-price`
                                                                ],
                                                            ),
                                                        )} pl-11`}
                                                    />
                                                </div>
                                            </FormField>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* VISIBILITY / FEATURES                                       */}
                    {/* ========================================================== */}

                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Visibility & Features
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Control how this item appears throughout
                                your website.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                            <ToggleCard
                                icon={
                                    <Star
                                        size={18}
                                        fill={
                                            form.featured
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                }
                                title="Featured Item"
                                description="Display this item in your featured menu section."
                                checked={form.featured}
                                onChange={(checked) =>
                                    handleChange(
                                        "featured",
                                        checked,
                                    )
                                }
                            />

                            <ToggleCard
                                icon={<Check size={18} />}
                                title="Popular Item"
                                description="Mark this item as popular for customers."
                                checked={form.popular}
                                onChange={(checked) =>
                                    handleChange(
                                        "popular",
                                        checked,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* ========================================================== */}
                    {/* FORM ACTIONS                                                 */}
                    {/* ========================================================== */}

                    <div className="flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft size={16} />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving ? (
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

            {/* ================================================================ */}
            {/* SUCCESS MODAL                                                     */}
            {/* ================================================================ */}

            {showSuccessModal && (
                <SuccessModal
                    itemName={form.name}
                    onDone={handleSuccessDone}
                />
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

                {required && (
                    <span className="ml-1 text-error-500">
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <p className="mt-1.5 text-xs text-error-500">
                    {error}
                </p>
            )}
        </div>
    );
}

/* ========================================================================= */
/* INPUT CLASS                                                               */
/* ========================================================================= */

function inputClass(hasError: boolean) {
    return `h-11 w-full rounded-lg border bg-transparent px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 ${hasError
            ? "border-error-500"
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
            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${checked
                    ? "border-brand-300 bg-brand-50/50 dark:border-brand-500/30 dark:bg-brand-500/5"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                }`}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${checked
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

                <p className="mt-1 text-xs leading-5 text-gray-400">
                    {description}
                </p>
            </div>

            <div
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked
                        ? "bg-brand-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
                onClick={onDone}
            />

            {/* MODAL */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                {/* TOP DECORATION */}
                <div className="absolute inset-x-0 top-0 h-1 bg-brand-500" />

                <div className="p-7 text-center sm:p-8">
                    {/* SUCCESS ICON */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/25">
                            <Check
                                size={24}
                                strokeWidth={2.5}
                            />
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
                    The menu item you're trying to edit
                    doesn't exist.
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