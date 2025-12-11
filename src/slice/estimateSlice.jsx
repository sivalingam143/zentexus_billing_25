


// // slices/estimateSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../config/API";

// // Thunks
// export const fetchParties = createAsyncThunk(
//   "estimate/fetchParties",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/parties.php", {
//         search_text: ""
//       });
//       return response.data.body?.parties || [];
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const searchEstimates = createAsyncThunk(
//   "estimate/searchEstimates",
//   async (searchText = "", { rejectWithValue }) => {
//     try {
//       // Adjust this endpoint as needed
//       const response = await axiosInstance.post("/estimates.php", {
//         search_text: searchText
//       });
//       return response.data.body?.estimates || [];
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const createEstimate = createAsyncThunk(
//   "estimate/createEstimate",
//   async (estimateData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/estimates.php", estimateData);
//       if (response.data?.head?.code === 200) {
//         return response.data;
//       } else {
//         return rejectWithValue(response.data?.head?.msg || "Failed to create estimate");
//       }
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const updateEstimate = createAsyncThunk(
//   "estimate/updateEstimate",
//   async (estimateData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/estimates.php", estimateData);
//       if (response.data?.head?.code === 200) {
//         return response.data;
//       } else {
//         return rejectWithValue(response.data?.head?.msg || "Failed to update estimate");
//       }
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );
// // export const deleteEstimate = createAsyncThunk(
// //   "estimate/deleteEstimate",
// //   async (estimateId, { rejectWithValue }) => {
// //     try {
// //       await deleteEstimateApi(estimateId);
// //       return { estimateId };
// //     } catch (error) {
// //       return rejectWithValue(error.message);
// //     }
// //   }
// // );

// // Slice
// const estimateSlice = createSlice({
//   name: "estimate",
//   initialState: {
//     parties: [],
//     estimates: [],
//     partiesStatus: "idle",
//     estimatesStatus: "idle",
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Parties
//       .addCase(fetchParties.pending, (state) => {
//         state.partiesStatus = "loading";
//         state.error = null;
//       })
//       .addCase(fetchParties.fulfilled, (state, action) => {
//         state.partiesStatus = "succeeded";
//         state.parties = action.payload;
//       })
//       .addCase(fetchParties.rejected, (state, action) => {
//         state.partiesStatus = "failed";
//         state.error = action.payload;
//       })
      
//       // Search Estimates
//       .addCase(searchEstimates.pending, (state) => {
//         state.estimatesStatus = "loading";
//         state.error = null;
//       })
//       .addCase(searchEstimates.fulfilled, (state, action) => {
//         state.estimatesStatus = "succeeded";
//         state.estimates = action.payload;
//       })
//       .addCase(searchEstimates.rejected, (state, action) => {
//         state.estimatesStatus = "failed";
//         state.error = action.payload;
//       })
      
//       // Create Estimate
//       .addCase(createEstimate.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createEstimate.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(createEstimate.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Update Estimate
//       .addCase(updateEstimate.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateEstimate.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(updateEstimate.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError } = estimateSlice.actions;
// export default estimateSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchEstimatesApi,
  createEstimateApi,
  updateEstimateApi,
  deleteEstimateApi,
  fetchPartiesApi,
} from "../services/EstimateService";

export const fetchParties = createAsyncThunk(
  "estimate/fetchParties",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const parties = await fetchPartiesApi(searchText);
      return Array.isArray(parties) ? parties : [];
    } catch (error) {
      console.error("Fetch parties error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const searchEstimates = createAsyncThunk(
  "estimate/searchEstimates",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const estimates = await searchEstimatesApi(searchText);
      return Array.isArray(estimates) ? estimates : [];
    } catch (error) {
      console.error("Search estimates error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const createEstimate = createAsyncThunk(
  "estimate/createEstimate",
  async (estimateData, { rejectWithValue }) => {
    try {
      console.log("Creating estimate with data:", estimateData);
      const response = await createEstimateApi(estimateData);
      return response;
    } catch (error) {
      console.error("Create estimate error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateEstimate = createAsyncThunk(
  "estimate/updateEstimate",
  async (estimateData, { rejectWithValue }) => {
    try {
      console.log("Updating estimate with data:", estimateData);
      const response = await updateEstimateApi(estimateData);
      return { ...estimateData, response };
    } catch (error) {
      console.error("Update estimate error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEstimate = createAsyncThunk(
  "estimate/deleteEstimate",
  async (estimateId, { rejectWithValue }) => {
    try {
      await deleteEstimateApi(estimateId);
      return { estimateId };
    } catch (error) {
      console.error("Delete estimate error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  estimates: [],
  parties: [],
  status: "idle",
  partiesStatus: "idle",
  loading: false,
  error: null,
  estimateResponse: null,
};

const estimateSlice = createSlice({
  name: "estimate",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEstimateResponse: (state) => {
      state.estimateResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch parties
      .addCase(fetchParties.pending, (state) => {
        state.partiesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.partiesStatus = "succeeded";
        state.parties = action.payload;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.partiesStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      
      // Search estimates
      .addCase(searchEstimates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchEstimates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.estimates = action.payload;
      })
      .addCase(searchEstimates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      
      // Create estimate
      .addCase(createEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEstimate.fulfilled, (state, action) => {
        state.loading = false;
        state.estimateResponse = action.payload;
      })
      .addCase(createEstimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Update estimate
      .addCase(updateEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEstimate.fulfilled, (state, action) => {
        state.loading = false;
        state.estimateResponse = action.payload.response;
        const { edit_estimates_id } = action.meta.arg;
        const index = state.estimates.findIndex(
          (estimate) => estimate.estimate_id === edit_estimates_id
        );
        if (index !== -1) {
          state.estimates[index] = { ...state.estimates[index], ...action.meta.arg };
        }
      })
      .addCase(updateEstimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Delete estimate
      .addCase(deleteEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEstimate.fulfilled, (state, action) => {
        state.loading = false;
        state.estimates = state.estimates.filter(
          (estimate) => estimate.estimate_id !== action.payload.estimateId
        );
      })
      .addCase(deleteEstimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, clearEstimateResponse } = estimateSlice.actions;
export default estimateSlice.reducer;
