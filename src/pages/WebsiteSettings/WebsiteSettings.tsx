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
import Toast from "../../components/toast/Toast";
import { baseUrl } from "../../services/api";
import DashboardLoader from "../../components/loaders/DashboardLoader";

/* ========================================================================
   TYPES
======================================================================== */

interface WebsiteSettingsData {
  logo: string;
  sliderImages: string[];
  video: string;
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

const DEFAULT_WHATSAPP_MESSAGE =
  "Hello! I would like to know more about your menu.";

const ALLOWED_SLIDER_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const ALLOWED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

/* ========================================================================
   MAIN COMPONENT
======================================================================== */

export default function WebsiteSettings() {
  const SOCIAL_PREFIXES = {
    facebook: "https://m.me/",
    instagram: "https://ig.me/m/",
    whatsapp: "https://wa.me/",
  } as const;

  /*
   * The RTK Query endpoint can expose WebsiteSettings while this component
   * expects WebsiteSettingsData. Normalize the response here so the rest
   * of the component always works with one consistent type.
   */
  const {
    data: apiData,
    isLoading: websiteSettingsLoading,
    refetch,
  } = useGetWebsiteSettingsQuery();

  const data = apiData as Partial<WebsiteSettingsData> | undefined;

  console.log(data);

  const [addOrUpdateWebsiteSettings, { isLoading: websiteSettingLoading }] =
    useAddOrUpdateWebsiteSettingsMutation();

  /* --------------------------------------------------------------------
       WEBSITE SETTINGS
  -------------------------------------------------------------------- */

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsData>({
    logo: "",
    sliderImages: [],
    video: "",
    facebookUrl: "",
    instagramUrl: "",
    whatsappUrl: "",
    whatsappMessage: DEFAULT_WHATSAPP_MESSAGE,
    email: "",
  });

  /* --------------------------------------------------------------------
       LOGO
  -------------------------------------------------------------------- */

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  /* --------------------------------------------------------------------
       SLIDER IMAGES
       
       sliderImages  = existing server images that should be KEPT
       sliderFiles   = newly selected files
       sliderPreviews = previews corresponding to sliderFiles
  -------------------------------------------------------------------- */

  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [sliderFiles, setSliderFiles] = useState<File[]>([]);
  const [sliderPreviews, setSliderPreviews] = useState<string[]>([]);

  /* --------------------------------------------------------------------
       VIDEO
  -------------------------------------------------------------------- */

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");

  const [websiteErrors, setWebsiteErrors] = useState<FormErrors>({});

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const sliderInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sliderImagesDirtyRef = useRef(false);

  /* --------------------------------------------------------------------
       TOAST
  -------------------------------------------------------------------- */

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

  /* ====================================================================
       LOAD WEBSITE SETTINGS
  ==================================================================== */

  useEffect(() => {
    if (!data) {
      return;
    }

    let existingSliderImages: string[] = [];

    try {
      if (data.sliderImages) {
        const parsed = JSON.parse(data.sliderImages as any);

        if (Array.isArray(parsed)) {
          existingSliderImages = parsed.filter(Boolean);
        }
      }
    } catch {
      existingSliderImages = [];
    }

    setWebsiteSettings((previous) => ({
      ...previous,
      logo: data.logo ?? "",
      sliderImages: existingSliderImages,
      video: data.video ?? "",
      facebookUrl: data.facebookUrl ?? "",
      instagramUrl: data.instagramUrl ?? "",
      whatsappUrl: data.whatsappUrl ?? "",
      whatsappMessage: data.whatsappMessage || DEFAULT_WHATSAPP_MESSAGE,
      email: data.email ?? "",
    }));

    setSliderImages(existingSliderImages);

    /*
     * Only restore the server video if there isn't a local video
     * currently being edited.
     */
  }, [data]);

  /* ====================================================================
       CLEANUP ON UNMOUNT
  ==================================================================== */

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }

      sliderPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, []);

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

  /* ====================================================================
       SLIDER IMAGES
  ==================================================================== */

  const handleSliderImagesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const files = Array.from(event.target.files ?? []);

    /*
     * Always reset the input.
     *
     * This allows the user to select the same file again after removing it.
     */
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const validFiles: File[] = [];

    for (const file of files) {
      if (!ALLOWED_SLIDER_IMAGE_TYPES.includes(file.type)) {
        showToast(
          `${file.name}: Only PNG, JPG, JPEG, or WEBP images are allowed.`,
          "error",
        );
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        showToast(`${file.name}: Image must be smaller than 5MB.`, "error");
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Do NOT do:
     *
     * setSliderImages([])
     *
     * because sliderImages contains existing server images that the user
     * has decided to keep.
     *
     * New files are simply appended.
     */
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setSliderFiles((previous) => [...previous, ...validFiles]);

    setSliderPreviews((previous) => [...previous, ...newPreviews]);
  };

  const removeExistingSliderImage = (index: number): void => {
    sliderImagesDirtyRef.current = true;

    setSliderImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const removeNewSliderImage = (index: number): void => {
    setSliderPreviews((previous) => {
      const preview = previous[index];

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      return previous.filter((_, previewIndex) => previewIndex !== index);
    });

    setSliderFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  /* ====================================================================
       VIDEO
  ==================================================================== */

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      showToast("Only MP4, WEBM, OGG, or MOV videos are allowed.", "error");

      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      showToast("Video must be smaller than 50MB.", "error");

      return;
    }

    /*
     * Revoke the previous local preview if there was one.
     */
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    const preview = URL.createObjectURL(file);

    setVideoFile(file);
    setVideoPreview(preview);

    /*
     * Clear any previous server video from the local form state.
     * The backend will replace it with the new VideoFile.
     */
    setWebsiteSettings((previous) => ({
      ...previous,
      video: "",
    }));
  };

  const removeVideo = (): void => {
    /*
     * Remove newly selected local video.
     */
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideoPreview("");
    setVideoFile(null);

    /*
     * Mark the existing server video for deletion.
     */

    setWebsiteSettings((previous) => ({
      ...previous,
      video: "",
    }));

    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  /* ====================================================================
       WEBSITE LOGO
  ==================================================================== */

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setWebsiteErrors((previous) => ({
        ...previous,
        logo: "Only PNG, JPG, JPEG, WEBP, or SVG images are allowed.",
      }));

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setWebsiteErrors((previous) => ({
        ...previous,
        logo: "Logo image must be smaller than 5MB.",
      }));

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

  /* ====================================================================
       SOCIAL HELPERS
  ==================================================================== */

  function getWhatsAppNumber(url: string): string {
    const prefix = SOCIAL_PREFIXES.whatsapp;

    if (!url) {
      return "";
    }

    if (url.startsWith(prefix)) {
      return url.slice(prefix.length);
    }

    return url.replace(/^https?:\/\/wa\.me\//i, "").replace(/\D/g, "");
  }

  function getSocialIdentifier(
    value: string,
    platform: "facebook" | "instagram",
  ): string {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    const prefix = SOCIAL_PREFIXES[platform];

    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim();
    }

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
      // Invalid URL. Validation will handle it.
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

    /* LOGO */

    if (!websiteSettings.logo.trim() && !logoFile && !logoPreview) {
      errors.logo = "Website logo is required.";
    }

    /* FACEBOOK */

    const facebookIdentifier = getSocialIdentifier(
      websiteSettings.facebookUrl,
      "facebook",
    );

    if (!facebookIdentifier) {
      errors.facebookUrl = "Facebook is required.";
    } else if (!isValidSocialIdentifier(facebookIdentifier, "facebook")) {
      errors.facebookUrl = "Facebook is invalid.";
    }

    /* INSTAGRAM */

    const instagramIdentifier = getSocialIdentifier(
      websiteSettings.instagramUrl,
      "instagram",
    );

    if (!instagramIdentifier) {
      errors.instagramUrl = "Instagram is required.";
    } else if (!isValidSocialIdentifier(instagramIdentifier, "instagram")) {
      errors.instagramUrl = "Instagram is invalid.";
    }

    /* WHATSAPP */

    const whatsappNumber = getWhatsAppNumber(websiteSettings.whatsappUrl);

    if (!whatsappNumber) {
      errors.whatsappUrl = "WhatsApp is required.";
    } else if (!isValidWhatsAppNumber(whatsappNumber)) {
      errors.whatsappUrl = "WhatsApp is invalid.";
    }

    /* WHATSAPP MESSAGE */

    const whatsappMessage = websiteSettings.whatsappMessage.trim();

    if (!whatsappMessage) {
      errors.whatsappMessage = "WhatsApp message is required.";
    } else if (whatsappMessage.length < 5 || whatsappMessage.length > 500) {
      errors.whatsappMessage = "WhatsApp message is invalid.";
    }

    /* EMAIL */

    const email = websiteSettings.email.trim();

    if (!email) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Email is invalid.";
    }

    setWebsiteErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* ====================================================================
       SAVE WEBSITE SETTINGS
  ==================================================================== */

  const handleSaveWebsiteSettings = async (): Promise<void> => {
    if (!validateWebsiteSettings()) {
      return;
    }

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

      /* ==============================================================
         LOGO
      ============================================================== */

      if (logoFile) {
        formData.append("LogoFile", logoFile);
      }

      /* ==============================================================
         EXISTING SLIDER IMAGES TO KEEP
         
         This contains ONLY the server images that the user has not
         removed.
      ============================================================== */

      formData.append("SliderImages", JSON.stringify(sliderImages));

      /* ==============================================================
         NEW SLIDER IMAGES
         
         These are the files that were selected in this session.
      ============================================================== */

      sliderFiles.forEach((file) => {
        formData.append("SliderImageFiles", file);
      });

      /* ==============================================================
         VIDEO
      ============================================================== */

      if (videoFile) {
        formData.append("VideoFile", videoFile);
      }

      const response = await addOrUpdateWebsiteSettings(formData).unwrap();

      if (!response.success) {
        showToast(
          response.message || "Failed to save website settings.",
          "error",
        );

        return;
      }

      /* ==============================================================
         SUCCESS
      ============================================================== */

      setSuccessModal({
        title: "Settings Saved!",
        message: "Your website settings have been updated successfully.",
      });

      /* ==============================================================
         CLEAR LOGO FILE
      ============================================================== */

      setLogoFile(null);

      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }

      /* ==============================================================
         CLEAR NEW SLIDER FILES/PREVIEWS
      ============================================================== */

      sliderPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      setSliderFiles([]);
      setSliderPreviews([]);

      if (sliderInputRef.current) {
        sliderInputRef.current.value = "";
      }

      /* ==============================================================
         CLEAR VIDEO FILE/PREVIEW
      ============================================================== */

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setVideoFile(null);
      setVideoPreview("");

      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }

      /* ==============================================================
         REFRESH FROM SERVER
      ============================================================== */

      await refetch();
    } catch (error) {
      console.error("Error saving website settings:", error);

      showToast("Failed to save website settings. Please try again.", "error");

      setWebsiteErrors((previous) => ({
        ...previous,
        general: "Something went wrong while saving website settings.",
      }));
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
      latitude: String(location?.coordinates?.lat ?? ""),
      longitude: String(location?.coordinates?.lng ?? ""),
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

  /* ====================================================================
       RENDER
  ==================================================================== */

  const hasLogo = Boolean(logoPreview) || Boolean(websiteSettings.logo);
  const hasVideo = Boolean(videoPreview) || Boolean(websiteSettings.video);

  if (websiteSettingsLoading) {
    return <DashboardLoader message="Loading website settings..." />;
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* =====================================================
            TOAST
        ===================================================== */}

        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />

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
            {/* ====================================================
                LOGO
            ==================================================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website Logo
                <span className="ml-1 text-error-500">*</span>
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  {hasLogo ? (
                    <img
                      src={logoPreview || `${baseUrl}${websiteSettings.logo}`}
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

                      {hasLogo ? "Change Logo" : "Select Logo"}
                    </button>

                    {hasLogo && (
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

            {/* ====================================================
                SOCIAL / CONTACT
            ==================================================== */}

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
                  <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    https://m.me/
                  </div>

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
                        const next = {
                          ...previous,
                        };

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
                  <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    https://ig.me/m/
                  </div>

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
                        const next = {
                          ...previous,
                        };

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

              {/* WHATSAPP */}

              <Field
                label="WhatsApp URL"
                required
                error={websiteErrors.whatsappUrl}
              >
                <div
                  className={`flex h-11 w-full overflow-hidden rounded-lg border bg-transparent text-sm transition ${
                    websiteErrors.whatsappUrl
                      ? "border-error-500 focus-within:border-error-500 focus-within:ring-3 focus-within:ring-error-500/10"
                      : "border-gray-300 focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 dark:border-gray-700"
                  } dark:bg-gray-900`}
                >
                  <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    https://wa.me/
                  </div>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={getWhatsAppNumber(websiteSettings.whatsappUrl)}
                    onChange={(event) => {
                      const number = event.target.value.replace(/\D/g, "");

                      setWebsiteSettings((previous) => ({
                        ...previous,
                        whatsappUrl: number
                          ? `${SOCIAL_PREFIXES.whatsapp}${number}`
                          : "",
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
              </Field>

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

            {/* ====================================================
                WHATSAPP MESSAGE
            ==================================================== */}

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
                placeholder={DEFAULT_WHATSAPP_MESSAGE}
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

            {/* ====================================================
                SLIDER IMAGES
            ==================================================== */}

            <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Slider Images
                </label>

                <p className="mt-1 text-xs text-gray-400">
                  Add multiple images for your website slider. You can remove
                  existing images or add new ones.
                </p>
              </div>

              {/* EXISTING + NEW IMAGES */}

              {(sliderImages.length > 0 || sliderPreviews.length > 0) && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {/* EXISTING */}

                  {sliderImages.map((image, index) => (
                    <div
                      key={`existing-${image}-${index}`}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <img
                        src={`${baseUrl}${image}`}
                        alt={`Slider ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

                      <button
                        type="button"
                        onClick={() => removeExistingSliderImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-error-500 opacity-100 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label={`Remove slider image ${index + 1}`}
                      >
                        <X size={16} />
                      </button>

                      <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                        Existing
                      </span>
                    </div>
                  ))}

                  {/* NEW */}

                  {sliderPreviews.map((preview, index) => (
                    <div
                      key={`new-${preview}-${index}`}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10"
                    >
                      <img
                        src={preview}
                        alt={`New slider ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

                      <button
                        type="button"
                        onClick={() => removeNewSliderImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-error-500 opacity-100 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label={`Remove new slider ${index + 1}`}
                      >
                        <X size={16} />
                      </button>

                      <span className="absolute bottom-2 left-2 rounded-md bg-brand-500 px-2 py-1 text-[10px] font-medium text-white">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* UPLOAD */}

              <div className="mt-5">
                <input
                  ref={sliderInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleSliderImagesChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => sliderInputRef.current?.click()}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-5 text-center transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-brand-500 dark:hover:bg-brand-500/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-gray-800 dark:text-gray-400">
                    <Plus size={19} />
                  </span>

                  <span className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      Add Slider Images
                    </span>

                    <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Click to browse and select multiple images
                    </span>
                  </span>
                </button>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <span className="h-1 w-1 rounded-full bg-gray-400" />
                  <span>PNG, JPG or WebP</span>

                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />

                  <span>Maximum 5MB per image</span>
                </div>
              </div>
            </div>

            {/* ====================================================
    VIDEO
==================================================== */}

            <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Website Video
                </label>

                <p className="mt-1 text-xs text-gray-400">
                  Upload a video for your website. You can replace or remove the
                  existing video.
                </p>
              </div>

              {hasVideo ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <div className="relative aspect-video w-full bg-black">
                    <video
                      key={videoPreview || websiteSettings.video}
                      src={videoPreview || `${baseUrl}${websiteSettings.video}`}
                      controls
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {videoPreview
                          ? "New video selected"
                          : "Current website video"}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {videoPreview
                          ? videoFile?.name || "Selected video"
                          : "This video is currently saved on the server."}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
                      >
                        <Upload size={16} />
                        Change Video
                      </button>

                      <button
                        type="button"
                        onClick={removeVideo}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-error-500 transition hover:bg-error-50 dark:border-gray-700 dark:hover:bg-error-500/10"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 text-center dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/10">
                    <Upload size={21} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                    No video selected
                  </h3>

                  <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
                    Upload an MP4, WEBM, OGG, or MOV video up to 50MB.
                  </p>

                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
                  >
                    <Upload size={16} />
                    Select Video
                  </button>
                </div>
              )}

              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleVideoChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-gray-400">
                MP4, WEBM, OGG or MOV. Maximum 50MB.
              </p>
            </div>
          </div>

          {/* SAVE */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-gray-800">
            <button
              type="button"
              onClick={handleSaveWebsiteSettings}
              disabled={websiteSettingLoading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {websiteSettingLoading ? (
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

/* ========================================================================
   VALIDATION HELPERS
======================================================================== */

function isValidPhone(value: string): boolean {
  const trimmed = value.trim();

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
