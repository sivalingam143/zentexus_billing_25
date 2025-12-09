// src/slice/unitSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUnitsApi,
  createUnitApi,
  updateUnitApi,
  deleteUnitApi,
  saveUnitConversionApi,
} from "../services/UnitService";


export const saveUnitConversion = createAsyncThunk(
  "unit/saveUnitConversion",
  async ({ unit_id, conversion_text }, { rejectWithValue }) => {
    try {
      const response = await saveUnitConversionApi(unit_id, conversion_text);
      return { unit_id, conversion_text, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchUnits = createAsyncThunk(
  "unit/fetchUnits",
  async (_, { rejectWithValue }) => {
    try {
      const units = await fetchUnitsApi();
      return Array.isArray(units) ? units : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUnit = createAsyncThunk(
  "unit/createUnit",
  async (unitData, { rejectWithValue }) => {
    try {
      const response = await createUnitApi(unitData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUnit = createAsyncThunk(
  "unit/updateUnit",
  async (unitData, { rejectWithValue }) => {
    try {
      const response = await updateUnitApi(unitData);
      return { ...unitData, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUnit = createAsyncThunk(
  "unit/deleteUnit",
  async (unit_id, { rejectWithValue }) => {
    try {
      await deleteUnitApi(unit_id);
      return { unit_id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  units: [],
  status: "idle",
  error: null,
  unitResponse: null,
};

const unitSlice = createSlice({
  name: "unit",
  initialState,
  reducers: {
    clearUnitResponse: (state) => {
      state.unitResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unitResponse = action.payload;
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unitResponse = action.payload.response;
        const index = state.units.findIndex((u) => u.unit_id === action.payload.unit_id);
        if (index !== -1) {
          state.units[index] = { ...state.units[index], ...action.payload };
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
.addCase(saveUnitConversion.fulfilled, (state, action) => {
  const { unit_id, conversion_text } = action.payload;
  const unit = state.units.find(u => u.unit_id === unit_id);
  if (unit) {
    let arr = unit.conversion || [];
    if (typeof arr === "string") {
      try { arr = JSON.parse(arr); } catch { arr = arr ? [arr] : []; }
    }
    arr.push(conversion_text);
    unit.conversion = arr; // keep as array in Redux
  }
})
      .addCase(deleteUnit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.units = state.units.filter((u) => u.unit_id !== action.payload.unit_id);
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearUnitResponse } = unitSlice.actions;
export default unitSlice.reducer;