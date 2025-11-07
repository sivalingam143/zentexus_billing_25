import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSettingApi, updateSettingApi } from "../services/SettingService";

// Fetch all Setting
export const fetchSetting = createAsyncThunk(
  "Setting/fetchSetting",
  async () => {
    const response = await fetchSettingApi();
    console.log("response", response);
    return response;
  }
);

// Update Setting by ID
export const updateSetting = createAsyncThunk(
  "Setting/updateSetting",
  async (formData) => {
    console.log("siva", formData);
    const response = await updateSettingApi(formData);
    return {
      formData,
    };
  }
);

const SettingSlice = createSlice({
  name: "Setting",
  initialState: {
    Setting: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSetting.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Setting = action.payload;
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.Setting.findIndex(
          (Setting) => Setting.id === action.payload.id
        );
        console.log(index);
        if (index !== -1) {
          // Replace the updated Setting with the response payload
          state.Setting[index] = action.payload;
        }
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default SettingSlice.reducer;
