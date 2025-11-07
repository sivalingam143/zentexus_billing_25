import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductApi,
  addProductApi,
  updateProductApi,
  deleteProductApi,
} from "../services/ProductService";

// Fetch all Product
export const fetchProduct = createAsyncThunk(
  "Product/fetchProduct",
  async () => {
    const response = await fetchProductApi();
    console.log("response", response);
    return response;
  }
);

// Add new Product
export const addProduct = createAsyncThunk(
  "Product/addProduct",
  async (ProductData) => {
    console.log("Product data:", ProductData);
    const response = await addProductApi(ProductData);
    console.log("API Response on Add Product:", response);
    return response; // Single product object
  }
);

// Update Product by ID
export const updateProduct = createAsyncThunk(
  "Product/updateProduct",
  async (formData) => {
    console.log("siva", formData);
    const response = await updateProductApi(formData);
    return {
      formData,
    };
  }
);

// Delete Product by ID
export const deleteProduct = createAsyncThunk(
  "Product/deleteProduct",
  async (ProductId) => {
    const response = await deleteProductApi(ProductId);
    return ProductId;
  }
);
const ProductSlice = createSlice({
  name: "Product",
  initialState: {
    Product: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Product.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Product = state.Product.filter(
          (Product) => Product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.Product.findIndex(
          (Product) => Product.id === action.payload.id
        );
        if (index !== -1) {
          state.Product[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ProductSlice.reducer;
