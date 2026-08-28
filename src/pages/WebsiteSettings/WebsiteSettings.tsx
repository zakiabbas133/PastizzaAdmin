import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  Check,
  Edit3,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import type { Location } from "../../types";
import { locations as initialLocations } from "../../data/locations";
import {
  useAddOrUpdateWebsiteSettingsMutation,
  useGetWebsiteSettingsQuery,
} from "../../services/websiteSettingsApi";

/* ========================================================================
   TYPES
======================================================================== */

interface WebsiteSettingsData {
  logo: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  whatsappMessage: string;
  email: string;
}

interface LocationForm {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  openingHours: string[];
  latitude: string;
  longitude: string;
}

type FormErrors = Record<string, string>;

interface SuccessModalData {
  title: string;
  message: string;
}

/* ========================================================================
   CONSTANTS
======================================================================== */

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const EMPTY_LOCATION_FORM: LocationForm = {
  name: "",
  address: "",
  phone: "",
  whatsapp: "",
  openingHours: Array(7).fill(""),
  latitude: "",
  longitude: "",
};

const INITIAL_WEBSITE_SETTINGS: WebsiteSettingsData = {
  logo: "",
  facebookUrl: "",
  instagramUrl: "",
  whatsappUrl: "",
  whatsappMessage: "Hello! I would like to know more about your menu.",
  email: "",
};

/* ========================================================================
   MAIN COMPONENT
======================================================================== */

