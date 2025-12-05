
// src/slice/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  bulkUpdateProductStatusApi,
} from "../services/ProductService";


export const bulkUpdateProductStatus = createAsyncThunk(
  "product/bulkUpdateProductStatus",
  async ({ product_ids, status_code, status_name }, { rejectWithValue }) => {
    try {
      const response = await bulkUpdateProductStatusApi({
        product_ids,
        status_code,
        status_name,
      });
      return { product_ids, status_code, status_name }; // return what changed
    } catch (error) {
      return rejectWithValue(error.message || "Bulk update failed");
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const response = await fetchProductsApi(searchText);
      console.log("response",response)
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
  async (product_id, { rejectWithValue }) => {  // ← use product_id
    try {
      await deleteProductApi(product_id);  // ← pass product_id
      return product_id;
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
  state.products = state.products.filter(p => p.product_id !== action.payload);
})
.addCase(bulkUpdateProductStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bulkUpdateProductStatus.fulfilled, (state, action) => {
        const { product_ids, status_code, status_name } = action.payload;

        state.products = state.products.map((product) =>
          product_ids.includes(product.product_id)
            ? { ...product, status_code, status_name }
            : product
        );
        state.status = "succeeded";
      })
      .addCase(bulkUpdateProductStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});


export const { clearError } = productSlice.actions;
export default productSlice.reducer;