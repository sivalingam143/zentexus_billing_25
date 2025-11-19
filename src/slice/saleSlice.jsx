import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchSalesApi,
  createSaleApi,
  updateSaleApi,
  deleteSaleApi,
  fetchPartiesApi,
} from "../services/saleService";

// Fetch all sales (using search with empty string)
export const fetchSales = createAsyncThunk(
  "sale/fetchSales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await searchSalesApi(""); // ✅ Use search API with empty string for all
      console.log("Fetched sales from API:", response);
      return Array.isArray(response) ? response : []; // Ensure array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search sales
export const searchSales = createAsyncThunk(
  "sale/searchSales",
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await searchSalesApi(searchText); // ✅ Matches export
      console.log("Searched sales from API:", response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch parties
export const fetchParties = createAsyncThunk(
  "sale/fetchParties",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const response = await fetchPartiesApi(searchText); // ✅ Matches export
      console.log("Fetched parties from API:", response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new sale
export const createSale = createAsyncThunk(
  "sale/createSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await createSaleApi(saleData); // ✅ Matches export
      console.log("Create sale API response:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing sale
export const updateSale = createAsyncThunk(
  "sale/updateSale",
  async (saleData, { rejectWithValue }) => {
    try {
      console.log("Sending data for update:", saleData);
      const response = await updateSaleApi(saleData); // ✅ Matches export
      console.log("Update sale API response:", response);
      return { ...saleData, response }; // Return submitted data + response for reducer
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a sale
export const deleteSale = createAsyncThunk(
  "sale/deleteSale",
  async (saleId, { rejectWithValue }) => {
    try {
      const response = await deleteSaleApi(saleId); // ✅ Matches export
      console.log("Delete API response:", response);
      return { saleId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const saleSlice = createSlice({
  name: "sales",
  initialState: {
    sales: [], // Initial empty array for sales
    parties: [], // Initial empty array for parties
    status: "idle",
    partiesStatus: "idle",
    error: null,
    saleResponse: null,
  },
  reducers: {
    clearSaleResponse: (state) => {
      state.saleResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Fetched sales payload:", action.payload);
        state.sales = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure array
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Search sales
      .addCase(searchSales.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sales = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchSales.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Fetch parties
      .addCase(fetchParties.pending, (state) => {
        state.partiesStatus = "loading";
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.partiesStatus = "succeeded";
        console.log("Fetched parties payload:", action.payload);
        state.parties = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.partiesStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      // Create sale
      .addCase(createSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.saleResponse = action.payload;
        // Optionally add to list (uncomment if needed)
        // if (action.payload.body?.sale) state.sales.unshift(action.payload.body.sale);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Update sale
      .addCase(updateSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.saleResponse = action.payload.response;
        // Update in list using submitted data (action.meta.arg)
        const saleId = action.meta.arg.edit_sales_id;
        const index = state.sales.findIndex((sale) => sale.sale_id === saleId);
        if (index !== -1) {
          state.sales[index] = { ...state.sales[index], ...action.meta.arg };
        }
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Delete sale
      .addCase(deleteSale.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sales = state.sales.filter(
          (sale) => sale.sale_id !== action.payload.saleId
        );
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSaleResponse } = saleSlice.actions;
export default saleSlice.reducer;