export default function WebsiteSettings() {
  const SOCIAL_PREFIXES = {
    facebook: "https://m.me/",
    instagram: "https://ig.me/m/",
    whatsapp: "https://wa.me/",
  } as const;

  const {
    data = {},
    isLoading: categoriesLoading,
    refetch,
  } = useGetWebsiteSettingsQuery();
  console.log(data)
  const [addOrUpdateWebsiteSettings, { isLoading: websiteSettingLoading }] =
    useAddOrUpdateWebsiteSettingsMutation();

  /* --------------------------------------------------------------------
       WEBSITE SETTINGS
    -------------------------------------------------------------------- */

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsData>(
    INITIAL_WEBSITE_SETTINGS,
  );

  const [logoPreview, setLogoPreview] = useState<string>("");

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [websiteErrors, setWebsiteErrors] = useState<FormErrors>({});

  const [isSavingWebsite, setIsSavingWebsite] = useState<boolean>(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  /* --------------------------------------------------------------------
       LOCATIONS
    -------------------------------------------------------------------- */

  const [locations, setLocations] = useState<Location[]>(initialLocations);

  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState<boolean>(false);

  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null,
  );

  const [locationForm, setLocationForm] = useState<LocationForm>({
    ...EMPTY_LOCATION_FORM,
    openingHours: [...EMPTY_LOCATION_FORM.openingHours],
  });

  const [locationErrors, setLocationErrors] = useState<FormErrors>({});

  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  /* --------------------------------------------------------------------
       SUCCESS MODAL
    -------------------------------------------------------------------- */

  const [successModal, setSuccessModal] = useState<SuccessModalData | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

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

  /* ====================================================================
       WEBSITE LOGO
    ==================================================================== */

  function getWhatsAppNumber(url: string): string {
    const prefix = "https://wa.me/";

    if (!url) {
      return "";
    }

    if (url.startsWith(prefix)) {
      return url.slice(prefix.length);
    }

    return url.replace(/^https?:\/\/wa\.me\//i, "").replace(/\D/g, "");
  }

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      setWebsiteErrors((previous) => ({
        ...previous,
        logo: "Only PNG, JPG, JPEG, WEBP, or SVG images are allowed.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setWebsiteErrors((previous) => ({
        ...previous,
        logo: "Logo image must be smaller than 5MB.",
      }));

      event.target.value = "";
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    const preview = URL.createObjectURL(file);

    setLogoFile(file);
    setLogoPreview(preview);

    setWebsiteErrors((previous) => {
      const next = { ...previous };
      delete next.logo;
      return next;
    });
  };

  const removeLogo = (): void => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogoPreview("");
    setLogoFile(null);

    setWebsiteSettings((previous) => ({
      ...previous,
      logo: "",
    }));

    setWebsiteErrors((previous) => {
      const next = { ...previous };
      delete next.logo;
      return next;
    });

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  function getSocialIdentifier(
    value: string,
    platform: "facebook" | "instagram",
  ): string {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    const prefix = SOCIAL_PREFIXES[platform];

    // Already in our expected format.
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim();
    }

    /*
     * Support previously saved values such as:
     * https://facebook.com/yourpage
     * https://instagram.com/yourpage
     */
    try {
      const url = new URL(trimmed);
      const hostname = url.hostname.toLowerCase();

      if (platform === "facebook") {
        if (
          hostname === "facebook.com" ||
          hostname === "www.facebook.com" ||
          hostname.endsWith(".facebook.com") ||
          hostname === "fb.com" ||
          hostname === "www.fb.com" ||
          hostname.endsWith(".fb.com")
        ) {
          return url.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
        }
      }

      if (platform === "instagram") {
        if (
          hostname === "instagram.com" ||
          hostname === "www.instagram.com" ||
          hostname.endsWith(".instagram.com")
        ) {
          return url.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
        }
      }
    } catch {
      // Invalid URL. Return the original value so validation fails.
    }

    return trimmed;
  }

  function isValidSocialIdentifier(
    value: string,
    platform: "facebook" | "instagram",
  ): boolean {
    const identifier = value.trim();

    if (!identifier) {
      return false;
    }

    /*
     * Facebook:
     * - Page/profile username
     * - Facebook page ID
     *
     * Instagram:
     * - Instagram username
     */
    if (platform === "facebook") {
      return (
        /^[a-zA-Z0-9.]+$/.test(identifier) &&
        identifier.length >= 1 &&
        identifier.length <= 100
      );
    }

    return (
      /^[a-zA-Z0-9._]+$/.test(identifier) &&
      identifier.length >= 1 &&
      identifier.length <= 30
    );
  }

  function isValidWhatsAppNumber(value: string): boolean {
    const digits = value.replace(/\D/g, "");

    /*
     * International phone numbers:
     * Minimum 7 digits
     * Maximum 15 digits
     */
    return digits.length >= 7 && digits.length <= 15;
  }

  function isValidEmail(value: string): boolean {
    const email = value.trim();

    if (!email) {
      return false;
    }

    if (email.length > 254) {
      return false;
    }

    /*
     * Prevent:
     * - spaces
     * - missing @
     * - missing domain
     * - missing TLD
     * - consecutive dots
     */
    if (/\s/.test(email)) {
      return false;
    }

    if (email.includes("..")) {
      return false;
    }

    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
      email,
    );
  }

  /* ====================================================================
       WEBSITE VALIDATION
    ==================================================================== */

  const validateWebsiteSettings = (): boolean => {
    const errors: FormErrors = {};

    /* ============================================================
     LOGO
  ============================================================ */

    if (!websiteSettings.logo.trim() && !logoFile && !logoPreview) {
      errors.logo = "Website logo is required.";
    }

    /* ============================================================
     FACEBOOK
  ============================================================ */

    const facebookIdentifier = getSocialIdentifier(
      websiteSettings.facebookUrl,
      "facebook",
    );

    if (!facebookIdentifier) {
      errors.facebookUrl = "Facebook is required.";
    } else if (!isValidSocialIdentifier(facebookIdentifier, "facebook")) {
      errors.facebookUrl = "Facebook is invalid.";
    }

    /* ============================================================
     INSTAGRAM
  ============================================================ */

    const instagramIdentifier = getSocialIdentifier(
      websiteSettings.instagramUrl,
      "instagram",
    );

    if (!instagramIdentifier) {
      errors.instagramUrl = "Instagram is required.";
    } else if (!isValidSocialIdentifier(instagramIdentifier, "instagram")) {
      errors.instagramUrl = "Instagram is invalid.";
    }

    /* ============================================================
     WHATSAPP
  ============================================================ */

    const whatsappNumber = getWhatsAppNumber(websiteSettings.whatsappUrl);

    if (!whatsappNumber) {
      errors.whatsappUrl = "WhatsApp is required.";
    } else if (!isValidWhatsAppNumber(whatsappNumber)) {
      errors.whatsappUrl = "WhatsApp is invalid.";
    }

    /* ============================================================
     WHATSAPP MESSAGE
  ============================================================ */

    const whatsappMessage = websiteSettings.whatsappMessage.trim();

    if (!whatsappMessage) {
      errors.whatsappMessage = "WhatsApp message is required.";
    } else if (whatsappMessage.length < 5 || whatsappMessage.length > 500) {
      errors.whatsappMessage = "WhatsApp message is invalid.";
    }

    /* ============================================================
     EMAIL
  ============================================================ */

    const email = websiteSettings.email.trim();

    if (!email) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Email is invalid.";
    }

    setWebsiteErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSaveWebsiteSettings = async (): Promise<void> => {
    if (!validateWebsiteSettings()) {
      return;
    }

    setIsSavingWebsite(true);

    try {
      const formData = new FormData();

      formData.append("FacebookUrl", websiteSettings.facebookUrl.trim());

      formData.append("InstagramUrl", websiteSettings.instagramUrl.trim());

      formData.append("WhatsappUrl", websiteSettings.whatsappUrl.trim());

      formData.append(
        "WhatsappMessage",
        websiteSettings.whatsappMessage.trim(),
      );

      formData.append("Email", websiteSettings.email.trim());

      // Only append when a new logo was selected
      if (logoFile) {
        formData.append("LogoFile", logoFile);
      }

      const response = await addOrUpdateWebsiteSettings(formData).unwrap();

      if (response.success) {
        setSuccessModal({
          title: "Settings Saved!",
          message: "Your website settings have been updated successfully.",
        });

        // Clear the selected file after successful upload
        setLogoFile(null);
      }
    } catch (error) {
      console.error("Error saving website settings:", error);
      showToast("Failed to create category. Please try again.", "error");
      setWebsiteErrors((previous) => ({
        ...previous,
        general: "Something went wrong while saving website settings.",
      }));
    } finally {
      setIsSavingWebsite(false);
    }
  };

  /* ====================================================================
       LOCATION MODAL
    ==================================================================== */

  const openAddLocation = (): void => {
    setEditingLocationId(null);

    setLocationForm({
      ...EMPTY_LOCATION_FORM,
      openingHours: [...EMPTY_LOCATION_FORM.openingHours],
    });

    setLocationErrors({});
    setIsLocationModalOpen(true);
  };

  const openEditLocation = (location: Location): void => {
    setEditingLocationId(location.id);

    setLocationForm({
      name: location.name,
      address: location.address,
      phone: location.phone,
      whatsapp: String(location.whatsapp),
      openingHours: [...location.openingHours, "", "", "", ""].slice(0, 7),
      latitude: String(location?.coordinates?.lat),
      longitude: String(location?.coordinates?.lng),
    });

    setLocationErrors({});
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = (): void => {
    setIsLocationModalOpen(false);
    setEditingLocationId(null);

    setLocationForm({
      ...EMPTY_LOCATION_FORM,
      openingHours: [...EMPTY_LOCATION_FORM.openingHours],
    });

    setLocationErrors({});
  };

  /* ====================================================================
       LOCATION VALIDATION
    ==================================================================== */

  const validateLocation = (): boolean => {
    const errors: FormErrors = {};

    const name = locationForm.name.trim();

    const address = locationForm.address.trim();

    const phone = locationForm.phone.trim();

    const whatsapp = locationForm.whatsapp.trim();

    const latitude = locationForm.latitude.trim();

    const longitude = locationForm.longitude.trim();

    /* NAME */

    if (!name) {
      errors.name = "Location name is required.";
    } else if (name.length < 2) {
      errors.name = "Location name must contain at least 2 characters.";
    } else if (name.length > 80) {
      errors.name = "Location name cannot exceed 80 characters.";
    }

    /* ADDRESS */

    if (!address) {
      errors.address = "Address is required.";
    } else if (address.length < 5) {
      errors.address = "Please enter a complete address.";
    } else if (address.length > 200) {
      errors.address = "Address cannot exceed 200 characters.";
    }

    /* PHONE */

    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (!isValidPhone(phone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    /* WHATSAPP */

    if (!whatsapp) {
      errors.whatsapp = "WhatsApp number is required.";
    } else if (!isValidPhone(whatsapp)) {
      errors.whatsapp = "Please enter a valid WhatsApp number.";
    }

    /* LATITUDE */

    if (!latitude) {
      errors.latitude = "Latitude is required.";
    } else if (!isValidLatitude(latitude)) {
      errors.latitude = "Latitude must be between -90 and 90.";
    }

    /* LONGITUDE */

    if (!longitude) {
      errors.longitude = "Longitude is required.";
    } else if (!isValidLongitude(longitude)) {
      errors.longitude = "Longitude must be between -180 and 180.";
    }

    /* OPENING HOURS */

    const validOpeningHours = locationForm.openingHours
      .map((hour) => hour.trim())
      .filter(Boolean);

    if (validOpeningHours.length === 0) {
      errors.openingHours = "Add at least one opening-hours entry.";
    }

    setLocationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* ====================================================================
       SAVE LOCATION
    ==================================================================== */

  const handleSaveLocation = (): void => {
    if (!validateLocation()) {
      return;
    }

    const openingHours = locationForm.openingHours
      .map((hour) => hour.trim())
      .filter(Boolean);

    if (editingLocationId) {
      setLocations((previous) =>
        previous.map((location) => {
          if (location.id !== editingLocationId) {
            return location;
          }

          return {
            ...location,
            name: locationForm.name.trim(),
            address: locationForm.address.trim(),
            phone: locationForm.phone.trim(),
            whatsapp: locationForm.whatsapp.trim(),
            openingHours,
            coordinates: {
              lat: Number(locationForm.latitude),
              lng: Number(locationForm.longitude),
            },
          };
        }),
      );

      closeLocationModal();

      setSuccessModal({
        title: "Location Updated!",
        message: "The location has been updated successfully.",
      });

      return;
    }

    const newLocation: Location = {
      id: createLocationId(locationForm.name, locations),
      name: locationForm.name.trim(),
      address: locationForm.address.trim(),
      phone: locationForm.phone.trim(),
      whatsapp: locationForm.whatsapp.trim(),
      openingHours,
      coordinates: {
        lat: Number(locationForm.latitude),
        lng: Number(locationForm.longitude),
      },
    };

    setLocations((previous) => [...previous, newLocation]);

    closeLocationModal();

    setSuccessModal({
      title: "Location Added!",
      message: "The new location has been added successfully.",
    });
  };

  /* ====================================================================
       DELETE LOCATION
    ==================================================================== */

  const handleDeleteLocation = (): void => {
    if (!deleteLocation) {
      return;
    }

    setIsDeleting(true);

    setTimeout(() => {
      setLocations((previous) =>
        previous.filter((location) => location.id !== deleteLocation.id),
      );

      setIsDeleting(false);
      setDeleteLocation(null);

      setSuccessModal({
        title: "Location Deleted!",
        message: "The location has been deleted successfully.",
      });
    }, 300);
  };

  /* ====================================================================
       OPENING HOURS
    ==================================================================== */

  const updateOpeningHour = (index: number, value: string): void => {
    setLocationForm((previous) => ({
      ...previous,
      openingHours: previous.openingHours.map((hour, hourIndex) =>
        hourIndex === index ? value : hour,
      ),
    }));
  };

  const getWebsiteSettings = async () => {
    const response = null;
  };

  useEffect(() => {
    getWebsiteSettings();
  }, []);

  /* ====================================================================
       RENDER
    ==================================================================== */

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* PAGE HEADER */}

        <div className="flex flex-col gap-1">
          <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
            Website Settings
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your website branding, social links, contact information, and
            restaurant locations.
          </p>
        </div>

        {/* ========================================================
                    WEBSITE INFORMATION
                ======================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-5 py-5 lg:px-6 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                <Globe size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Website Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configure your website branding and contact details.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 lg:p-6">
            {/* LOGO */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website Logo
                <span className="ml-1 text-error-500">*</span>
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  {logoPreview || websiteSettings.logo ? (
                    <img
                      src={logoPreview || websiteSettings.logo}
                      alt="Website logo"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <ImageIcon size={30} className="text-gray-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
                    >
                      <Upload size={16} />

                      {logoPreview || websiteSettings.logo
                        ? "Change Logo"
                        : "Select Logo"}
                    </button>

                    {(logoPreview || websiteSettings.logo) && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-error-500 transition hover:bg-error-50 dark:border-gray-700 dark:hover:bg-error-500/10"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    PNG, JPG, JPEG, WEBP or SVG. Maximum 5MB.
                  </p>

                  {websiteErrors.logo && (
                    <p className="mt-1 text-xs text-error-500">
                      {websiteErrors.logo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SOCIAL / CONTACT */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* FACEBOOK */}

              <Field
                label="Facebook"
                required
                error={websiteErrors.facebookUrl}
              >
                <div
                  className={`flex h-11 w-full overflow-hidden rounded-lg border bg-transparent text-sm transition ${
                    websiteErrors.facebookUrl
                      ? "border-error-500 focus-within:border-error-500 focus-within:ring-3 focus-within:ring-error-500/10"
                      : "border-gray-300 focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 dark:border-gray-700"
                  } dark:bg-gray-900`}
                >
                  {/* FIXED PREFIX */}
                  <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    https://m.me/
                  </div>

                  {/* USERNAME / PAGE ID */}
                  <input
                    type="text"
                    value={getSocialIdentifier(
                      websiteSettings.facebookUrl,
                      "facebook",
                    )}
                    onChange={(event) => {
                      const value = event.target.value
                        .replace(
                          /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\//i,
                          "",
                        )
                        .replace(/\s/g, "");

                      setWebsiteSettings((previous) => ({
                        ...previous,
                        facebookUrl: value
                          ? `${SOCIAL_PREFIXES.facebook}${value}`
                          : "",
                      }));

                      setWebsiteErrors((previous) => {
                        const next = { ...previous };
                        delete next.facebookUrl;
                        return next;
                      });
                    }}
                    placeholder="yourpage"
                    maxLength={100}
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white/90 dark:placeholder:text-gray-500"
                  />
                </div>
              </Field>

              {/* INSTAGRAM */}

              <Field
                label="Instagram"
                required
                error={websiteErrors.instagramUrl}
              >
                <div
                  className={`flex h-11 w-full overflow-hidden rounded-lg border bg-transparent text-sm transition ${
                    websiteErrors.instagramUrl
                      ? "border-error-500 focus-within:border-error-500 focus-within:ring-3 focus-within:ring-error-500/10"
                      : "border-gray-300 focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 dark:border-gray-700"
                  } dark:bg-gray-900`}
                >
                  {/* FIXED PREFIX */}
                  <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    https://ig.me/m/
                  </div>

                  {/* USERNAME */}
                  <input
                    type="text"
                    value={getSocialIdentifier(
                      websiteSettings.instagramUrl,
                      "instagram",
                    )}
                    onChange={(event) => {
                      const value = event.target.value
                        .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
                        .replace(/\s/g, "");

                      setWebsiteSettings((previous) => ({
                        ...previous,
                        instagramUrl: value
                          ? `${SOCIAL_PREFIXES.instagram}${value}`
                          : "",
                      }));

                      setWebsiteErrors((previous) => {
                        const next = { ...previous };
                        delete next.instagramUrl;
                        return next;
                      });
                    }}
                    placeholder="yourusername"
                    maxLength={30}
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white/90 dark:placeholder:text-gray-500"
                  />
                </div>
              </Field>

              {/* WHATSAPP URL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  WhatsApp URL
                </label>

                <div
                  className={`flex h-11 w-full overflow-hidden rounded-lg border bg-transparent text-sm transition ${
                    websiteErrors.whatsappUrl
                      ? "border-error-500 focus-within:border-error-500 focus-within:ring-3 focus-within:ring-error-500/10"
                      : "border-gray-300 focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 dark:border-gray-700"
                  } dark:bg-gray-900`}
                >
                  {/* FIXED PREFIX */}

                  <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    https://wa.me/
                  </div>

                  {/* NUMBER */}

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={getWhatsAppNumber(websiteSettings.whatsappUrl)}
                    onChange={(event) => {
                      const number = event.target.value.replace(/\D/g, "");

                      setWebsiteSettings((previous) => ({
                        ...previous,
                        whatsappUrl: number ? `https://wa.me/${number}` : "",
                      }));

                      setWebsiteErrors((previous) => {
                        const next = {
                          ...previous,
                        };

                        delete next.whatsappUrl;

                        return next;
                      });
                    }}
                    placeholder="15550142200"
                    className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white/90 dark:placeholder:text-gray-500"
                  />
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  Enter the WhatsApp number with country code, without + or
                  spaces.
                </p>

                {websiteErrors.whatsappUrl && (
                  <p className="mt-1 text-xs text-error-500">
                    {websiteErrors.whatsappUrl}
                  </p>
                )}
              </div>

              {/* EMAIL */}

              <Field label="Email" required error={websiteErrors.email}>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={websiteSettings.email}
                    onChange={(event) =>
                      setWebsiteSettings((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    placeholder="hello@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>
            </div>

            {/* WHATSAPP MESSAGE */}

            <Field
              label="WhatsApp Message"
              error={websiteErrors.whatsappMessage}
            >
              <textarea
                rows={4}
                maxLength={500}
                value={websiteSettings.whatsappMessage}
                onChange={(event) =>
                  setWebsiteSettings((previous) => ({
                    ...previous,
                    whatsappMessage: event.target.value,
                  }))
                }
                placeholder="Hello! I would like to know more about your menu."
                className={textareaClass}
              />

              <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-400">
                  This message is included automatically when a customer opens
                  WhatsApp.
                </p>

                <span
                  className={
                    websiteSettings.whatsappMessage.length > 500
                      ? "text-xs text-error-500"
                      : "text-xs text-gray-400"
                  }
                >
                  {websiteSettings.whatsappMessage.length}
                  /500
                </span>
              </div>
            </Field>
          </div>

          {/* SAVE */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-gray-800">
            <button
              type="button"
              onClick={handleSaveWebsiteSettings}
              disabled={isSavingWebsite}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSavingWebsite ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Save Website Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================
                    LOCATIONS
                ======================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Locations
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your restaurant locations.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddLocation}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 sm:w-auto"
            >
              <Plus size={17} />
              Add Location
            </button>
          </div>

          <div className="p-5 lg:p-6">
            {locations.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-5 text-center dark:border-gray-700">
                <MapPin size={22} className="text-gray-400" />

                <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                  No locations found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
                  Add your first restaurant location to get started.
                </p>

                <button
                  type="button"
                  onClick={openAddLocation}
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-brand-500 px-4 text-xs font-medium text-white hover:bg-brand-600"
                >
                  <Plus size={15} />
                  Add Location
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {locations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onEdit={openEditLocation}
                    onDelete={setDeleteLocation}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOCATION MODAL */}

      {isLocationModalOpen && (
        <LocationModal
          editing={Boolean(editingLocationId)}
          form={locationForm}
          errors={locationErrors}
          onChange={setLocationForm}
          onOpeningHourChange={updateOpeningHour}
          onClose={closeLocationModal}
          onSubmit={handleSaveLocation}
        />
      )}

      {/* DELETE MODAL */}

      {deleteLocation && (
        <DeleteConfirmationModal
          locationName={deleteLocation.name}
          loading={isDeleting}
          onCancel={() => setDeleteLocation(null)}
          onConfirm={handleDeleteLocation}
        />
      )}

      {/* SUCCESS MODAL */}

      {successModal && (
        <SuccessModal
          title={successModal.title}
          message={successModal.message}
          onClose={() => setSuccessModal(null)}
        />
      )}
    </>
  );
}

/* ========================================================================
   LOCATION CARD
======================================================================== */

function LocationCard({
  location,
  onEdit,
  onDelete,
}: {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-brand-200 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500/40">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4 dark:border-gray-800">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/10">
            <MapPin size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
              {location.name}
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              {location.address}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(location)}
            aria-label={`Edit ${location.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-brand-500 dark:hover:bg-gray-800"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(location)}
            aria-label={`Delete ${location.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div>
          <p className={labelClass}>Phone</p>

          <p className={valueClass}>{location.phone}</p>
        </div>

        <div>
          <p className={labelClass}>WhatsApp</p>

          <p className={valueClass}>{location.whatsapp}</p>
        </div>

        <div className="sm:col-span-2">
          <p className={labelClass}>Opening Hours</p>

          <div className="mt-2 space-y-1">
            {location.openingHours.map((hour, index) => (
              <p
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400"
              >
                {hour}
              </p>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <p className={labelClass}>Coordinates</p>

          <p className="mt-1 break-all font-mono text-xs text-gray-600 dark:text-gray-400">
            {location?.coordinates?.lat}, {location?.coordinates?.lng}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   LOCATION MODAL
======================================================================== */

function LocationModal({
  editing,
  form,
  errors,
  onChange,
  onOpeningHourChange,
  onClose,
  onSubmit,
}: {
  editing: boolean;
  form: LocationForm;
  errors: FormErrors;
  onChange: React.Dispatch<React.SetStateAction<LocationForm>>;
  onOpeningHourChange: (index: number, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-gray-950/40 backdrop-blur-md dark:bg-black/60"
        onClick={onClose}
      />

      <div className="relative my-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-800">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-gray-800 sm:text-lg dark:text-white">
              {editing ? "Edit Location" : "Add Location"}
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              {editing
                ? "Update your restaurant location details."
                : "Add a new restaurant location."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Location Name" required error={errors.name}>
              <input
                type="text"
                maxLength={80}
                value={form.name}
                onChange={(event) =>
                  onChange((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Riverside"
                className={inputClass}
              />
            </Field>

            <Field label="Address" required error={errors.address}>
              <input
                type="text"
                maxLength={200}
                value={form.address}
                onChange={(event) =>
                  onChange((previous) => ({
                    ...previous,
                    address: event.target.value,
                  }))
                }
                placeholder="42 Ember Lane, Riverside District"
                className={inputClass}
              />
            </Field>

            <Field label="Phone" required error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  onChange((previous) => ({
                    ...previous,
                    phone: event.target.value,
                  }))
                }
                placeholder="+1 (555) 014-2200"
                className={inputClass}
              />
            </Field>

            <Field label="WhatsApp" required error={errors.whatsapp}>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(event) =>
                  onChange((previous) => ({
                    ...previous,
                    whatsapp: event.target.value,
                  }))
                }
                placeholder="+15550142200"
                className={inputClass}
              />
            </Field>

            <Field label="Latitude" required error={errors.latitude}>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(event) =>
                  onChange((previous) => ({
                    ...previous,
                    latitude: event.target.value,
                  }))
                }
                placeholder="40.7128"
                className={inputClass}
              />
            </Field>

            <Field label="Longitude" required error={errors.longitude}>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(event) =>
                  onChange((previous) => ({
                    ...previous,
                    longitude: event.target.value,
                  }))
                }
                placeholder="-74.0060"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-6">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Opening Hours <span className="text-error-500">*</span>
              </label>

              <p className="mt-1 text-xs text-gray-400">
                Enter the opening hours exactly as you want them displayed.
              </p>
            </div>

            <div className="space-y-3">
              {DAYS.map((day, index) => (
                <div
                  key={day}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr]"
                >
                  <div className="flex h-11 items-center rounded-lg bg-gray-50 px-3 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {day}
                  </div>

                  <input
                    type="text"
                    value={form.openingHours[index] || ""}
                    onChange={(event) =>
                      onOpeningHourChange(index, event.target.value)
                    }
                    placeholder="e.g. 11:00 – 22:00"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            {errors.openingHours && (
              <p className="mt-2 text-xs text-error-500">
                {errors.openingHours}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            <Check size={17} />

            {editing ? "Update Location" : "Add Location"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   DELETE MODAL
======================================================================== */

function DeleteConfirmationModal({
  locationName,
  loading,
  onCancel,
  onConfirm,
}: {
  locationName: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center overflow-y-auto p-4">
      <div
        className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm dark:bg-black/70"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:rounded-3xl sm:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/10">
          <Trash2 size={21} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
          Delete Location?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            "{locationName}"
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-error-500 px-5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Location
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   SUCCESS MODAL
======================================================================== */

function SuccessModal({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100001] flex items-center justify-center overflow-y-auto p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-gray-950/40 backdrop-blur-md dark:bg-black/60"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl dark:border-gray-700/80 dark:bg-gray-900 sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 sm:right-4 sm:top-4 sm:h-9 sm:w-9 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <X size={17} />
        </button>

        <div className="px-5 pb-6 pt-8 text-center sm:px-8 sm:pb-8 sm:pt-10">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 ring-6 ring-success-50/60 sm:h-20 sm:w-20 sm:ring-8 dark:bg-success-500/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-500 text-white shadow-lg shadow-success-500/30 sm:h-14 sm:w-14">
                <Check size={25} strokeWidth={3} />
              </div>
            </div>
          </div>

          <div className="mt-5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-[11px] font-medium text-success-600 sm:mt-7 sm:text-xs dark:bg-success-500/10 dark:text-success-400">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success-500" />
            Successfully Completed
          </div>

          <h2 className="mt-2 break-words px-2 text-xl font-semibold tracking-tight text-gray-800 sm:text-2xl dark:text-white">
            {title}
          </h2>

          <p className="mx-auto mt-2 max-w-sm break-words text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6 dark:text-gray-400">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-xs font-medium text-white shadow-sm shadow-brand-500/20 transition hover:bg-brand-600 sm:h-11 sm:text-sm"
          >
            <Check size={16} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   FIELD
======================================================================== */

function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}

        {required && <span className="ml-1 text-error-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1 break-words text-xs text-error-500">{error}</p>
      )}
    </div>
  );
}

/* ========================================================================
   STYLES
======================================================================== */

const inputClass =
  "h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500";

const textareaClass =
  "w-full min-w-0 resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500";

const labelClass =
  "text-[11px] font-medium uppercase tracking-wide text-gray-400";

const valueClass = "mt-1 break-words text-sm text-gray-700 dark:text-gray-300";

function isValidPhone(value: string): boolean {
  const trimmed = value.trim();

  /*
   * Supports:
   * +1 (555) 014-2200
   * +15550142200
   * 03001234567
   */

  const digits = trimmed.replace(/\D/g, "");

  return digits.length >= 7 && digits.length <= 15;
}

function isValidLatitude(value: string): boolean {
  if (!value.trim()) {
    return false;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= -90 && number <= 90;
}

function isValidLongitude(value: string): boolean {
  if (!value.trim()) {
    return false;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= -180 && number <= 180;
}

/* ========================================================================
   LOCATION ID
======================================================================== */

function createLocationId(name: string, existingLocations: Location[]): string {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "location";

  let id = base;
  let counter = 1;

  while (existingLocations.some((location) => location.id === id)) {
    id = `${base}-${counter}`;
    counter++;
  }

  return id;
}
