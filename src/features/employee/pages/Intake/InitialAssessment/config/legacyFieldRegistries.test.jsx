/** @format */

import { describe, it, expect } from "vitest";
import {
  ACTIVE_WITHDRAWAL_FIELD_REGISTRY,
  MENTAL_STATUS_EXAM_FIELD_REGISTRY,
} from "./legacyFieldRegistries";

// These registries are the contract consumed by the legacy object-form hooks:
// each entry maps a form field `key` to its state `setter` name and a
// `defaultValue` expression. Drift here silently breaks form reset/hydration,
// so we lock the shape and a few representative values.
describe("legacyFieldRegistries", () => {
  const registries = {
    ACTIVE_WITHDRAWAL_FIELD_REGISTRY,
    MENTAL_STATUS_EXAM_FIELD_REGISTRY,
  };

  it("exports both registries as non-empty arrays", () => {
    expect(Array.isArray(ACTIVE_WITHDRAWAL_FIELD_REGISTRY)).toBe(true);
    expect(Array.isArray(MENTAL_STATUS_EXAM_FIELD_REGISTRY)).toBe(true);
    expect(ACTIVE_WITHDRAWAL_FIELD_REGISTRY.length).toBeGreaterThan(0);
    expect(MENTAL_STATUS_EXAM_FIELD_REGISTRY.length).toBeGreaterThan(0);
  });

  // WHY: every entry must carry the three properties the hook reads; a missing
  // or non-string property would throw when the hook builds setters.
  it.each(Object.entries(registries))(
    "%s entries all have string key/setter and a defaultValue",
    (_name, registry) => {
      registry.forEach((entry) => {
        expect(typeof entry.key).toBe("string");
        expect(entry.key.length).toBeGreaterThan(0);
        expect(typeof entry.setter).toBe("string");
        expect(entry.setter.startsWith("set")).toBe(true);
        expect(typeof entry.defaultValue).toBe("string");
        expect(entry.defaultValue.length).toBeGreaterThan(0);
      });
    },
  );

  // WHY: keys index into the form state object, so duplicates would shadow
  // each other and lose data.
  it.each(Object.entries(registries))(
    "%s has unique keys",
    (_name, registry) => {
      const keys = registry.map((e) => e.key);
      expect(new Set(keys).size).toBe(keys.length);
    },
  );

  // WHY: defaultValue is a stringified JS expression; the only two valid forms
  // produced by the generator are the literal `false` and the empty-string
  // literal `""` (i.e. the 2-char string composed of two quote chars).
  it.each(Object.entries(registries))(
    "%s defaultValue is either boolean-false or empty-string literal",
    (_name, registry) => {
      registry.forEach((entry) => {
        expect(["false", '""']).toContain(entry.defaultValue);
      });
    },
  );

  it("maps representative active-withdrawal fields to their setters", () => {
    const byKey = Object.fromEntries(
      ACTIVE_WITHDRAWAL_FIELD_REGISTRY.map((e) => [e.key, e]),
    );
    expect(byKey.noneReportedOrObserved).toEqual({
      key: "noneReportedOrObserved",
      setter: "setNoneReportedOrObserved",
      defaultValue: "false",
    });
    // WHY: the *OtherType text fields default to empty string, not false.
    expect(byKey.VisualDisturbancesOtherType.defaultValue).toBe('""');
    expect(byKey.VisualDisturbancesOtherType.setter).toBe(
      "setVisualDisturbancesOtherType",
    );
  });

  it("maps representative mental-status fields to their setters", () => {
    const byKey = Object.fromEntries(
      MENTAL_STATUS_EXAM_FIELD_REGISTRY.map((e) => [e.key, e]),
    );
    expect(byKey.consistent).toEqual({
      key: "consistent",
      setter: "setConsistent",
      defaultValue: "false",
    });
    expect(byKey.otherText.defaultValue).toBe('""');
    // WHY: this free-text concentration field is the last entry and must round-trip.
    expect(byKey.otherAbilityToConcentration).toEqual({
      key: "otherAbilityToConcentration",
      setter: "setOtherAbilityToConcentration",
      defaultValue: '""',
    });
  });

  // WHY: every empty-string-default field is a text field and the convention is
  // that its key contains "Other"/"Text"/"Type" — guards against a boolean
  // field accidentally getting a string default.
  it("empty-string defaults correspond to text-style keys in mental status exam", () => {
    MENTAL_STATUS_EXAM_FIELD_REGISTRY.filter(
      (e) => e.defaultValue === '""',
    ).forEach((e) => {
      expect(/Other|Text|other/.test(e.key)).toBe(true);
    });
  });
});
