/** @format */

import { configureStore } from "@reduxjs/toolkit";
import chat from "./chatSlice";
import authSlice from "./authSlice";
import organizationSlice from "./organizationSlice";
import facilitySlice from "./facilitySlice";
import residentSlice from "./residentSlice";
import employeeSlice from "./employeeSlice";
import permissionsSlice from "./permissionsSlice";
import uiSlice from "./uiSlice";
import settingsSlice from "./settingsSlice";
import notificationSlice from "./notificationSlice";
import signatureDraftReducer from "./signatureDraftSlice";

export const store = configureStore({
  reducer: {
    chat,
    auth: authSlice,
    signatureDraft: signatureDraftReducer,
    organization: organizationSlice,
    facility: facilitySlice,
    resident: residentSlice,
    employee: employeeSlice,
    permissions: permissionsSlice,
    ui: uiSlice,
    settings: settingsSlice,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
