import { createSlice } from "@reduxjs/toolkit";
import { LoginSlice, LOGOUT } from "./authSlice";
import { pickActiveOrganizationId } from "../utils/organizationContext";

const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    currentOrgId: sessionStorage.getItem("activeOrgId") || null,
  },
  reducers: {
    setCurrentOrgId: (state, action) => {
      state.currentOrgId = action.payload;
      if (action.payload) {
        sessionStorage.setItem("activeOrgId", action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginSlice, (state, action) => {
        const profile = action.payload?.profile?.data;
        const picked = pickActiveOrganizationId(profile);
        if (picked) {
          state.currentOrgId = picked;
          sessionStorage.setItem("activeOrgId", picked);
        } else if (sessionStorage.getItem("activeOrgId")) {
          state.currentOrgId = sessionStorage.getItem("activeOrgId");
        }
      })
      .addCase(LOGOUT, (state) => {
        state.currentOrgId = null;
        sessionStorage.removeItem("activeOrgId");
      });
  },
});

export const { setCurrentOrgId } = organizationSlice.actions;
export const selectCurrentOrgId = (state) => state.organization.currentOrgId;
export default organizationSlice.reducer;
