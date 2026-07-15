import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    unreadNotifications: 0,
    notificationsList: [],
  },
  reducers: {
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    setNotificationsList: (state, action) => {
      state.notificationsList = action.payload;
    },
  },
});

export const { setUnreadNotifications, setNotificationsList } =
  notificationSlice.actions;
export const selectUnreadNotifications = (state) =>
  state.notification.unreadNotifications;
export const selectNotificationsList = (state) =>
  state.notification.notificationsList;

export default notificationSlice.reducer;
