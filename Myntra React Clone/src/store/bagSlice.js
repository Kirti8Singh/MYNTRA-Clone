import { createSlice } from "@reduxjs/toolkit";

const bagSlice = createSlice({
  name: "bag",
  initialState: [],
  reducers: {
    // Adds a product ID string to the cart tracking array
    addToBag: (state, action) => {
      state.push(action.payload);
    },
    // Filters out a product ID string to remove it from the cart tracking array
    removeFromBag: (state, action) => {
      return state.filter((itemId) => itemId !== action.payload);
    },
  },
});

export const bagActions = bagSlice.actions;
export default bagSlice;
