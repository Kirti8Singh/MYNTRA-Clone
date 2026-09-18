import { configureStore } from "@reduxjs/toolkit";
import itemsSlice from "./itemsSlice";
import fetchStatusSlice from "./fetchStatusSlice";
import bagSlice from "./bagSlice";
import toastSlice from "./toastSlice";
import searchSlice from "./searchSlice";
import filterSlice from "./filterSlice";
import sortSlice from "./sortSlice";

// Combining our modular slices into a centralized global store framework
const myntraStore = configureStore({
  reducer: {
    items: itemsSlice.reducer,
    fetchStatus: fetchStatusSlice.reducer,
    bag: bagSlice.reducer,
    toast: toastSlice.reducer,
    search: searchSlice.reducer,
    filter: filterSlice.reducer,
    sort: sortSlice.reducer,
  },
});

export default myntraStore;
