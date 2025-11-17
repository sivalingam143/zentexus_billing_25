// // src/features/party/partySlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import { getsale } from '../services/saleService';
// import { getParties } from '../services/saleService';


// export const fetchParties = createAsyncThunk(
//   'party/fetchParties',
//   async (_, { rejectWithValue }) => {
//     try {
//       // ⭐️ UPDATED: Use getParties
//       const parties = await getParties(); 
//       return parties;
//     } catch (error) {
//       // Return the error message to the rejected action payload
//       return rejectWithValue(error.message); 
//     }
//   }
// );


// // ------------------- ADD OR UPDATE SALE/INVOICE -------------------
// export const addOrUpdateSale = createAsyncThunk(
//   'party/addOrUpdateSale',
//   async (saleData, { rejectWithValue }) => {
//     try {
//       // If saleData has sale_id -> update invoice
//       const response = await updateInvoice(saleData);
//       return response; // returns PHP response with head.code & head.msg
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// const saleSlice = createSlice({
//   name: 'party',
//   initialState: {
//     list: [],
//     status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//   },
//   reducers: {
//     // Add any synchronous reducers here if needed
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchParties.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchParties.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.list = action.payload; // array of party objects
//       })
//       .addCase(fetchParties.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload; // Error message from rejectWithValue
//       });
//   },
  
// });

// // Selector to format party data for the DashboardSale DropDown component
// export const selectPartyOptions = (state) => {
//   return state.party.list.map(party => ({
//     value: party.id.toString(), // Ensure ID is a string for dropdown value
//     label: party.name,
//     phone: party.phone,
//     billingAddress: party.billingaddress,
//     shippingAddress: party.shippingaddress,
    
//     // Add other fields you might need
//   }));
// };

// export default saleSlice.reducer;

// src/features/party/partySlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getParties, addOrUpdateSale } from '../services/saleService';

// // ------------------- FETCH PARTIES -------------------
// export const fetchParties = createAsyncThunk(
//   'party/fetchParties',
//   async (_, { rejectWithValue }) => {
//     try {
//       const parties = await getParties(); 
//       return parties;
//     } catch (error) {
//       return rejectWithValue(error.message); 
//     }
//   }
// );

// // ------------------- ADD OR UPDATE SALE/INVOICE -------------------
// export const saveSale = createAsyncThunk(  
//   'sale/saveSale',
//   async (saleData, { rejectWithValue }) => {
//     try {
//       const response = await addOrUpdateSale(saleData);
//       return response; 
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const saleSlice = createSlice({
//   name: 'party',
//   initialState: {
//     list: [],
//     status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//     saleStatus: 'idle', // for addOrUpdateSale
//     saleError: null,
//     saleResponse: null, // store PHP response after save/update
//   },
//   reducers: {
//     // Add any synchronous reducers here if needed
//   },
//   extraReducers: (builder) => {
//     builder
//       // ------------------- FETCH PARTIES -------------------
//       .addCase(fetchParties.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchParties.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.list = action.payload;
//       })
//       .addCase(fetchParties.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       // ------------------- ADD OR UPDATE SALE -------------------
//       .addCase(addOrUpdateSale.pending, (state) => {
//         state.saleStatus = 'loading';
//         state.saleError = null;
//         state.saleResponse = null;
//       })
//       .addCase(addOrUpdateSale.fulfilled, (state, action) => {
//         state.saleStatus = 'succeeded';
//         state.saleResponse = action.payload; // head.code & head.msg
//       })
//       .addCase(addOrUpdateSale.rejected, (state, action) => {
//         state.saleStatus = 'failed';
//         state.saleError = action.payload;
//       });
//   },
// });

// // Selector to format party data for the DashboardSale DropDown component
// export const selectPartyOptions = (state) => {
//   return state.party.list.map(party => ({
//     value: party.id.toString(),
//     label: party.name,
//     phone: party.phone,
//     billingAddress: party.billingaddress,
//     shippingAddress: party.shippingaddress,
//   }));
// };

// export default saleSlice.reducer;



// src/slice/saleSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getParties, addOrUpdateSale } from "../services/saleService";

// FETCH PARTIES
export const fetchParties = createAsyncThunk(
  "party/fetchParties",
  async (_, { rejectWithValue }) => {
    try {
      const parties = await getParties();
      return parties;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// SAVE SALE (Create or Update)
export const saveSale = createAsyncThunk(
  "party/saveSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await addOrUpdateSale(saleData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// SLICE
const saleSlice = createSlice({
  name: "party",
  initialState: {
    list: [],
    status: "idle",
    error: null,

    saleStatus: "idle",
    saleError: null,
    saleResponse: null,
  },
  reducers: {},
  extraReducers: (builder) => {  
    // Fetch Parties
    builder
      .addCase(fetchParties.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Save Sale
    builder
      .addCase(saveSale.pending, (state) => {
        state.saleStatus = "loading";
        state.saleError = null;
        state.saleResponse = null;
      })
      .addCase(saveSale.fulfilled, (state, action) => {
        state.saleStatus = "succeeded";
        state.saleResponse = action.payload;
      })
      .addCase(saveSale.rejected, (state, action) => {
        state.saleStatus = "failed";
        state.saleError = action.payload;
      });
  },
});

// SELECTOR
export const selectPartyOptions = (state) =>
  state.party.list.map((p) => ({
    value: p.id.toString(),
    label: p.name,
    phone: p.phone,
    billingAddress: p.billingaddress,
    shippingAddress: p.shippingaddress,
  }));

export default saleSlice.reducer;
