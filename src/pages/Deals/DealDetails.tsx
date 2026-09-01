import { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Star,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useGetDealsQuery } from "../../services/dealsApi";
import { baseUrl } from "../../services/api";

export default function DealDetails() {
  const { id } = useParams();
  const { data, isLoading: dealsLoading } = useGetDealsQuery();
 
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (dealsLoading && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
        Loading deal details...
      </div>
    );
  }

  const deal = data?.data?.find((item) => item.id === id);

  if (!deal) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 text-center dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <Package size={25} />
        </div>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Deal not found
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The deal you are looking for does not exist.
        </p>

        <Link
          to="/deals"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          <ArrowLeft size={16} />
          Back to Deals
        </Link>
      </div>
    );
  }

  const discount =
    (deal.originalPrice as number) > deal.price
      ? Math.round(
          ((((deal.originalPrice as number) - deal.price) /
            deal.originalPrice) as number) * 100,
        )
      : 0;

  const handleDelete = () => {
    setDeleteOpen(false);

    navigate("/deals");
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/deals"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
              Deal Details
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View complete deal information.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/deals/${deal.id}/edit`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Edit3 size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:flex-none"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* =====================================================
          DETAILS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* IMAGE */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-2">
          <div className="relative h-[280px] sm:h-[380px] lg:h-[450px]">
            {deal.image ? (
              <img
                src={baseUrl + deal.image}
                alt={deal.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800">
                No Image
              </div>
            )}

            {deal.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                {deal.badge}
              </span>
            )}

            {deal.featured && (
              <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-warning-600 shadow-sm dark:bg-gray-900/90 dark:text-warning-400">
                <Star size={14} fill="currentColor" />
                Featured
              </span>
            )}

            {discount > 0 && (
              <span className="absolute bottom-5 left-5 rounded-lg bg-success-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
                Save {discount}%
              </span>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Deal
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
              {deal.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {deal.description}
            </p>
          </div>

          <div className="my-6 border-t border-gray-100 dark:border-gray-800" />

          {/* PRICE */}
          <div>
            <p className="text-xs text-gray-400">Special Price</p>

            <div className="mt-1 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold text-gray-800 dark:text-white/90">
                Rs. {deal.price.toLocaleString()}
              </span>

              {(deal.originalPrice as number) > deal.price && (
                <span className="mb-1 text-sm text-gray-400 line-through">
                  Rs. {deal.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {discount > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-success-50 px-3 py-2.5 dark:bg-success-500/10">
              <CheckCircle2
                size={16}
                className="text-success-600 dark:text-success-400"
              />

              <span className="text-sm font-medium text-success-700 dark:text-success-400">
                {discount}% discount
              </span>
            </div>
          )}
        </div>

        {/* INCLUDED ITEMS */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-3">
          <div className="border-b border-gray-200 px-5 py-5 lg:px-6 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Included Items
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Everything included with this deal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 lg:p-6">
            {(deal.dealItems ?? []).map((item, index) => {
              const itemName = item.menuItemName ?? item.menuItemVariantName ?? "Menu item";

              return (
                <div
                  key={`${itemName}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400">
                    <CheckCircle2 size={18} />
                  </div>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {itemName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}
      {deleteOpen && (
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
                  {deal.title}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
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
