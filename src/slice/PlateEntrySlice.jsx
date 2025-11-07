import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPlateEntryApi,
  addPlateEntryApi,
  updatePlateEntryApi,
  deletePlateEntryApi,
} from "../services/PlateEntryService";

// Fetch all PlateEntry
export const fetchPlateEntry = createAsyncThunk(
  "PlateEntry/fetchPlateEntry",
  async () => {
    const response = await fetchPlateEntryApi();
    console.log("response", response);
    return response;
  }
);

// Add new PlateEntry
export const addPlateEntry = createAsyncThunk(
  "PlateEntry/addPlateEntry",
  async (PlateEntryData) => {
    console.log("PlateEntry data:", PlateEntryData);
    const response = await addPlateEntryApi(PlateEntryData);
    console.log("API Response on Add PlateEntry:", response);
    return response;
  }
);

// Update PlateEntry by ID
export const updatePlateEntry = createAsyncThunk(
  "PlateEntry/updatePlateEntry",
  async (updatedata) => {
    console.log("siva", updatedata);
    const response = await updatePlateEntryApi(updatedata);
    return {
      updatedata,
    };
  }
);

// Delete PlateEntry by ID
export const deletePlateEntry = createAsyncThunk(
  "PlateEntry/deletePlateEntry",
  async (PlateEntryId) => {
    const response = await deletePlateEntryApi(PlateEntryId);
    return PlateEntryId;
  }
);
const PlateEntrySlice = createSlice({
  name: "PlateEntry",
  initialState: {
    PlateEntry: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlateEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlateEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.PlateEntry = action.payload;
      })
      .addCase(fetchPlateEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPlateEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPlateEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("action.payload:", action.payload);
        state.PlateEntry.push(action.payload[0]); // Add the PlateEntry to the PlateEntry array
      })
      .addCase(addPlateEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePlateEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePlateEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log('action',action.payload);
        state.PlateEntry = state.PlateEntry.filter(
          (PlateEntry) => PlateEntry.id !== action.payload
        );
      })
      .addCase(deletePlateEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updatePlateEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.PlateEntry.findIndex(
          (PlateEntry) => PlateEntry.id === action.payload.id
        );
        console.log(index);
        if (index !== -1) {
          // Replace the updated PlateEntry with the response payload
          state.PlateEntry[index] = action.payload;
        }
      })
      .addCase(updatePlateEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default PlateEntrySlice.reducer;
