import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { logout } from "../features/auth/authSlice";

import type { LoginResponse } from "../types/auth";

export const baseUrl = import.meta.env.VITE_BASE_URL;

console.log(baseUrl);


const rawBaseQuery = fetchBaseQuery({
  baseUrl,

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;

    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithAuth,

  tagTypes: [
    "Category",
    "MenuItem",
    "Deals",
    "Location",
    "Review",
    "Categories",
    "WebsiteSettings",
  ],

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, FormData>({
      query: (formData) => ({
        url: "/Account/Login",
        method: "POST",
        body: formData,
      }),
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/Account/Logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = api;
