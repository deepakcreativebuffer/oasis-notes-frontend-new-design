/** @format */

import { describe, it, expect, vi } from "vitest";

import reducer, {
  setCurrentOrgId,
  selectCurrentOrgId,
} from "./organizationSlice";
import { LoginSlice, LOGOUT } from "./authSlice";

// authSlice.LOGOUT's reducer calls clearClientPersistence on import-time-safe
// modules, but here we only use the action CREATORS to drive extraReducers, so
// no storage side effects run. Mock anyway to keep the unit hermetic.
vi.mock("./authStorage", () => ({
  clearClientPersistence: vi.fn(),
  clearLegacyAuthStorage: vi.fn(),
}));

const INITIAL = { currentOrgId: null };

const profileWith = (orgs, activeOrganizationId) => ({
  profile: { data: { organizations: orgs, activeOrganizationId } },
});

describe("organizationSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("should set the current organization id directly", () => {
    const state = reducer(INITIAL, setCurrentOrgId("org-test-001"));
    expect(state.currentOrgId).toBe("org-test-001");
  });

  describe("on login (extraReducers)", () => {
    const ORGS = [{ _id: "org-1" }, { _id: "org-2" }];

    it("should adopt the server-preferred active org when the user is a member", () => {
      const state = reducer(INITIAL, LoginSlice(profileWith(ORGS, "org-2")));
      // WHY: the active-org context scopes every API call; honoring the saved
      // preference keeps the user in the facility/org they last worked in.
      expect(state.currentOrgId).toBe("org-2");
    });

    it("should fall back to the first enrolled org when the preferred id is not a member", () => {
      const state = reducer(INITIAL, LoginSlice(profileWith(ORGS, "org-999")));
      expect(state.currentOrgId).toBe("org-1");
    });

    it("should be null when the profile has no organizations", () => {
      const state = reducer(INITIAL, LoginSlice(profileWith([], undefined)));
      expect(state.currentOrgId).toBeNull();
    });
  });

  it("should clear the current org id on logout", () => {
    const state = reducer({ currentOrgId: "org-1" }, LOGOUT());
    // WHY: org context is PHI-scoping; it must not survive a logout into the
    // next session.
    expect(state.currentOrgId).toBeNull();
  });

  it("should select the current org id", () => {
    expect(
      selectCurrentOrgId({ organization: { currentOrgId: "org-1" } }),
    ).toBe("org-1");
  });
});
