/** @format */

import { describe, it, expect, vi } from "vitest";

import {
  createEmptyIndependentLivingRow,
  createDefaultIndependentLivingSkills,
  mapApiRowToIndependentLivingRow,
  loadIndependentLivingSkillsFromApi,
  independentLivingSkillsToLegacyFlat,
  buildIndependentLivingLegacyBindings,
  isIndependentLivingRowEmptyForPrint,
  isIndependentLivingSectionHiddenForPrint,
  EMPTY_OTHER_LIVING_SKILL_DRAFT,
  EMPTY_YES_NO_ROW_DRAFT,
  createDefaultYesNoRows,
  loadYesNoRowsFromApi,
  yesNoRowsToLegacyFlat,
  buildYesNoRowsLegacyBindings,
  isYesNoRowHiddenForPrint,
  isYesNoSectionHiddenForPrint,
} from "./dynamicFormState";
import {
  INDEPENDENT_LIVING_SKILLS_FIXED_ROWS,
  RISK_FACTORS_FIXED_ROWS,
  PROTECTIVE_FACTORS_FIXED_ROWS,
} from "../config/dynamicFormGroups";

// Pure transform module: import functions, drive representative + edge inputs,
// assert the exact shapes payloadMapper / view forms depend on.
describe("dynamicFormState - independent living skills", () => {
  describe("createEmptyIndependentLivingRow", () => {
    it("returns a row keyed by type with all booleans false and empty comments", () => {
      expect(createEmptyIndependentLivingRow("Bathing/Showering")).toEqual({
        type: "Bathing/Showering",
        good: false,
        fair: false,
        otherCurrentNotSoGood: false,
        needAssist: false,
        comments: "",
      });
    });
  });

  describe("createDefaultIndependentLivingSkills", () => {
    it("creates one empty row per fixed config entry, preserving type order", () => {
      const rows = createDefaultIndependentLivingSkills();
      expect(rows).toHaveLength(INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.length);
      expect(rows.map((r) => r.type)).toEqual(
        INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map((c) => c.type),
      );
      // every default row is empty
      expect(rows.every((r) => r.good === false && r.comments === "")).toBe(
        true,
      );
    });
  });

  describe("mapApiRowToIndependentLivingRow", () => {
    it("returns an empty row when apiRow is missing", () => {
      expect(mapApiRowToIndependentLivingRow("Mobility", undefined)).toEqual(
        createEmptyIndependentLivingRow("Mobility"),
      );
    });

    it("maps api fields onto the row and defaults comments to empty string", () => {
      const apiRow = {
        good: true,
        fair: false,
        otherCurrentNotSoGood: true,
        needAssist: false,
        // comments intentionally omitted -> "" via ??
      };
      expect(mapApiRowToIndependentLivingRow("Eating", apiRow)).toEqual({
        type: "Eating",
        good: true,
        fair: false,
        otherCurrentNotSoGood: true,
        needAssist: false,
        comments: "",
      });
    });

    it("preserves provided comments", () => {
      const row = mapApiRowToIndependentLivingRow("Eating", {
        good: false,
        comments: "needs help",
      });
      expect(row.comments).toBe("needs help");
    });
  });

  describe("loadIndependentLivingSkillsFromApi", () => {
    it("returns empty fixed rows and no extras when apiArray is undefined", () => {
      const { fixed, extras } = loadIndependentLivingSkillsFromApi(undefined);
      expect(fixed).toHaveLength(INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.length);
      expect(extras).toEqual([]);
      expect(fixed[0]).toEqual(
        createEmptyIndependentLivingRow(
          INDEPENDENT_LIVING_SKILLS_FIXED_ROWS[0].type,
        ),
      );
    });

    it("maps the first 10 api entries into fixed rows positionally", () => {
      const apiArray = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map((_, i) => ({
        good: i === 0,
        fair: false,
        otherCurrentNotSoGood: false,
        needAssist: false,
        comments: `c${i}`,
      }));
      const { fixed, extras } = loadIndependentLivingSkillsFromApi(apiArray);
      expect(fixed[0].good).toBe(true);
      expect(fixed[0].comments).toBe("c0");
      // exactly 10 fixed rows -> no extras
      expect(extras).toEqual([]);
    });

    it("returns api entries beyond index 10 as extras (custom rows)", () => {
      const base = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map(() => ({
        good: false,
      }));
      const extra = { type: "Custom skill", good: true, comments: "extra" };
      const apiArray = [...base, extra];
      const { fixed, extras } = loadIndependentLivingSkillsFromApi(apiArray);
      expect(fixed).toHaveLength(10);
      // WHY: getApiArrayData(10, len, arr) slices from index 10 onward
      expect(extras).toEqual([extra]);
    });
  });

  describe("independentLivingSkillsToLegacyFlat", () => {
    it("expands each fixed row into the legacy prefixed flat keys", () => {
      const rows = createDefaultIndependentLivingSkills();
      rows[0].good = true;
      rows[0].comments = "ok";
      const flat = independentLivingSkillsToLegacyFlat(rows);
      const prefix = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS[0].legacyPrefix;
      expect(flat[`${prefix}Good`]).toBe(true);
      expect(flat[`${prefix}Fair`]).toBe(false);
      expect(flat[`${prefix}NotSoGood`]).toBe(false);
      expect(flat[`${prefix}GoodNeedAssist`]).toBe(false);
      expect(flat[`${prefix}Comments`]).toBe("ok");
    });

    it("tolerates missing rows by treating them as empty objects", () => {
      // fewer rows than fixed config -> undefined rows fall back to {}
      const flat = independentLivingSkillsToLegacyFlat([]);
      const prefix = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS[0].legacyPrefix;
      expect(flat[`${prefix}Good`]).toBeUndefined();
      expect(flat[`${prefix}Comments`]).toBeUndefined();
    });
  });

  describe("buildIndependentLivingLegacyBindings", () => {
    it("includes flat values, the extras array, and a setter per field", () => {
      const rows = createDefaultIndependentLivingSkills();
      const extras = [{ type: "Custom" }];
      const updateFixedRow = vi.fn();
      const bindings = buildIndependentLivingLegacyBindings(
        rows,
        extras,
        updateFixedRow,
      );
      const prefix = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS[0].legacyPrefix;

      expect(bindings.handleRiskFactorActivityArray).toBe(extras);
      expect(typeof bindings[`set${prefix}Good`]).toBe("function");
      expect(typeof bindings[`set${prefix}Comments`]).toBe("function");
    });

    it("setters forward a plain value to updateFixedRow with the right field", () => {
      const rows = createDefaultIndependentLivingSkills();
      const updateFixedRow = vi.fn();
      const bindings = buildIndependentLivingLegacyBindings(
        rows,
        [],
        updateFixedRow,
      );
      const prefix = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS[0].legacyPrefix;

      bindings[`set${prefix}Good`](true);
      expect(updateFixedRow).toHaveBeenCalledWith(0, "good", true);

      bindings[`set${prefix}Comments`]("hello");
      expect(updateFixedRow).toHaveBeenCalledWith(0, "comments", "hello");
    });

    it("setters resolve functional updaters against the current row value", () => {
      const rows = createDefaultIndependentLivingSkills();
      rows[0].fair = false;
      const updateFixedRow = vi.fn();
      const bindings = buildIndependentLivingLegacyBindings(
        rows,
        [],
        updateFixedRow,
      );
      const prefix = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS[0].legacyPrefix;

      // functional updater receives current value and its result is forwarded
      bindings[`set${prefix}Fair`]((prev) => !prev);
      expect(updateFixedRow).toHaveBeenCalledWith(0, "fair", true);
    });
  });

  describe("isIndependentLivingRowEmptyForPrint", () => {
    it("is empty only when good/fair/otherCurrentNotSoGood are all undefined", () => {
      expect(isIndependentLivingRowEmptyForPrint({})).toBe(true);
      expect(isIndependentLivingRowEmptyForPrint(undefined)).toBe(true);
      expect(isIndependentLivingRowEmptyForPrint({ good: false })).toBe(false);
      expect(isIndependentLivingRowEmptyForPrint({ fair: true })).toBe(false);
    });
  });

  describe("isIndependentLivingSectionHiddenForPrint", () => {
    it("is hidden when all core rows are empty and there is no other draft type", () => {
      const rows = Array.from({ length: 10 }, () => ({}));
      expect(isIndependentLivingSectionHiddenForPrint(rows, "", false)).toBe(
        true,
      );
    });

    it("is visible when an other-draft type exists even if rows are empty", () => {
      const rows = Array.from({ length: 10 }, () => ({}));
      expect(
        isIndependentLivingSectionHiddenForPrint(rows, "Custom", false),
      ).toBe(false);
    });

    it("is visible when any core row has data", () => {
      const rows = Array.from({ length: 10 }, () => ({}));
      rows[2] = { good: true };
      expect(isIndependentLivingSectionHiddenForPrint(rows, "", true)).toBe(
        false,
      );
    });
  });
});

