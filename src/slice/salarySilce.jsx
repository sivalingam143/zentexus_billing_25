import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSalaryReportApi } from "../services/salaryRportService";

// Fetch all Report
export const fetchSalaryReport = createAsyncThunk(
  "SalaryReport/fetchSalaryReport",
  async ({ from_date, to_date }) => {
    const response = await fetchSalaryReportApi({ from_date, to_date });
    console.log("response", response);
    return response;
  }
);

const SalaryReportSlice = createSlice({
  name: "SalaryReport",
  initialState: {
    SalaryReport: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaryReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSalaryReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.SalaryReport = action.payload?.report || [];
      })
      .addCase(fetchSalaryReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default SalaryReportSlice.reducer;
