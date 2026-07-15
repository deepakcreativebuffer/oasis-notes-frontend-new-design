/** @format */

import { describe, it, expect } from "vitest";
import { QUALITIES_OPTIONS } from "./assessmentFields";

// Pure config module: QUALITIES_OPTIONS feeds a multi-select, so the shape
// ({ label, value }) and self-equal label/value contract are the load-bearing
// guarantees the select relies on.
describe("assessmentFields", () => {
  it("should export QUALITIES_OPTIONS as a non-empty array", () => {
    expect(Array.isArray(QUALITIES_OPTIONS)).toBe(true);
    expect(QUALITIES_OPTIONS.length).toBeGreaterThan(0);
  });

  it("should shape every option as { label, value } strings", () => {
    QUALITIES_OPTIONS.forEach((opt) => {
      expect(opt).toHaveProperty("label");
      expect(opt).toHaveProperty("value");
      expect(typeof opt.label).toBe("string");
      expect(typeof opt.value).toBe("string");
    });
  });

  it("should keep label equal to value for each option", () => {
    // WHY: the select stores the value verbatim; mismatched label/value would
    // persist a different string than the user sees.
    QUALITIES_OPTIONS.forEach((opt) => {
      expect(opt.label).toBe(opt.value);
    });
  });

  it("should contain expected representative qualities", () => {
    const values = QUALITIES_OPTIONS.map((o) => o.value);
    expect(values).toContain("Self motivated");
    expect(values).toContain("Communication");
    expect(values).toContain("Team work");
  });

  it("should not contain duplicate values", () => {
    const values = QUALITIES_OPTIONS.map((o) => o.value);
    expect(new Set(values).size).toBe(values.length);
  });
});
