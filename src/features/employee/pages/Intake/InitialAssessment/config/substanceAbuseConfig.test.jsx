/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SUBSTANCE_ABUSE_FIXED_ROWS,
  SUBSTANCE_ABUSE_FIXED_COUNT,
} from "./substanceAbuseConfig";

// This config is the source of truth for the substance-abuse history grid on the
// Initial Assessment intake form. The row order and the derived legacy flat field
// names form the contract with payloadMapper (typeArrayTemp) and the legacy
// state setters, so they must stay stable.
describe("substanceAbuseConfig", () => {
  beforeEach(() => vi.clearAllMocks());

  it("exposes 14 fixed rows and a matching count constant", () => {
    // WHY: the grid renders fixed rows 0-13; count drift would desync payloadMapper.
    expect(SUBSTANCE_ABUSE_FIXED_ROWS).toHaveLength(14);
    expect(SUBSTANCE_ABUSE_FIXED_COUNT).toBe(14);
    expect(SUBSTANCE_ABUSE_FIXED_COUNT).toBe(SUBSTANCE_ABUSE_FIXED_ROWS.length);
  });

  it("preserves the exact substance type ordering", () => {
    // WHY: order is positional and must match payloadMapper's typeArrayTemp.
    expect(SUBSTANCE_ABUSE_FIXED_ROWS.map((r) => r.types)).toEqual([
      "Alcohol",
      "Benzodiazepines",
      "Crack",
      "Heroin",
      "Inhalants",
      "Marijuana",
      "Methamphetamine",
      "Methadone",
      "MDMA (ecstasy)",
      "Primary Care Physician (angel dust)",
      "Prescription medicine",
      "OTC medicine",
      "Cocaine",
      "Hallucinogens",
    ]);
  });

  it("preserves the substanceKey ordering used for legacy flat names", () => {
    // WHY: substanceKey (not the display label) drives legacy field names.
    expect(SUBSTANCE_ABUSE_FIXED_ROWS.map((r) => r.substanceKey)).toEqual([
      "Alcohol",
      "Benzodiazepines",
      "Crack",
      "Heroin",
      "Inhalants",
      "Marijuana",
      "Methamphetamine",
      "Methadone",
      "MDMA",
      "PCP",
      "Prescription",
      "OTC",
      "Cocaine",
      "Hallucinogens",
    ]);
  });

  it("uses abbreviated substanceKeys that differ from the display label", () => {
    // WHY: these three rows intentionally decouple label from key; if they ever
    // collapse to the label, legacy field names would silently change.
    const mdma = SUBSTANCE_ABUSE_FIXED_ROWS.find(
      (r) => r.substanceKey === "MDMA",
    );
    const pcp = SUBSTANCE_ABUSE_FIXED_ROWS.find(
      (r) => r.substanceKey === "PCP",
    );
    const otc = SUBSTANCE_ABUSE_FIXED_ROWS.find(
      (r) => r.substanceKey === "OTC",
    );
    expect(mdma.types).toBe("MDMA (ecstasy)");
    expect(pcp.types).toBe("Primary Care Physician (angel dust)");
    expect(otc.types).toBe("OTC medicine");
  });

  it("derives legacyKeys for the four tracked fields per row", () => {
    // WHY: legacyKeys are the flat field names the form reads/writes; they must
    // be `substanceAbuseHistoryData<Field><SubstanceKey>`.
    SUBSTANCE_ABUSE_FIXED_ROWS.forEach((row) => {
      expect(row.legacyKeys).toEqual({
        ageOfFirstUse: `substanceAbuseHistoryDataAgeOfFirstUse${row.substanceKey}`,
        lastUse: `substanceAbuseHistoryDataLastUse${row.substanceKey}`,
        frequency: `substanceAbuseHistoryDataFrequency${row.substanceKey}`,
        lengthOfSobriety: `substanceAbuseHistoryDataLengthOfSobriety${row.substanceKey}`,
      });
    });
  });

  it("derives setters for the four tracked fields per row", () => {
    // WHY: setters mirror legacyKeys with a `set` prefix; the form dispatches them.
    SUBSTANCE_ABUSE_FIXED_ROWS.forEach((row) => {
      expect(row.setters).toEqual({
        ageOfFirstUse: `setSubstanceAbuseHistoryDataAgeOfFirstUse${row.substanceKey}`,
        lastUse: `setSubstanceAbuseHistoryDataLastUse${row.substanceKey}`,
        frequency: `setSubstanceAbuseHistoryDataFrequency${row.substanceKey}`,
        lengthOfSobriety: `setSubstanceAbuseHistoryDataLengthOfSobriety${row.substanceKey}`,
      });
    });
  });

  it("uses concrete example field names for Alcohol", () => {
    // WHY: spot-check the literal output so a refactor of the template string
    // (e.g. casing) is caught.
    const alcohol = SUBSTANCE_ABUSE_FIXED_ROWS[0];
    expect(alcohol.legacyKeys.ageOfFirstUse).toBe(
      "substanceAbuseHistoryDataAgeOfFirstUseAlcohol",
    );
    expect(alcohol.setters.lengthOfSobriety).toBe(
      "setSubstanceAbuseHistoryDataLengthOfSobrietyAlcohol",
    );
  });

  it("keeps every substanceKey unique so legacy names do not collide", () => {
    // WHY: duplicate keys would generate overlapping flat field names and clobber data.
    const keys = SUBSTANCE_ABUSE_FIXED_ROWS.map((r) => r.substanceKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("gives every row the original types and substanceKey plus derived maps", () => {
    SUBSTANCE_ABUSE_FIXED_ROWS.forEach((row) => {
      expect(typeof row.types).toBe("string");
      expect(typeof row.substanceKey).toBe("string");
      expect(row.types.length).toBeGreaterThan(0);
      expect(row.substanceKey.length).toBeGreaterThan(0);
      expect(Object.keys(row.legacyKeys)).toEqual([
        "ageOfFirstUse",
        "lastUse",
        "frequency",
        "lengthOfSobriety",
      ]);
    });
  });
});
