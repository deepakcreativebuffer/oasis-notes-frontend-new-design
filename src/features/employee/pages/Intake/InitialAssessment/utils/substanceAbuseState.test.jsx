/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createDefaultSubstanceAbuseRows,
  mapApiRowToSubstanceRow,
  loadSubstanceAbuseFromApi,
  attachSubstanceAbuseSetters,
  substanceAbuseToLegacyFlat,
} from "./substanceAbuseState";
import {
  SUBSTANCE_ABUSE_FIXED_ROWS,
  SUBSTANCE_ABUSE_FIXED_COUNT,
} from "../config/substanceAbuseConfig";

// Pure state-mapping helpers for the Initial Assessment substance-abuse grid.
// These translate between the API row shape, react-select option objects, and
// the legacy flat field names the EHR form historically used.
describe("substanceAbuseState", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("createDefaultSubstanceAbuseRows", () => {
    it("should create one empty row per fixed substance, preserving order", () => {
      const rows = createDefaultSubstanceAbuseRows();
      // WHY: the grid must always show all fixed substances (Alcohol..Hallucinogens)
      expect(rows).toHaveLength(SUBSTANCE_ABUSE_FIXED_COUNT);
      rows.forEach((row, i) => {
        expect(row.types).toBe(SUBSTANCE_ABUSE_FIXED_ROWS[i].types);
      });
    });

    it("should default every editable field to empty string", () => {
      const [first] = createDefaultSubstanceAbuseRows();
      expect(first).toEqual({
        types: "Alcohol",
        ageOfFirstUse: "",
        lastUse: "",
        frequency: "",
        lengthOfSobriety: "",
      });
    });

    it("should return a fresh array on each call (no shared references)", () => {
      const a = createDefaultSubstanceAbuseRows();
      const b = createDefaultSubstanceAbuseRows();
      expect(a).not.toBe(b);
      expect(a[0]).not.toBe(b[0]);
    });
  });

  describe("mapApiRowToSubstanceRow", () => {
    it("should return an empty row when the api row is missing", () => {
      expect(mapApiRowToSubstanceRow("Heroin", undefined)).toEqual({
        types: "Heroin",
        ageOfFirstUse: "",
        lastUse: "",
        frequency: "",
        lengthOfSobriety: "",
      });
    });

    it("should wrap primitive select values into {label,value} options", () => {
      const row = mapApiRowToSubstanceRow("Cocaine", {
        ageOfFirstUse: "21",
        lastUse: "2026-01-01",
        frequency: "Daily",
        lengthOfSobriety: "6 months",
      });
      // WHY: react-select needs option objects; ageOfFirstUse stays a raw string
      expect(row.ageOfFirstUse).toBe("21");
      expect(row.lastUse).toEqual({ label: "2026-01-01", value: "2026-01-01" });
      expect(row.frequency).toEqual({ label: "Daily", value: "Daily" });
      expect(row.lengthOfSobriety).toEqual({
        label: "6 months",
        value: "6 months",
      });
    });

    it("should pass through values that are already option objects", () => {
      const opt = { label: "Weekly", value: "weekly" };
      const row = mapApiRowToSubstanceRow("Marijuana", { frequency: opt });
      expect(row.frequency).toBe(opt);
    });

    it("should coerce nullish select fields to empty string", () => {
      const row = mapApiRowToSubstanceRow("Inhalants", {
        ageOfFirstUse: null,
        lastUse: null,
        frequency: undefined,
        lengthOfSobriety: "",
      });
      expect(row.ageOfFirstUse).toBe("");
      expect(row.lastUse).toBe("");
      expect(row.frequency).toBe("");
      expect(row.lengthOfSobriety).toBe("");
    });
  });

  describe("loadSubstanceAbuseFromApi", () => {
    it("should return defaults and no extras for non-array input", () => {
      const result = loadSubstanceAbuseFromApi(null);
      expect(result.fixed).toHaveLength(SUBSTANCE_ABUSE_FIXED_COUNT);
      expect(result.extras).toEqual([]);
      // WHY: undefined api payload must not crash intake load
      expect(loadSubstanceAbuseFromApi(undefined).extras).toEqual([]);
    });

    it("should match api rows to their fixed row by types", () => {
      // Provide enough leading rows so the later types-match wins over the
      // positional fallback for earlier fixed rows.
      const heroinIndex = SUBSTANCE_ABUSE_FIXED_ROWS.findIndex(
        (r) => r.types === "Heroin",
      );
      const apiArray = SUBSTANCE_ABUSE_FIXED_ROWS.map((r) => ({
        types: r.types,
        ageOfFirstUse: r.types === "Heroin" ? "18" : "",
        frequency: r.types === "Heroin" ? "Daily" : "",
      }));
      const { fixed, extras } = loadSubstanceAbuseFromApi(apiArray);
      // WHY: each api row carries its substance types and lands in its named slot
      expect(fixed[heroinIndex].ageOfFirstUse).toBe("18");
      expect(fixed[heroinIndex].frequency).toEqual({
        label: "Daily",
        value: "Daily",
      });
      expect(fixed[heroinIndex].types).toBe("Heroin");
      expect(extras).toEqual([]);
    });

    it("should fall back to positional matching when types is absent", () => {
      const apiArray = [{ ageOfFirstUse: "30" }];
      const { fixed } = loadSubstanceAbuseFromApi(apiArray);
      // WHY: legacy rows without a types field map by index (row 0 = Alcohol)
      expect(fixed[0].ageOfFirstUse).toBe("30");
      expect(fixed[0].types).toBe("Alcohol");
    });

    it("should collect unmatched api rows as extras", () => {
      const apiArray = [{ types: "SomeNewDrug", ageOfFirstUse: "40" }];
      const { extras } = loadSubstanceAbuseFromApi(apiArray);
      // WHY: an extra ends up at the positional Alcohol slot first, so to force
      // an extra we exceed the fixed count
      const overflow = [
        ...Array.from({ length: SUBSTANCE_ABUSE_FIXED_COUNT }, () => ({})),
        { types: "ExtraDrug", ageOfFirstUse: "50" },
      ];
      const result = loadSubstanceAbuseFromApi(overflow);
      expect(result.extras).toEqual([
        { types: "ExtraDrug", ageOfFirstUse: "50" },
      ]);
      // single unmatched-by-type row still gets consumed positionally
      expect(loadSubstanceAbuseFromApi(apiArray).fixed[0].ageOfFirstUse).toBe(
        "40",
      );
    });

    it("should not double-consume the same api row", () => {
      const apiArray = [
        { types: "Alcohol", ageOfFirstUse: "1" },
        { types: "Alcohol", ageOfFirstUse: "2" },
      ];
      const { fixed, extras } = loadSubstanceAbuseFromApi(apiArray);
      // WHY: first Alcohol consumed by the Alcohol fixed row; the duplicate is
      // consumed positionally by the second fixed row (Benzodiazepines)
      expect(fixed[0].ageOfFirstUse).toBe("1");
      expect(fixed[1].ageOfFirstUse).toBe("2");
      expect(extras).toEqual([]);
    });
  });

  describe("attachSubstanceAbuseSetters", () => {
    it("should attach a setter for every field of every fixed row", () => {
      const bindings = {};
      const fixedRows = createDefaultSubstanceAbuseRows();
      const updateFixedRow = vi.fn();
      attachSubstanceAbuseSetters(bindings, fixedRows, updateFixedRow);

      const expectedCount = SUBSTANCE_ABUSE_FIXED_COUNT * 4;
      expect(Object.keys(bindings)).toHaveLength(expectedCount);
      expect(
        typeof bindings.setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol,
      ).toBe("function");
    });

    it("should call updateFixedRow with index/field/value on direct set", () => {
      const bindings = {};
      const fixedRows = createDefaultSubstanceAbuseRows();
      const updateFixedRow = vi.fn();
      attachSubstanceAbuseSetters(bindings, fixedRows, updateFixedRow);

      bindings.setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol("25");
      expect(updateFixedRow).toHaveBeenCalledWith(0, "ageOfFirstUse", "25");
    });

    it("should support functional updater values reading the current row", () => {
      const bindings = {};
      const fixedRows = createDefaultSubstanceAbuseRows();
      fixedRows[0].ageOfFirstUse = "10";
      const updateFixedRow = vi.fn();
      attachSubstanceAbuseSetters(bindings, fixedRows, updateFixedRow);

      bindings.setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol(
        (prev) => `${prev}-next`,
      );
      // WHY: legacy useState-style setters pass an updater fn; it must receive
      // the current field value
      expect(updateFixedRow).toHaveBeenCalledWith(
        0,
        "ageOfFirstUse",
        "10-next",
      );
    });

    it("should return the same bindings object it was given", () => {
      const bindings = {};
      const out = attachSubstanceAbuseSetters(
        bindings,
        createDefaultSubstanceAbuseRows(),
        vi.fn(),
      );
      expect(out).toBe(bindings);
    });
  });

  describe("substanceAbuseToLegacyFlat", () => {
    it("should flatten fixed rows into legacy field names", () => {
      const rows = createDefaultSubstanceAbuseRows();
      rows[0].ageOfFirstUse = "19";
      rows[0].frequency = "Daily";
      const flat = substanceAbuseToLegacyFlat(rows);
      // WHY: payload mapper still expects the historical flat keys per substance
      expect(flat.substanceAbuseHistoryDataAgeOfFirstUseAlcohol).toBe("19");
      expect(flat.substanceAbuseHistoryDataFrequencyAlcohol).toBe("Daily");
      expect(flat.substanceAbuseHistoryDataLastUseAlcohol).toBe("");
    });

    it("should emit a key for every legacy field of every fixed row", () => {
      const flat = substanceAbuseToLegacyFlat(
        createDefaultSubstanceAbuseRows(),
      );
      expect(Object.keys(flat)).toHaveLength(SUBSTANCE_ABUSE_FIXED_COUNT * 4);
    });

    it("should default missing rows to empty strings without crashing", () => {
      // WHY: a short/empty rows array must still produce a complete flat payload
      const flat = substanceAbuseToLegacyFlat([]);
      expect(flat.substanceAbuseHistoryDataAgeOfFirstUseAlcohol).toBe("");
      expect(Object.keys(flat)).toHaveLength(SUBSTANCE_ABUSE_FIXED_COUNT * 4);
    });
  });
});
