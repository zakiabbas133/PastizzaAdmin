import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { persistReducer, persistStore } from "redux-persist";

import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/authSlice";
import categoriesReducer from "../features/categoriesSlice";

import { api } from "../services/api";

const rootReducer = combineReducers({
  auth: authReducer,

  [api.reducerPath]: api.reducer,
  categories: categoriesReducer,
});

const persistConfig = {
  key: "root",

  storage,

  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
        ],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
