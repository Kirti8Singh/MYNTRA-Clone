import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },

  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;

      const alreadyExists = state.items.some(
        (wishlistItem) => wishlistItem.id === item.id
      );

      if (!alreadyExists) {
        state.items.push(item);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    toggleWishlist: (state, action) => {
      const item = action.payload;

      const existingIndex = state.items.findIndex(
        (wishlistItem) => wishlistItem.id === item.id
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(item);
      }
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice;