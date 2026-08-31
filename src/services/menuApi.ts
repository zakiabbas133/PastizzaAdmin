import { ApiResponse } from "../types/category";
import { api } from "./api";

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  featured: boolean;
  popular: boolean;
  isActive: boolean;
  displayOrder: number;
  categoryId: string;
  categoryName: string;
  variants: MenuItemVariant[];
}

/*
 * Request used when creating a menu item.
 *
 * The backend uses the same MenuItemDto for all CRUD operations.
 * We do not need categoryName when creating the item.
 */
export interface CreateMenuItemRequest {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageFile?: File | null;
  featured: boolean;
  popular: boolean;
  isActive: boolean;
  displayOrder: number;
  categoryId: string;
  categoryName?: string;
  variants: {
    id?: string;
    name: string;
    price: number;
    displayOrder: number;
    isActive: boolean;
  }[];
}

export interface UpdateMenuItemRequest extends CreateMenuItemRequest {
  id: string;
}

export const menuApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // GET ALL MENU ITEMS
    // GET /Menu
    // ============================================================

    getMenuItems: builder.query<MenuItem[], void>({
      query: () => ({
        url: "/Menu/GetMenuItems",
        method: "GET",
      }),

      transformResponse: (response: ApiResponse<MenuItem[]>) => {
        return response.data;
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "MenuItem" as const,
                id: item.id,
              })),

              {
                type: "MenuItem" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "MenuItem" as const,
                id: "LIST",
              },
            ],
    }),

    // ============================================================
    // GET MENU ITEM BY ID
    // GET /Menu/{id}
    // ============================================================

    getMenuItemById: builder.query<MenuItem, string>({
      query: (id) => ({
        url: `/Menu/GetMenuItem/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "MenuItem",
          id,
        },
      ],
    }),

    // ============================================================
    // CREATE MENU ITEM
    // POST /Menu
    // ============================================================

    createMenuItem: builder.mutation<
      {
        success: boolean;
        message: string;
        data?: MenuItem;
      },
      FormData
    >({
      query: (formData) => ({
        url: "/Menu/CreateMenuItem",
        method: "POST",
        body: formData,
      }),

      invalidatesTags: [
        {
          type: "MenuItem",
          id: "LIST",
        },
      ],
    }),

    // ============================================================
    // UPDATE MENU ITEM
    // PUT /Menu/{id}
    // ============================================================

    updateMenuItem: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        id: string;
        formData: FormData;
      }
    >({
      query: ({ id, formData }) => ({
        url: `/Menu/UpdateMenuItem/${id}`,
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "MenuItem",
          id,
        },
        {
          type: "MenuItem",
          id: "LIST",
        },
      ],
    }),

    // ============================================================
    // DELETE MENU ITEM
    // DELETE /Menu/{id}
    // ============================================================

    deleteMenuItem: builder.mutation<
      {
        success: boolean;
        message: string;
        id: string;
        data: string;
      },
      string
    >({
      query: (id) => ({
        url: `/Menu/DeleteMenuItem/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "MenuItem",
          id,
        },
        {
          type: "MenuItem",
          id: "LIST",
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;
