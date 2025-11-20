// src/slice/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../services/CategoryService";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await fetchCategoriesApi();
      return Array.isArray(categories) ? categories : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await createCategoryApi(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await updateCategoryApi(categoryData);
      return { ...categoryData, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (category_id, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(category_id);
      return { category_id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  status: "idle",
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.category_id === action.payload.category_id
        );
        if (index !== -1) {
          state.categories[index] = {
            ...state.categories[index],
            category_name: action.payload.category_name,
          };
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.category_id !== action.payload.category_id
        );
      });
  },
});

export default categorySlice.reducer;