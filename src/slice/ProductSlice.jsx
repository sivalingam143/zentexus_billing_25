
// src/slice/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  bulkUpdateProductStatusApi,
  bulkAssignProductCodeApi,
  bulkAssignUnitsApi,
  bulkUpdateItemsApi,
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


// Add this thunk (anywhere with other thunks)
export const bulkAssignUnits = createAsyncThunk(
  "product/bulkAssignUnits",
 async ({ product_ids, unit_value, unit_id }, { rejectWithValue }) => {
  try {
    const response = await bulkAssignUnitsApi({ product_ids, unit_value, unit_id });
    return { product_ids, unit_value, unit_id };
  } catch (error) {
    return rejectWithValue(error.message);
  }
}
);


export const bulkAssignProductCode = createAsyncThunk(
  "product/bulkAssignProductCode",
  async ({ product_ids }, { rejectWithValue }) => {
    try {
      const response = await bulkAssignProductCodeApi({ product_ids });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to assign codes");
    }
  }
);

export const bulkUpdateItems = createAsyncThunk(
  "product/bulkUpdateItems",
  async (payload, { rejectWithValue }) => {
    try {
      await bulkUpdateItemsApi(payload);
      // We rely on the fetchProducts call after closing the modal for fresh data
      return payload; 
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
      })

      .addCase(bulkAssignProductCode.fulfilled, (state, action) => {
  // Refetch will happen automatically via modal close → ProductTab re-fetch
  state.status = "succeeded";
})

.addCase(bulkAssignUnits.fulfilled, (state, action) => {
  const { product_ids, unit_value, unit_id } = action.payload;
  state.products = state.products.map(p =>
    product_ids.includes(p.product_id)
      ? { ...p, unit_value, unit_id }  // ← Save both!
      : p
  );
})

// src/slice/productSlice.js

// ... (other addCase blocks)
// FIX: Bulk Update Items (Logic condensed and moved inline as requested)
        .addCase(bulkUpdateItems.fulfilled, (state, action) => {
            const { product_ids, ...payloadFields } = action.payload; 

            const fieldsToUpdate = {};
            for (const key in payloadFields) {
                const value = payloadFields[key];
                
                // Skip control flags, null, and undefined values
                if (key === 'bulk_update_items' || value === null || value === undefined) {
                    continue;
                }

                // 1. Handle HSN Code (convert to number)
                if (key === 'hsn_code' && value !== '') {
                    fieldsToUpdate[key] = parseInt(value, 10);
                } 
                // 2. Sanitize price strings (empty string to "{}")
                else if ((key === 'sale_price' || key === 'purchase_price') && value === '') {
                    fieldsToUpdate[key] = "{}";
                } 
                // 3. All other valid fields (category_id, tax_rate, etc.)
                else {
                    fieldsToUpdate[key] = value;
                }
            }

            // The simple mapping part
            state.products = state.products.map((product) => {
                if (product_ids.includes(product.product_id)) {
                    return { ...product, ...fieldsToUpdate }; 
                }
                return product;
            });
            state.status = "succeeded";
        })
  },
});


export const { clearError } = productSlice.actions;
export default productSlice.reducer;