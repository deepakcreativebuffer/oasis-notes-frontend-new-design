/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { buildFamilyMentalHealthProps } from "./familyMentalHealthProps";
import { FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS } from "./FamilyMentalHealthSection";

// buildFamilyMentalHealthProps is a pure prop-picker: it copies exactly the keys
// the FamilyMentalHealthSection component consumes out of a larger scope object.
// Tests assert the pick contract (only known keys, by-reference copy, missing-safe).
describe("buildFamilyMentalHealthProps", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should export a function", () => {
    expect(typeof buildFamilyMentalHealthProps).toBe("function");
  });

  it("should pick exactly the section prop keys from the scope", () => {
    // WHY: build a scope where each known key maps to a unique sentinel value so we
    // can verify both that the key is copied and that the value is the same one.
    const scope = {};
    for (const key of FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS) {
      scope[key] = `value-${key}`;
    }
    // extra unrelated keys must NOT be copied through
    scope.unrelatedNoise = "should-not-appear";
    scope.MRN = "MRN-TEST-001";

    const result = buildFamilyMentalHealthProps(scope);

    expect(Object.keys(result).sort()).toEqual(
      [...FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS].sort(),
    );
    for (const key of FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS) {
      expect(result[key]).toBe(`value-${key}`);
    }
    expect(result).not.toHaveProperty("unrelatedNoise");
    expect(result).not.toHaveProperty("MRN");
  });

  it("should copy function references by identity (handlers stay callable)", () => {
    // WHY: the section relies on handler identity, so the picker must pass refs, not clones.
    const handler = vi.fn();
    const scope = {
      SignificantFamilyMedicalPsychiatricHistoryHandler: handler,
      handleRemoveItem: handler,
    };

    const result = buildFamilyMentalHealthProps(scope);

    expect(result.SignificantFamilyMedicalPsychiatricHistoryHandler).toBe(
      handler,
    );
    result.handleRemoveItem("x");
    expect(handler).toHaveBeenCalledWith("x");
  });

  it("should set missing keys to undefined while still defining every prop key", () => {
    // WHY: scope[key] of an absent key is undefined; the result must still contain
    // the key (so the component destructure is stable) rather than omit it.
    const result = buildFamilyMentalHealthProps({});

    expect(Object.keys(result).sort()).toEqual(
      [...FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS].sort(),
    );
    for (const key of FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS) {
      expect(result[key]).toBeUndefined();
    }
  });

  it("should return a fresh object (not the scope itself)", () => {
    const scope = { canDelete: true };
    const result = buildFamilyMentalHealthProps(scope);
    expect(result).not.toBe(scope);
    expect(result.canDelete).toBe(true);
  });
});
