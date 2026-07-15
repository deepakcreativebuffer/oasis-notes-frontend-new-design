/** @format */

import { describe, it, expect } from "vitest";
import { COMMON_APIS } from "./commonApis";

describe("COMMON_APIS", () => {
  it("exposes a non-empty endpoint map", () => {
    expect(COMMON_APIS).toBeTypeOf("object");
    expect(Object.keys(COMMON_APIS).length).toBeGreaterThan(0);
  });

  it("has string or function values for every endpoint", () => {
    Object.values(COMMON_APIS).forEach((v) =>
      expect(["string", "function"]).toContain(typeof v),
    );
  });
});
