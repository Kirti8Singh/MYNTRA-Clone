import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",

  initialState: {
    isSaved: false,
  
    name: "",
    email: "",
    phone: "",
  
    skinType: "",
    concerns: [],
    skinGoals: "",
  
    budget: "all",
    preferredBrands: [],
  },

  reducers: {
    updateProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  
    toggleConcern: (state, action) => {
      const concern = action.payload;
  
      if (state.concerns.includes(concern)) {
        state.concerns = state.concerns.filter(
          (item) => item !== concern
        );
      } else {
        state.concerns.push(concern);
      }
    },
  
    toggleBrand: (state, action) => {
      const brand = action.payload;
  
      if (state.preferredBrands.includes(brand)) {
        state.preferredBrands = state.preferredBrands.filter(
          (item) => item !== brand
        );
      } else {
        state.preferredBrands.push(brand);
      }
    },
  
    saveProfile: (state) => {
      state.isSaved = true;
    },
  
    editProfile: (state) => {
      state.isSaved = false;
    },
  
    clearProfile: (state) => {
      state.isSaved = false;
      state.name = "";
      state.email = "";
      state.phone = "";
      state.skinType = "";
      state.concerns = [];
      state.skinGoals = "";
      state.budget = "all";
      state.preferredBrands = [];
    },
  },
});

export const profileActions = profileSlice.actions;

export default profileSlice;