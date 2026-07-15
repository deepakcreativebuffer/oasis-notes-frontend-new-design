/** @format */

import { describe, it, expect } from "vitest";
import * as options from "./initialAssessmentSelectOptions";

// Pure config module: these option arrays are consumed by react-select dropdowns
// across the InitialAssessment form, so the {label,value} contract and the set of
// allowed values are load-bearing. We assert export shape, not rendering.

// Every export in this module is expected to be an array of select options.
const ALL_EXPORT_NAMES = [
  "ADMISSION_STATUS_OPTIONS",
  "REASON_FOR_ADMISSION_OPTIONS",
  "THYROID_DISORDER_OPTIONS",
  "INFECTION_DISEASES_OPTIONS",
  "FAMILY_MENTAL_HEALTH_RELATION_OPTIONS",
  "MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS",
  "MENTAL_HEALTH_TREATMENT_DIAGNOSIS_REASON_OPTIONS",
  "LEGAL_SYSTEM_INTERACTION_OPTIONS",
  "MEDICAL_EQUIPMENT_OPTIONS",
  "SPECIAL_PRECAUTIONS_OPTIONS",
  "RISK_FACTORS_COMMENTS_OPTIONS",
  "RISK_FACTORS_BEHAVIOR_OPTIONS",
  "RISK_FACTORS_SYMPTOMS_OPTIONS",
];

describe("initialAssessmentSelectOptions", () => {
  it("exports exactly the expected named option arrays", () => {
    // WHY: lock the public surface so a rename/removal breaks the test loudly.
    expect(Object.keys(options).sort()).toEqual([...ALL_EXPORT_NAMES].sort());
  });

  describe.each(ALL_EXPORT_NAMES)("%s", (name) => {
    it("is a non-empty array of { label, value } objects", () => {
      const list = options[name];
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
      list.forEach((opt) => {
        expect(opt).toEqual(
          expect.objectContaining({
            label: expect.any(String),
            value: expect.any(String),
          }),
        );
        // WHY: select components key off `value`; empty strings would be unselectable.
        expect(opt.value).not.toBe("");
        expect(opt.label).not.toBe("");
      });
    });

    it("has unique values (no duplicate option keys)", () => {
      const values = options[name].map((o) => o.value);
      // WHY: duplicate values in react-select cause ambiguous selection state.
      expect(new Set(values).size).toBe(values.length);
    });

    it("uses label === value for every option (mirrored config)", () => {
      // WHY: this module intentionally mirrors label/value; guards accidental drift.
      options[name].forEach((opt) => expect(opt.label).toBe(opt.value));
    });
  });

  it("ADMISSION_STATUS_OPTIONS contains the two known admission types", () => {
    expect(options.ADMISSION_STATUS_OPTIONS).toEqual([
      { label: "Voluntary", value: "Voluntary" },
      { label: "Court Ordered Treatment", value: "Court Ordered Treatment" },
    ]);
  });

  it("THYROID_DISORDER_OPTIONS offers hypo/hyperthyroidism", () => {
    const values = options.THYROID_DISORDER_OPTIONS.map((o) => o.value);
    expect(values).toEqual(["Hypothyroidism", "Hyperthyroidism"]);
  });

  it("MEDICAL_EQUIPMENT_OPTIONS and SPECIAL_PRECAUTIONS_OPTIONS include a None opt-out", () => {
    // WHY: these multi-selects allow an explicit "None" rather than empty selection.
    expect(
      options.MEDICAL_EQUIPMENT_OPTIONS.some((o) => o.value === "None"),
    ).toBe(true);
    expect(
      options.SPECIAL_PRECAUTIONS_OPTIONS.some((o) => o.value === "None"),
    ).toBe(true);
  });

  it("MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS lists the level-of-care codes", () => {
    const values = options.MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS.map(
      (o) => o.value,
    );
    expect(values).toEqual(["BHRF", "IP", "OP", "PHP", "IOP"]);
  });

  it("REASON_FOR_ADMISSION_OPTIONS covers common presenting concerns", () => {
    const values = options.REASON_FOR_ADMISSION_OPTIONS.map((o) => o.value);
    expect(values).toContain("Anxiety");
    expect(values).toContain("Depression");
    expect(values).toContain("Danger to self");
    expect(values).toContain("Danger to others");
  });

  it("RISK_FACTORS_SYMPTOMS_OPTIONS enumerates hallucination modalities", () => {
    const values = options.RISK_FACTORS_SYMPTOMS_OPTIONS.map((o) => o.value);
    expect(values).toEqual([
      "Auditory Hallucination",
      "Visual Hallucination",
      "Tactile Hallucination",
      "Olfactory Hallucination",
    ]);
  });
});
