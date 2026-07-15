/** @format */

import { describe, it, expect } from "vitest";
import reducer, {
  setUnreadNotifications,
  setNotificationsList,
  selectUnreadNotifications,
  selectNotificationsList,
} from "./notificationSlice";

const INITIAL = { unreadNotifications: 0, notificationsList: [] };

describe("notificationSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("should set the unread notification count", () => {
    const state = reducer(INITIAL, setUnreadNotifications(7));
    expect(state.unreadNotifications).toBe(7);
  });

  it("should set the notifications list", () => {
    const list = [{ _id: "notif-1", message: "Test notification" }];
    const state = reducer(INITIAL, setNotificationsList(list));
    expect(state.notificationsList).toEqual(list);
  });

  it("should select unread count and list", () => {
    const root = {
      notification: {
        unreadNotifications: 3,
        notificationsList: [{ _id: "n" }],
      },
    };
    expect(selectUnreadNotifications(root)).toBe(3);
    expect(selectNotificationsList(root)).toEqual([{ _id: "n" }]);
  });
});
