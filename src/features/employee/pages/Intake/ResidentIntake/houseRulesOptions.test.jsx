/** @format */

import { describe, it, expect } from "vitest";
import {
  houseRulesOptionValue,
  sanitizeHouseRuleText,
  sanitizeHouseRulesArray,
} from "./houseRulesOptions";

// This is a pure config/util module driving the Resident Intake house-rules
// picker. Tests assert the option shape (the select contract) and the legacy
// sanitizer behaviour that keeps saved records aligned with current wording
// without a DB migration.
describe("houseRulesOptions", () => {
  describe("houseRulesOptionValue", () => {
    it("should be a non-empty array of {label,value} options", () => {
      expect(Array.isArray(houseRulesOptionValue)).toBe(true);
      expect(houseRulesOptionValue.length).toBeGreaterThan(0);
      // WHY: react-select consumes {label,value}; both must be present strings.
      houseRulesOptionValue.forEach((opt) => {
        expect(opt).toHaveProperty("label");
        expect(opt).toHaveProperty("value");
        expect(typeof opt.label).toBe("string");
        expect(typeof opt.value).toBe("string");
      });
    });

    it("should use identical label and value for every option", () => {
      // WHY: the saved rule text IS the displayed text — label/value must match
      // so persisted selections render exactly as chosen.
      houseRulesOptionValue.forEach((opt) => {
        expect(opt.value).toBe(opt.label);
      });
    });

    it("should not carry legacy numeric prefixes in the displayed text", () => {
      // WHY: numbers ("1. ", "2. " …) were removed 2026-04-30; out-of-sequence
      // selections looked wrong when printed.
      houseRulesOptionValue.forEach((opt) => {
        expect(opt.label).not.toMatch(/^\s*\d+\.\s+/);
      });
    });

    it("should not reference legacy facility branding in option text", () => {
      // WHY: "DEVINE CARE LLC"/"Devine Care" was genericised to "Facility".
      houseRulesOptionValue.forEach((opt) => {
        expect(opt.label).not.toMatch(/DEVINE CARE LLC/);
        expect(opt.label).not.toMatch(/Devine Care/);
      });
    });

    it("should have unique values (no duplicate rules)", () => {
      const values = houseRulesOptionValue.map((o) => o.value);
      expect(new Set(values).size).toBe(values.length);
    });

    it("should include the no-pets rule and the sign-in/out rule", () => {
      const values = houseRulesOptionValue.map((o) => o.value);
      expect(values).toContain("No pets are allowed.");
      expect(
        values.some((v) =>
          v.startsWith("All residents are required to sign in and out"),
        ),
      ).toBe(true);
    });
  });

  describe("sanitizeHouseRuleText", () => {
    it("should strip a leading numeric prefix", () => {
      // WHY: legacy records saved with "5. " prefixes must render without them.
      expect(sanitizeHouseRuleText("5. Please show respect.")).toBe(
        "Please show respect.",
      );
      expect(sanitizeHouseRuleText("  12.  Keep room clean.")).toBe(
        "Keep room clean.",
      );
    });

    it("should replace DEVINE CARE LLC and Devine Care with Facility", () => {
      expect(
        sanitizeHouseRuleText("Smoking at DEVINE CARE LLC is banned."),
      ).toBe("Smoking at Facility is banned.");
      expect(sanitizeHouseRuleText("Welcome to Devine Care house.")).toBe(
        "Welcome to Facility house.",
      );
    });

    it("should replace all occurrences of the branding tokens", () => {
      expect(sanitizeHouseRuleText("Devine Care and Devine Care again.")).toBe(
        "Facility and Facility again.",
      );
    });

    it("should apply both branding and number-prefix sanitisation together", () => {
      expect(sanitizeHouseRuleText("3. Respect Devine Care staff.")).toBe(
        "Respect Facility staff.",
      );
    });

    it("should leave already-clean text unchanged", () => {
      const clean = "Please show respect and kindness towards other clients.";
      expect(sanitizeHouseRuleText(clean)).toBe(clean);
    });

    it("should not strip mid-string numbers like '8:00 AM'", () => {
      // WHY: only a LEADING "N. " is a legacy prefix; times/sequences mid-text stay.
      const txt = "Visitors leave by 10:00 PM. Rule 9. applies.";
      expect(sanitizeHouseRuleText(txt)).toBe(txt);
    });

    it("should return non-string input unchanged", () => {
      expect(sanitizeHouseRuleText(undefined)).toBeUndefined();
      expect(sanitizeHouseRuleText(null)).toBeNull();
      expect(sanitizeHouseRuleText(42)).toBe(42);
    });
  });

  describe("sanitizeHouseRulesArray", () => {
    it("should sanitise label and value of each rule object", () => {
      const input = [
        { label: "1. Devine Care rule.", value: "1. Devine Care rule." },
      ];
      const out = sanitizeHouseRulesArray(input);
      expect(out).toEqual([
        { label: "Facility rule.", value: "Facility rule." },
      ]);
    });

    it("should preserve extra keys on rule objects", () => {
      const out = sanitizeHouseRulesArray([
        { label: "2. Clean.", value: "2. Clean.", id: "rule-test-001" },
      ]);
      expect(out[0].id).toBe("rule-test-001");
      expect(out[0].label).toBe("Clean.");
    });

    it("should pass through non-object entries untouched", () => {
      const out = sanitizeHouseRulesArray(["3. raw", null, 7]);
      // WHY: array map only transforms object entries; primitives pass through.
      expect(out).toEqual(["3. raw", null, 7]);
    });

    it("should return non-array input unchanged", () => {
      expect(sanitizeHouseRulesArray(undefined)).toBeUndefined();
      expect(sanitizeHouseRulesArray("not-array")).toBe("not-array");
    });

    it("should produce already-clean canonical options as a no-op", () => {
      // WHY: current option list is already sanitised — round-tripping is stable.
      expect(sanitizeHouseRulesArray(houseRulesOptionValue)).toEqual(
        houseRulesOptionValue,
      );
    });
  });
});
