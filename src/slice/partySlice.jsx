
// import { createSlice } from "@reduxjs/toolkit";

// const partySlice = createSlice({
//   name: "party",
//   initialState: {
//     parties: [],
//   },
//   reducers: {
//     setParties: (state, action) => {
//       state.parties = action.payload;
//     },
//     addParty: (state, action) => {
//       state.parties.push(action.payload);
//     },
//   },
// });

// export const { setParties, addParty } = partySlice.actions;
// export default partySlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const partySlice = createSlice({
  name: "party",
  initialState: {
    parties: [],
    selectedParty: null, // static selected party
  },
  reducers: {
    setParties: (state, action) => {
      state.parties = action.payload;
    },
    addParty: (state, action) => {
      state.parties.push(action.payload);
      if (!state.selectedParty) {
        state.selectedParty = action.payload; // select first party by default
      }
    },
  },
});

export const { setParties, addParty } = partySlice.actions;
export default partySlice.reducer;
