import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCompanyApi,
  addCompanyApi,
  updateCompanyApi,
  deleteCompanyApi,
} from "../services/companyService";

// Fetch all company payroll entries
export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async () => {
    const response = await fetchCompanyApi();
    console.log("response", response);
    return response;
  }
);

// Add new company payroll entry
export const addCompany = createAsyncThunk(
  "company/addCompany",
  async (companydata) => {
    console.log("addcompany data:", companydata);
    const response = await addCompanyApi(companydata);
    console.log("API Response on Add addcompany:", response);
    return response;
  }
);

// Update company payroll entry by ID
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (updatedata) => {
    console.log("update data:", updatedata);
    const response = await updateCompanyApi(updatedata);
    return response;
  }
);

// Delete company payroll entry by ID
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (dryId) => {
    const response = await deleteCompanyApi(dryId);
    return dryId;
  }
);

const CompanySlice = createSlice({
  name: "company",
  initialState: {
    company: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.company.push(action.payload);
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.company = state.company.filter(
          (company) => company.id !== action.payload
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.company.findIndex(
          (company) => company.id === action.payload.id
        );
        if (index !== -1) {
          state.company[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default CompanySlice.reducer;
