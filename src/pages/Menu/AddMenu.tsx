import { useRef, useState } from "react";
import {
    Check,
    ChevronRight,
    ImagePlus,
    Plus,
    Trash2,
    Upload,
    Star,
    Flame,
    ArrowRight,
    Utensils,
    X,
} from "lucide-react";

import type { MenuItem, MenuCategory } from "../../types";
import { useNavigate } from "react-router";

type Variant = {
    name: string;
    price: string;
};

const categories: {
    label: string;
    value: MenuCategory;
}[] = [
        { label: "Pizza", value: "pizza" },
        { label: "Pasta", value: "pasta" },
        { label: "Burgers", value: "burgers" },
        { label: "Fries", value: "fries" },
        { label: "Rolls", value: "rolls" },
        { label: "Desserts", value: "desserts" },
        { label: "Drinks", value: "drinks" },
    ];

const initialVariant: Variant = {
    name: "",
    price: "",
};

export default function AddMenu() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState<MenuCategory | "">("");
    const [description, setDescription] = useState("");

    const [image, setImage] = useState<string | null>(null);

    const [featured, setFeatured] = useState(false);
    const [popular, setPopular] = useState(false);

    const [variants, setVariants] = useState<Variant[]>([
        {
            name: "",
            price: "",
        },
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    /*
     * Controls the success modal.
     */
    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

    /* ---------------------------------------------------------------------- */
    /* Slug                                                                    */
    /* ---------------------------------------------------------------------- */

    const generateSlug = (value: string) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleNameChange = (value: string) => {
        setName(value);

        if (!slug || slug === generateSlug(name)) {
            setSlug(generateSlug(value));
        }
    };

    /* ---------------------------------------------------------------------- */
    /* Image                                                                    */
    /* ---------------------------------------------------------------------- */

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);

        setImage(imageUrl);
    };

    const removeImage = () => {
        setImage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /* ---------------------------------------------------------------------- */
    /* Variants                                                                 */
    /* ---------------------------------------------------------------------- */

    const addVariant = () => {
        setVariants((current) => [
            ...current,
            {
                ...initialVariant,
            },
        ]);
    };

    const removeVariant = (index: number) => {
        if (variants.length === 1) return;

        setVariants((current) =>
            current.filter(
                (_, variantIndex) =>
                    variantIndex !== index,
            ),
        );
    };

    const updateVariant = (
        index: number,
        field: keyof Variant,
        value: string,
    ) => {
        setVariants((current) =>
            current.map((variant, variantIndex) =>
                variantIndex === index
                    ? {
                        ...variant,
                        [field]: value,
                    }
                    : variant,
            ),
        );
    };

    /* ---------------------------------------------------------------------- */
    /* Reset Form                                                              */
    /* ---------------------------------------------------------------------- */

    const resetForm = () => {
        setName("");
        setSlug("");
        setCategory("");
        setDescription("");
        setImage(null);
        setFeatured(false);
        setPopular(false);

        setVariants([
            {
                ...initialVariant,
            },
        ]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /* ---------------------------------------------------------------------- */
    /* Success Modal Actions                                                   */
    /* ---------------------------------------------------------------------- */

    const handleAddAnother = () => {
        setShowSuccessModal(false);

        resetForm();

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleViewMenu = () => {
        /*
         * Change this route if your menu items route
         * is different.
         */
        navigate("/");
    };

    /* ---------------------------------------------------------------------- */
    /* Submit                                                                   */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setIsSubmitting(true);

        const menuItem: Partial<MenuItem> = {
            id: crypto.randomUUID(),
            name,
            slug,
            category: category as MenuCategory,
            description,
            image: image ?? "",
            featured,
            popular,
            variants: variants
                .filter(
                    (variant) =>
                        variant.name.trim() !== "",
                )
                .map((variant) => ({
                    name: variant.name,
                    price: Number(variant.price),
                })),
        };

        console.log("Menu item:", menuItem);

        /*
         * Later replace this with:
         *
         * await addDish(menuItem);
         *
         * or your Firestore service.
         */

        try {
            await new Promise((resolve) =>
                setTimeout(resolve, 700),
            );

            /*
             * Only show the success modal after the
             * item has actually been added successfully.
             */
            setShowSuccessModal(true);
        } catch (error) {
            console.error(
                "Error adding menu item:",
                error,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* ---------------------------------------------------------------- */}
                {/* Header                                                           */}
                {/* ---------------------------------------------------------------- */}

                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Home</span>

                        <ChevronRight size={15} />

                        <span>Menu Items</span>

                        <ChevronRight size={15} />

                        <span className="text-gray-800 dark:text-white/90">
                            Add Menu Item
                        </span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add Menu Item
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Add a new item to your
                            restaurant menu.
                        </p>
                    </div>
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* Form                                                             */}
                {/* ---------------------------------------------------------------- */}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        {/* ============================================================ */}
                        {/* LEFT COLUMN                                                  */}
                        {/* ============================================================ */}

                        <div className="space-y-6">
                            {/* ---------------------------------------------------------- */}
                            {/* Basic Information                                          */}
                            {/* ---------------------------------------------------------- */}

                            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                                <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                                    <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                        Basic Information
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Enter the basic
                                        details of your
                                        menu item.
                                    </p>
                                </div>

                                <div className="space-y-5 p-6">
                                    {/* Name */}
                                    <FormField
                                        label="Item Name"
                                        required
                                        htmlFor="item-name"
                                    >
                                        <input
                                            id="item-name"
                                            value={name}
                                            onChange={(event) =>
                                                handleNameChange(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            placeholder="e.g. Margherita Classica"
                                            className={
                                                inputClass
                                            }
                                            required
                                        />
                                    </FormField>

                                    {/* Slug */}
                                    <FormField
                                        label="Slug"
                                        required
                                        htmlFor="slug"
                                    >
                                        <input
                                            id="slug"
                                            value={slug}
                                            onChange={(
                                                event,
                                            ) =>
                                                setSlug(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            placeholder="margherita-classica"
                                            className={
                                                inputClass
                                            }
                                            required
                                        />

                                        <p className="mt-1.5 text-xs text-gray-400">
                                            Used for the menu
                                            item's URL.
                                        </p>
                                    </FormField>

                                    {/* Category */}
                                    <FormField
                                        label="Category"
                                        required
                                        htmlFor="category"
                                    >
                                        <div className="relative">
                                            <select
                                                id="category"
                                                value={
                                                    category
                                                }
                                                onChange={(
                                                    event,
                                                ) =>
                                                    setCategory(
                                                        event
                                                            .target
                                                            .value as MenuCategory,
                                                    )
                                                }
                                                className={`${inputClass} appearance-none pr-10`}
                                                required
                                            >
                                                <option value="">
                                                    Select a
                                                    category
                                                </option>

                                                {categories.map(
                                                    (
                                                        item,
                                                    ) => (
                                                        <option
                                                            key={
                                                                item.value
                                                            }
                                                            value={
                                                                item.value
                                                            }
                                                        >
                                                            {
                                                                item.label
                                                            }
                                                        </option>
                                                    ),
                                                )}
                                            </select>

                                            <ChevronRight
                                                size={17}
                                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400"
                                            />
                                        </div>
                                    </FormField>

                                    {/* Description */}
                                    <FormField
                                        label="Description"
                                        required
                                        htmlFor="description"
                                    >
                                        <textarea
                                            id="description"
                                            value={
                                                description
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setDescription(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            placeholder="Describe the ingredients, preparation and taste of this item..."
                                            rows={5}
                                            maxLength={500}
                                            className={`${inputClass} min-h-[130px] resize-y py-3`}
                                            required
                                        />

                                        <div className="mt-1.5 flex justify-between">
                                            <p className="text-xs text-gray-400">
                                                Keep the
                                                description
                                                concise and
                                                appetizing.
                                            </p>

                                            <span className="text-xs text-gray-400">
                                                {
                                                    description.length
                                                }
                                                /500
                                            </span>
                                        </div>
                                    </FormField>
                                </div>
                            </div>

                            {/* ---------------------------------------------------------- */}
                            {/* Variants                                                    */}
                            {/* ---------------------------------------------------------- */}

                            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                                <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                                    <div>
                                        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                            Variants & Pricing
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Add different
                                            sizes or
                                            options and
                                            their prices.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            addVariant
                                        }
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        <Plus
                                            size={16}
                                        />
                                        Add Variant
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="mb-2 hidden grid-cols-[1fr_180px_44px] gap-3 px-1 text-xs font-medium uppercase tracking-wide text-gray-400 sm:grid">
                                        <span>
                                            Variant
                                            Name
                                        </span>
                                        <span>
                                            Price
                                        </span>
                                        <span />
                                    </div>

                                    <div className="space-y-3">
                                        {variants.map(
                                            (
                                                variant,
                                                index,
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_44px]"
                                                >
                                                    <div>
                                                        <label className="mb-1.5 block text-xs font-medium text-gray-500 sm:hidden dark:text-gray-400">
                                                            Variant
                                                            Name
                                                        </label>

                                                        <input
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
                                                            className={
                                                                inputClass
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1.5 block text-xs font-medium text-gray-500 sm:hidden dark:text-gray-400">
                                                            Price
                                                        </label>

                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                                Rs.
                                                            </span>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    variant.price
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateVariant(
                                                                        index,
                                                                        "price",
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="1200"
                                                                className={`${inputClass} pl-11`}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeVariant(
                                                                    index,
                                                                )
                                                            }
                                                            disabled={
                                                                variants.length ===
                                                                1
                                                            }
                                                            className="flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-error-200 hover:bg-error-50 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-30 sm:w-11 dark:border-gray-700 dark:hover:border-error-500/30 dark:hover:bg-error-500/10"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Example
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                            Pizza → Small:
                                            Rs. 650 ·
                                            Medium: Rs.
                                            1200 · Large:
                                            Rs. 1800
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ============================================================ */}
                        {/* RIGHT COLUMN                                                 */}
                        {/* ============================================================ */}

                        <div className="space-y-6">
                            {/* ---------------------------------------------------------- */}
                            {/* Image Upload                                                */}
                            {/* ---------------------------------------------------------- */}

                            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                                <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                                    <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                        Menu Image
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Upload a
                                        high-quality
                                        image of the
                                        dish.
                                    </p>
                                </div>

                                <div className="p-6">
                                    <input
                                        ref={
                                            fileInputRef
                                        }
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={
                                            handleImageChange
                                        }
                                    />

                                    {image ? (
                                        <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={
                                                    image
                                                }
                                                alt="Menu item preview"
                                                className="aspect-[4/3] w-full object-cover"
                                            />

                                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-gray-700 backdrop-blur transition hover:bg-white"
                                                >
                                                    <Upload
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    Change
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        removeImage
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-500 text-white transition hover:bg-error-600"
                                                >
                                                    <Trash2
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="group flex aspect-[4/3] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-brand-400 hover:bg-brand-50/30 dark:border-gray-700 dark:bg-gray-800/30 dark:hover:border-brand-500 dark:hover:bg-brand-500/5"
                                        >
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition group-hover:text-brand-500 dark:bg-gray-800">
                                                <ImagePlus
                                                    size={
                                                        25
                                                    }
                                                />
                                            </div>

                                            <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                Click to
                                                upload an
                                                image
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                PNG, JPG or
                                                WEBP
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                Recommended
                                                900 ×
                                                700px
                                            </p>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ---------------------------------------------------------- */}
                            {/* Visibility                                                  */}
                            {/* ---------------------------------------------------------- */}

                            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                                <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                                    <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                        Menu Visibility
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Highlight this
                                        item across your
                                        restaurant.
                                    </p>
                                </div>

                                <div className="space-y-3 p-6">
                                    <ToggleOption
                                        icon={
                                            <Star
                                                size={
                                                    18
                                                }
                                            />
                                        }
                                        title="Featured Item"
                                        description="Show this item in featured sections."
                                        checked={
                                            featured
                                        }
                                        onChange={
                                            setFeatured
                                        }
                                    />

                                    <ToggleOption
                                        icon={
                                            <Flame
                                                size={
                                                    18
                                                }
                                            />
                                        }
                                        title="Popular Item"
                                        description="Mark this item as a customer favorite."
                                        checked={
                                            popular
                                        }
                                        onChange={
                                            setPopular
                                        }
                                    />
                                </div>
                            </div>

                            {/* ---------------------------------------------------------- */}
                            {/* Quick Preview                                               */}
                            {/* ---------------------------------------------------------- */}

                            {(name ||
                                category ||
                                image) && (
                                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                                        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                                            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                                Quick Preview
                                            </h2>
                                        </div>

                                        <div className="p-5">
                                            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                                <div className="relative aspect-[16/10] bg-gray-100 dark:bg-gray-800">
                                                    {image ? (
                                                        <img
                                                            src={
                                                                image
                                                            }
                                                            alt={
                                                                name ||
                                                                "Menu item"
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-gray-400">
                                                            <ImagePlus
                                                                size={
                                                                    30
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="absolute left-3 top-3 flex gap-1.5">
                                                        {featured && (
                                                            <span className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-amber-600 shadow-sm">
                                                                Featured
                                                            </span>
                                                        )}

                                                        {popular && (
                                                            <span className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-brand-600 shadow-sm">
                                                                Popular
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <span className="text-xs font-medium capitalize text-brand-500">
                                                        {category ||
                                                            "Category"}
                                                    </span>

                                                    <h3 className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90">
                                                        {name ||
                                                            "Menu Item Name"}
                                                    </h3>

                                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                                        {description ||
                                                            "Your menu item description will appear here."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* ---------------------------------------------------------------- */}
                    {/* Bottom Actions                                                    */}
                    {/* ---------------------------------------------------------------- */}

                    <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-end dark:border-gray-800 dark:bg-white/[0.03]">
                        <button
                            type="button"
                            onClick={() =>
                                window.history.back()
                            }
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isSubmitting
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                    Adding Item...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />

                                    Add Menu Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ====================================================================== */}
            {/* SUCCESS MODAL                                                          */}
            {/* ====================================================================== */}

            {showSuccessModal && (
                <SuccessModal
                    itemName={name}
                    onAddAnother={handleAddAnother}
                    onViewMenu={handleViewMenu}
                    onClose={() =>
                        setShowSuccessModal(
                            false,
                        )
                    }
                />
            )}
        </>
    );
}

/* ========================================================================== */
/* Success Modal                                                              */
/* ========================================================================== */

function SuccessModal({
    itemName,
    onAddAnother,
    onViewMenu,
    onClose,
}: {
    itemName: string;
    onAddAnother: () => void;
    onViewMenu: () => void;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
        >
            {/* ------------------------------------------------------------------ */}
            {/* Blurred Backdrop                                                   */}
            {/* ------------------------------------------------------------------ */}

            <div
                className="absolute inset-0 bg-gray-950/40 backdrop-blur-md dark:bg-black/60"
                onClick={onClose}
            />

            {/* ------------------------------------------------------------------ */}
            {/* Modal                                                              */}
            {/* ------------------------------------------------------------------ */}

            <div className="relative w-full max-w-md animate-[successModalIn_0.35s_ease-out] overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-2xl dark:border-gray-700/80 dark:bg-gray-900/95">
                {/* Decorative background */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-success-500/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />

                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                    <X size={18} />
                </button>

                <div className="relative px-6 pb-7 pt-9 sm:px-8 sm:pb-8">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            {/* Outer glow */}
                            <div className="absolute inset-0 scale-125 rounded-full bg-success-500/20 blur-xl" />

                            {/* Circle */}
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-success-50 ring-8 ring-success-50/60 dark:bg-success-500/10 dark:ring-success-500/5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-500 text-white shadow-lg shadow-success-500/30 animate-[successIconPop_0.45s_ease-out]">
                                    <Check
                                        size={30}
                                        strokeWidth={3}
                                        className="animate-[successCheck_0.45s_ease-out_0.2s_both]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="mt-7 text-center">
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />

                            Successfully Added
                        </div>

                        <h2
                            id="success-modal-title"
                            className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-white"
                        >
                            Menu Item Added!
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                            Your new menu item{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-200">
                                “{itemName}”
                            </span>{" "}
                            has been added successfully.
                        </p>
                    </div>

                    {/* Item Preview */}
                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-success-500 shadow-sm dark:bg-gray-800">
                            <Utensils size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                                {itemName}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                                Available in your menu
                            </p>
                        </div>

                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500 text-white">
                            <Check
                                size={13}
                                strokeWidth={3}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 space-y-2.5">
                        <button
                            type="button"
                            onClick={onViewMenu}
                            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-medium text-white shadow-sm shadow-brand-500/20 transition hover:bg-brand-600 hover:shadow-md"
                        >
                            View Menu Items

                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </button>

                        <button
                            type="button"
                            onClick={onAddAnother}
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            <Plus size={16} />

                            Add Another Item
                        </button>
                    </div>

                    <p className="mt-5 text-center text-xs text-gray-400">
                        You can edit this item anytime
                        from your menu dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================== */
/* Reusable Components                                                        */
/* ========================================================================== */

const inputClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-transparent px-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500";

function FormField({
    label,
    required,
    htmlFor,
    children,
}: {
    label: string;
    required?: boolean;
    htmlFor?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}

                {required && (
                    <span className="ml-1 text-error-500">
                        *
                    </span>
                )}
            </label>

            {children}
        </div>
    );
}

function ToggleOption({
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
            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${checked
                ? "border-brand-300 bg-brand-50/50 dark:border-brand-500/30 dark:bg-brand-500/5"
                : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                }`}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${checked
                    ? "bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                    }`}
            >
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {title}
                </p>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
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
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked
                        ? "left-6"
                        : "left-1"
                        }`}
                />
            </div>
        </button>
    );
}