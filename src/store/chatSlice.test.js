/** @format */

import { describe, it, expect } from "vitest";
import reducer, {
  setChatMenuData,
  updateUnreadMessages,
  setGroupChatMenuData,
  updateGroupUnreadMessages,
  setDocumentID,
  setChatID,
  selectChatMenu,
  selectGroupChatMenu,
  fetchDocumentId,
  fetchChatId,
} from "./chatSlice";

const INITIAL = {
  step: 1,
  isQuizOpen: false,
  chatMenuData: [],
  chatGroupMenuData: [],
  activeActiveChat: "",
};

describe("chatSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  describe("simple setters", () => {
    it("should set the chat menu data", () => {
      const list = [{ _id: "chat-1" }];
      const state = reducer(INITIAL, setChatMenuData(list));
      expect(state.chatMenuData).toEqual(list);
    });

    it("should set the group chat menu data", () => {
      const list = [{ _id: "group-1" }];
      const state = reducer(INITIAL, setGroupChatMenuData(list));
      expect(state.chatGroupMenuData).toEqual(list);
    });

    it("should set the active chat id and the document id", () => {
      let state = reducer(INITIAL, setChatID("chat-9"));
      state = reducer(state, setDocumentID("doc-9"));
      expect(state.activeActiveChat).toBe("chat-9");
      expect(state.id).toBe("doc-9");
    });
  });

  describe("updateUnreadMessages", () => {
    const baseState = () => ({
      ...INITIAL,
      activeActiveChat: "chat-open",
      chatMenuData: [
        { _id: "chat-1", unreadMessagesCount: 0, updatedAt: "t0" },
      ],
    });

    it("should increment the unread count and bump updatedAt for a message in a non-active chat from another user", () => {
      const state = reducer(
        baseState(),
        updateUnreadMessages({
          conversationId: "chat-1",
          updatedAt: "t1",
          sentBy: "user-B",
          currentUserId: "user-A",
        }),
      );
      // WHY: a new message in a conversation the user isn't viewing must raise
      // the unread badge so clinical messages aren't missed.
      expect(state.chatMenuData[0].unreadMessagesCount).toBe(1);
      expect(state.chatMenuData[0].updatedAt).toBe("t1");
    });

    it("should not increment when the message is for the currently open chat", () => {
      const state = reducer(
        { ...baseState(), activeActiveChat: "chat-1" },
        updateUnreadMessages({
          conversationId: "chat-1",
          updatedAt: "t1",
          sentBy: "user-B",
          currentUserId: "user-A",
        }),
      );
      // WHY: messages in the chat you're actively reading are already "seen".
      expect(state.chatMenuData[0].unreadMessagesCount).toBe(0);
      expect(state.chatMenuData[0].updatedAt).toBe("t1");
    });

    it("should not increment for the user's own outgoing message", () => {
      const state = reducer(
        baseState(),
        updateUnreadMessages({
          conversationId: "chat-1",
          sentBy: "user-A",
          currentUserId: "user-A",
        }),
      );
      expect(state.chatMenuData[0].unreadMessagesCount).toBe(0);
    });

    it("should be a no-op when currentUserId is missing", () => {
      const before = baseState();
      const state = reducer(
        before,
        updateUnreadMessages({ conversationId: "chat-1", sentBy: "user-B" }),
      );
      expect(state.chatMenuData[0].unreadMessagesCount).toBe(0);
    });
  });

  describe("updateGroupUnreadMessages", () => {
    it("should increment the group unread count for a non-active group from another user", () => {
      const state = reducer(
        {
          ...INITIAL,
          activeActiveChat: "group-open",
          chatGroupMenuData: [
            { _id: "group-1", unreadMessagesCount: 2, updatedAt: "t0" },
          ],
        },
        updateGroupUnreadMessages({
          groupId: "group-1",
          updatedAt: "t1",
          sentBy: "user-B",
          currentUserId: "user-A",
        }),
      );
      expect(state.chatGroupMenuData[0].unreadMessagesCount).toBe(3);
      expect(state.chatGroupMenuData[0].updatedAt).toBe("t1");
    });
  });

  describe("selectors", () => {
    it("should select chat, group, document id, and chat id", () => {
      const root = {
        chat: {
          chatMenuData: [{ _id: "c" }],
          chatGroupMenuData: [{ _id: "g" }],
          id: "doc-1",
          activeActiveChat: "chat-1",
        },
      };
      expect(selectChatMenu(root)).toEqual([{ _id: "c" }]);
      expect(selectGroupChatMenu(root)).toEqual([{ _id: "g" }]);
      expect(fetchDocumentId(root)).toBe("doc-1");
      expect(fetchChatId(root)).toBe("chat-1");
    });
  });
});
