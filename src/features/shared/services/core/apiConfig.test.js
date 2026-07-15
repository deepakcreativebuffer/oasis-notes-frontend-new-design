/** @format */

import { describe, it, expect } from "vitest";
import { getApiVersionPrefix, versionedPath } from "./apiConfig";

// REACT_APP_API_VERSION is unset in the test env, so versioning is disabled.
describe("apiConfig", () => {
  it("returns an empty prefix when no API version is configured", () => {
    expect(getApiVersionPrefix()).toBe("");
  });

  it("leaves the path unchanged when versioning is off", () => {
    expect(versionedPath("users/1")).toBe("users/1");
  });
});
