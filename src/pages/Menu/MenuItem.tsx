import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Edit3,
    Flame,
    Hash,
    Heart,
    Package,
    Star,
    Tag,
    Utensils,
} from "lucide-react";

import { menuItems } from "../../data/menu";
import type { MenuItem } from "../../types";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PK").format(price);

const getCategoryLabel = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1);

export default function MenuItemDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const item = useMemo<MenuItem | undefined>(() => {
        return menuItems.find(
            (menuItem) =>
                menuItem.id === id ||
                menuItem.slug === id,
        );
    }, [id]);

    if (!item) {
        return <MenuItemNotFound />;
    }

    const startingPrice =
        item.variants.length > 0
            ? Math.min(
                ...item.variants.map(
                    (variant) => variant.price,
                ),
            )
            : 0;

    const highestPrice =
        item.variants.length > 0
            ? Math.max(
                ...item.variants.map(
                    (variant) => variant.price,
                ),
            )
            : 0;

    return (
        <div className="space-y-6">
            {/* ================================================================ */}
            {/* BREADCRUMBS                                                      */}
            {/* ================================================================ */}

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
                    {item.name}
                </span>
            </div>

            {/* ================================================================ */}
            {/* HEADER                                                            */}
            {/* ================================================================ */}

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
                            {item.name}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Complete menu item details
                        </p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Link
                        to={`/menu-items/${item.id}/edit`}
                        type="button"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        <Edit3 size={16} />
                        Edit Item
                    </Link>
                </div>
            </div>

            {/* ================================================================ */}
            {/* MAIN ITEM CARD                                                    */}
            {/* ================================================================ */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                {/* ============================================================ */}
                {/* IMAGE                                                          */}
                {/* ============================================================ */}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                            {item.featured && (
                                <StatusBadge variant="featured">
                                    <Star
                                        size={13}
                                        fill="currentColor"
                                    />
                                    Featured
                                </StatusBadge>
                            )}

                            {item.popular && (
                                <StatusBadge variant="popular">
                                    <Flame size={13} />
                                    Popular
                                </StatusBadge>
                            )}
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                <Tag size={13} />
                                {getCategoryLabel(item.category)}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-success-50 px-3 py-1.5 text-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
                                <Check size={13} />
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* ============================================================ */}
                {/* BASIC INFORMATION                                              */}
                {/* ============================================================ */}

                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Item Information
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Overview of this menu item
                        </p>
                    </div>

                    <div className="space-y-5 p-5">
                        {/* Name */}
                        <InfoRow
                            label="Item Name"
                            value={item.name}
                        />

                        {/* Category */}
                        <InfoRow
                            label="Category"
                            value={getCategoryLabel(
                                item.category,
                            )}
                        />

                        {/* Slug */}
                        <InfoRow
                            label="Slug"
                            value={item.slug}
                            monospace
                        />

                        {/* ID */}
                        <InfoRow
                            label="Item ID"
                            value={item.id}
                            monospace
                        />

                        {/* Price */}
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Price Range
                                </span>

                                <Package
                                    size={17}
                                    className="text-gray-400"
                                />
                            </div>

                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                                    Rs. {formatPrice(startingPrice)}
                                </span>

                                {startingPrice !==
                                    highestPrice && (
                                        <span className="pb-0.5 text-sm text-gray-400">
                                            — Rs.{" "}
                                            {formatPrice(
                                                highestPrice,
                                            )}
                                        </span>
                                    )}
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                                Based on available variants
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400">
                                    <Check size={17} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        Menu Status
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Available on the menu
                                    </p>
                                </div>
                            </div>

                            <span className="text-sm font-medium text-success-600 dark:text-success-400">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* DESCRIPTION                                                       */}
            {/* ================================================================ */}

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Description
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Detailed description shown to customers
                    </p>
                </div>

                <div className="p-5">
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                        <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
                            {item.description}
                        </p>
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
                            Available sizes and prices for this item
                        </p>
                    </div>

                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {item.variants.length}{" "}
                        {item.variants.length === 1
                            ? "Variant"
                            : "Variants"}
                    </span>
                </div>

                <div className="p-5">
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Variant
                                    </th>

                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Price
                                    </th>

                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {item.variants.map(
                                    (variant, index) => (
                                        <tr
                                            key={`${variant.name}-${index}`}
                                            className="border-t border-gray-100 dark:border-gray-800"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                                                        <Utensils size={15} />
                                                    </div>

                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                        {variant.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                                    Rs.{" "}
                                                    {formatPrice(
                                                        variant.price,
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success-600 dark:text-success-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                                                    Available
                                                </span>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* FEATURES / TAGS                                                   */}
            {/* ================================================================ */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Tags */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Item Tags
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Promotional and discovery tags
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 p-5">
                        {item.featured && (
                            <FeatureTag
                                icon={<Star size={15} />}
                                title="Featured"
                                description="Shown in featured items"
                            />
                        )}

                        {item.popular && (
                            <FeatureTag
                                icon={<Flame size={15} />}
                                title="Popular"
                                description="Marked as a popular item"
                            />
                        )}

                        {!item.featured &&
                            !item.popular && (
                                <div className="w-full rounded-xl bg-gray-50 p-4 text-sm text-gray-400 dark:bg-gray-800/50">
                                    No promotional tags assigned.
                                </div>
                            )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Metadata
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Internal item information
                        </p>
                    </div>

                    <div className="space-y-4 p-5">
                        <MetadataRow
                            icon={<Hash size={16} />}
                            label="Item ID"
                            value={item.id}
                        />

                        <MetadataRow
                            icon={<Tag size={16} />}
                            label="Category"
                            value={item.category}
                        />

                        <MetadataRow
                            icon={<Heart size={16} />}
                            label="Popular"
                            value={item.popular ? "Yes" : "No"}
                        />

                        <MetadataRow
                            icon={<Star size={16} />}
                            label="Featured"
                            value={item.featured ? "Yes" : "No"}
                        />
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* BOTTOM ACTIONS                                                    */}
            {/* ================================================================ */}

            <div className="flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-white/[0.03]">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <ArrowLeft size={16} />
                    Back to Menu
                </button>

                <div className="flex flex-col sm:flex-row">
                    <Link
                        to={`/menu-items/${item.id}/edit`}
                        type="button"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                        <Edit3 size={16} />
                        Edit Menu Item
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* INFO ROW                                                                  */
/* ========================================================================= */

function InfoRow({
    label,
    value,
    monospace = false,
}: {
    label: string;
    value: string;
    monospace?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </span>

            <span
                className={`max-w-[65%] text-right text-sm font-medium text-gray-800 dark:text-white/90 ${monospace
                    ? "break-all font-mono text-xs"
                    : ""
                    }`}
            >
                {value}
            </span>
        </div>
    );
}

/* ========================================================================= */
/* STATUS BADGE                                                              */
/* ========================================================================= */

function StatusBadge({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant: "featured" | "popular";
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur ${variant === "featured"
                ? "bg-white/95 text-amber-600 dark:bg-gray-900/95 dark:text-amber-400"
                : "bg-white/95 text-orange-600 dark:bg-gray-900/95 dark:text-orange-400"
                }`}
        >
            {children}
        </span>
    );
}

/* ========================================================================= */
/* FEATURE TAG                                                               */
/* ========================================================================= */

function FeatureTag({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {title}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* METADATA ROW                                                              */
/* ========================================================================= */

function MetadataRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
                <div className="text-gray-400">
                    {icon}
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                </span>
            </div>

            <span className="text-sm font-medium capitalize text-gray-800 dark:text-white/90">
                {value}
            </span>
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
                    The menu item you're looking for doesn't
                    exist or may have been removed.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/menu-items")}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
                >
                    <ArrowLeft size={16} />
                    Back to Menu Items
                </button>
            </div>
        </div>
    );
}