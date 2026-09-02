import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Upload,
  Utensils,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

import { useAddOrUpdateDealMutation } from "../../services/dealsApi";
import { useGetMenuItemsQuery } from "../../services/menuApi";
import Toast from "../../components/toast/Toast";

interface DealForm {
  title: string;
  description: string;
  image: string;
  imageFile: File | null;
  price: string;
  originalPrice: string;
  badge: string;
  items: string[];
  featured: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  items?: string;
}

const EMPTY_FORM: DealForm = {
  title: "",
  description: "",
  image: "",
  imageFile: null,
  price: "",
  originalPrice: "",
  badge: "",
  items: [""],
  featured: false,
};

function SuccessModal({
  dealName,
  onAddAnother,
  onViewDeals,
  onClose,
}: {
  dealName: string;
  onAddAnother: () => void;
  onViewDeals: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-gray-950/40 backdrop-blur-md dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* MODAL */}
      <div className="relative my-auto flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl dark:border-gray-700/80 dark:bg-gray-900 sm:rounded-3xl">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-success-500/10 blur-3xl sm:-right-20 sm:-top-20 sm:h-48 sm:w-48" />

        <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl sm:-bottom-24 sm:-left-16 sm:h-48 sm:w-48" />

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 sm:right-4 sm:top-4 sm:h-9 sm:w-9 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <X size={17} className="sm:h-[18px] sm:w-[18px]" />
        </button>

        {/* SCROLLABLE CONTENT */}
        <div className="relative min-h-0 overflow-y-auto overscroll-contain">
          <div className="px-4 pb-5 pt-7 sm:px-7 sm:pb-7 sm:pt-9 md:px-8 md:pb-8">
            {/* SUCCESS ICON */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 scale-125 rounded-full bg-success-500/20 blur-xl" />

                {/* Outer circle */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success-50 ring-6 ring-success-50/60 sm:h-20 sm:w-20 sm:ring-8 dark:bg-success-500/10 dark:ring-success-500/5">
                  {/* Inner circle */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-500 text-white shadow-lg shadow-success-500/30 sm:h-14 sm:w-14">
                    <Check
                      size={24}
                      strokeWidth={3}
                      className="sm:h-[30px] sm:w-[30px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div className="mt-5 text-center sm:mt-7">
              {/* Badge */}
              <div className="mb-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-medium text-success-600 sm:px-3 sm:text-xs dark:bg-success-500/10 dark:text-success-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success-500" />
                Successfully Added
              </div>

              {/* Title */}
              <h2
                id="success-modal-title"
                className="px-2 text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl dark:text-white"
              >
                Deal Added Successfully!
              </h2>

              {/* Description */}
              <p className="mx-auto mt-2 max-w-sm px-1 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6 dark:text-gray-400">
                Your new deal{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  “{dealName}”
                </span>{" "}
                has been added successfully.
              </p>
            </div>

            {/* DEAL PREVIEW */}
            <div className="mt-5 flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-2.5 sm:mt-6 sm:gap-3 sm:p-3 dark:border-gray-800 dark:bg-gray-800/50">
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-success-500 shadow-sm sm:h-10 sm:w-10 dark:bg-gray-800">
                <Utensils size={17} className="sm:h-[18px] sm:w-[18px]" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-800 sm:text-sm dark:text-white/90">
                  {dealName}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-gray-400 sm:text-xs">
                  Available in your deals
                </p>
              </div>

              {/* Check */}
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-500 text-white sm:h-6 sm:w-6">
                <Check
                  size={11}
                  strokeWidth={3}
                  className="sm:h-[13px] sm:w-[13px]"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-5 space-y-2 sm:mt-6 sm:space-y-2.5">
              {/* View Deals */}
              <button
                type="button"
                onClick={onViewDeals}
                className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-xs font-medium text-white shadow-sm shadow-brand-500/20 transition hover:bg-brand-600 hover:shadow-md sm:h-11 sm:px-5 sm:text-sm"
              >
                View Deals
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                />
              </button>

              {/* Add Another */}
              <button
                type="button"
                onClick={onAddAnother}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:h-11 sm:px-5 sm:text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <Plus size={15} className="sm:h-4 sm:w-4" />
                Add Another Deal
              </button>
            </div>

            {/* FOOTNOTE */}
            <p className="mt-4 text-center text-[10px] leading-4 text-gray-400 sm:mt-5 sm:text-xs">
              You can edit this deal anytime from your deals dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateDeal() {
  const navigate = useNavigate();

  // ============================================================
  // RTK QUERY
  // ============================================================

  const { data: menuItems = [], isLoading: menuItemsLoading } =
    useGetMenuItemsQuery();

  const [addOrUpdateDeal, { isLoading: isSaving }] =
    useAddOrUpdateDealMutation();

  const [form, setForm] = useState<DealForm>(EMPTY_FORM);

  const [errors, setErrors] = useState<FormErrors>({});

  const [imagePreview, setImagePreview] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [createdDealName, setCreatedDealName] = useState("");

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================================
  // IMAGE PREVIEW
  // ============================================================

  useEffect(() => {
    if (!form.imageFile) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(form.imageFile);

    setImagePreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [form.imageFile]);

  // ============================================================
  // IMAGE CHANGE
  // ============================================================

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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((previous) => ({
        ...previous,
        image: "Please select a valid image file.",
      }));

      event.target.value = "";
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        image: "Image size must be less than 5 MB.",
      }));

      event.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      imageFile: file,
      image: "",
    }));

    setErrors((previous) => ({
      ...previous,
      image: undefined,
    }));
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const removeImage = () => {
    setForm((previous) => ({
      ...previous,
      imageFile: null,
      image: "",
    }));

    setImagePreview("");

    setErrors((previous) => ({
      ...previous,
      image: "Deal image is required.",
    }));
  };

  const handleItemSelection = (selectedValues: string[]) => {
    setForm((previous) => ({
      ...previous,
      items: selectedValues,
    }));

    setErrors((previous) => ({
      ...previous,
      items: undefined,
    }));
  };

  const toggleMenuItem = (menuItemId: string) => {
    const nextItems = form.items.includes(menuItemId)
      ? form.items.filter((itemId) => itemId !== menuItemId)
      : [...form.items, menuItemId];

    handleItemSelection(nextItems);
  };

  const selectedMenuItems = form.items
    .map((itemId) => menuItems.find((menuItem) => menuItem.id === itemId))
    .filter(Boolean) as typeof menuItems;

  // ============================================================
  // VALIDATE FORM
  // ============================================================

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    const title = form.title.trim();

    const description = form.description.trim();

    const price = Number(form.price);

    const originalPrice = Number(form.originalPrice);

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    if (!title) {
      newErrors.title = "Deal title is required.";
    } else if (title.length < 3) {
      newErrors.title = "Deal title must contain at least 3 characters.";
    } else if (title.length > 100) {
      newErrors.title = "Deal title cannot exceed 100 characters.";
    }

    // --------------------------------------------------------
    // DESCRIPTION
    // --------------------------------------------------------

    if (!description) {
      newErrors.description = "Deal description is required.";
    } else if (description.length < 10) {
      newErrors.description =
        "Description must contain at least 10 characters.";
    } else if (description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
    }

    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    if (!form.imageFile && !form.image) {
      newErrors.image = "Deal image is required.";
    }

    // --------------------------------------------------------
    // PRICE
    // --------------------------------------------------------

    if (!form.price.trim()) {
      newErrors.price = "Deal price is required.";
    } else if (!Number.isFinite(price) || price <= 0) {
      newErrors.price = "Deal price must be greater than 0.";
    } else if (!Number.isInteger(price)) {
      newErrors.price = "Deal price must be a whole number.";
    }

    // --------------------------------------------------------
    // ORIGINAL PRICE
    // --------------------------------------------------------

    if (!form.originalPrice.trim()) {
      newErrors.originalPrice = "Original price is required.";
    } else if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
      newErrors.originalPrice = "Original price must be greater than 0.";
    } else if (!Number.isInteger(originalPrice)) {
      newErrors.originalPrice = "Original price must be a whole number.";
    } else if (Number.isFinite(price) && originalPrice <= price) {
      newErrors.originalPrice =
        "Original price must be greater than the deal price.";
    }

    // --------------------------------------------------------
    // INCLUDED ITEMS
    // --------------------------------------------------------

    const validItems = form.items.map((item) => item.trim()).filter(Boolean);

    if (!validItems.length) {
      newErrors.items = "At least one menu item must be selected.";
    }

    return newErrors;
  };

  const buildDealItemsPayload = () =>
    form.items
      .map((menuItemId) => menuItemId.trim())
      .filter(Boolean)
      .map((menuItemId, index) => ({
        MenuItemId: menuItemId,
        Quantity: 1,
        DisplayOrder: index + 1,
      }));

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    const validationErrors = validateForm();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // ====================================================
      // CREATE FORMDATA
      // ====================================================

      const formData = new FormData();

      formData.append("Title", form.title.trim());

      formData.append("Description", form.description.trim());

      formData.append("Price", Number(form.price).toString());

      formData.append("OriginalPrice", Number(form.originalPrice).toString());

      if (form.badge.trim()) {
        formData.append("Badge", form.badge.trim());
      }

      formData.append("Featured", form.featured.toString());

      // New deals are active by default
      formData.append("IsActive", "true");

      // First deal gets display order 1.
      // You can change this later when
      // implementing deal ordering.
      formData.append("DisplayOrder", "1");

      // ====================================================
      // DEAL ITEMS
      // ====================================================
      // The backend expects an array of objects with MenuItemId,
      // MenuItemVariantId, Quantity, and DisplayOrder.
      // ====================================================

      const dealItems = buildDealItemsPayload();

      formData.append("DealItems", JSON.stringify(dealItems));

      // ====================================================
      // IMAGE
      // ====================================================

      if (form.imageFile) {
        formData.append("Image", form.imageFile);
      }

      // Add request explicitly says no image removal
      formData.append("RemoveImage", "false");

      // ====================================================
      // API CALL
      // ====================================================

      const response = await addOrUpdateDeal(formData).unwrap();

      // ====================================================
      // SUCCESS
      // ====================================================
      if (response.success) {
        setCreatedDealName(form.title.trim());

        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error("Error creating deal:", error);
      showToast(error.data.message, "error");
      // ====================================================
      // API ERROR
      // ====================================================

      let message = "Something went wrong while creating the deal.";

      if (error?.data?.message) {
        message = error.data.message;
      } else if (typeof error?.data === "string") {
        message = error.data;
      } else if (error?.error) {
        message = error.error;
      }

      setErrors((previous) => ({
        ...previous,
        title: message,
      }));
    }
  };

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      items: [""],
    });

    setErrors({});

    setImagePreview("");

    setCreatedDealName("");

    setShowSuccessModal(false);
  };

  // ============================================================
  // CLOSE SUCCESS MODAL
  // ============================================================

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // ============================================================
  // INPUT CLASS
  // ============================================================

  const inputClass = (hasError = false) =>
    `h-11 w-full rounded-lg border bg-transparent px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 ${
      hasError
        ? "border-error-500 focus:border-error-500 focus:ring-error-500/10 dark:border-error-500"
        : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700"
    }`;

  // ============================================================
  // TEXTAREA CLASS
  // ============================================================

  const textareaClass = (hasError = false) =>
    `w-full resize-none rounded-lg border px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 ${
      hasError
        ? "border-error-500 focus:border-error-500 focus:ring-error-500/10 dark:border-error-500"
        : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700"
    }`;

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

      <div className="mx-auto w-full max-w-5xl">
        {/* =========================================================
                    HEADER
                ========================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            to="/deals"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
              Create Deal
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a new promotional deal for your customers.
            </p>
          </div>
        </div>

        {/* =========================================================
                    FORM CARD
                ========================================================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* HEADER */}

          <div className="border-b border-gray-200 px-5 py-5 lg:px-6 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Deal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add the details customers will see for this deal.
            </p>
          </div>

          {/* FORM BODY */}

          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2 lg:p-6">
            {errors.title && (
              <div className="flex items-start gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
                <X size={18} className="mt-0.5 shrink-0" />

                <p>{errors.title}</p>
              </div>
            )}
            {/* =================================================
                            TITLE
                        ================================================= */}

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deal Title <span className="text-error-500">*</span>
              </label>

              <input
                type="text"
                value={form.title}
                maxLength={100}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }));

                  setErrors((previous) => ({
                    ...previous,
                    title: undefined,
                  }));
                }}
                placeholder="e.g. Fire Duo"
                className={inputClass(!!errors.title)}
              />

              {/* <div className="mt-1.5 flex items-center justify-between gap-2">
                {errors.title ? (
                  <p className="text-xs text-error-500">{errors.title}</p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-gray-400">
                  {form.title.length}
                  /100
                </span>
              </div> */}
            </div>

            {/* =================================================
                            DESCRIPTION
                        ================================================= */}

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description <span className="text-error-500">*</span>
              </label>

              <textarea
                rows={5}
                maxLength={500}
                value={form.description}
                onChange={(event) => {
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }));

                  setErrors((previous) => ({
                    ...previous,
                    description: undefined,
                  }));
                }}
                placeholder="Describe the deal..."
                className={textareaClass(!!errors.description)}
              />

              <div className="mt-1.5 flex items-center justify-between gap-2">
                {errors.description ? (
                  <p className="text-xs text-error-500">{errors.description}</p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-gray-400">
                  {form.description.length}
                  /500
                </span>
              </div>
            </div>

            {/* =================================================
                            PRICE
                        ================================================= */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deal Price <span className="text-error-500">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  Rs.
                </span>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.price}
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }));

                    setErrors((previous) => ({
                      ...previous,
                      price: undefined,
                      originalPrice: undefined,
                    }));
                  }}
                  placeholder="4200"
                  className={`${inputClass(!!errors.price)} pl-12`}
                />
              </div>

              {errors.price && (
                <p className="mt-1.5 text-xs text-error-500">{errors.price}</p>
              )}
            </div>

            {/* =================================================
                            ORIGINAL PRICE
                        ================================================= */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Original Price <span className="text-error-500">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  Rs.
                </span>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.originalPrice}
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      originalPrice: event.target.value,
                    }));

                    setErrors((previous) => ({
                      ...previous,
                      originalPrice: undefined,
                    }));
                  }}
                  placeholder="5200"
                  className={`${inputClass(!!errors.originalPrice)} pl-12`}
                />
              </div>

              {errors.originalPrice && (
                <p className="mt-1.5 text-xs text-error-500">
                  {errors.originalPrice}
                </p>
              )}
            </div>

            {/* =================================================
                            BADGE
                        ================================================= */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Badge
              </label>

              <input
                type="text"
                maxLength={40}
                value={form.badge}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    badge: event.target.value,
                  }))
                }
                placeholder="e.g. Best Value"
                className={inputClass()}
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Optional promotional label.
              </p>
            </div>

            {/* =================================================
                            FEATURED
                        ================================================= */}

            <div className="flex items-end">
              <label className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Deal
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Show this deal as featured.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      featured: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 shrink-0 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
              </label>
            </div>

            {/* =================================================
                            IMAGE
                        ================================================= */}

            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deal Image <span className="text-error-500">*</span>
              </label>

              {imagePreview ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Deal preview"
                      className="h-56 w-full object-cover sm:h-72"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-14 sm:flex-row sm:items-end sm:justify-between">
                      <span className="max-w-full truncate text-xs font-medium text-white">
                        {form.imageFile?.name || "Selected image"}
                      </span>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-error-600 transition hover:bg-white"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="deal-image"
                  className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-10 text-center transition ${
                    errors.image
                      ? "border-error-400 bg-error-50/30 dark:border-error-500/60 dark:bg-error-500/5"
                      : "border-gray-300 hover:border-brand-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <Upload size={22} />
                  </div>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload deal image
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, JPEG or WEBP
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Maximum file size: 5 MB
                  </p>

                  <input
                    id="deal-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {errors.image && (
                <p className="mt-1.5 text-xs text-error-500">{errors.image}</p>
              )}

              {imagePreview && (
                <label
                  htmlFor="change-deal-image"
                  className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-500 transition hover:text-brand-600"
                >
                  <Upload size={16} />
                  Change image
                  <input
                    id="change-deal-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* =================================================
                            ITEMS
                        ================================================= */}

            <div className="lg:col-span-2">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Included Items <span className="text-error-500">*</span>
                </label>

                <p className="mt-1 text-xs text-gray-400">
                  Select all menu items included in this deal.
                </p>
              </div>

              <div
                className={`overflow-hidden rounded-xl border bg-transparent shadow-sm transition ${
                  errors.items
                    ? "border-error-500 focus-within:border-error-500 focus-within:ring-3 focus-within:ring-error-500/10 dark:border-error-500"
                    : "border-gray-300 focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 dark:border-gray-700"
                }`}
              >
                <div className="flex min-h-[56px] flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50/70 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/60">
                  {selectedMenuItems.length > 0 ? (
                    selectedMenuItems.map((menuItem) => (
                      <button
                        type="button"
                        key={menuItem.id}
                        onClick={() => toggleMenuItem(menuItem.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/15"
                      >
                        {menuItem.name}
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-200 text-[10px] text-brand-700 dark:bg-brand-500/20 dark:text-brand-200">
                          ×
                        </span>
                      </button>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      Select menu items...
                    </span>
                  )}
                </div>

                <select
                  multiple
                  value={form.items}
                  disabled={menuItemsLoading || menuItems.length === 0}
                  onChange={(event) => {
                    const selectedValues = Array.from(
                      event.target.selectedOptions,
                      (option) => option.value,
                    );

                    handleItemSelection(selectedValues);
                  }}
                  className="min-h-[150px] w-full border-0 bg-transparent px-3 py-2 text-sm text-gray-800 outline-none dark:bg-gray-900 dark:text-white/90"
                >
                  {menuItems.length === 0 && !menuItemsLoading && (
                    <option value="" disabled>
                      No menu items available
                    </option>
                  )}

                  {menuItems.map((menuItem) => (
                    <option key={menuItem.id} value={menuItem.id}>
                      {menuItem.name}
                    </option>
                  ))}
                </select>
              </div>

              {errors.items && (
                <p className="mt-1.5 text-xs text-error-500">{errors.items}</p>
              )}
            </div>
          </div>

          {/* =====================================================
                        FOOTER
                    ===================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-gray-800">
            <Link
              to="/deals"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Create Deal
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =============================================================
                SUCCESS MODAL
            ============================================================= */}

      {showSuccessModal && (
        <SuccessModal
          dealName={createdDealName}
          onClose={closeSuccessModal}
          onAddAnother={() => {
            resetForm();
          }}
          onViewDeals={() => {
            setShowSuccessModal(false);

            navigate("/deals");
          }}
        />
      )}
    </>
  );
}
