// src/store.js or src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import partyReducer from "../slice/partySlice";
import saleReducer from "../slice/saleSlice";
import unitReducer from "../slice/UnitSlice";  
import categoryReducer from "../slice/CategorySlice";

export const store = configureStore({
  reducer: {
    party: partyReducer,
    sale: saleReducer,
    unit: unitReducer,
    category: categoryReducer,  // key must be "unit"
  },
});

export default store;