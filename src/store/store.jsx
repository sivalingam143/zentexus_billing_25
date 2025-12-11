// src/store.js or src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import partyReducer from "../slice/partySlice";
import saleReducer from "../slice/saleSlice";
import unitReducer from "../slice/UnitSlice";  
import categoryReducer from "../slice/CategorySlice";
import productReducer from "../slice/ProductSlice";
import serviceReducer from "../slice/serviceSlice";
import estimateReducer from "../slice/estimateSlice"


export const store = configureStore({
  reducer: {
    party: partyReducer,
    sale: saleReducer,
    estimate: estimateReducer,
    unit: unitReducer,
    category: categoryReducer,
    product : productReducer,
    service : serviceReducer,  
  },
});

export default store;