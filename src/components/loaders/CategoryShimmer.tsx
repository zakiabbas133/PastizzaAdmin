import "./CategoryShimmer.css";

function CategoryShimmer() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      {/* Category */}
      <td className="px-5 py-5 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Image */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
            <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="relative h-4 w-32 max-w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800">
              <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
            </div>

            <div className="relative h-3 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800/80">
              <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
            </div>
          </div>
        </div>
      </td>

      {/* Description */}
      <td className="px-5 py-5">
        <div className="space-y-2">
          <div className="relative h-3.5 w-72 max-w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800">
            <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
          </div>

          <div className="relative h-3.5 w-48 max-w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800/80">
            <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-5 lg:px-6">
        <div className="flex justify-end gap-2">
          <div className="relative h-9 w-16 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
            <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
          </div>

          <div className="relative h-9 w-20 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
            <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default CategoryShimmer;
