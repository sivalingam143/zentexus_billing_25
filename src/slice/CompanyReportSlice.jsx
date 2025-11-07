import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCompanyPayrollReportApi } from "../services/CompanyReportService";

// Fetch Payroll Report
export const fetchCompanyPayrollReport = createAsyncThunk(
  "CompanyReport/fetchReport",
  async ({ from_date, to_date }) => {
    const response = await fetchCompanyPayrollReportApi({ from_date, to_date });
    return response;
  }
);

const companyPayrollSlice = createSlice({
  name: "CompanyReport",
  initialState: {
    CompanyReport: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyPayrollReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanyPayrollReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.CompanyReport = action.payload?.report || [];
      })
      .addCase(fetchCompanyPayrollReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default companyPayrollSlice.reducer;
