/** @format */

import { describe, it, expect } from "vitest";
import {
  PSYCHIATRIC_DIAGNOSIS_SLOTS,
  MEDICAL_DIAGNOSIS_SLOTS,
} from "./diagnosisSlotsConfig";

// Pure config module: these slot arrays are the contract the diagnosis form
// uses to bind each ICD/description field to its getter/setter on the form
// context, so the exact keys and ordering are load-bearing.
describe("diagnosisSlotsConfig", () => {
  const SLOT_SHAPE_KEYS = [
    "name",
    "icdCodeKey",
    "descriptionKey",
    "setIcdCodeKey",
    "setDescriptionKey",
  ];
  const EXPECTED_NAMES = ["Primary", "Secondary", "Tertiary", "Additional"];

  describe("PSYCHIATRIC_DIAGNOSIS_SLOTS", () => {
    it("exposes exactly four slots in Primary->Additional order", () => {
      expect(Array.isArray(PSYCHIATRIC_DIAGNOSIS_SLOTS)).toBe(true);
      expect(PSYCHIATRIC_DIAGNOSIS_SLOTS).toHaveLength(4);
      expect(PSYCHIATRIC_DIAGNOSIS_SLOTS.map((s) => s.name)).toEqual(
        EXPECTED_NAMES,
      );
    });

    it("gives every slot the five-key string shape", () => {
      for (const slot of PSYCHIATRIC_DIAGNOSIS_SLOTS) {
        expect(Object.keys(slot)).toEqual(SLOT_SHAPE_KEYS);
        for (const key of SLOT_SHAPE_KEYS) {
          expect(typeof slot[key]).toBe("string");
          expect(slot[key].length).toBeGreaterThan(0);
        }
      }
    });

    it("prefixes psychiatric field keys and uses set* setter keys", () => {
      for (const slot of PSYCHIATRIC_DIAGNOSIS_SLOTS) {
        // WHY: every psychiatric field key is namespaced with "psychiatric"
        expect(slot.icdCodeKey.startsWith("psychiatric")).toBe(true);
        expect(slot.descriptionKey.startsWith("psychiatric")).toBe(true);
        // WHY: setter keys follow the set*Psychiatric* convention. The source
        // has inconsistent ICD casing (e.g. "Secondaryicd" vs "setSecondaryIcd")
        // so we assert the prefix shape rather than deriving from the getter.
        expect(slot.setIcdCodeKey.startsWith("setPsychiatric")).toBe(true);
        expect(slot.setDescriptionKey.startsWith("setPsychiatric")).toBe(true);
      }
    });

    it("pins the Primary slot's exact binding keys", () => {
      // WHY: the form context reads these literal keys; a rename would silently
      // break field binding, so snapshot the canonical Primary slot.
      expect(PSYCHIATRIC_DIAGNOSIS_SLOTS[0]).toEqual({
        name: "Primary",
        icdCodeKey: "psychiatricPrimaryIcdCode",
        descriptionKey: "psychiatricPrimaryDescription",
        setIcdCodeKey: "setPsychiatricPrimaryIcdCode",
        setDescriptionKey: "setPsychiatricPrimaryDescription",
      });
    });
  });

  describe("MEDICAL_DIAGNOSIS_SLOTS", () => {
    it("exposes exactly four slots in Primary->Additional order", () => {
      expect(Array.isArray(MEDICAL_DIAGNOSIS_SLOTS)).toBe(true);
      expect(MEDICAL_DIAGNOSIS_SLOTS).toHaveLength(4);
      expect(MEDICAL_DIAGNOSIS_SLOTS.map((s) => s.name)).toEqual(
        EXPECTED_NAMES,
      );
    });

    it("gives every slot the five-key string shape", () => {
      for (const slot of MEDICAL_DIAGNOSIS_SLOTS) {
        expect(Object.keys(slot)).toEqual(SLOT_SHAPE_KEYS);
        for (const key of SLOT_SHAPE_KEYS) {
          expect(typeof slot[key]).toBe("string");
          expect(slot[key].length).toBeGreaterThan(0);
        }
      }
    });

    it("pins the Primary slot's exact binding keys", () => {
      expect(MEDICAL_DIAGNOSIS_SLOTS[0]).toEqual({
        name: "Primary",
        icdCodeKey: "primaryIcdCode",
        descriptionKey: "primaryDescription",
        setIcdCodeKey: "setPrimaryIcdCode",
        setDescriptionKey: "setPrimaryDescription",
      });
    });

    it("keeps medical field keys un-prefixed by 'psychiatric'", () => {
      // WHY: medical and psychiatric slots share names but must map to distinct
      // form fields; guard against accidental cross-contamination of keys.
      for (const slot of MEDICAL_DIAGNOSIS_SLOTS) {
        expect(slot.icdCodeKey.startsWith("psychiatric")).toBe(false);
        expect(slot.descriptionKey.startsWith("psychiatric")).toBe(false);
      }
    });
  });

  it("uses disjoint icdCode keys across the two slot groups", () => {
    // WHY: a key collision between groups would make one diagnosis overwrite
    // the other on the shared form context.
    const psychKeys = PSYCHIATRIC_DIAGNOSIS_SLOTS.map((s) => s.icdCodeKey);
    const medKeys = MEDICAL_DIAGNOSIS_SLOTS.map((s) => s.icdCodeKey);
    const overlap = psychKeys.filter((k) => medKeys.includes(k));
    expect(overlap).toEqual([]);
  });
});
