// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // 🌟 Import the service function 🌟
// import { addItem } from '../services/ItemService'; // Adjust path as necessary

// // --- Thunk for Adding Item ---
// export const addNewItem = createAsyncThunk(
//   'items/addNewItem',
//   async (itemData, { rejectWithValue }) => {
//     try {
//       // 🌟 Call the service function, which handles the API request 🌟
//       const newItem = await addItem(itemData);
//       return newItem; 

//     } catch (error) {
//       console.error("Error adding item:", error);
//       // Return the error message provided by the service
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // --- Item Slice ---
// const itemSlice = createSlice({
//   name: 'items',
//   initialState: {
//     items: [],
//     loading: 'idle',
//     error: null,
//   },
//   reducers: {
//     // Synchronous reducers go here if needed
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addNewItem.pending, (state) => {
//         state.loading = 'pending';
//       })
//       .addCase(addNewItem.fulfilled, (state, action) => {
//         state.loading = 'idle';
//         // Add the new item to the list
//         state.items.push(action.payload); 
//         state.error = null;
//       })
//       .addCase(addNewItem.rejected, (state, action) => {
//         state.loading = 'idle';
//         state.error = action.payload;
//       });
//   },
// });

// export default itemSlice.reducer;