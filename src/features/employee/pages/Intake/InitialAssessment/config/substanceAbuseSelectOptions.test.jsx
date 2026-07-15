/** @format */

import { describe, it, expect } from "vitest";
import {
  SUBSTANCE_LAST_USE_OPTIONS,
  SUBSTANCE_FREQUENCY_OPTIONS,
  SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
  SUBSTANCE_FIELD_OPTIONS,
} from "./substanceAbuseSelectOptions";

// These option lists feed react-select dropdowns on the Initial Assessment
// substance-abuse section; each must be a stable {label,value} array so the
// stored intake value matches the visible label exactly.
describe("substanceAbuseSelectOptions", () => {
  const allLists = [
    ["SUBSTANCE_LAST_USE_OPTIONS", SUBSTANCE_LAST_USE_OPTIONS],
    ["SUBSTANCE_FREQUENCY_OPTIONS", SUBSTANCE_FREQUENCY_OPTIONS],
    [
      "SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS",
      SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
    ],
  ];

  it.each(allLists)(
    "%s is a non-empty array of {label,value} pairs where label === value",
    (_name, list) => {
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
      // WHY: react-select persists `value`; mismatched label/value would store
      // a value the clinician never saw.
      list.forEach((opt) => {
        expect(Object.keys(opt).sort()).toEqual(["label", "value"]);
        expect(typeof opt.label).toBe("string");
        expect(opt.label).toBe(opt.value);
      });
    },
  );

  it("exposes the exact last-use options in order", () => {
    expect(SUBSTANCE_LAST_USE_OPTIONS.map((o) => o.value)).toEqual([
      "Weeks ago",
      "Days ago",
      "Yesterday",
      "Months ago",
      "Few hours ago",
      "Unsure",
    ]);
  });

  it("exposes the exact frequency options in order", () => {
    expect(SUBSTANCE_FREQUENCY_OPTIONS.map((o) => o.value)).toEqual([
      "Daily",
      "Two to four times weekly",
      "Multiple times a day",
      "Chronic",
      "Intermittent",
      "Only on social events",
      "Only on weekends",
      "Few times a month",
    ]);
  });

  it("exposes the exact length-of-sobriety options in order", () => {
    expect(SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS.map((o) => o.value)).toEqual([
      "One week",
      "A few days ago",
      "One month",
      "Two months",
      "Three months",
      "Four months",
      "Five to Six months",
      "One year",
      "Two years",
      "Many years",
    ]);
  });

  it("maps SUBSTANCE_FIELD_OPTIONS field keys to their corresponding option arrays", () => {
    // WHY: the section renders a select per intake field by looking up this map;
    // a wrong reference would show the wrong dropdown.
    expect(SUBSTANCE_FIELD_OPTIONS).toEqual({
      lastUse: SUBSTANCE_LAST_USE_OPTIONS,
      frequency: SUBSTANCE_FREQUENCY_OPTIONS,
      lengthOfSobriety: SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
    });
    expect(Object.keys(SUBSTANCE_FIELD_OPTIONS)).toEqual([
      "lastUse",
      "frequency",
      "lengthOfSobriety",
    ]);
  });

  it("has no duplicate values within any single option list", () => {
    // WHY: duplicate values in a select break controlled-value matching.
    allLists.forEach(([, list]) => {
      const values = list.map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
    });
  });
});
