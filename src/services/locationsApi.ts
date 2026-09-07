import { Location } from "../types";
import { ApiResponse } from "../types/category";
import { api } from "./api";

export const locationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => ({
        url: "/Locations/ListLocations",
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<Location[]>) => {
        return response.data;
      },
    }),

    addLocation: builder.mutation<ApiResponse<Location>, FormData>({
      query: (body) => ({
        url: "/Locations/AddLocation",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        {
          type: "Location",
          id: "LOCATION",
        },
      ],
    }),

    updateLocation: builder.mutation<ApiResponse<Location>, FormData>({
      query: (body) => ({
        url: "/Locations/UpdateLocation",
        method: "PUT",
        body,
      }),

      invalidatesTags: [
        {
          type: "Location",
          id: "LOCATION",
        },
      ],
    }),
    removeLocation: builder.mutation<ApiResponse<Location>, string>({
      query: (id) => ({
        url: `/Locations/DeleteLocation/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Location",
          id: "LOCATION",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useRemoveLocationMutation,
} = locationsApi;
