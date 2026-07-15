import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: "light",
    userPreferences: {},
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setUserPreferences: (state, action) => {
      state.userPreferences = { ...state.userPreferences, ...action.payload };
    },
  },
});

export const { setTheme, setUserPreferences } = settingsSlice.actions;
export const selectTheme = (state) => state.settings.theme;
export const selectUserPreferences = (state) => state.settings.userPreferences;

export default settingsSlice.reducer;
