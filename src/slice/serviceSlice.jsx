// src/slice/serviceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchServicesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
} from "../services/ServiceTabService";

export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (searchText = "", { rejectWithValue }) => {
    try {
      const response = await fetchServicesApi(searchText);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch services");
    }
  }
);

export const createService = createAsyncThunk(
  "service/createService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await createServiceApi(serviceData);
      return response.body;   // response.body must contain a service object for this to work
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateService = createAsyncThunk(
  "service/updateService",
  async (serviceData, { rejectWithValue }) => {
    try {
      await updateServiceApi(serviceData);
      return serviceData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (service_code, { rejectWithValue }) => {
    try {
      await deleteServiceApi(service_code);
      return service_code;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  services: [],
  status: "idle",
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.services.unshift(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.services.findIndex(s => s.service_code === updated.edit_service_id || s.service_code === updated.service_id);
        if (index !== -1) state.services[index] = { ...state.services[index], ...updated };
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.service_code !== action.payload);
      });
  },
});

export const { clearError } = serviceSlice.actions;
export default serviceSlice.reducer;