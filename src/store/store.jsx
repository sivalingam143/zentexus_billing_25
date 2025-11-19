import { configureStore } from "@reduxjs/toolkit";
import partyReducer from "../slice/partySlice";
import saleReducer from "../slice/saleSlice";

const store = configureStore({
  reducer: {
    parties: partyReducer,
    sale: saleReducer,
  },
});

export default store;
