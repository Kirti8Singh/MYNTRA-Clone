import { createSlice } from "@reduxjs/toolkit";

const itemsSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    // Populates your catalog state array cleanly upon initial backend fetch load
    addInitialItems: (state, action) => {
      return action.payload;
    },
  },
});

export const itemsActions = itemsSlice.actions;
export default itemsSlice;
