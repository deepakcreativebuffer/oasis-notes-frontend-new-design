/** @format */

import { describe, it, expect } from "vitest";
import { buildQueryString, withPagination, joinPath } from "./queryBuilder";

describe("buildQueryString", () => {
  it("returns empty string for no params", () => {
    expect(buildQueryString()).toBe("");
    expect(buildQueryString({})).toBe("");
  });

  it("builds a leading-? query string and skips null/undefined/empty", () => {
    expect(
      buildQueryString({ a: 1, b: null, c: undefined, d: "", e: "x" }),
    ).toBe("?a=1&e=x");
  });
});

describe("withPagination", () => {
  it("appends pagination params to the base path", () => {
    expect(withPagination("/users", { page: 2, limit: 10 })).toBe(
      "/users?page=2&limit=10",
    );
  });

  it("returns the bare path when no params are given", () => {
    expect(withPagination("/users")).toBe("/users");
  });
});

describe("joinPath", () => {
  it("joins segments without duplicate slashes", () => {
    expect(joinPath("/api/", "/users/", "/1")).toBe("/api/users/1");
  });

  it("drops falsy segments", () => {
    expect(joinPath("api", "", null, "users")).toBe("api/users");
  });
});
