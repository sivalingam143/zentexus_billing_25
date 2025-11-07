import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReportApi } from "../services/ReportService";

// Fetch all Report
export const fetchReport = createAsyncThunk("Report/fetchReport", async () => {
  const response = await fetchReportApi();
  console.log("response", response);
  return response;
});

const ReportSlice = createSlice({
  name: "Report",
  initialState: {
    Report: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Report = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ReportSlice.reducer;
