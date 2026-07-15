/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSubstanceSelectPropNames,
  SUBSTANCE_SELECT_FIELD_TYPES,
  SUBSTANCE_SELECT_SUBSTANCE_KEYS,
} from "./substanceAbuseSelectPropNames";
import { SUBSTANCE_ABUSE_FIXED_ROWS } from "./substanceAbuseConfig";

// WHY: This module produces the legacy flat prop-name strings that wire each
// substance-abuse Select to its onChange/options/setter in InitialAssessment.
// The exact string shape is a contract with the legacy form state — a typo
// here silently breaks a patient's substance-use intake field.
describe("substanceAbuseSelectPropNames", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("SUBSTANCE_SELECT_FIELD_TYPES", () => {
    it("should expose exactly the three Select-driven fields", () => {
      expect(SUBSTANCE_SELECT_FIELD_TYPES).toEqual([
        "lastUse",
        "frequency",
        "lengthOfSobriety",
      ]);
    });
  });

  describe("SUBSTANCE_SELECT_SUBSTANCE_KEYS", () => {
    it("should mirror the substanceKey of every fixed row in order", () => {
      // WHY: keys are derived from the fixed config; they must stay aligned 1:1
      // so iterating keys lines up with the 14 fixed intake rows.
      expect(SUBSTANCE_SELECT_SUBSTANCE_KEYS).toEqual(
        SUBSTANCE_ABUSE_FIXED_ROWS.map((row) => row.substanceKey),
      );
      expect(SUBSTANCE_SELECT_SUBSTANCE_KEYS).toHaveLength(14);
    });

    it("should include the legacy-typo keys that drive special prefixes", () => {
      // WHY: PCP/OTC/Cocaine/Hallucinogens/Methadone/Prescription get the
      // misspelled 'hnadle' prefixes downstream, so they must be present.
      [
        "Alcohol",
        "Cocaine",
        "Hallucinogens",
        "OTC",
        "PCP",
        "Methadone",
        "Prescription",
      ].forEach((key) => {
        expect(SUBSTANCE_SELECT_SUBSTANCE_KEYS).toContain(key);
      });
    });
  });

  describe("getSubstanceSelectPropNames - field segments", () => {
    it("should map lastUse to the LastUse segment", () => {
      const props = getSubstanceSelectPropNames("Heroin", "lastUse");
      expect(props.setter).toBe("setSubstanceAbuseHistoryDataLastUseHeroin");
      expect(props.handleKey).toBe(
        "handleKeysubstanceAbuseHistoryDataLastUseHeroin",
      );
    });

    it("should map frequency to the Frequency segment", () => {
      const props = getSubstanceSelectPropNames("Heroin", "frequency");
      expect(props.setter).toBe("setSubstanceAbuseHistoryDataFrequencyHeroin");
    });

    it("should default any non-lastUse/frequency field to LengthOfSobriety", () => {
      // WHY: fieldSegment falls through to LengthOfSobriety for the third
      // Select, so even an unexpected field value still yields a sobriety prop.
      const props = getSubstanceSelectPropNames("Heroin", "lengthOfSobriety");
      expect(props.setter).toBe(
        "setSubstanceAbuseHistoryDataLengthOfSobrietyHeroin",
      );
    });
  });

  describe("getSubstanceSelectPropNames - handler prefix", () => {
    it("should use 'handlersubstance' for any Alcohol field", () => {
      // WHY: Alcohol is the one substance using the 'handler' (with r) prefix.
      expect(getSubstanceSelectPropNames("Alcohol", "lastUse").handler).toBe(
        "handlersubstanceAbuseHistoryDataLastUseAlcohol",
      );
      expect(getSubstanceSelectPropNames("Alcohol", "frequency").handler).toBe(
        "handlersubstanceAbuseHistoryDataFrequencyAlcohol",
      );
      expect(
        getSubstanceSelectPropNames("Alcohol", "lengthOfSobriety").handler,
      ).toBe("handlersubstanceAbuseHistoryDataLengthOfSobrietyAlcohol");
    });

    it("should use the typo 'hnadlesubstance' for lastUse of Cocaine/Hallucinogens/OTC/PCP", () => {
      // WHY: these four legacy keys had a misspelled handler name for lastUse;
      // generating 'handle' instead would not match the existing form state.
      ["Cocaine", "Hallucinogens", "OTC", "PCP"].forEach((key) => {
        expect(getSubstanceSelectPropNames(key, "lastUse").handler).toBe(
          `hnadlesubstanceAbuseHistoryDataLastUse${key}`,
        );
      });
    });

    it("should use the typo 'hnadlesubstance' for lengthOfSobriety of Methadone/Prescription", () => {
      ["Methadone", "Prescription"].forEach((key) => {
        expect(
          getSubstanceSelectPropNames(key, "lengthOfSobriety").handler,
        ).toBe(`hnadlesubstanceAbuseHistoryDataLengthOfSobriety${key}`);
      });
    });

    it("should use the correct 'handlesubstance' for non-special combinations", () => {
      // WHY: PCP's typo only applies to lastUse; its frequency uses the normal
      // 'handlesubstance' prefix.
      expect(getSubstanceSelectPropNames("PCP", "frequency").handler).toBe(
        "handlesubstanceAbuseHistoryDataFrequencyPCP",
      );
      expect(getSubstanceSelectPropNames("Cocaine", "frequency").handler).toBe(
        "handlesubstanceAbuseHistoryDataFrequencyCocaine",
      );
      // Methadone lastUse is NOT special (only its lengthOfSobriety is)
      expect(getSubstanceSelectPropNames("Methadone", "lastUse").handler).toBe(
        "handlesubstanceAbuseHistoryDataLastUseMethadone",
      );
      expect(getSubstanceSelectPropNames("Heroin", "lastUse").handler).toBe(
        "handlesubstanceAbuseHistoryDataLastUseHeroin",
      );
    });
  });

  describe("getSubstanceSelectPropNames - options prefix", () => {
    it("should use 'selectedsubstance' for Alcohol lastUse and frequency", () => {
      // WHY: Alcohol's lastUse/frequency Selects read pre-selected option state
      // via the 'selectedsubstance' prop instead of raw 'optionsubstance'.
      expect(getSubstanceSelectPropNames("Alcohol", "lastUse").options).toBe(
        "selectedsubstanceAbuseHistoryDataLastUseAlcohol",
      );
      expect(getSubstanceSelectPropNames("Alcohol", "frequency").options).toBe(
        "selectedsubstanceAbuseHistoryDataFrequencyAlcohol",
      );
    });

    it("should use 'optionsubstance' for Alcohol lengthOfSobriety and all other substances", () => {
      expect(
        getSubstanceSelectPropNames("Alcohol", "lengthOfSobriety").options,
      ).toBe("optionsubstanceAbuseHistoryDataLengthOfSobrietyAlcohol");
      expect(getSubstanceSelectPropNames("Heroin", "lastUse").options).toBe(
        "optionsubstanceAbuseHistoryDataLastUseHeroin",
      );
      expect(getSubstanceSelectPropNames("Cocaine", "frequency").options).toBe(
        "optionsubstanceAbuseHistoryDataFrequencyCocaine",
      );
    });
  });

  describe("getSubstanceSelectPropNames - full shape", () => {
    it("should return all four prop-name keys", () => {
      const props = getSubstanceSelectPropNames("Heroin", "frequency");
      expect(Object.keys(props).sort()).toEqual([
        "handleKey",
        "handler",
        "options",
        "setter",
      ]);
    });

    it("should produce non-empty distinct strings for every substance x field combo", () => {
      // WHY: smoke-cover the whole 14x3 matrix the intake page iterates so a
      // future config change that breaks one combination is caught.
      SUBSTANCE_SELECT_SUBSTANCE_KEYS.forEach((key) => {
        SUBSTANCE_SELECT_FIELD_TYPES.forEach((field) => {
          const props = getSubstanceSelectPropNames(key, field);
          Object.values(props).forEach((name) => {
            expect(typeof name).toBe("string");
            expect(name.length).toBeGreaterThan(0);
            expect(name.endsWith(key)).toBe(true);
          });
          // each prop name should be unique within a combo
          const values = Object.values(props);
          expect(new Set(values).size).toBe(values.length);
        });
      });
    });
  });
});