describe("dynamicFormState - yes/no rows", () => {
  describe("constant drafts", () => {
    it("EMPTY_OTHER_LIVING_SKILL_DRAFT is a blank living-skill row", () => {
      expect(EMPTY_OTHER_LIVING_SKILL_DRAFT).toEqual({
        type: "",
        good: false,
        fair: false,
        otherCurrentNotSoGood: false,
        needAssist: false,
        comments: "",
      });
    });

    it("EMPTY_YES_NO_ROW_DRAFT has undefined yesNo and empty comment", () => {
      expect(EMPTY_YES_NO_ROW_DRAFT).toEqual({
        type: "",
        yesNo: undefined,
        comment: "",
      });
    });
  });

  describe("createDefaultYesNoRows", () => {
    it("creates comment rows for comment-config and comments[] rows for dropdown-config", () => {
      const rows = createDefaultYesNoRows(RISK_FACTORS_FIXED_ROWS);
      expect(rows).toHaveLength(RISK_FACTORS_FIXED_ROWS.length);

      // index 0 uses legacyKeys.comment -> string comment field, yesNo null
      expect(rows[0]).toEqual({
        type: RISK_FACTORS_FIXED_ROWS[0].type,
        yesNo: null,
        comment: "",
      });

      // "Behavior cues" (index 6) uses legacyKeys.comments -> comments array
      expect(rows[6]).toEqual({
        type: RISK_FACTORS_FIXED_ROWS[6].type,
        yesNo: null,
        comments: [],
      });
    });

    it("works for protective factors (all comment-based)", () => {
      const rows = createDefaultYesNoRows(PROTECTIVE_FACTORS_FIXED_ROWS);
      expect(rows.every((r) => r.comment === "" && r.yesNo === null)).toBe(
        true,
      );
    });
  });

  describe("loadYesNoRowsFromApi", () => {
    it("returns null yesNo + empty fields when apiArray is undefined", () => {
      const { fixed, extras } = loadYesNoRowsFromApi(
        RISK_FACTORS_FIXED_ROWS,
        12,
        undefined,
      );
      expect(fixed).toHaveLength(RISK_FACTORS_FIXED_ROWS.length);
      expect(fixed[0].yesNo).toBeNull();
      expect(fixed[0].comment).toBe("");
      expect(extras).toEqual([]);
    });

    it("maps yesNo and comment from the api row", () => {
      const apiArray = [{ yesNo: "Yes", comment: "ideation present" }];
      const { fixed } = loadYesNoRowsFromApi(
        RISK_FACTORS_FIXED_ROWS,
        12,
        apiArray,
      );
      expect(fixed[0].yesNo).toBe("Yes");
      expect(fixed[0].comment).toBe("ideation present");
    });

    it("maps comments string arrays into {label,value} option objects", () => {
      const apiArray = new Array(7).fill(null);
      // index 6 is the Behavior cues dropdown config
      apiArray[6] = { yesNo: "No", comments: ["cue-a", "cue-b"] };
      const { fixed } = loadYesNoRowsFromApi(
        RISK_FACTORS_FIXED_ROWS,
        12,
        apiArray,
      );
      expect(fixed[6].comments).toEqual([
        { label: "cue-a", value: "cue-a" },
        { label: "cue-b", value: "cue-b" },
      ]);
    });

    it("returns api entries past fixedCount as extras", () => {
      const apiArray = new Array(12).fill({ yesNo: null });
      const extraRow = { yesNo: "Yes", comment: "custom risk" };
      apiArray.push(extraRow);
      const { fixed, extras } = loadYesNoRowsFromApi(
        RISK_FACTORS_FIXED_ROWS,
        12,
        apiArray,
      );
      expect(fixed).toHaveLength(RISK_FACTORS_FIXED_ROWS.length);
      expect(extras).toEqual([extraRow]);
    });
  });

  describe("yesNoRowsToLegacyFlat", () => {
    it("writes yesNo and comment legacy keys for comment-config rows", () => {
      const rows = createDefaultYesNoRows(RISK_FACTORS_FIXED_ROWS);
      rows[0].yesNo = "Yes";
      rows[0].comment = "note";
      const flat = yesNoRowsToLegacyFlat(RISK_FACTORS_FIXED_ROWS, rows);
      const cfg = RISK_FACTORS_FIXED_ROWS[0];
      expect(flat[cfg.legacyKeys.yesNo]).toBe("Yes");
      expect(flat[cfg.legacyKeys.comment]).toBe("note");
    });

    it("writes the comments legacy key for dropdown-config rows", () => {
      const rows = createDefaultYesNoRows(RISK_FACTORS_FIXED_ROWS);
      rows[6].comments = [{ label: "x", value: "x" }];
      const flat = yesNoRowsToLegacyFlat(RISK_FACTORS_FIXED_ROWS, rows);
      const cfg = RISK_FACTORS_FIXED_ROWS[6];
      expect(flat[cfg.legacyKeys.comments]).toEqual([
        { label: "x", value: "x" },
      ]);
    });

    it("defaults missing comment/comments to empty primitives", () => {
      // pass empty rows array so each row is {} -> defaults kick in
      const flat = yesNoRowsToLegacyFlat(RISK_FACTORS_FIXED_ROWS, []);
      expect(flat[RISK_FACTORS_FIXED_ROWS[0].legacyKeys.comment]).toBe("");
      expect(flat[RISK_FACTORS_FIXED_ROWS[6].legacyKeys.comments]).toEqual([]);
    });
  });

  describe("buildYesNoRowsLegacyBindings", () => {
    it("includes flat values, the extras under extraArrayKey, and setters", () => {
      const rows = createDefaultYesNoRows(RISK_FACTORS_FIXED_ROWS);
      const extras = [{ type: "Custom" }];
      const updateFixedRow = vi.fn();
      const bindings = buildYesNoRowsLegacyBindings(
        RISK_FACTORS_FIXED_ROWS,
        rows,
        extras,
        updateFixedRow,
        "riskFactorsExtras",
      );

      expect(bindings.riskFactorsExtras).toBe(extras);
      const cfg = RISK_FACTORS_FIXED_ROWS[0];
      expect(typeof bindings[cfg.setters.yesNo]).toBe("function");
      expect(typeof bindings[cfg.setters.comment]).toBe("function");
    });

    it("yesNo setter forwards value to updateFixedRow at the row index", () => {
      const rows = createDefaultYesNoRows(RISK_FACTORS_FIXED_ROWS);
      const updateFixedRow = vi.fn();
      const bindings = buildYesNoRowsLegacyBindings(
        RISK_FACTORS_FIXED_ROWS,
        rows,
        [],
        updateFixedRow,
        "extras",
      );
      bindings[RISK_FACTORS_FIXED_ROWS[0].setters.yesNo]("Yes");
      expect(updateFixedRow).toHaveBeenCalledWith(0, "yesNo", "Yes");
    });

    it("comments setter exists only for dropdown-config rows and updates comments", () => {
      const rows = createDefaultYesNoRows(RISK_FACTORS_FIXED_ROWS);
      const updateFixedRow = vi.fn();
      const bindings = buildYesNoRowsLegacyBindings(
        RISK_FACTORS_FIXED_ROWS,
        rows,
        [],
        updateFixedRow,
        "extras",
      );
      const dropdownCfg = RISK_FACTORS_FIXED_ROWS[6];
      const options = [{ label: "x", value: "x" }];
      bindings[dropdownCfg.setters.comments](options);
      expect(updateFixedRow).toHaveBeenCalledWith(6, "comments", options);
    });

    it("setter resolves a functional updater against the current value", () => {
      const rows = createDefaultYesNoRows(RISK_FACTORS_FIXED_ROWS);
      rows[0].comment = "old";
      const updateFixedRow = vi.fn();
      const bindings = buildYesNoRowsLegacyBindings(
        RISK_FACTORS_FIXED_ROWS,
        rows,
        [],
        updateFixedRow,
        "extras",
      );
      bindings[RISK_FACTORS_FIXED_ROWS[0].setters.comment](
        (prev) => `${prev}+new`,
      );
      expect(updateFixedRow).toHaveBeenCalledWith(0, "comment", "old+new");
    });
  });

  describe("isYesNoRowHiddenForPrint / isYesNoSectionHiddenForPrint", () => {
    it("a row is hidden only when yesNo is undefined", () => {
      expect(isYesNoRowHiddenForPrint({})).toBe(true);
      expect(isYesNoRowHiddenForPrint({ yesNo: undefined })).toBe(true);
      expect(isYesNoRowHiddenForPrint({ yesNo: null })).toBe(false);
      expect(isYesNoRowHiddenForPrint({ yesNo: "Yes" })).toBe(false);
    });

    it("section is hidden when every row is hidden and other draft yesNo is undefined", () => {
      const rows = [{}, {}, {}];
      expect(isYesNoSectionHiddenForPrint(rows, undefined)).toBe(true);
    });

    it("section is visible when other draft yesNo is set", () => {
      const rows = [{}, {}];
      expect(isYesNoSectionHiddenForPrint(rows, "Yes")).toBe(false);
    });

    it("section is visible when any row has a yesNo value", () => {
      const rows = [{}, { yesNo: "No" }];
      expect(isYesNoSectionHiddenForPrint(rows, undefined)).toBe(false);
    });
  });
});
