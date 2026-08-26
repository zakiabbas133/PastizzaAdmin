import {
    ChangeEvent,
    useEffect,
    useState,
} from "react";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Upload,
} from "lucide-react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router";

import { deals as initialDeals } from "../../data/deals";
import type { Deal } from "../../types";

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

export default function EditDeal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const deal = initialDeals.find(
        (item) => item.id === id
    );

    const [form, setForm] =
        useState<DealForm | null>(null);

    const [imagePreview, setImagePreview] =
        useState("");

    useEffect(() => {
        if (!deal) {
            return;
        }

        setForm({
            title: deal.title,
            description: deal.description,
            image: deal.image,
            imageFile: null,
            price: String(deal.price),
            originalPrice: String(
                deal.originalPrice
            ),
            badge: deal.badge ?? "",
            items:
                deal.items.length > 0
                    ? [...deal.items]
                    : [""],
            featured: Boolean(deal.featured),
        });

        setImagePreview(deal.image);
    }, [deal]);

    useEffect(() => {
        if (!form?.imageFile) {
            return;
        }

        const url = URL.createObjectURL(
            form.imageFile
        );

        setImagePreview(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [form?.imageFile]);

    if (!deal || !form) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 text-center dark:border-gray-800 dark:bg-white/[0.03]">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Deal not found
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    The deal you are trying to edit does not
                    exist.
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

        setForm((previous) =>
            previous
                ? {
                    ...previous,
                    imageFile: file,
                }
                : previous
        );
    };

    const removeImage = () => {
        setForm((previous) =>
            previous
                ? {
                    ...previous,
                    image: "",
                    imageFile: null,
                }
                : previous
        );

        setImagePreview("");
    };

    const updateItem = (
        index: number,
        value: string
    ) => {
        setForm((previous) =>
            previous
                ? {
                    ...previous,
                    items: previous.items.map(
                        (item, itemIndex) =>
                            itemIndex === index
                                ? value
                                : item
                    ),
                }
                : previous
        );
    };

    const addItem = () => {
        setForm((previous) =>
            previous
                ? {
                    ...previous,
                    items: [...previous.items, ""],
                }
                : previous
        );
    };

    const removeItem = (index: number) => {
        setForm((previous) => {
            if (!previous) {
                return previous;
            }

            const items = previous.items.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            );

            return {
                ...previous,
                items: items.length ? items : [""],
            };
        });
    };

    const handleSubmit = () => {
        const updatedDeal: Deal = {
            id: deal.id,
            title: form.title.trim(),
            description: form.description.trim(),
            image:
                imagePreview ||
                form.image ||
                "",
            price: Number(form.price),
            originalPrice: Number(
                form.originalPrice
            ),
            badge: form.badge.trim(),
            items: form.items
                .map((item) => item.trim())
                .filter(Boolean),
            featured: form.featured,
        };

        /*
         * Replace this with your Firestore update call.
         */
        console.log("Updated deal:", updatedDeal);

        navigate(`/deals/${deal.id}`);
    };

    return (
        <div className="mx-auto w-full max-w-5xl">
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                    to={`/deals/${deal.id}`}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <ArrowLeft size={18} />
                </Link>

                <div>
                    <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
                        Edit Deal
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Update the information for{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {deal.title}
                        </span>
                        .
                    </p>
                </div>
            </div>

            {/* FORM */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="border-b border-gray-200 px-5 py-5 lg:px-6 dark:border-gray-800">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        Deal Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2 lg:p-6">
                    {/* TITLE */}
                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deal Title{" "}
                            <span className="text-error-500">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            value={form.title}
                            onChange={(event) =>
                                setForm((previous: any) => ({
                                    ...previous,
                                    title:
                                        event.target.value,
                                }))
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description{" "}
                            <span className="text-error-500">
                                *
                            </span>
                        </label>

                        <textarea
                            rows={5}
                            value={form.description}
                            onChange={(event) =>
                                setForm((previous: any) => ({
                                    ...previous,
                                    description:
                                        event.target.value,
                                }))
                            }
                            className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                    </div>

                    {/* PRICE */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deal Price{" "}
                            <span className="text-error-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                Rs.
                            </span>

                            <input
                                type="number"
                                min="0"
                                value={form.price}
                                onChange={(event) =>
                                    setForm((previous: any) => ({
                                        ...previous,
                                        price:
                                            event.target.value,
                                    }))
                                }
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-12 pr-4 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            />
                        </div>
                    </div>

                    {/* ORIGINAL PRICE */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Original Price{" "}
                            <span className="text-error-500">
                                *
                            </span>
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                Rs.
                            </span>

                            <input
                                type="number"
                                min="0"
                                value={form.originalPrice}
                                onChange={(event) =>
                                    setForm((previous: any) => ({
                                        ...previous,
                                        originalPrice:
                                            event.target.value,
                                    }))
                                }
                                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-12 pr-4 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            />
                        </div>
                    </div>

                    {/* BADGE */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Badge
                        </label>

                        <input
                            type="text"
                            value={form.badge}
                            onChange={(event) =>
                                setForm((previous: any) => ({
                                    ...previous,
                                    badge:
                                        event.target.value,
                                }))
                            }
                            placeholder="e.g. Popular"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                    </div>

                    {/* FEATURED */}
                    <div className="flex items-end">
                        <label className="flex h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-4 dark:border-gray-700">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Featured Deal
                                </p>

                                <p className="text-xs text-gray-400">
                                    Show this deal as featured.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={form.featured}
                                onChange={(event) =>
                                    setForm((previous: any) => ({
                                        ...previous,
                                        featured:
                                            event.target.checked,
                                    }))
                                }
                                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                            />
                        </label>
                    </div>

                    {/* IMAGE */}
                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deal Image
                        </label>

                        {imagePreview ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt={form.title}
                                        className="h-64 w-full object-cover sm:h-72"
                                    />

                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-14">
                                        <span className="min-w-0 truncate text-xs font-medium text-white">
                                            {form.imageFile
                                                ? form.imageFile.name
                                                : "Current image"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-error-600 hover:bg-white"
                                        >
                                            <Trash2 size={14} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="edit-deal-image"
                                className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-10 text-center hover:border-brand-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-white/[0.02]"
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

                                <input
                                    id="edit-deal-image"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {imagePreview && (
                            <label
                                htmlFor="edit-deal-image-change"
                                className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600"
                            >
                                <Upload size={16} />
                                Change image

                                <input
                                    id="edit-deal-image-change"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* ITEMS */}
                    <div className="lg:col-span-2">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Included Items
                                </label>

                                <p className="mt-1 text-xs text-gray-400">
                                    Add or remove items included in
                                    this deal.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600"
                            >
                                <Plus size={16} />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {form.items.map(
                                (item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(event) =>
                                                updateItem(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(index)
                                            }
                                            disabled={
                                                form.items.length === 1
                                            }
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-error-500 hover:bg-error-50 disabled:opacity-30 dark:hover:bg-error-500/10"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-gray-800">
                    <Link
                        to={`/deals/${deal.id}`}
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </Link>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}