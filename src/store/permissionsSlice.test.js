/** @format */

import { describe, it, expect } from "vitest";
import reducer, { setPermissions, selectPermissions } from "./permissionsSlice";

describe("permissionsSlice", () => {
  it("should return the initial state with null permissions", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual({
      permissions: null,
    });
  });

  it("should set the permissions payload", () => {
    const perms = { canViewChart: true, canEditMeds: false };
    const state = reducer({ permissions: null }, setPermissions(perms));
    // WHY: RBAC permissions gate access to clinical actions; the slice stores
    // them verbatim for downstream guards to read.
    expect(state.permissions).toEqual(perms);
  });

  it("should select the permissions", () => {
    const root = { permissions: { permissions: { canViewChart: true } } };
    expect(selectPermissions(root)).toEqual({ canViewChart: true });
  });
});
