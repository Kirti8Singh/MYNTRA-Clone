import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",

  initialState: {
    companies: [],
    priceRange: "all",
    rating: "all",
  },

  reducers: {
    toggleCompany: (state, action) => {
      const company = action.payload;

      if (state.companies.includes(company)) {
        state.companies = state.companies.filter(
          (item) => item !== company
        );
      } else {
        state.companies.push(company);
      }
    },

    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },

    setRating: (state, action) => {
      state.rating = action.payload;
    },

    clearFilters: (state) => {
      state.companies = [];
      state.priceRange = "all";
      state.rating = "all";
    },
  },
});

export const filterActions = filterSlice.actions;

export default filterSlice;