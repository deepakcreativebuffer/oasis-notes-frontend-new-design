import { createSlice } from "@reduxjs/toolkit";

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: null,
  },
  reducers: {
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

export const { setPermissions } = permissionsSlice.actions;
export const selectPermissions = (state) => state.permissions.permissions;

export default permissionsSlice.reducer;
