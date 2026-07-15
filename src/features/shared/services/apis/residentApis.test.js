/** @format */

import { describe, it, expect } from "vitest";
import { RESIDENT_APIS } from "./residentApis";

describe("RESIDENT_APIS", () => {
  it("exposes a non-empty endpoint map", () => {
    expect(RESIDENT_APIS).toBeTypeOf("object");
    expect(Object.keys(RESIDENT_APIS).length).toBeGreaterThan(0);
  });

  it("has string or function values for every endpoint", () => {
    Object.values(RESIDENT_APIS).forEach((v) =>
      expect(["string", "function"]).toContain(typeof v),
    );
  });
});
