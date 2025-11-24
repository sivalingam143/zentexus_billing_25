
// slices/partySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as partyService from "../services/PartyService";

// Thunks
export const searchPartiesAndSales = createAsyncThunk(
  "party/searchAll",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const result = await partyService.searchAll(searchText);
      return result; // { parties: [], sales: [] }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addNewParty = createAsyncThunk(
  "party/addNewParty",
  async (partyData, { rejectWithValue }) => {
    try {
      await partyService.addParty(partyData);
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateExistingParty = createAsyncThunk(
  "party/updateParty",
  async (partyData, { rejectWithValue }) => {
    try {
      const updated = await partyService.updateParty(partyData);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteExistingParty = createAsyncThunk(
  "party/deleteParty",
  async (parties_id, { rejectWithValue }) => {
    try {
      await partyService.deleteParty(parties_id);
      return parties_id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const partySlice = createSlice({
  name: "party",
  initialState: {
    parties: [],
    sales: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search (Parties + Sales)
      .addCase(searchPartiesAndSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPartiesAndSales.fulfilled, (state, action) => {
        state.loading = false;
        state.parties = action.payload.parties;
        state.sales = action.payload.sales;
      })
      .addCase(searchPartiesAndSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Party
      .addCase(addNewParty.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewParty.fulfilled, (state) => {
        state.loading = false;
        // Refetch via searchAll() after add
      })
      .addCase(addNewParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Party
      .addCase(updateExistingParty.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.parties.findIndex((p) => p.parties_id === updated.parties_id);
        if (index !== -1) state.parties[index] = updated;
      })

      // Delete Party
      .addCase(deleteExistingParty.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.parties = state.parties.filter((p) => p.parties_id !== deletedId);
      });
  },
});

export const { clearError } = partySlice.actions;
export default partySlice.reducer;