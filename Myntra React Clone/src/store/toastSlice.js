import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: { message: "", visible: false },
  reducers: {
    // Shows the toast with the given message
    showToast: (state, action) => {
      state.message = action.payload;
      state.visible = true;
    },
    // Hides the toast (auto-dismiss timer or manual close)
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const toastActions = toastSlice.actions;
export default toastSlice;