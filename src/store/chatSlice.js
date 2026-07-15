/** @format */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  isQuizOpen: false,
  chatMenuData: [],
  chatGroupMenuData: [],
  activeActiveChat: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setDocumentID: (state, action) => {
      state.id = action.payload;
    },
    setChatID: (state, action) => {
      state.activeActiveChat = action.payload;
    },
    setChatMenuData: (state, action) => {
      state.chatMenuData = action.payload;
    },

    updateUnreadMessages: (state, action) => {
      const { conversationId, updatedAt, sentBy, currentUserId } =
        action.payload;
      if (!currentUserId) return;

      const chatIndex = state.chatMenuData.findIndex(
        (chat) => chat._id === conversationId,
      );
      if (
        conversationId !== state.activeActiveChat &&
        currentUserId !== sentBy
      ) {
        if (chatIndex !== -1) {
          state.chatMenuData[chatIndex].unreadMessagesCount += 1;
        }
      }
      if (updatedAt && chatIndex !== -1 && state.chatMenuData[chatIndex]) {
        state.chatMenuData[chatIndex].updatedAt = updatedAt;
      }
    },
    setGroupChatMenuData: (state, action) => {
      state.chatGroupMenuData = action.payload;
    },
    updateGroupUnreadMessages: (state, action) => {
      const { groupId, updatedAt, sentBy, currentUserId } = action.payload;
      if (!currentUserId) return;

      const chatIndex = state.chatGroupMenuData.findIndex(
        (chat) => chat._id === groupId,
      );
      if (groupId !== state.activeActiveChat && currentUserId !== sentBy) {
        if (chatIndex !== -1) {
          state.chatGroupMenuData[chatIndex].unreadMessagesCount += 1;
        }
      }
      if (updatedAt && chatIndex !== -1 && state.chatGroupMenuData[chatIndex]) {
        state.chatGroupMenuData[chatIndex].updatedAt = updatedAt;
      }
    },
  },
});
export const { setChatMenuData, updateUnreadMessages } = chatSlice.actions;
export const selectChatMenu = (state) => state.chat.chatMenuData;
export const { setGroupChatMenuData, updateGroupUnreadMessages } =
  chatSlice.actions;
export const selectGroupChatMenu = (state) => state.chat.chatGroupMenuData;
export const { setDocumentID } = chatSlice.actions;
export const fetchDocumentId = (state) => state.chat.id;
export const { setChatID } = chatSlice.actions;
export const fetchChatId = (state) => state.chat.activeActiveChat;

export default chatSlice.reducer;
