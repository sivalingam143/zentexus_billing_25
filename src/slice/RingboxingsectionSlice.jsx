import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchringboxingApi,
  addringboxingApi,
  updateringboxingApi,
  deleteringboxingApi,
} from "../services/RingboxingsectionService";

// Fetch all ring boxing records
export const fetchringboxing = createAsyncThunk(
  "ringboxing/fetchringboxing",
  async () => {
    const response = await fetchringboxingApi();
    return response;
  }
);

// Add new ring boxing record
export const addringboxing = createAsyncThunk(
  "ringboxing/addringboxing",
  async (ringboxingdata) => {
    const response = await addringboxingApi(ringboxingdata);
    return response; // Updated list
  }
);

// Update ring boxing record by ID
export const updateringboxing = createAsyncThunk(
  "ringboxing/updateringboxing",
  async (ringboxingdata) => {
    const response = await updateringboxingApi(ringboxingdata);
    return response; // Updated record
  }
);

// Delete ring boxing record by ID
export const deleteringboxing = createAsyncThunk(
  "ringboxing/deleteringboxing",
  async (ringboxingId) => {
    const response = await deleteringboxingApi(ringboxingId);
    return ringboxingId; // Deleted ID
  }
);

const ringboxingSlice = createSlice({
  name: "ringboxing",
  initialState: {
    ringboxing: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Ring Boxing
      .addCase(fetchringboxing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchringboxing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ringboxing = action.payload;
      })
      .addCase(fetchringboxing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Ring Boxing
      .addCase(addringboxing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addringboxing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ringboxing = action.payload; // Replace with updated list
      })
      .addCase(addringboxing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update Ring Boxing
      .addCase(updateringboxing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateringboxing.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedEntry = action.payload;
        const index = state.ringboxing.findIndex(
          (entry) => entry.id === updatedEntry.id
        );
        if (index !== -1) {
          state.ringboxing[index] = updatedEntry;
        }
      })
      .addCase(updateringboxing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Delete Ring Boxing
      .addCase(deleteringboxing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteringboxing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ringboxing = state.ringboxing.filter(
          (entry) => entry.id !== action.payload
        );
      })
      .addCase(deleteringboxing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ringboxingSlice.reducer;
