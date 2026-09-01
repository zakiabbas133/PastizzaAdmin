import { ApiResponse } from "../types/category";
import { Deal } from "../types";
import { api } from "./api";

export const dealsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // GET ALL DEALS
    // ============================================================

    getDeals: builder.query<ApiResponse<Deal[]>, void>({
      query: () => ({
        url: "/Deal/ListDeals",
        method: "GET",
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((deal: Deal) => ({
                type: "Deals" as const,
                id: deal.id,
              })),
              {
                type: "Deals" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Deals" as const,
                id: "LIST",
              },
            ],
    }),

    // ============================================================
    // GET DEAL BY ID
    // ============================================================

    getDealById: builder.query<ApiResponse<Deal>, string>({
      query: (id) => ({
        url: `/Deal/DealDetails/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Deals",
          id,
        },
      ],
    }),

    // ============================================================
    // ADD OR UPDATE DEAL
    // ============================================================

    addOrUpdateDeal: builder.mutation<ApiResponse<Deal>, FormData>({
      query: (formData) => ({
        url: "/Deal/AddOrUpdateDeal",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: [
        {
          type: "Deals",
          id: "LIST",
        },
        {
          type: "Deals",
        },
      ],
    }),

    // ============================================================
    // DELETE DEAL
    // ============================================================

    deleteDeal: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/Deal/DeleteDeal/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "Deals",
          id,
        },
        {
          type: "Deals",
          id: "LIST",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetDealsQuery,
  useGetDealByIdQuery,
  useAddOrUpdateDealMutation,
  useDeleteDealMutation,
} = dealsApi;
