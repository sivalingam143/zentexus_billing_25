import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchdeluxeApi,
  adddeluxeApi,
  updatedeluxeApi,
  deletedeluxeApi,
} from "../services/DeluxeService";

// Fetch all Deluxe Payroll Records
export const fetchdeluxe = createAsyncThunk("deluxe/fetchdeluxe", async () => {
  const response = await fetchdeluxeApi();
  console.log("fetch response:", response);
  return response; // Returns array of deluxe payroll records
});

// Add new Deluxe Payroll Record
export const adddeluxe = createAsyncThunk(
  "deluxe/adddeluxe",
  async (deluxeData) => {
    console.log("adddeluxe data:", deluxeData);
    const response = await adddeluxeApi(deluxeData);
    console.log("API Response on Add deluxe:", response);
    return response; // Returns array with the newly added record
  }
);

// Update Deluxe Payroll Record by ID
export const updatedeluxe = createAsyncThunk(
  "deluxe/updatedeluxe",
  async (deluxeData) => {
    console.log("update deluxe data:", deluxeData);
    const response = await updatedeluxeApi(deluxeData);
    console.log("API Response on Update deluxe:", response);
    return { id: response, data: deluxeData }; // Return both the ID and the updated data
  }
);

// Delete Deluxe Payroll Record by ID
export const deletedeluxe = createAsyncThunk(
  "deluxe/deletedeluxe",
  async (deluxeId) => {
    const response = await deletedeluxeApi(deluxeId);
    return response; // Returns the deleted ID
  }
);

const deluxeSlice = createSlice({
  name: "deluxe",
  initialState: {
    deluxe: [],
    status: "idle", // Track loading/succeeded/failed states
    error: null, // Track errors
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Deluxe
      .addCase(fetchdeluxe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchdeluxe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deluxe = action.payload; // Replace state with fetched records
      })
      .addCase(fetchdeluxe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Deluxe
      .addCase(adddeluxe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adddeluxe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deluxe.push(action.payload[0]); // Add the new record to the array
      })
      .addCase(adddeluxe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update Deluxe
      .addCase(updatedeluxe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatedeluxe.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.deluxe.findIndex(
          (deluxe) => deluxe.id === action.payload.id
        );
        if (index !== -1) {
          // Update the record with the new data from the thunk
          state.deluxe[index] = {
            ...state.deluxe[index],
            ...action.payload.data,
            id: action.payload.id,
          };
        }
      })
      .addCase(updatedeluxe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete Deluxe
      .addCase(deletedeluxe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletedeluxe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deluxe = state.deluxe.filter(
          (deluxe) => deluxe.id !== action.payload // Filter by the returned ID
        );
      })
      .addCase(deletedeluxe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default deluxeSlice.reducer;
