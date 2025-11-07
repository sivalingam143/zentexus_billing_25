import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchknottingApi,
  addknottingApi,
  updateknottingApi,
  deleteknottingApi,
} from "../services/KnottingService";

// Fetch all Knotting Payroll Records
export const fetchknotting = createAsyncThunk(
  "knotting/fetchknotting",
  async () => {
    const response = await fetchknottingApi();
    console.log("fetch response:", response);
    return response; // Returns array of knotting payroll records
  }
);

// Add new Knotting Payroll Record
export const addknotting = createAsyncThunk(
  "knotting/addknotting",
  async (knottingData) => {
    console.log("addknotting data:", knottingData);
    const response = await addknottingApi(knottingData);
    console.log("API Response on Add knotting:", response);
    return response; // Returns array with the newly added record
  }
);

// Update Knotting Payroll Record by ID
export const updateknotting = createAsyncThunk(
  "knotting/updateknotting",
  async (knottingData) => {
    console.log("update knotting data:", knottingData);
    const response = await updateknottingApi(knottingData);
    console.log("API Response on Update knotting:", response);
    return { id: response, data: knottingData }; // Return both the ID and the updated data
  }
);

// Delete Knotting Payroll Record by ID
export const deleteknotting = createAsyncThunk(
  "knotting/deleteknotting",
  async (knottingId) => {
    const response = await deleteknottingApi(knottingId);
    return response; // Returns the deleted ID
  }
);

const knottingSlice = createSlice({
  name: "knotting",
  initialState: {
    knotting: [],
    status: "idle", // Added to track loading/succeeded/failed states
    error: null, // Added to track errors
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Knotting
      .addCase(fetchknotting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchknotting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.knotting = action.payload; // Replace state with fetched records
      })
      .addCase(fetchknotting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Knotting
      .addCase(addknotting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addknotting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.knotting.push(action.payload[0]); // Add the new record to the array
      })
      .addCase(addknotting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update Knotting
      .addCase(updateknotting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateknotting.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.knotting.findIndex(
          (knotting) => knotting.id === action.payload.id
        );
        if (index !== -1) {
          // Update the record with the new data from the thunk
          state.knotting[index] = {
            ...state.knotting[index],
            ...action.payload.data,
            id: action.payload.id,
          };
        }
      })
      .addCase(updateknotting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete Knotting
      .addCase(deleteknotting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteknotting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.knotting = state.knotting.filter(
          (knotting) => knotting.id !== action.payload // Filter by the returned ID
        );
      })
      .addCase(deleteknotting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default knottingSlice.reducer;
