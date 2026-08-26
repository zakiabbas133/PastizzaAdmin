import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    Edit3,
    Eye,
    Grid2X2,
    List,
    Plus,
    Search,
    Star,
    Trash2,
    X,
    AlertTriangle,
} from "lucide-react";

import { deals as initialDeals } from "../../data/deals";
import type { Deal } from "../../types";

export default function Deals() {
    const navigate = useNavigate();

    const [dealList, setDealList] =
        useState<Deal[]>(initialDeals);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [viewMode, setViewMode] =
        useState<"grid" | "list">("grid");

    const [deleteTarget, setDeleteTarget] =
        useState<Deal | null>(null);

    const filteredDeals = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return dealList;
        }

        return dealList.filter((deal) => {
            return (
                deal.title
                    .toLowerCase()
                    .includes(query) ||
                deal.description
                    .toLowerCase()
                    .includes(query) ||
                deal.badge
                    ?.toLowerCase()
                    .includes(query) ||
                deal.items.some((item) =>
                    item.toLowerCase().includes(query)
                )
            );
        });
    }, [dealList, searchQuery]);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDealList((previous) =>
            previous.filter(
                (deal) => deal.id !== deleteTarget.id
            )
        );

        setDeleteTarget(null);
    };

    const calculateDiscount = (
        price: number,
        originalPrice: number
    ) => {
        if (!originalPrice || originalPrice <= price) {
            return 0;
        }

        return Math.round(
            ((originalPrice - price) / originalPrice) * 100
        );
    };

    return (
        <>
            {/* =====================================================
          HEADER
      ===================================================== */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
                        Deals
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage promotional deals and special offers.
                    </p>
                </div>

                <Link
                    to="/deals/create"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                >
                    <Plus size={18} />
                    Add Deal
                </Link>
            </div>

            {/* =====================================================
          MAIN CARD
      ===================================================== */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                {/* TOOLBAR */}
                <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-6 dark:border-gray-800">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                            All Deals
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {dealList.length}{" "}
                            {dealList.length === 1
                                ? "deal"
                                : "deals"}{" "}
                            total
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                        {/* SEARCH */}
                        <div className="relative w-full sm:w-[280px]">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search deals..."
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* VIEW SWITCHER */}
                        <div className="flex h-11 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-900">
                            <button
                                type="button"
                                onClick={() =>
                                    setViewMode("grid")
                                }
                                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm transition sm:flex-none ${viewMode === "grid"
                                    ? "bg-white text-gray-800 shadow-sm dark:bg-gray-800 dark:text-white"
                                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                                    }`}
                            >
                                <Grid2X2 size={16} />
                                <span className="hidden sm:inline">
                                    Grid
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setViewMode("list")
                                }
                                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm transition sm:flex-none ${viewMode === "list"
                                    ? "bg-white text-gray-800 shadow-sm dark:bg-gray-800 dark:text-white"
                                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                                    }`}
                            >
                                <List size={16} />
                                <span className="hidden sm:inline">
                                    List
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* =====================================================
            GRID
        ===================================================== */}
                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3 lg:p-6">
                        {filteredDeals.map((deal: Deal) => {
                            const discount =
                                calculateDiscount(
                                    deal.price,
                                    deal.originalPrice as number
                                );

                            return (
                                <div
                                    key={deal.id}
                                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900"
                                >
                                    {/* IMAGE */}
                                    <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {deal.image ? (
                                            <img
                                                src={deal.image}
                                                alt={deal.title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}

                                        {/* BADGE */}
                                        {deal.badge && (
                                            <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                                {deal.badge}
                                            </span>
                                        )}

                                        {/* FEATURED */}
                                        {deal.featured && (
                                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-warning-600 shadow-sm dark:bg-gray-900/90 dark:text-warning-400">
                                                <Star
                                                    size={13}
                                                    fill="currentColor"
                                                />
                                                Featured
                                            </span>
                                        )}

                                        {/* DISCOUNT */}
                                        {discount > 0 && (
                                            <span className="absolute bottom-3 left-3 rounded-md bg-success-500 px-2 py-1 text-xs font-semibold text-white">
                                                {discount}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                                {deal.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                                {deal.description}
                                            </p>

                                            {/* ITEMS */}
                                            <div className="mt-4 space-y-1.5">
                                                {deal.items
                                                    .slice(0, 3)
                                                    .map((item) => (
                                                        <div
                                                            key={item}
                                                            className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                                                        >
                                                            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                                                            {item}
                                                        </div>
                                                    ))}

                                                {deal.items.length > 3 && (
                                                    <p className="text-xs text-gray-400">
                                                        +{deal.items.length - 3}{" "}
                                                        more
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* PRICE */}
                                        <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Deal Price
                                                </p>

                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-xl font-bold text-gray-800 dark:text-white/90">
                                                        Rs.{" "}
                                                        {deal.price.toLocaleString()}
                                                    </span>

                                                    {deal.originalPrice as number >
                                                        deal.price && (
                                                            <span className="text-sm text-gray-400 line-through">
                                                                Rs.{" "}
                                                                {deal.originalPrice?.toLocaleString()}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/deals/${deal.id}`
                                                    )
                                                }
                                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/deals/${deal.id}/edit`
                                                    )
                                                }
                                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                            >
                                                <Edit3 size={14} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteTarget(deal)
                                                }
                                                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-error-600 transition hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* =====================================================
            LIST
        ===================================================== */}
                {viewMode === "list" && (
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:px-6 dark:text-gray-400">
                                        Deal
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Items
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Price
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500 lg:px-6 dark:text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredDeals.map((deal) => (
                                    <tr
                                        key={deal.id}
                                        className="transition hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                    >
                                        <td className="px-5 py-4 lg:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                                                    {deal.image && (
                                                        <img
                                                            src={deal.image}
                                                            alt={deal.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                                        {deal.title}
                                                    </p>

                                                    {deal.badge && (
                                                        <span className="mt-1 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                                                            {deal.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
                                                {deal.items.join(", ")}
                                            </p>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <p className="font-semibold text-gray-800 dark:text-white/90">
                                                Rs.{" "}
                                                {deal.price.toLocaleString()}
                                            </p>

                                            {deal.originalPrice as number >
                                                deal.price && (
                                                    <p className="text-xs text-gray-400 line-through">
                                                        Rs.{" "}
                                                        {deal.originalPrice?.toLocaleString()}
                                                    </p>
                                                )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {deal.featured ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-600 dark:bg-warning-500/10 dark:text-warning-400">
                                                    <Star
                                                        size={12}
                                                        fill="currentColor"
                                                    />
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    Standard
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 lg:px-6">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/deals/${deal.id}`
                                                        )
                                                    }
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/deals/${deal.id}/edit`
                                                        )
                                                    }
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                                >
                                                    <Edit3 size={14} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleteTarget(deal)
                                                    }
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* EMPTY */}
                {filteredDeals.length === 0 && (
                    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            <Search size={21} />
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                            No deals found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Try changing your search or create a
                            new deal.
                        </p>
                    </div>
                )}
            </div>

            {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}
            {deleteTarget && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900">
                        <div className="px-5 py-7 text-center sm:px-6">
                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400">
                                <AlertTriangle size={26} />
                            </div>

                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Delete Deal?
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete{" "}
                                <strong className="font-semibold text-gray-700 dark:text-gray-300">
                                    {deleteTarget.title}
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
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto"
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