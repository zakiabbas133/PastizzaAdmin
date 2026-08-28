import { api } from "./api";
import type { Category, ApiResponse } from "../types/category";

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // GET ALL CATEGORIES
    // ==========================================
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/Categories/List",
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<Category[]>) => {
        return response.data;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "Categories" as const,
                id: category.id,
              })),

              {
                type: "Categories" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Categories" as const,
                id: "LIST",
              },
            ],
    }),

    // ==========================================
    // GET CATEGORY DETAILS
    // ==========================================
    getCategoryDetails: builder.query<Category, string>({
      query: (id) => ({
        url: `/Categories/Details?id=${id}`,
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<Category>) => {
        return response.data;
      },

      providesTags: (_result, _error, id) => [
        {
          type: "Categories",
          id,
        },
      ],
    }),

    // ==========================================
    // CREATE CATEGORY
    // ==========================================
    createCategory: builder.mutation<ApiResponse<Category>, FormData>({
      query: (formData) => ({
        url: "/Categories/Create",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: [
        {
          type: "Categories",
          id: "LIST",
        },
      ],
    }),

    // ==========================================
    // EDIT CATEGORY
    // ==========================================
    updateCategory: builder.mutation<
      ApiResponse<Category>,
      {
        category: FormData;
      }
    >({
      query: ({ category }) => ({
        url: `/Categories/Edit`,
        method: "PATCH",
        body: category,
      }),
    }),

    // ==========================================
    // DELETE CATEGORY
    // ==========================================
    deleteCategory: builder.mutation<
      {
        success: boolean;
        data?: string;
        message?: string;
      },
      string
    >({
      query: (id) => ({
        url: `/Categories/Delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategoryOrder: builder.mutation<
      ApiResponse<null>,
      {
        draggedCategoryId: string;
        targetCategoryId: string;
        targetOrder: number;
        draggedOrder: number;
      }
    >({
      query: ({
        draggedCategoryId,
        targetCategoryId,
        targetOrder,
        draggedOrder,
      }) => ({
        url: `/Categories/UpdateCategoryOrder?draggedCategoryId=${draggedCategoryId}&targetCategoryId=${targetCategoryId}&targetOrder=${targetOrder}&draggedOrder=${draggedOrder}`,
        method: "POST",
        params: {
          draggedCategoryId,
          targetCategoryId,
          targetOrder,
          draggedOrder,
        },
      }),

      invalidatesTags: (_result, _error) => [
        {
          type: "Categories",
        },
        {
          type: "Categories",
          id: "LIST",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryDetailsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryOrderMutation,
} = categoriesApi;
