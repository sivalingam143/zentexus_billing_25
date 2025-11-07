import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPayApi,
  addPayApi,
  updatePayApi,
  deletePayApi,
} from "../services/PayService";

// Fetch all pay entries
export const fetchPay = createAsyncThunk("Pay/fetchPay", async () => {
  const response = await fetchPayApi();
  console.log("fetchPay response", response);
  return response;
});

// Add new pay entry
export const addPay = createAsyncThunk(
  "Pay/addPay",
  async (PayData, { rejectWithValue }) => {
    try {
      console.log("addPay data:", PayData);
      const response = await addPayApi(PayData);
      console.log("API Response on Add Pay:", response);
      if (!response) throw new Error("Failed to add pay entry");
      return response; // Returns the new pay entry
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update pay entry by ID
export const updatePay = createAsyncThunk(
  "Pay/updatePay",
  async (updateData, { rejectWithValue }) => {
    try {
      console.log("updateData", updateData);
      const response = await updatePayApi(updateData);
      console.log("API Response on Update Pay:", response);
      return response; // Returns the updated pay entry with ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete pay entry by ID
export const deletePay = createAsyncThunk(
  "Pay/deletePay",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deletePayApi(id);
      return response; // Returns the deleted ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const PaySlice = createSlice({
  name: "Pay",
  initialState: {
    Pay: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Pay
      .addCase(fetchPay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPay.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Pay = action.payload || [];
      })
      .addCase(fetchPay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Add Pay
      .addCase(addPay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPay.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.Pay.unshift(action.payload); // Add new entry to the beginning
        }
      })
      .addCase(addPay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Update Pay
      .addCase(updatePay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePay.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPay = action.payload;
        const index = state.Pay.findIndex(
          (entry) => entry.id === updatedPay.id
        );
        if (index !== -1) {
          state.Pay[index] = updatedPay;
        } else {
          state.Pay.push(updatedPay);
        }
      })
      .addCase(updatePay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Delete Pay
      .addCase(deletePay.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePay.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Pay = state.Pay.filter((entry) => entry.id !== action.payload);
      })
      .addCase(deletePay.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default PaySlice.reducer;
