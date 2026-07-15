/** @format */

import { describe, it, expect } from "vitest";
import {
  INDEPENDENT_LIVING_SKILLS_FIXED_ROWS,
  INDEPENDENT_LIVING_SKILL_FIELDS,
  RISK_FACTORS_FIXED_ROWS,
  PROTECTIVE_FACTORS_FIXED_ROWS,
  DYNAMIC_FORM_GROUPS,
} from "./dynamicFormGroups";

// Pure config module: this schema is the payloadMapper contract for the
// InitialAssessment dynamic form sections. Assert export shape/values so a
// drift in row order, counts, or legacy key/setter names is caught.
describe("dynamicFormGroups", () => {
  describe("INDEPENDENT_LIVING_SKILLS_FIXED_ROWS", () => {
    it("should list the 10 fixed independent-living rows in order", () => {
      expect(INDEPENDENT_LIVING_SKILLS_FIXED_ROWS).toHaveLength(10);
      expect(INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map((r) => r.type)).toEqual([
        "Bathing/Showering",
        "Grooming/hygiene",
        "Mobility",
        "Housework",
        "Shopping",
        "Managing money/budget",
        "Preparing food",
        "Eating",
        "Toileting",
        "Taking medications",
      ]);
    });

    it("should give every row a legacyPrefix for payloadMapper compatibility", () => {
      // WHY: each fixed row maps to a flat variable prefix; a missing prefix
      // would silently drop the field from the legacy payload.
      INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.forEach((row) => {
        expect(typeof row.legacyPrefix).toBe("string");
        expect(row.legacyPrefix.length).toBeGreaterThan(0);
      });
    });

    it("should flag only 'Taking medications' as requiring independent10", () => {
      // WHY: requiresIndependent10 is the special-case branch; it must apply to
      // exactly the medications row.
      const flagged = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.filter(
        (r) => r.requiresIndependent10,
      );
      expect(flagged).toHaveLength(1);
      expect(flagged[0].type).toBe("Taking medications");
    });
  });

  describe("INDEPENDENT_LIVING_SKILL_FIELDS", () => {
    it("should expose the per-skill field columns", () => {
      expect(INDEPENDENT_LIVING_SKILL_FIELDS).toEqual([
        "good",
        "fair",
        "otherCurrentNotSoGood",
        "needAssist",
        "comments",
      ]);
    });
  });

  describe("RISK_FACTORS_FIXED_ROWS", () => {
    it("should list 12 risk-factor rows each with a type and setters", () => {
      expect(RISK_FACTORS_FIXED_ROWS).toHaveLength(12);
      RISK_FACTORS_FIXED_ROWS.forEach((row) => {
        expect(typeof row.type).toBe("string");
        expect(row.legacyKeys).toBeTruthy();
        expect(row.setters).toBeTruthy();
        // yesNo legacy key + setter are always present
        expect(typeof row.legacyKeys.yesNo).toBe("string");
        expect(typeof row.setters.yesNo).toBe("string");
      });
    });

    it("should pair each setter name with the conventional set-prefix", () => {
      // WHY: the form context exposes setters as set<Field>; an inconsistent
      // name here breaks controlled updates for that row.
      const substance = RISK_FACTORS_FIXED_ROWS.find(
        (r) => r.type === "Substance abuse",
      );
      expect(substance.legacyKeys).toEqual({
        yesNo: "SubstanceYesNo",
        comment: "SubstanceAbuseComment",
      });
      expect(substance.setters).toEqual({
        yesNo: "setSubstanceYesNo",
        comment: "setSubstanceCommentAbuse",
      });
    });

    it("should use a 'comments' dropdown key for the cue/psychosis rows", () => {
      // WHY: these two rows use `comments` (dropdown) rather than `comment`.
      const behaviorCues = RISK_FACTORS_FIXED_ROWS.find(
        (r) => r.type === "Behavior cues",
      );
      expect(behaviorCues.legacyKeys.comments).toBe("behaviorcuesDropDown");
      expect(behaviorCues.setters.comments).toBe("setBehaviorcuesDropDown");
      expect(behaviorCues.legacyKeys.comment).toBeUndefined();
    });
  });

  describe("PROTECTIVE_FACTORS_FIXED_ROWS", () => {
    it("should list 6 protective-factor rows with yesNo/comment keys", () => {
      expect(PROTECTIVE_FACTORS_FIXED_ROWS).toHaveLength(6);
      PROTECTIVE_FACTORS_FIXED_ROWS.forEach((row) => {
        expect(typeof row.type).toBe("string");
        expect(typeof row.legacyKeys.yesNo).toBe("string");
        expect(typeof row.legacyKeys.comment).toBe("string");
        expect(typeof row.setters.yesNo).toBe("string");
        expect(typeof row.setters.comment).toBe("string");
      });
    });
  });

  describe("DYNAMIC_FORM_GROUPS", () => {
    it("should describe each section's apiKey, fixedCount and fixedRows", () => {
      expect(Object.keys(DYNAMIC_FORM_GROUPS)).toEqual([
        "independentLivingSkills",
        "riskFactors",
        "protectiveFactors",
      ]);

      expect(DYNAMIC_FORM_GROUPS.independentLivingSkills).toMatchObject({
        apiKey: "independentLivingSkills",
        fixedCount: 10,
        fixedRows: INDEPENDENT_LIVING_SKILLS_FIXED_ROWS,
        fields: INDEPENDENT_LIVING_SKILL_FIELDS,
      });
      expect(DYNAMIC_FORM_GROUPS.riskFactors).toMatchObject({
        apiKey: "riskFactors",
        fixedCount: 12,
        fixedRows: RISK_FACTORS_FIXED_ROWS,
      });
      expect(DYNAMIC_FORM_GROUPS.protectiveFactors).toMatchObject({
        apiKey: "protectiveFactors",
        fixedCount: 6,
        fixedRows: PROTECTIVE_FACTORS_FIXED_ROWS,
      });
    });

    it("should keep fixedCount in sync with the referenced fixedRows length", () => {
      // WHY: fixedCount drives how many rows are treated as non-removable;
      // a mismatch with the actual rows array would corrupt the dynamic rows.
      Object.values(DYNAMIC_FORM_GROUPS).forEach((group) => {
        expect(group.fixedCount).toBe(group.fixedRows.length);
      });
    });
  });
});
