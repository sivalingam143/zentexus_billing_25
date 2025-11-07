import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchpackingApi,
  addpackingApi,
  updatepackingApi,
  deletepackingApi,
} from "../services/PackingService";

// Fetch all Packing Payroll Records
export const fetchpacking = createAsyncThunk(
  "packing/fetchpacking",
  async () => {
    const response = await fetchpackingApi();
    console.log("fetch response:", response);
    return response; // Returns array of packing payroll records
  }
);

// Add new Packing Payroll Record
export const addpacking = createAsyncThunk(
  "packing/addpacking",
  async (packingData) => {
    console.log("addpacking data:", packingData);
    const response = await addpackingApi(packingData);
    console.log("API Response on Add packing:", response);
    return response; // Returns array with the newly added record
  }
);

// Update Packing Payroll Record by ID
export const updatepacking = createAsyncThunk(
  "packing/updatepacking",
  async (packingData) => {
    console.log("update packing data:", packingData);
    const response = await updatepackingApi(packingData);
    console.log("API Response on Update packing:", response);
    return { id: response, data: packingData }; // Return both the ID and the updated data
  }
);

// Delete Packing Payroll Record by ID
export const deletepacking = createAsyncThunk(
  "packing/deletepacking",
  async (packingId) => {
    const response = await deletepackingApi(packingId);
    return response; // Returns the deleted ID
  }
);

const packingSlice = createSlice({
  name: "packing",
  initialState: {
    packing: [],
    status: "idle", // Track loading/succeeded/failed states
    error: null, // Track errors
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Packing
      .addCase(fetchpacking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchpacking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.packing = action.payload; // Replace state with fetched records
      })
      .addCase(fetchpacking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Packing
      .addCase(addpacking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addpacking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.packing.push(action.payload[0]); // Add the new record to the array
      })
      .addCase(addpacking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update Packing
      .addCase(updatepacking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatepacking.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.packing.findIndex(
          (packing) => packing.id === action.payload.id
        );
        if (index !== -1) {
          // Update the record with the new data from the thunk
          state.packing[index] = {
            ...state.packing[index],
            ...action.payload.data,
            id: action.payload.id,
          };
        }
      })
      .addCase(updatepacking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete Packing
      .addCase(deletepacking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletepacking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.packing = state.packing.filter(
          (packing) => packing.id !== action.payload // Filter by the returned ID
        );
      })
      .addCase(deletepacking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default packingSlice.reducer;
