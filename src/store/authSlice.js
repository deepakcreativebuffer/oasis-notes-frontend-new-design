/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { clearClientPersistence } from "./authStorage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    /** Set true only after refresh/login succeeds — not from localStorage. */
    isAuthenticated: false,
    userProfile: {},
    unreadMessages: 0,
    unreadNotifications: 0,
  },
  reducers: {
    LoginSlice: (state, action) => {
      const profile = action?.payload?.profile?.data;
      state.isAuthenticated = true;
      state.userProfile = profile;
      state.unreadNotifications = profile?.unreadNotifications || 0;
      state.unreadMessages = profile?.totalUnreadMessages || 0;
    },
    updateUnreadMessageCount: (state, action) => {
      const { read, count } = action.payload;
      if (read) {
        state.unreadMessages = Math.max(0, state.unreadMessages - count);
      } else {
        state.unreadMessages += count;
      }
    },
    updateUnreadNotificationCount: (state, action) => {
      const { read, count } = action.payload;
      if (read) {
        state.unreadNotifications = Math.max(
          0,
          state.unreadNotifications - count,
        );
      } else {
        state.unreadNotifications += count;
      }
    },

    UpdateUserProfile: (state, action) => {
      state.userProfile = action?.payload;
    },

    LOGOUT: (state) => {
      state.isAuthenticated = false;
      state.userProfile = {};
      clearClientPersistence();
    },
  },
});

export const {
  LoginSlice,
  LOGOUT,
  UpdateUserProfile,
  updateUnreadMessageCount,
  updateUnreadNotificationCount,
} = authSlice.actions;

export const isAuthenticated = (state) => state.auth.isAuthenticated;
export const userProfile = (state) => state.auth.userProfile;
export const selectUserId = (state) => state.auth.userProfile?._id;

export default authSlice.reducer;
