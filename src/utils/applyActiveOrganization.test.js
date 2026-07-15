/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { applyActiveOrganization } from "./applyActiveOrganization";
import { setCurrentOrgId } from "../store/organizationSlice";
import { UpdateUserProfile } from "../store/authSlice";

vi.mock("../store/authStorage", () => ({
  clearClientPersistence: vi.fn(),
  clearLegacyAuthStorage: vi.fn(),
}));

describe("applyActiveOrganization", () => {
  let dispatch;
  beforeEach(() => {
    dispatch = vi.fn();
  });

  it("should set the org id and update the profile when given an active org and profile", () => {
    const profile = { _id: "user-test-001", name: "Test User" };
    applyActiveOrganization(dispatch, profile, "org-test-001");

    expect(dispatch).toHaveBeenCalledWith(setCurrentOrgId("org-test-001"));
    // WHY: the active org must be mirrored onto the profile so API interceptors
    // and UI read a single, consistent org context.
    expect(dispatch).toHaveBeenCalledWith(
      UpdateUserProfile({ ...profile, activeOrganizationId: "org-test-001" }),
    );
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("should only set the org id when no profile object is supplied", () => {
    applyActiveOrganization(dispatch, null, "org-test-001");
    expect(dispatch).toHaveBeenCalledWith(setCurrentOrgId("org-test-001"));
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("should do nothing when there is no active organization id", () => {
    applyActiveOrganization(dispatch, { _id: "u" }, undefined);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
