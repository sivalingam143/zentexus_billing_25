import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchExplosivePayrollApi,
  addExplosivePayrollApi,
  updateExplosivePayrollApi,
  deleteExplosivePayrollApi,
} from "../services/ExplosiveService";

// Fetch all explosive payroll records
export const fetchExplosivePayroll = createAsyncThunk(
  "explosivePayroll/fetchExplosivePayroll",
  async () => {
    const response = await fetchExplosivePayrollApi();
    console.log("fetch response:", response);
    return response; // Array of payroll records from body.explosive_payroll
  }
);

// Add new explosive payroll record
export const addExplosivePayroll = createAsyncThunk(
  "explosivePayroll/addExplosivePayroll",
  async (payrollData) => {
    console.log("add payroll data:", payrollData);
    const response = await addExplosivePayrollApi(payrollData);
    console.log("API Response on Add:", response);
    return response; // Updated list from head.explosivePayroll
  }
);

// Update explosive payroll record by ID
export const updateExplosivePayroll = createAsyncThunk(
  "explosivePayroll/updateExplosivePayroll",
  async (payrollData) => {
    console.log("update data:", payrollData);
    const response = await updateExplosivePayrollApi(payrollData);
    return { id: response, payrollData }; // Return updated ID and original data
  }
);

// Delete explosive payroll record by ID
export const deleteExplosivePayroll = createAsyncThunk(
  "explosivePayroll/deleteExplosivePayroll",
  async (id) => {
    const response = await deleteExplosivePayrollApi(id);
    return response; // Returns the deleted ID
  }
);

const explosivePayrollSlice = createSlice({
  name: "explosivePayroll",
  initialState: {
    explosivePayroll: [],
    status: "idle", // Added status to initial state
    error: null, // Added error to initial state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Explosive Payroll
      .addCase(fetchExplosivePayroll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExplosivePayroll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.explosivePayroll = action.payload; // Array from body.explosive_payroll
      })
      .addCase(fetchExplosivePayroll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Explosive Payroll
      .addCase(addExplosivePayroll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addExplosivePayroll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.explosivePayroll = action.payload; // Replace with updated list from head.explosivePayroll
      })
      .addCase(addExplosivePayroll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Update Explosive Payroll
      .addCase(updateExplosivePayroll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateExplosivePayroll.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, payrollData } = action.payload;
        const index = state.explosivePayroll.findIndex(
          (item) => item.id === id
        );
        if (index !== -1) {
          state.explosivePayroll[index] = {
            ...state.explosivePayroll[index],
            ...payrollData, // Update with the new data
          };
        }
      })
      .addCase(updateExplosivePayroll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Delete Explosive Payroll
      .addCase(deleteExplosivePayroll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteExplosivePayroll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.explosivePayroll = state.explosivePayroll.filter(
          (item) => item.id !== action.payload // Filter out deleted ID
        );
      })
      .addCase(deleteExplosivePayroll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default explosivePayrollSlice.reducer;
