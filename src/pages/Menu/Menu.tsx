import { useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Grid2X2,
    List,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    Star,
    Trash2,
    Utensils,
    X,
} from "lucide-react";

import { menuItems as initialMenuItems } from "../../data/menu";
import type { MenuItem } from "../../types";
import { Link, useNavigate } from "react-router";

type ViewMode = "grid" | "list";

type Category =
    | "all"
    | "pizza"
    | "pasta"
    | "burgers"
    | "fries"
    | "rolls"
    | "desserts"
    | "drinks";

const categories: { label: string; value: Category }[] = [
    { label: "All Items", value: "all" },
    { label: "Pizza", value: "pizza" },
    { label: "Pasta", value: "pasta" },
    { label: "Burgers", value: "burgers" },
    { label: "Fries", value: "fries" },
    { label: "Rolls", value: "rolls" },
    { label: "Desserts", value: "desserts" },
    { label: "Drinks", value: "drinks" },
];

const ITEMS_PER_PAGE = 9;

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PK").format(price);

const getStartingPrice = (item: MenuItem) => {
    if (!item.variants?.length) return 0;

    return Math.min(...item.variants.map((variant) => variant.price));
};

const getCategoryLabel = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1);

export default function MenuItems() {
    const [items, setItems] = useState<MenuItem[]>(initialMenuItems);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<Category>("all");
    const [status, setStatus] = useState<"all" | "featured" | "popular">(
        "all",
    );

    const [viewMode, setViewMode] = useState<ViewMode>("list");

    const [page, setPage] = useState(1);

    /*
     * Stores the item that the user wants to delete.
     *
     * null = modal closed
     * MenuItem = modal opened for this item
     */
    const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    /* ---------------------------------------------------------------------- */
    /* Filtering                                                               */
    /* ---------------------------------------------------------------------- */

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                item.name.toLowerCase().includes(searchValue) ||
                item.description.toLowerCase().includes(searchValue) ||
                item.category.toLowerCase().includes(searchValue);

            const matchesCategory =
                category === "all" || item.category === category;

            const matchesStatus =
                status === "all" ||
                (status === "featured" && item.featured) ||
                (status === "popular" && item.popular);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [items, search, category, status]);

    /* ---------------------------------------------------------------------- */
    /* Pagination                                                              */
    /* ---------------------------------------------------------------------- */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    );

    const currentItems = filteredItems.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE,
    );

    /* ---------------------------------------------------------------------- */
    /* Filters                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategory = (value: Category) => {
        setCategory(value);
        setPage(1);
    };

    const handleStatus = (
        value: "all" | "featured" | "popular",
    ) => {
        setStatus(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setStatus("all");
        setPage(1);
    };

    /* ---------------------------------------------------------------------- */
    /* Delete                                                                  */
    /* ---------------------------------------------------------------------- */

    const handleDeleteItem = async () => {
        if (!deleteItem) return;

        setIsDeleting(true);

        try {
            /*
             * LOCAL DELETE
             *
             * When Firestore is connected, replace this section with:
             *
             * await deleteDish(deleteItem.id);
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 500),
            );

            setItems((currentItems) =>
                currentItems.filter(
                    (item) => item.id !== deleteItem.id,
                ),
            );

            setDeleteItem(null);

            /*
             * If deleting the final item on a page, move back one page.
             */
            setPage((currentPage) => {
                const remainingItems = filteredItems.length - 1;

                const newTotalPages = Math.max(
                    1,
                    Math.ceil(remainingItems / ITEMS_PER_PAGE),
                );

                return Math.min(currentPage, newTotalPages);
            });
        } catch (error) {
            console.error("Failed to delete menu item:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* ================================================================== */}
                {/* HEADER                                                             */}
                {/* ================================================================== */}

                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Home</span>

                        <ChevronRight size={15} />

                        <span className="text-gray-800 dark:text-white/90">
                            Menu Items
                        </span>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Menu Items
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage your restaurant menu, prices and menu items.
                            </p>
                        </div>

                        <Link
                            to={'/add-menu'}
                            type="button"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600"
                        >
                            <Plus size={18} />
                            Add Menu Item
                        </Link>
                    </div>
                </div>

                {/* ================================================================== */}
                {/* SUMMARY CARDS                                                      */}
                {/* ================================================================== */}

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <SummaryCard
                        title="Total Items"
                        value={items.length}
                        icon={<Utensils size={20} />}
                    />

                    <SummaryCard
                        title="Featured"
                        value={items.filter((item) => item.featured).length}
                        icon={<Star size={20} />}
                    />

                    <SummaryCard
                        title="Popular"
                        value={items.filter((item) => item.popular).length}
                        icon={<Star size={20} />}
                    />

                    <SummaryCard
                        title="Categories"
                        value={
                            new Set(
                                items.map((item) => item.category),
                            ).size
                        }
                        icon={<Grid2X2 size={20} />}
                    />
                </div>

                {/* ================================================================== */}
                {/* MAIN CARD                                                          */}
                {/* ================================================================== */}

                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                    {/* ---------------------------------------------------------------- */}
                    {/* FILTERS                                                          */}
                    {/* ---------------------------------------------------------------- */}

                    <div className="border-b border-gray-200 p-5 dark:border-gray-800">
                        <div className="flex flex-col gap-4">
                            {/* Search + View Switcher */}
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <div className="relative w-full lg:max-w-md">
                                    <Search
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            handleSearch(event.target.value)
                                        }
                                        placeholder="Search menu items..."
                                        className="h-11 w-full rounded-lg border border-gray-200 bg-transparent pl-10 pr-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
                                    />

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => handleSearch("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 self-end rounded-lg border border-gray-200 p-1 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("list")}
                                        className={`flex h-9 w-9 items-center justify-center rounded-md transition ${viewMode === "list"
                                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white"
                                            : "text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                            }`}
                                        aria-label="List view"
                                    >
                                        <List size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setViewMode("grid")}
                                        className={`flex h-9 w-9 items-center justify-center rounded-md transition ${viewMode === "grid"
                                            ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white"
                                            : "text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                            }`}
                                        aria-label="Grid view"
                                    >
                                        <Grid2X2 size={17} />
                                    </button>
                                </div>
                            </div>

                            {/* Category Filters */}
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {categories.map((item) => {
                                    const active =
                                        category === item.value;

                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() =>
                                                handleCategory(item.value)
                                            }
                                            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${active
                                                ? "bg-brand-500 text-white"
                                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Status Filters */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex gap-2">
                                    <StatusButton
                                        active={status === "all"}
                                        onClick={() =>
                                            handleStatus("all")
                                        }
                                    >
                                        All
                                    </StatusButton>

                                    <StatusButton
                                        active={status === "featured"}
                                        onClick={() =>
                                            handleStatus("featured")
                                        }
                                    >
                                        Featured
                                    </StatusButton>

                                    <StatusButton
                                        active={status === "popular"}
                                        onClick={() =>
                                            handleStatus("popular")
                                        }
                                    >
                                        Popular
                                    </StatusButton>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing{" "}
                                    <span className="font-medium text-gray-700 dark:text-gray-200">
                                        {filteredItems.length}
                                    </span>{" "}
                                    items
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------------------------------------------- */}
                    {/* CONTENT                                                          */}
                    {/* ---------------------------------------------------------------- */}

                    <div className="p-5">
                        {currentItems.length === 0 ? (
                            <EmptyState onClear={clearFilters} />
                        ) : viewMode === "grid" ? (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {currentItems.map((item) => (
                                    <MenuItemCard
                                        key={item.id}
                                        item={item}
                                        openMenu={openMenu}
                                        setOpenMenu={setOpenMenu}
                                        onDelete={setDeleteItem}
                                    />
                                ))}
                            </div>
                        ) : (
                            <MenuItemTable
                                items={currentItems}
                                openMenu={openMenu}
                                setOpenMenu={setOpenMenu}
                                onDelete={setDeleteItem}
                            />
                        )}
                    </div>

                    {/* ---------------------------------------------------------------- */}
                    {/* PAGINATION                                                       */}
                    {/* ---------------------------------------------------------------- */}

                    {filteredItems.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing{" "}
                                <span className="font-medium text-gray-700 dark:text-gray-200">
                                    {(page - 1) *
                                        ITEMS_PER_PAGE +
                                        1}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-gray-700 dark:text-gray-200">
                                    {Math.min(
                                        page * ITEMS_PER_PAGE,
                                        filteredItems.length,
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-gray-700 dark:text-gray-200">
                                    {filteredItems.length}
                                </span>
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((currentPage) =>
                                            Math.max(1, currentPage - 1),
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1,
                                ).map((number) => (
                                    <button
                                        key={number}
                                        type="button"
                                        onClick={() =>
                                            setPage(number)
                                        }
                                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${page === number
                                            ? "bg-brand-500 text-white"
                                            : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        setPage((currentPage) =>
                                            Math.min(
                                                totalPages,
                                                currentPage + 1,
                                            ),
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ==================================================================== */}
            {/* DELETE CONFIRMATION MODAL                                           */}
            {/* ==================================================================== */}

            <DeleteConfirmationModal
                item={deleteItem}
                isDeleting={isDeleting}
                onCancel={() => {
                    if (!isDeleting) {
                        setDeleteItem(null);
                    }
                }}
                onConfirm={handleDeleteItem}
            />
        </>
    );
}

/* ========================================================================= */
/* SUMMARY CARD                                                              */
/* ========================================================================= */

function SummaryCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                    {icon}
                </div>

                <span className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {value}
                </span>
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                {title}
            </p>
        </div>
    );
}

/* ========================================================================= */
/* MENU ITEM CARD                                                            */
/* ========================================================================= */

function MenuItemCard({
    item,
    openMenu,
    setOpenMenu,
    onDelete,
}: {
    item: MenuItem;
    openMenu: string | null;
    setOpenMenu: (id: string | null) => void;
    onDelete: (item: MenuItem) => void;
}) {
    const price = getStartingPrice(item);

    return (
        <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {item.featured && (
                        <Badge variant="featured">
                            <Star size={12} fill="currentColor" />
                            Featured
                        </Badge>
                    )}

                    {item.popular && (
                        <Badge variant="popular">
                            Popular
                        </Badge>
                    )}
                </div>

                {/* Menu */}
                <div className="absolute right-3 top-3">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setOpenMenu(
                                    openMenu === item.id
                                        ? null
                                        : item.id,
                                )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white dark:bg-gray-900/90 dark:text-gray-200 dark:hover:bg-gray-900"
                        >
                            <MoreVertical size={17} />
                        </button>

                        {openMenu === item.id && (
                            <ActionMenu
                                item={item}
                                onClose={() =>
                                    setOpenMenu(null)
                                }
                                onDelete={() => {
                                    setOpenMenu(null);
                                    onDelete(item);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {getCategoryLabel(item.category)}
                    </span>

                    <span className="text-xs text-gray-400">
                        {item.variants.length}{" "}
                        {item.variants.length === 1
                            ? "variant"
                            : "variants"}
                    </span>
                </div>

                <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {item.name}
                </h3>

                <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500 dark:text-gray-400">
                    {item.description}
                </p>

                <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400">
                            Starting from
                        </p>

                        <p className="mt-0.5 text-lg font-semibold text-gray-800 dark:text-white/90">
                            Rs. {formatPrice(price)}
                        </p>
                    </div>

                    <Link
                        to={`/menu-items/${item.id}/edit`}
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <Pencil size={13} />
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* TABLE VIEW                                                                */
/* ========================================================================= */

function MenuItemTable({
    items,
    openMenu,
    setOpenMenu,
    onDelete,
}: {
    items: MenuItem[];
    openMenu: string | null;
    setOpenMenu: (id: string | null) => void;
    onDelete: (item: MenuItem) => void;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th className="pb-4 pl-1 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                            Item
                        </th>

                        <th className="pb-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                            Category
                        </th>

                        <th className="pb-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                            Price
                        </th>

                        <th className="pb-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                            Variants
                        </th>

                        <th className="pb-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400">
                            Tags
                        </th>

                        <th className="pb-4 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => {
                        const price = getStartingPrice(item);

                        return (
                            <tr
                                key={item.id}
                                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                            >
                                <td className="py-4 pl-1">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-12 w-16 rounded-lg object-cover"
                                        />

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                                                {item.name}
                                            </p>

                                            <p className="mt-0.5 max-w-[320px] truncate text-xs text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="py-4">
                                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                        {getCategoryLabel(
                                            item.category,
                                        )}
                                    </span>
                                </td>

                                <td className="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                    Rs. {formatPrice(price)}
                                </td>

                                <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {item.variants.length}
                                </td>

                                <td className="py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.featured && (
                                            <Badge variant="featured">
                                                <Star
                                                    size={11}
                                                    fill="currentColor"
                                                />
                                                Featured
                                            </Badge>
                                        )}

                                        {item.popular && (
                                            <Badge variant="popular">
                                                Popular
                                            </Badge>
                                        )}

                                        {!item.featured &&
                                            !item.popular && (
                                                <span className="text-xs text-gray-400">
                                                    —
                                                </span>
                                            )}
                                    </div>
                                </td>

                                <td className="py-4 text-right">
                                    <div className="relative inline-block">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu === item.id
                                                        ? null
                                                        : item.id,
                                                )
                                            }
                                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {openMenu === item.id && (
                                            <ActionMenu
                                                item={item}
                                                onClose={() =>
                                                    setOpenMenu(null)
                                                }
                                                onDelete={() => {
                                                    setOpenMenu(null);
                                                    onDelete(item);
                                                }}
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

/* ========================================================================= */
/* ACTION MENU                                                               */
/* ========================================================================= */

function ActionMenu({
    item,
    onClose,
    onDelete,
}: {
    item: MenuItem;
    onClose: () => void;
    onDelete: () => void;
}) {

    const navigate = useNavigate();
    return (
        <div className="absolute right-0 top-11 z-30 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <button
                type="button"
                onClick={() => {
                    onClose();
                    navigate(`/menu-items/${item.id}/edit`);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <Pencil size={15} />
                Edit
            </button>

            <button
                type="button"
                onClick={() => {
                    onClose();
                    navigate(`/menu-items/${item.id}`);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <Utensils size={15} />
                View
            </button>

            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

            <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10"
            >
                <Trash2 size={15} />
                Delete
            </button>
        </div>
    );
}

/* ========================================================================= */
/* DELETE CONFIRMATION MODAL                                                */
/* ========================================================================= */

function DeleteConfirmationModal({
    item,
    isDeleting,
    onCancel,
    onConfirm,
}: {
    item: MenuItem | null;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    if (!item) return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isDeleting
                ) {
                    onCancel();
                }
            }}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-menu-item-title"
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-100 p-5 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/10">
                            <Trash2 size={20} />
                        </div>

                        <div>
                            <h2
                                id="delete-menu-item-title"
                                className="text-base font-semibold text-gray-800 dark:text-white/90"
                            >
                                Delete menu item?
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-20 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                                {item.name}
                            </p>

                            <p className="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
                                {getCategoryLabel(item.category)}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                {item.variants.length}{" "}
                                {item.variants.length === 1
                                    ? "variant"
                                    : "variants"}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                            {item.name}
                        </span>
                        ? The menu item and its information will be
                        permanently removed.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/70 p-5 sm:flex-row sm:justify-end dark:border-gray-800 dark:bg-gray-800/20">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-error-500 px-4 text-sm font-medium text-white transition hover:bg-error-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                Yes, Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* STATUS BUTTON                                                             */
/* ========================================================================= */

function StatusButton({
    active,
    children,
    onClick,
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${active
                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white"
                : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
        >
            {children}
        </button>
    );
}

/* ========================================================================= */
/* BADGE                                                                     */
/* ========================================================================= */

function Badge({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant: "featured" | "popular";
}) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium shadow-sm ${variant === "featured"
                ? "bg-white text-amber-600 dark:bg-gray-900 dark:text-amber-400"
                : "bg-white text-brand-600 dark:bg-gray-900 dark:text-brand-400"
                }`}
        >
            {children}
        </span>
    );
}

/* ========================================================================= */
/* EMPTY STATE                                                               */
/* ========================================================================= */

function EmptyState({
    onClear,
}: {
    onClear: () => void;
}) {
    return (
        <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                <Search size={23} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">
                No menu items found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Try changing your search or filters to find what
                you're looking for.
            </p>

            <button
                type="button"
                onClick={onClear}
                className="mt-5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                Clear filters
            </button>
        </div>
    );
}