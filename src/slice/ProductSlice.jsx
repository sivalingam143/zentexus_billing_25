
// src/slice/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../services/ProductService";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const response = await fetchProductsApi(searchText);
      // Return ALL items (Goods + Services) — no filtering!
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await createProductApi(productData);
      return response.body; // contains item_code, id, etc.
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (productData, { rejectWithValue }) => {
    try {
      await updateProductApi(productData);
      return productData; // return updated data to update state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (item_code, { rejectWithValue }) => {
    try {
      await deleteProductApi(item_code);
      return item_code;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Optional: clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products (Goods + Services)
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        // Optionally push new item if backend doesn't return full object
        // But better: refetch using invalidation or just rely on refetch
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.products.findIndex(
          (p) => p.item_code === updated.edit_item_code || p.item_code === updated.item_code
        );
        if (index !== -1) {
          state.products[index] = { ...state.products[index], ...updated };
        }
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.item_code !== action.payload
        );
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;