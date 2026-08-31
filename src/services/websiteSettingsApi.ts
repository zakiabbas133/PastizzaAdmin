import { api } from "./api";
import type { ApiResponse } from "../types/category";
import { WebsiteSettings } from "../types/websiteSettings";

export const websiteSettingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // GET WEBSITE SETTINGS
    // ==========================================
    getWebsiteSettings: builder.query<WebsiteSettings, void>({
      query: () => ({
        url: "/WebsiteSettings/GetSettings",
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<WebsiteSettings>) => {
        return response.data;
      },
    }),

    // ==========================================
    // UPDATE WEBSITE SETTINGS
    // ==========================================
    addOrUpdateWebsiteSettings: builder.mutation<
      ApiResponse<WebsiteSettings>,
      FormData
    >({
      query: (formData) => ({
        url: "/WebsiteSettings/AddOrUpdate",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: [
        {
          type: "WebsiteSettings",
          id: "SETTINGS",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetWebsiteSettingsQuery,
  useAddOrUpdateWebsiteSettingsMutation,
} = websiteSettingsApi;
