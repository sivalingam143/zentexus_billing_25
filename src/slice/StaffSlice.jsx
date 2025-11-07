import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchStaffApi,
  addStaffApi,
  updateStaffApi,
  deleteStaffApi,
} from "../services/StaffService";

// Fetch all Staff
export const fetchStaff = createAsyncThunk("Staff/fetchStaff", async () => {
  const response = await fetchStaffApi();
  console.log("response", response);
  return response;
});

// Add new Staff
export const addStaff = createAsyncThunk(
  "Staff/addStaff",
  async (StaffData) => {
    console.log("Staff data:", StaffData);
    const response = await addStaffApi(StaffData);
    console.log("API Response on Add Staff:", response);
    return response;
  }
);

// Update Staff by ID
export const updateStaff = createAsyncThunk(
  "Staff/updateStaff",
  async (formdata) => {
    console.log("siva", formdata);
    const response = await updateStaffApi(formdata);
    return {
      formdata,
    };
  }
);

// Delete Staff by ID
export const deleteStaff = createAsyncThunk(
  "Staff/deleteStaff",
  async (StaffId) => {
    const response = await deleteStaffApi(StaffId);
    return StaffId;
  }
);
const StaffSlice = createSlice({
  name: "Staff",
  initialState: {
    Staff: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Staff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("action.payload:", action.payload);
        state.Staff.push(action.payload[0]); // Add the Staff to the Staff array
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("action", action.payload);
        state.Staff = state.Staff.filter(
          (Staff) => Staff.id !== action.payload
        );
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.Staff.findIndex(
          (Staff) => Staff.id === action.payload.id
        );
        console.log(index);
        if (index !== -1) {
          // Replace the updated Staff with the response payload
          state.Staff[index] = action.payload;
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default StaffSlice.reducer;
