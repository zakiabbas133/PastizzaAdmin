import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LoginResponse } from "../../types/auth";

interface AuthState {
  token: string | null;
  expiresAt: string | null;
  user: LoginResponse["user"] | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  expiresAt: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.token = null;
      state.expiresAt = null;
      state.user = null;
      state.isAuthenticated = false;
    },

    clearCredentials: (state) => {
      state.token = null;
      state.expiresAt = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
