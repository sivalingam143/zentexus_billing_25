// import { configureStore } from "@reduxjs/toolkit";
// import partyReducer from "../slice/partySlice";
// import saleReducer from "../slice/saleSlice";

// const store = configureStore({
//   reducer: {
//     party: partyReducer,
//     sale: saleReducer,
//   },
// });

// export default store;

import { configureStore } from "@reduxjs/toolkit";
import partyReducer from "../slice/partySlice";

const store = configureStore({
  reducer: {
    parties: partyReducer,
  },
});

export default store;
