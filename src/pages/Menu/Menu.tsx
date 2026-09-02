import { useMemo, useRef, useState } from "react";
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

import type { MenuItem } from "../../types";
import { Link, useNavigate } from "react-router";

import {
  useDeleteMenuItemMutation,
  useGetMenuItemsQuery,
} from "../../services/menuApi";

import { useGetCategoriesQuery } from "../../services/categoriesApi";

import DashboardLoader from "../../components/loaders/DashboardLoader";
import { baseUrl } from "../../services/api";
import Toast from "../../components/toast/Toast";

type ViewMode = "grid" | "list";

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
  /* ---------------------------------------------------------------------- */
  /* API                                                                     */
  /* ---------------------------------------------------------------------- */

  const {
    data: menuItems = [],
    isLoading: menuItemsLoading,
    isFetching: menuItemsFetching,
    isError: menuItemsError,
  } = useGetMenuItemsQuery();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();  

  const [deleteMenuItem] = useDeleteMenuItemMutation();

  /* ---------------------------------------------------------------------- */
  /* State                                                                   */
  /* ---------------------------------------------------------------------- */

  const [search, setSearch] = useState("");

  /*
   * Category stores the actual category ID.
   *
   * "" means "All Categories".
   */
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [category, setCategory] = useState<string>("");

  const [status, setStatus] = useState<"all" | "featured" | "popular">("all");

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [page, setPage] = useState(1);

  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  /*
   * Success modal
   *
   * Stores the response.data returned by the delete API.
   */
  const [successMessage, setSuccessMessage] = useState<unknown>(null);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Filtering                                                               */
  /* ---------------------------------------------------------------------- */

  const filteredItems = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return menuItems.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue) ||
        item.description.toLowerCase().includes(searchValue) ||
        item.slug.toLowerCase().includes(searchValue);

      /*
       * Category filtering is done using CategoryId.
       */
      const matchesCategory = !category || item.categoryId === category;

      const matchesStatus =
        status === "all" ||
        (status === "featured" && item.featured) ||
        (status === "popular" && item.popular);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [menuItems, search, category, status]);

  /* ---------------------------------------------------------------------- */
  /* Pagination                                                              */
  /* ---------------------------------------------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  /*
   * Make sure the current page is always valid.
   */
  const currentPage = Math.min(page, totalPages);

  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* ---------------------------------------------------------------------- */
  /* Filters                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleStatus = (value: "all" | "featured" | "popular") => {
    setStatus(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
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
      const response = await deleteMenuItem(deleteItem.id).unwrap();
      if (response.success) {
        /*
         * Close delete confirmation modal.
         */
        setDeleteItem(null);

        /*
         * Recalculate page after deletion.
         */
        const remainingItems = filteredItems.filter(
          (item) => item.id !== deleteItem.id,
        );

        const newTotalPages = Math.max(
          1,
          Math.ceil(remainingItems.length / ITEMS_PER_PAGE),
        );

        setPage((currentPage) => Math.min(currentPage, newTotalPages));

        /*
         * Open success modal and display response.data.
         */
        setSuccessMessage(response.data) as any;
      }
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };

      showToast(apiError?.data?.message ?? "Failed to delete menu item.", "error");
      console.error("Failed to delete menu item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ====================================================================
       TOAST
  ==================================================================== */

  const showToast = (message: string, type: "success" | "error"): void => {
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

  const hideToast = (): void => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }

    setToast((previous) => ({
      ...previous,
      show: false,
    }));
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  const isLoading = menuItemsLoading || categoriesLoading;

  const isFetching = menuItemsFetching && !menuItemsLoading;

  return (
    <>
      {isLoading && <DashboardLoader message="Loading menus..." />}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <div className="space-y-6">
        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Home</span>

            <ChevronRight size={15} />

            <span className="text-gray-800 dark:text-white/90">Menu Items</span>
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
              to="/add-menu"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600"
            >
              <Plus size={18} />
              Add Menu Item
            </Link>
          </div>
        </div>

        {/* ================================================================== */}
        {/* API ERROR                                                          */}
        {/* ================================================================== */}

        {(menuItemsError || categoriesError) && (
          <div className="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            Failed to load menu data. Please refresh the page and try again.
          </div>
        )}

        {/* ================================================================== */}
        {/* SUMMARY CARDS                                                      */}
        {/* ================================================================== */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            title="Total Items"
            value={menuItems.length}
            icon={<Utensils size={20} />}
          />

          <SummaryCard
            title="Featured"
            value={menuItems.filter((item) => item.featured).length}
            icon={<Star size={20} />}
          />

          <SummaryCard
            title="Popular"
            value={menuItems.filter((item) => item.popular).length}
            icon={<Star size={20} />}
          />

          <SummaryCard
            title="Categories"
            value={categories.length == 0 ? 0 : categories.length - 1}
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
                    onChange={(event) => handleSearch(event.target.value)}
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
                    className={`flex h-9 w-9 items-center justify-center rounded-md transition ${
                      viewMode === "list"
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
                    className={`flex h-9 w-9 items-center justify-center rounded-md transition ${
                      viewMode === "grid"
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
                {/* All */}

                {categories.map((item) => {
                  const active = category === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCategory(item.id)}
                      className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                        active
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
                    onClick={() => handleStatus("all")}
                  >
                    All
                  </StatusButton>

                  <StatusButton
                    active={status === "featured"}
                    onClick={() => handleStatus("featured")}
                  >
                    Featured
                  </StatusButton>

                  <StatusButton
                    active={status === "popular"}
                    onClick={() => handleStatus("popular")}
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
                  {isFetching && (
                    <span className="ml-2 text-xs text-gray-400">
                      Updating...
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* CONTENT                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div className="p-5">
            {currentItems.length === 0 ? (
              <EmptyState
                hasFilters={
                  Boolean(search) || Boolean(category) || status !== "all"
                }
                onClear={clearFilters}
              />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {currentItems.map((item: any) => (
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
                items={currentItems as any}
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
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {filteredItems.length}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((currentPage) => Math.max(1, currentPage - 1))
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
                    onClick={() => setPage(number)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                      currentPage === number
                        ? "bg-brand-500 text-white"
                        : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((currentPage) =>
                      Math.min(totalPages, currentPage + 1),
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
      {/* DELETE MODAL                                                         */}
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

      {/* ==================================================================== */}
      {/* SUCCESS MODAL                                                        */}
      {/* ==================================================================== */}

      <DeleteSuccessModal
        message={successMessage}
        onClose={() => setSuccessMessage(null)}
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

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{title}</p>
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
  const price = item.variants.length == 0 ? item.price : getStartingPrice(item);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {item.image ? (
          <img
            src={baseUrl + item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Utensils size={30} />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {item.featured && (
            <Badge variant="featured">
              <Star size={12} fill="currentColor" />
              Featured
            </Badge>
          )}

          {item.popular && <Badge variant="popular">Popular</Badge>}
        </div>

        <div className="absolute right-3 top-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white dark:bg-gray-900/90 dark:text-gray-200 dark:hover:bg-gray-900"
            >
              <MoreVertical size={17} />
            </button>

            {openMenu === item.id && (
              <ActionMenu
                item={item}
                onClose={() => setOpenMenu(null)}
                onDelete={() => {
                  setOpenMenu(null);
                  onDelete(item);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {getCategoryLabel(item.categoryName ?? "")}
          </span>

          <span className="text-xs text-gray-400">
            {item.variants?.length ?? 0}{" "}
            {(item.variants?.length ?? 0) === 1 ? "variant" : "variants"}
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
            <p className="text-xs text-gray-400">Starting from</p>

            <p className="mt-0.5 text-lg font-semibold text-gray-800 dark:text-white/90">
              Rs. {formatPrice(price as number)}
            </p>
          </div>

          <Link
            to={`/menu-items/${item.id}/edit`}
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
            const price =
              item.variants.length == 0 ? item.price : getStartingPrice(item);

            return (
              <tr
                key={item.id}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
              >
                <td className="py-4 pl-1">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={baseUrl + item.image}
                        alt={item.name}
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-800">
                        <Utensils size={18} />
                      </div>
                    )}

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
                    {getCategoryLabel(item.categoryName ?? "")}
                  </span>
                </td>

                <td className="py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                  Rs. {formatPrice(price as number)}
                </td>

                <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                  {item.variants?.length || "No Variants"}
                </td>

                <td className="py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {item.featured && (
                      <Badge variant="featured">
                        <Star size={11} fill="currentColor" />
                        Featured
                      </Badge>
                    )}

                    {item.popular && <Badge variant="popular">Popular</Badge>}

                    {!item.featured && !item.popular && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </td>

                <td className="py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(openMenu === item.id ? null : item.id)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === item.id && (
                      <ActionMenu
                        item={item}
                        onClose={() => setOpenMenu(null)}
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

  const categoryName = item.categoryName ?? "";

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
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

        <div className="p-5">
          <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
            {item.image ? (
              <img
                src={baseUrl + item.image}
                alt={item.name}
                className="h-16 w-20 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-700">
                <Utensils size={20} />
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
                {item.name}
              </p>

              <p className="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
                {categoryName}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {item.variants?.length ?? 0}{" "}
                {(item.variants?.length ?? 0) === 1 ? "variant" : "variants"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {item.name}
            </span>
            ? The menu item and its information will be permanently removed.
          </p>
        </div>

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
/* DELETE SUCCESS MODAL                                                      */
/* ========================================================================= */

function DeleteSuccessModal({
  message,
  onClose,
}: {
  message: unknown;
  onClose: () => void;
}) {
  if (message === null || message === undefined) return null;

  /*
   * Convert response.data into something readable.
   *
   * Handles:
   * - string
   * - number
   * - boolean
   * - object
   * - array
   */
  const formattedMessage =
    typeof message === "string"
      ? message
      : typeof message === "number" || typeof message === "boolean"
        ? String(message)
        : JSON.stringify(message, null, 2);

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 px-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-gray-200
          bg-white
          shadow-2xl
          animate-[successModalIn_0.35s_ease-out]
          dark:border-gray-700
          dark:bg-gray-900
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-success-title"
      >
        {/* ================================================================ */}
        {/* Decorative background                                             */}
        {/* ================================================================ */}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 overflow-hidden">
          <div className="absolute left-1/2 top-[-90px] h-52 w-52 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="absolute left-[-50px] top-[-80px] h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="absolute right-[-50px] top-[-80px] h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        {/* ================================================================ */}
        {/* Close button                                                      */}
        {/* ================================================================ */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-gray-400
            transition
            duration-200
            hover:bg-gray-100
            hover:text-gray-700
            dark:hover:bg-gray-800
            dark:hover:text-white
          "
          aria-label="Close success message"
        >
          <X size={18} />
        </button>

        {/* ================================================================ */}
        {/* Content                                                           */}
        {/* ================================================================ */}

        <div className="relative px-6 pb-6 pt-8 text-center">
          {/* ============================================================ */}
          {/* Animated Success SVG                                           */}
          {/* ============================================================ */}

          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            {/* Outer animated ring */}

            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-[successRing_1.5s_ease-out_infinite]" />

            {/* Second ring */}

            <div className="absolute inset-2 rounded-full border border-emerald-500/20" />

            {/* Glow */}

            <div className="absolute inset-3 rounded-full bg-emerald-500/10 blur-md" />

            {/* Main circle */}

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/25 animate-[successCircle_0.45s_ease-out]">
              <svg
                viewBox="0 0 52 52"
                className="h-9 w-9 text-white"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 27.5L22 35L39 17"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[successCheck_0.45s_0.2s_ease-out_forwards]"
                  strokeDasharray="40"
                  strokeDashoffset="40"
                />
              </svg>
            </div>

            {/* Small decorative dots */}

            <span className="absolute left-1 top-7 h-2 w-2 rounded-full bg-emerald-400 animate-[successDot_0.8s_ease-out_0.2s_both]" />

            <span className="absolute right-1 top-9 h-1.5 w-1.5 rounded-full bg-brand-400 animate-[successDot_0.8s_ease-out_0.35s_both]" />

            <span className="absolute bottom-3 left-4 h-1.5 w-1.5 rounded-full bg-blue-400 animate-[successDot_0.8s_ease-out_0.45s_both]" />

            <span className="absolute bottom-5 right-4 h-2 w-2 rounded-full bg-amber-400 animate-[successDot_0.8s_ease-out_0.55s_both]" />
          </div>

          {/* ============================================================ */}
          {/* Heading                                                        */}
          {/* ============================================================ */}

          <div className="mt-5 animate-[successContentIn_0.4s_0.1s_ease-out_both]">
            <h2
              id="delete-success-title"
              className="text-xl font-semibold text-gray-800 dark:text-white/90"
            >
              Menu Item Deleted
            </h2>

            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              The menu item has been successfully removed.
            </p>
          </div>

          {/* ============================================================ */}
          {/* API Response                                                   */}
          {/* ============================================================ */}

          <div className="mt-5 animate-[successContentIn_0.4s_0.2s_ease-out_both]">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 text-left dark:border-gray-800 dark:bg-gray-800/50">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Server Response
                </span>
              </div>

              <div className="max-h-40 overflow-y-auto">
                {typeof message === "object" && message !== null ? (
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-gray-600 dark:text-gray-300">
                    {formattedMessage}
                  </pre>
                ) : (
                  <p className="break-words text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {formattedMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Button                                                         */}
          {/* ============================================================ */}

          <div className="mt-6 animate-[successContentIn_0.4s_0.3s_ease-out_both]">
            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand-500
                px-5
                text-sm
                font-medium
                text-white
                shadow-sm
                transition
                duration-200
                hover:bg-brand-600
                hover:shadow-md
                active:scale-[0.98]
              "
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Done
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Bottom accent                                                     */}
        {/* ================================================================ */}

        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-brand-500 to-emerald-400" />
      </div>

      {/* ================================================================== */}
      {/* Modal Animations                                                    */}
      {/* ================================================================== */}

      <style>
        {`
          @keyframes successModalIn {
            0% {
              opacity: 0;
              transform: translateY(18px) scale(0.96);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes successCircle {
            0% {
              opacity: 0;
              transform: scale(0.4);
            }

            70% {
              transform: scale(1.08);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes successCheck {
            0% {
              stroke-dashoffset: 40;
            }

            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes successRing {
            0% {
              opacity: 0.7;
              transform: scale(0.85);
            }

            100% {
              opacity: 0;
              transform: scale(1.2);
            }
          }

          @keyframes successDot {
            0% {
              opacity: 0;
              transform: scale(0);
            }

            60% {
              opacity: 1;
              transform: scale(1.25);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes successContentIn {
            0% {
              opacity: 0;
              transform: translateY(8px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
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
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
        active
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
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium shadow-sm ${
        variant === "featured"
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
  hasFilters,
}: {
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
        <Search size={23} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">
        {hasFilters ? "No menu items found" : "No menu items yet"}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {hasFilters
          ? "Try changing your search or filters to find what you're looking for."
          : "Add your first menu item to start building your restaurant menu."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
