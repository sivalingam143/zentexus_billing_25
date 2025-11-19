import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchSalesApi,
  createSaleApi,
  updateSaleApi,
  deleteSaleApi,
  fetchPartiesApi,
} from "../services/saleService";

export const fetchSales = createAsyncThunk(
  "sale/fetchSales",
  async (_, { rejectWithValue }) => {
    try {
      const sales = await searchSalesApi("");
      return Array.isArray(sales) ? sales : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchSales = createAsyncThunk(
  "sale/searchSales",
  async (searchText, { rejectWithValue }) => {
    try {
      const sales = await searchSalesApi(searchText);
      return Array.isArray(sales) ? sales : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchParties = createAsyncThunk(
  "sale/fetchParties",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const parties = await fetchPartiesApi(searchText);
      return Array.isArray(parties) ? parties : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSale = createAsyncThunk(
  "sale/createSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await createSaleApi(saleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSale = createAsyncThunk(
  "sale/updateSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await updateSaleApi(saleData);
      return { ...saleData, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSale = createAsyncThunk(
  "sale/deleteSale",
  async (saleId, { rejectWithValue }) => {
    try {
      await deleteSaleApi(saleId);
      return { saleId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  sales: [],
  parties: [],
  status: "idle",
  partiesStatus: "idle",
  error: null,
  saleResponse: null,
};

const saleSlice = createSlice({
  name: "sale",
  initialState,
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
        state.sales = action.payload;
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
        state.sales = action.payload;
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
        state.parties = action.payload;
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
        const { edit_sales_id } = action.meta.arg;
        const index = state.sales.findIndex(
          (sale) => sale.sale_id === edit_sales_id
        );
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
