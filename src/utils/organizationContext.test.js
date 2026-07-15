/** @format */

import { describe, it, expect } from "vitest";
import { pickActiveOrganizationId } from "./organizationContext";

const ORGS = [{ _id: "org-1" }, { _id: "org-2" }];

describe("pickActiveOrganizationId", () => {
  it("should return null when the profile has no organizations", () => {
    expect(pickActiveOrganizationId({ organizations: [] })).toBeNull();
    expect(pickActiveOrganizationId({})).toBeNull();
    expect(pickActiveOrganizationId(null)).toBeNull();
  });

  it("should honor the saved active org when the user is a member", () => {
    expect(
      pickActiveOrganizationId({
        organizations: ORGS,
        activeOrganizationId: "org-2",
      }),
    ).toBe("org-2");
  });

  it("should fall back to the first org when the saved active org is not a member", () => {
    // WHY: a stale/invalid preferred org must not scope API calls to an org the
    // user no longer belongs to; default to a valid enrolled org.
    expect(
      pickActiveOrganizationId({
        organizations: ORGS,
        activeOrganizationId: "org-999",
      }),
    ).toBe("org-1");
  });

  it("should fall back to the first org when no preference is set", () => {
    expect(pickActiveOrganizationId({ organizations: ORGS })).toBe("org-1");
  });
});
