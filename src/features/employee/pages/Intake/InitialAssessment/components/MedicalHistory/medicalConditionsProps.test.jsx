/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { buildMedicalConditionsProps } from "./medicalConditionsProps";

// MedicalConditionsSection is a 1400+ line component pulling in heavy IO/UI deps.
// buildMedicalConditionsProps only consumes the exported prop-key whitelist, so
// we mock the module to a controlled key array and avoid mounting the section.
const { mockKeys } = vi.hoisted(() => ({
  mockKeys: [
    "AllergiesYes",
    "AnxietyComment",
    "handleAddCondition",
    "canDelete",
  ],
}));

vi.mock("./MedicalConditionsSection", () => ({
  __esModule: true,
  MEDICAL_CONDITIONS_SECTION_PROP_KEYS: mockKeys,
  // default export stubbed so any incidental import resolves
  default: () => null,
}));

describe("buildMedicalConditionsProps", () => {
  beforeEach(() => vi.clearAllMocks());

  it("picks exactly the whitelisted keys from the scope", () => {
    const scope = {
      AllergiesYes: true,
      AnxietyComment: "anxious",
      handleAddCondition: () => "added",
      canDelete: false,
      // not in the whitelist -> must be dropped
      SecretField: "leak",
      DepressionYes: "yes",
    };

    const props = buildMedicalConditionsProps(scope);

    // WHY: result must contain only the four whitelisted keys, nothing else
    expect(Object.keys(props).sort()).toEqual([...mockKeys].sort());
    expect(props.AllergiesYes).toBe(true);
    expect(props.AnxietyComment).toBe("anxious");
    expect(props.canDelete).toBe(false);
    // WHY: function-valued props are passed through by reference
    expect(props.handleAddCondition).toBe(scope.handleAddCondition);
    // WHY: keys outside the whitelist are never copied over
    expect(props).not.toHaveProperty("SecretField");
    expect(props).not.toHaveProperty("DepressionYes");
  });

  it("assigns undefined for whitelisted keys missing from scope", () => {
    const props = buildMedicalConditionsProps({ AllergiesYes: 1 });

    // WHY: every whitelisted key is set even when absent, so the shape is stable
    expect(Object.keys(props).sort()).toEqual([...mockKeys].sort());
    expect(props.AllergiesYes).toBe(1);
    expect(props.AnxietyComment).toBeUndefined();
    expect("AnxietyComment" in props).toBe(true);
  });

  it("returns a fresh object that does not alias the source scope", () => {
    const scope = { AllergiesYes: "a" };
    const props = buildMedicalConditionsProps(scope);

    expect(props).not.toBe(scope);
    props.AllergiesYes = "mutated";
    // WHY: mutating the result must not write back into the caller's scope
    expect(scope.AllergiesYes).toBe("a");
  });
});
