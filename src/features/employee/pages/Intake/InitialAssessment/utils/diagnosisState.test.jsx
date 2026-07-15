/** @format */

import { describe, it, expect } from "vitest";
import {
  createDefaultDiagnosisSlots,
  loadDiagnosisSlotsFromApi,
  diagnosisSlotsToLegacyFlat,
} from "./diagnosisState";

// Representative slot configuration mirroring the real diagnosis form shape:
// each slot has a display name plus the legacy flat-payload keys.
const slotConfig = [
  {
    name: "Primary Diagnosis",
    icdCodeKey: "primaryIcdCode",
    descriptionKey: "primaryDescription",
  },
  {
    name: "Secondary Diagnosis",
    icdCodeKey: "secondaryIcdCode",
    descriptionKey: "secondaryDescription",
  },
];

describe("createDefaultDiagnosisSlots", () => {
  it("creates one empty slot per config entry preserving names", () => {
    const result = createDefaultDiagnosisSlots(slotConfig);
    expect(result).toEqual([
      { name: "Primary Diagnosis", icdCode: "", description: "" },
      { name: "Secondary Diagnosis", icdCode: "", description: "" },
    ]);
  });

  it("returns an empty array for empty config", () => {
    expect(createDefaultDiagnosisSlots([])).toEqual([]);
  });
});

describe("loadDiagnosisSlotsFromApi", () => {
  it("maps API rows positionally onto fixed slots", () => {
    const apiArray = [
      { icdCode: "F32.9", description: "Major depressive disorder" },
      { icdCode: "F41.1", description: "Generalized anxiety disorder" },
    ];
    const { fixed, extras } = loadDiagnosisSlotsFromApi(slotConfig, apiArray);
    expect(fixed).toEqual([
      {
        name: "Primary Diagnosis",
        icdCode: "F32.9",
        description: "Major depressive disorder",
      },
      {
        name: "Secondary Diagnosis",
        icdCode: "F41.1",
        description: "Generalized anxiety disorder",
      },
    ]);
    // No API rows beyond the configured slots -> no extras.
    expect(extras).toEqual([]);
  });

  it("returns API rows beyond the slot count as extras", () => {
    const apiArray = [
      { icdCode: "F32.9", description: "MDD" },
      { icdCode: "F41.1", description: "GAD" },
      { icdCode: "F90.0", description: "ADHD" },
    ];
    const { fixed, extras } = loadDiagnosisSlotsFromApi(slotConfig, apiArray);
    expect(fixed).toHaveLength(2);
    // The 3rd API row overflows the 2 fixed slots and surfaces as an extra.
    expect(extras).toEqual([{ icdCode: "F90.0", description: "ADHD" }]);
  });

  it("falls back to empty strings when API rows are missing", () => {
    const apiArray = [{ icdCode: "F32.9", description: "MDD" }];
    const { fixed, extras } = loadDiagnosisSlotsFromApi(slotConfig, apiArray);
    expect(fixed[0]).toEqual({
      name: "Primary Diagnosis",
      icdCode: "F32.9",
      description: "MDD",
    });
    // Second slot has no corresponding API row -> empty defaults.
    expect(fixed[1]).toEqual({
      name: "Secondary Diagnosis",
      icdCode: "",
      description: "",
    });
    expect(extras).toEqual([]);
  });

  it("handles a missing/undefined apiArray without throwing", () => {
    const { fixed, extras } = loadDiagnosisSlotsFromApi(slotConfig, undefined);
    expect(fixed).toEqual([
      { name: "Primary Diagnosis", icdCode: "", description: "" },
      { name: "Secondary Diagnosis", icdCode: "", description: "" },
    ]);
    // null apiArray short-circuits extras to [].
    expect(extras).toEqual([]);
  });

  it("coalesces null icdCode/description on a row to empty strings", () => {
    const apiArray = [{ icdCode: null, description: null }];
    const { fixed } = loadDiagnosisSlotsFromApi(slotConfig, apiArray);
    expect(fixed[0].icdCode).toBe("");
    expect(fixed[0].description).toBe("");
  });
});

describe("diagnosisSlotsToLegacyFlat", () => {
  it("flattens fixed rows into legacy keyed payload", () => {
    const fixedRows = [
      { name: "Primary Diagnosis", icdCode: "F32.9", description: "MDD" },
      { name: "Secondary Diagnosis", icdCode: "F41.1", description: "GAD" },
    ];
    expect(diagnosisSlotsToLegacyFlat(slotConfig, fixedRows)).toEqual({
      primaryIcdCode: "F32.9",
      primaryDescription: "MDD",
      secondaryIcdCode: "F41.1",
      secondaryDescription: "GAD",
    });
  });

  it("emits empty strings when a fixed row is missing", () => {
    // Only the first row is provided; the second slot falls back to "".
    const fixedRows = [
      { name: "Primary Diagnosis", icdCode: "F32.9", description: "MDD" },
    ];
    expect(diagnosisSlotsToLegacyFlat(slotConfig, fixedRows)).toEqual({
      primaryIcdCode: "F32.9",
      primaryDescription: "MDD",
      secondaryIcdCode: "",
      secondaryDescription: "",
    });
  });

  it("returns an empty object for empty config", () => {
    expect(diagnosisSlotsToLegacyFlat([], [])).toEqual({});
  });

  it("round-trips: default slots -> flat yields all empty values", () => {
    const slots = createDefaultDiagnosisSlots(slotConfig);
    const flat = diagnosisSlotsToLegacyFlat(slotConfig, slots);
    expect(Object.values(flat).every((v) => v === "")).toBe(true);
  });
});
