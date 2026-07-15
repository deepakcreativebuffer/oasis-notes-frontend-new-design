import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: false,
    activeModal: null,
    filters: {},
  },
  reducers: {
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  setActiveModal,
  setFilters,
  clearFilters,
} = uiSlice.actions;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectFilters = (state) => state.ui.filters;

export default uiSlice.reducer;
