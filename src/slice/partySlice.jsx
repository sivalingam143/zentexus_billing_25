// src/slice/partySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as partyService from "../services/PartyService";

// Fetch all parties
// src/slice/partySlice.js

<<<<<<< HEAD
// Fetch all parties
export const fetchParties = createAsyncThunk(
  "party/fetchParties",
  // FIX: Accept 'searchText' here
  async (searchText, { rejectWithValue }) => {
    try {
      // 1. Await the response from the service, PASSING searchText
      const response = await partyService.getParties(searchText); 
      
      // 2. Extract the actual array from the nested 'body.parties' property
      const partiesArray = response?.body?.parties || []; 
      
      // 3. Return only the array to Redux
      return partiesArray; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

=======
// const partySlice = createSlice({
//   name: "party",
//   initialState: {
//     parties: [],
//     selectedParty: null, // static selected party
//   },
//   reducers: {
//     setParties: (state, action) => {
//       state.parties = action.payload;
//     },
//     addParty: (state, action) => {
//       state.parties.push(action.payload);
//       if (!state.selectedParty) {
//         state.selectedParty = action.payload; // select first party by default
//       }
//     },
//   },
// });

// export const { setParties, addParty } = partySlice.actions;
// export default partySlice.reducer;
// src/slice/partySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as partyService from "../services/PartyService";

// Fetch all parties
// src/slice/partySlice.js

// Fetch all parties
export const fetchParties = createAsyncThunk(
  "party/fetchParties",
  // FIX: Accept 'searchText' here
  async (searchText, { rejectWithValue }) => {
    try {
      // 1. Await the response from the service, PASSING searchText
      const response = await partyService.getParties(searchText); 
      
      // 2. Extract the actual array from the nested 'body.parties' property
      const partiesArray = response?.body?.parties || []; 
      
      // 3. Return only the array to Redux
      return partiesArray; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

>>>>>>> 71e4bea4fb31dd9e36f9164421fe14d3a7738b81
// ... other code remains the same

// Add new party
export const addNewParty = createAsyncThunk(
  "party/addNewParty",
  async (party, { rejectWithValue }) => {
    try {
      const data = await partyService.addParty(party);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🌟 NEW: Update existing party Thunk
export const updateExistingParty = createAsyncThunk(
  "party/updateParty",
  async (party, { rejectWithValue }) => {
    try {
      const data = await partyService.updateParty(party);
      return data; // Returns the updated party object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🌟 NEW: Delete party Thunk
export const deleteExistingParty = createAsyncThunk(
  "party/deleteParty",
  async (parties_id, { rejectWithValue }) => {
    try {
      const data = await partyService.deleteParty(parties_id);
      return data; // Returns the parties_id of the deleted party
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const partySlice = createSlice({
  name: "party",
  initialState: {
    parties: [],
    loading: false,
    error: null,
  },
 reducer: {  },

  extraReducers: (builder) => {
    builder
      // Fetch Parties
      .addCase(fetchParties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.loading = false;
        state.parties = action.payload;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Party
      .addCase(addNewParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewParty.fulfilled, (state, action) => {
        state.loading = false;
        // FIX: Add the new party (action.payload) to the beginning of the parties array
        // We put it at the beginning so the user sees it immediately.
        state.parties.unshift(action.payload); // Use unshift to add to the beginning
      })
      .addCase(addNewParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        // 🌟 NEW: Update Existing Party Reducer
      .addCase(updateExistingParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingParty.fulfilled, (state, action) => {
        state.loading = false;
        // Find the index and replace the old party object with the updated one
        const index = state.parties.findIndex(p => p.parties_id === action.payload.parties_id);
        if (index !== -1) {
          state.parties[index] = action.payload;
        }
      })
      .addCase(updateExistingParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🌟 NEW: Delete Party Reducer
      .addCase(deleteExistingParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingParty.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the party with the deleted parties_id
        state.parties = state.parties.filter(p => p.parties_id !== action.payload);
      })
      .addCase(deleteExistingParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        });
  },
});


export default partySlice.reducer;
