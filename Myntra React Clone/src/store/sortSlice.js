import { createSlice } from "@reduxjs/toolkit";

const sortSlice = createSlice({
  name: "sort",
  initialState: {
    sortBy: "recommended",
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearSort: (state) => {
      state.sortBy = "recommended";
    },
  },
});

export const sortActions = sortSlice.actions;
export default sortSlice;