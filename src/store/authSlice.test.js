/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import reducer, {
  LoginSlice,
  LOGOUT,
  UpdateUserProfile,
  updateUnreadMessageCount,
  updateUnreadNotificationCount,
  isAuthenticated,
  userProfile,
  selectUserId,
} from "./authSlice";
import { clearClientPersistence } from "./authStorage";

// Mock the client-persistence module so LOGOUT is observable and never touches
// real localStorage/sessionStorage. The factory is hoisted above the import.
vi.mock("./authStorage", () => ({
  clearClientPersistence: vi.fn(),
  clearLegacyAuthStorage: vi.fn(),
}));

// Fake PHI only — never realistic patient data.
const TEST_PROFILE = {
  _id: "user-test-001",
  name: "Test Employee",
  unreadNotifications: 3,
  totalUnreadMessages: 5,
};

const INITIAL_STATE = {
  isAuthenticated: false,
  userProfile: {},
  unreadMessages: 0,
  unreadNotifications: 0,
};

describe("authSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should return the initial unauthenticated state when called with undefined and an unknown action", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      // WHY: an EHR session must start logged-out; auth is only granted after a
      // successful login/refresh, never inferred from prior state.
      expect(state).toEqual(INITIAL_STATE);
    });
  });

  describe("LoginSlice", () => {
    it("should mark the session authenticated and hydrate the profile from payload.profile.data", () => {
      const state = reducer(
        INITIAL_STATE,
        LoginSlice({ profile: { data: TEST_PROFILE } }),
      );

      expect(state.isAuthenticated).toBe(true);
      expect(state.userProfile).toEqual(TEST_PROFILE);
      // WHY: unread badges seed from the authenticated profile so the user sees
      // pending clinical messages/notifications immediately on login.
      expect(state.unreadNotifications).toBe(3);
      expect(state.unreadMessages).toBe(5);
    });

    it("should default unread counts to 0 when the profile omits them", () => {
      const state = reducer(
        INITIAL_STATE,
        LoginSlice({ profile: { data: { _id: "user-test-002" } } }),
      );

      expect(state.isAuthenticated).toBe(true);
      expect(state.unreadNotifications).toBe(0);
      expect(state.unreadMessages).toBe(0);
    });

    it("should set an undefined profile without throwing when the payload shape is malformed", () => {
      // Edge case: missing profile.data (e.g. a partial/aborted login response).
      const state = reducer(INITIAL_STATE, LoginSlice({}));

      expect(state.isAuthenticated).toBe(true);
      expect(state.userProfile).toBeUndefined();
      expect(state.unreadNotifications).toBe(0);
      expect(state.unreadMessages).toBe(0);
    });
  });

  describe("updateUnreadMessageCount", () => {
    it("should increment the unread message count when messages arrive (read: false)", () => {
      const state = reducer(
        { ...INITIAL_STATE, unreadMessages: 2 },
        updateUnreadMessageCount({ read: false, count: 3 }),
      );
      expect(state.unreadMessages).toBe(5);
    });

    it("should decrement the unread message count when messages are read (read: true)", () => {
      const state = reducer(
        { ...INITIAL_STATE, unreadMessages: 5 },
        updateUnreadMessageCount({ read: true, count: 2 }),
      );
      expect(state.unreadMessages).toBe(3);
    });

    it("should clamp the unread message count at 0 and never go negative", () => {
      const state = reducer(
        { ...INITIAL_STATE, unreadMessages: 1 },
        updateUnreadMessageCount({ read: true, count: 5 }),
      );
      // WHY: a negative unread badge would be a nonsensical UI state; the count
      // floors at zero even if a "read" event over-counts.
      expect(state.unreadMessages).toBe(0);
    });
  });

  describe("updateUnreadNotificationCount", () => {
    it("should increment the unread notification count when notifications arrive (read: false)", () => {
      const state = reducer(
        { ...INITIAL_STATE, unreadNotifications: 4 },
        updateUnreadNotificationCount({ read: false, count: 1 }),
      );
      expect(state.unreadNotifications).toBe(5);
    });

    it("should decrement the unread notification count when notifications are read (read: true)", () => {
      const state = reducer(
        { ...INITIAL_STATE, unreadNotifications: 4 },
        updateUnreadNotificationCount({ read: true, count: 1 }),
      );
      expect(state.unreadNotifications).toBe(3);
    });

    it("should clamp the unread notification count at 0 and never go negative", () => {
      const state = reducer(
        { ...INITIAL_STATE, unreadNotifications: 2 },
        updateUnreadNotificationCount({ read: true, count: 10 }),
      );
      expect(state.unreadNotifications).toBe(0);
    });
  });

  describe("UpdateUserProfile", () => {
    it("should replace the stored profile with the action payload", () => {
      const updated = { ...TEST_PROFILE, name: "Test Employee Renamed" };
      const state = reducer(
        { ...INITIAL_STATE, userProfile: TEST_PROFILE },
        UpdateUserProfile(updated),
      );
      expect(state.userProfile).toEqual(updated);
    });
  });

  describe("LOGOUT", () => {
    it("should reset auth state and clear client persistence", () => {
      const loggedIn = {
        isAuthenticated: true,
        userProfile: TEST_PROFILE,
        unreadMessages: 5,
        unreadNotifications: 3,
      };

      const state = reducer(loggedIn, LOGOUT());

      expect(state.isAuthenticated).toBe(false);
      expect(state.userProfile).toEqual({});
      // WHY: logging out of an EHR must wipe client-side PHI/auth artifacts;
      // the reducer delegates that scrub to clearClientPersistence().
      expect(clearClientPersistence).toHaveBeenCalledTimes(1);
    });

    it("should leave unread counters untouched on logout (only auth/profile reset)", () => {
      // Edge case: LOGOUT intentionally does not zero the badge counters; this
      // pins that behavior so a future change is a deliberate decision.
      const state = reducer(
        {
          isAuthenticated: true,
          userProfile: TEST_PROFILE,
          unreadMessages: 5,
          unreadNotifications: 3,
        },
        LOGOUT(),
      );
      expect(state.unreadMessages).toBe(5);
      expect(state.unreadNotifications).toBe(3);
    });
  });

  describe("selectors", () => {
    const rootState = {
      auth: {
        isAuthenticated: true,
        userProfile: TEST_PROFILE,
        unreadMessages: 5,
        unreadNotifications: 3,
      },
    };

    it("should select the authentication flag", () => {
      expect(isAuthenticated(rootState)).toBe(true);
    });

    it("should select the user profile", () => {
      expect(userProfile(rootState)).toEqual(TEST_PROFILE);
    });

    it("should select the user id from the profile", () => {
      expect(selectUserId(rootState)).toBe("user-test-001");
    });

    it("should return undefined for the user id when the profile is empty", () => {
      const emptyState = { auth: { ...rootState.auth, userProfile: {} } };
      expect(selectUserId(emptyState)).toBeUndefined();
    });
  });
});
