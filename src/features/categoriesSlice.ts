import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Category } from "../types/category";

interface CategoriesState {
  selectedCategory: Category | null;

  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
}

const initialState: CategoriesState = {
  selectedCategory: null,

  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
};

const categoriesSlice = createSlice({
  name: "categories",

  initialState,

  reducers: {
    // ==========================================
    // CREATE MODAL
    // ==========================================

    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },

    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },

    // ==========================================
    // EDIT MODAL
    // ==========================================

    openEditModal: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
      state.isEditModalOpen = true;
    },

    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedCategory = null;
    },

    // ==========================================
    // DELETE MODAL
    // ==========================================

    openDeleteModal: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
      state.isDeleteModalOpen = true;
    },

    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.selectedCategory = null;
    },

    // ==========================================
    // CLEAR SELECTED CATEGORY
    // ==========================================

    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
});

export const {
  openCreateModal,
  closeCreateModal,

  openEditModal,
  closeEditModal,

  openDeleteModal,
  closeDeleteModal,

  clearSelectedCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
