/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  resolveRoleEndpoint,
  createForRole,
  updateForRole,
  postForRole,
} from "./roleAware";

const h = vi.hoisted(() => ({
  createApi: vi.fn(),
  updateApi: vi.fn(),
  postApi: vi.fn(),
}));

// Underlying API helpers are IO; stub them so we only assert routing logic.
vi.mock("../common/common.api", () => ({
  createApi: h.createApi,
  updateApi: h.updateApi,
  postApi: h.postApi,
}));

describe("resolveRoleEndpoint", () => {
  it("picks the admin endpoint when isAdmin is true", () => {
    expect(resolveRoleEndpoint(true, "/admin", "/emp")).toBe("/admin");
  });
  it("picks the employee endpoint otherwise", () => {
    expect(resolveRoleEndpoint(false, "/admin", "/emp")).toBe("/emp");
  });
});

describe("role-aware request helpers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("createForRole posts to the resolved url via createApi", () => {
    createForRole(true, "/admin", "/emp", { a: 1 }, { setLoading: vi.fn() });
    expect(h.createApi).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/admin", payload: { a: 1 } }),
    );
  });

  it("updateForRole routes to the employee url via updateApi", () => {
    updateForRole(false, "/admin", "/emp", { b: 2 });
    expect(h.updateApi).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/emp", payload: { b: 2 } }),
    );
  });

  it("postForRole forwards setLoading, url, payload and navigate to postApi", () => {
    const setLoading = vi.fn();
    const navigate = vi.fn();
    postForRole(true, "/admin", "/emp", { c: 3 }, { setLoading, navigate });
    expect(h.postApi).toHaveBeenCalledWith(
      setLoading,
      "/admin",
      { c: 3 },
      navigate,
    );
  });
});
