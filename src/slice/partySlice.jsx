import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as partyService from "../services/PartyService";

export const fetchParties = createAsyncThunk(
  "party/fetchParties",
  async (searchText, { rejectWithValue }) => {
    try {
      console.log("enter try fetch");
      const response = await partyService.getParties(searchText);
      console.log("response", response);
      const partiesArray = response || [];
      console.log("partiesArray", partiesArray);
      return partiesArray;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add new party
export const addNewParty = createAsyncThunk(
  "party/addNewParty",
  async (party, { rejectWithValue }) => {
    try {
      const response = await partyService.addParty(party);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExistingParty = createAsyncThunk(
  "party/updateParty",
  async (party, { rejectWithValue }) => {
    try {
      const data = await partyService.updateParty(party);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExistingParty = createAsyncThunk(
  "party/deleteParty",
  async (parties_id, { rejectWithValue }) => {
    try {
      const data = await partyService.deleteParty(parties_id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const partySlice = createSlice({
  name: "parties",
  initialState: {
    parties: [],
    loading: false,
    error: null,
  },
  reducer: {},

  extraReducers: (builder) => {
    builder
      // Add new party
      .addCase(addNewParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewParty.fulfilled, (state) => {
        state.loading = false;
        console.log(
          "New party creation fulfilled. Relying on fetchParties for state update."
        );
      })
      .addCase(addNewParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // src/slice/partySlice.js (inside extraReducers)

      // ...
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.loading = false;

        state.parties = action.payload;
        state.error = null;
      })

      //  Update existing party
      .addCase(updateExistingParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingParty.fulfilled, (state, action) => {
        state.loading = false;

        const updatedParty = action.payload;

        const index = state.parties.findIndex(
          (party) => party.parties_id === updatedParty.parties_id
        );

        if (index !== -1) {
          state.parties[index] = updatedParty;
        }
      })
      .addCase(updateExistingParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default partySlice.reducer;
