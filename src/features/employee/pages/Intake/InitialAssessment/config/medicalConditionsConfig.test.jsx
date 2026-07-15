/** @format */

import { describe, it, expect } from "vitest";
import {
  MEDICAL_CONDITIONS_FIXED_ROWS,
  MEDICAL_CONDITIONS_FIXED_COUNT,
} from "./medicalConditionsConfig";

// This config is the legacy-key contract consumed by payloadMapper. The row
// order, legacyKeys, and setters must stay stable or saved assessments break.
describe("medicalConditionsConfig", () => {
  it("should export a non-empty array of fixed condition rows", () => {
    expect(Array.isArray(MEDICAL_CONDITIONS_FIXED_ROWS)).toBe(true);
    expect(MEDICAL_CONDITIONS_FIXED_ROWS.length).toBeGreaterThan(0);
  });

  it("should keep MEDICAL_CONDITIONS_FIXED_COUNT in sync with the rows length", () => {
    // WHY: count is derived from the array; guard against it drifting out of sync.
    expect(MEDICAL_CONDITIONS_FIXED_COUNT).toBe(
      MEDICAL_CONDITIONS_FIXED_ROWS.length,
    );
    // WHY: current contract is exactly 26 rows (indices 0–25).
    expect(MEDICAL_CONDITIONS_FIXED_COUNT).toBe(26);
  });

  it("should give every row a non-empty condition label", () => {
    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((row) => {
      expect(typeof row.condition).toBe("string");
      expect(row.condition.length).toBeGreaterThan(0);
    });
  });

  it("should give every row legacyKeys and setters objects with a yesNo key", () => {
    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((row) => {
      expect(row.legacyKeys).toBeTypeOf("object");
      expect(row.setters).toBeTypeOf("object");
      expect(typeof row.legacyKeys.yesNo).toBe("string");
      expect(typeof row.setters.yesNo).toBe("string");
    });
  });

  it("should pair a comment key with a comment setter and a comments key with a comments setter", () => {
    // WHY: standard rows use legacyKeys.comment, multiselect rows use .comments;
    // each present key must have a matching setter of the same kind.
    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((row) => {
      if ("comment" in row.legacyKeys) {
        expect(typeof row.legacyKeys.comment).toBe("string");
        expect(typeof row.setters.comment).toBe("string");
      }
      if ("comments" in row.legacyKeys) {
        expect(typeof row.legacyKeys.comments).toBe("string");
        expect(typeof row.setters.comments).toBe("string");
      }
    });
  });

  it("should mark Thyroid disorder and Infection rows as multiselect with comments keys", () => {
    const multiselectRows = MEDICAL_CONDITIONS_FIXED_ROWS.filter(
      (row) => row.fieldType === "multiselect",
    );
    // WHY: exactly the two known multiselect conditions opt into the comments shape.
    expect(multiselectRows.map((r) => r.condition)).toEqual([
      "Thyroid disorder",
      "Infection or Diseases",
    ]);
    multiselectRows.forEach((row) => {
      expect(row.legacyKeys).toHaveProperty("comments");
      expect(row.setters).toHaveProperty("comments");
    });
  });

  it("should keep the first and last condition labels stable (payloadMapper order)", () => {
    // WHY: index 0 and index 25 anchor the otherConditionArrayTemp ordering.
    expect(MEDICAL_CONDITIONS_FIXED_ROWS[0].condition).toBe("diabetes");
    expect(MEDICAL_CONDITIONS_FIXED_ROWS[0].legacyKeys.yesNo).toBe(
      "yesDiabetes",
    );
    expect(MEDICAL_CONDITIONS_FIXED_ROWS[25].condition).toBe(
      "Infection or Diseases",
    );
    expect(MEDICAL_CONDITIONS_FIXED_ROWS[25].legacyKeys.yesNo).toBe(
      "InfectionYes",
    );
  });

  it("should use unique yesNo legacy keys across all rows", () => {
    // WHY: duplicate yesNo keys would collide when mapping form state to payload.
    const yesNoKeys = MEDICAL_CONDITIONS_FIXED_ROWS.map(
      (r) => r.legacyKeys.yesNo,
    );
    expect(new Set(yesNoKeys).size).toBe(yesNoKeys.length);
  });

  it("should prefix every setter name with 'set'", () => {
    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((row) => {
      Object.values(row.setters).forEach((setterName) => {
        expect(setterName.startsWith("set")).toBe(true);
      });
    });
  });
});
