import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPaySettingApi,
  updatePaySettingApi,
} from "../services/paySettingService";

// Fetch all pay settings
export const fetchPaySetting = createAsyncThunk(
  "paySetting/fetchPaySetting",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchPaySettingApi();
      console.log("fetchPaySetting response:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update pay setting by ID
export const updatePaySetting = createAsyncThunk(
  "paySetting/updatePaySetting",
  async (formData, { rejectWithValue }) => {
    console.log("updatePaySetting data:", formData);
    try {
      const response = await updatePaySettingApi(formData);
      return response; // Returns { id, pay_setting_cooly }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const SettingSlice = createSlice({
  name: "paySetting",
  initialState: {
    paySetting: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaySetting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPaySetting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paySetting = action.payload;
      })
      .addCase(fetchPaySetting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePaySetting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePaySetting.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.paySetting.findIndex(
          (setting) => setting.id === action.payload.id
        );
        if (index !== -1) {
          state.paySetting[index] = {
            ...state.paySetting[index],
            pay_setting_cooly_one: action.payload.pay_setting_cooly_one,
            pay_setting_cooly_two: action.payload.pay_setting_cooly_two,
          };
        }
      })
      .addCase(updatePaySetting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default SettingSlice.reducer;
