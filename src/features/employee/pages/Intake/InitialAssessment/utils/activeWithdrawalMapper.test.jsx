/** @format */

import { describe, it, expect } from "vitest";
import { mapActiveWithdrawalFromApi } from "./activeWithdrawalMapper";

// Pure transform: maps an API withdrawal-symptom payload to the form shape.
// The non-obvious bits are the derived *OtherBoolean flags and the
// AuditoryDisturbances -> VisualDisturbancesOther* remapping.
describe("mapActiveWithdrawalFromApi", () => {
  it("passes through simple symptom fields verbatim", () => {
    const api = {
      noneReportedOrObserved: false,
      Agitation: true,
      Nausea: true,
      Vomiting: false,
      Headache: true,
      TactileDisturbances: true,
      Anxiety: false,
      Tremors: true,
      VisualDisturbances: false,
      Sweats: true,
      Paranoia: false,
      GooseBumps: true,
      Runningnose: false,
      BonePain: true,
      Tearing: false,
      Seizures: true,
    };

    const result = mapActiveWithdrawalFromApi(api);

    expect(result.noneReportedOrObserved).toBe(false);
    expect(result.Agitation).toBe(true);
    expect(result.Nausea).toBe(true);
    expect(result.Vomiting).toBe(false);
    expect(result.Headache).toBe(true);
    expect(result.TactileDisturbances).toBe(true);
    expect(result.Anxiety).toBe(false);
    expect(result.Tremors).toBe(true);
    expect(result.VisualDisturbances).toBe(false);
    expect(result.Sweats).toBe(true);
    expect(result.Paranoia).toBe(false);
    expect(result.GooseBumps).toBe(true);
    expect(result.Runningnose).toBe(false);
    expect(result.BonePain).toBe(true);
    expect(result.Tearing).toBe(false);
    expect(result.Seizures).toBe(true);
  });

  it("remaps AuditoryDisturbances onto the VisualDisturbancesOther fields", () => {
    // WHY: source aliases API "AuditoryDisturbances" into the form's
    // VisualDisturbancesOtherType, and derives the boolean from its truthiness.
    const result = mapActiveWithdrawalFromApi({
      AuditoryDisturbances: "hearing voices",
    });

    expect(result.VisualDisturbancesOtherType).toBe("hearing voices");
    expect(result.VisualDisturbancesOtherBoolean).toBe(true);
  });

  it("sets VisualDisturbancesOtherBoolean false when AuditoryDisturbances is absent/empty", () => {
    expect(mapActiveWithdrawalFromApi({}).VisualDisturbancesOtherBoolean).toBe(
      false,
    );
    // WHY: empty string is falsy -> boolean must be false.
    const empty = mapActiveWithdrawalFromApi({ AuditoryDisturbances: "" });
    expect(empty.VisualDisturbancesOtherBoolean).toBe(false);
    expect(empty.VisualDisturbancesOtherType).toBe("");
  });

  it("derives LossofMuscleCoordinationOtherBoolean from the Other type string", () => {
    const present = mapActiveWithdrawalFromApi({
      LossofMuscleCoordination: true,
      LossofMuscleCoordinationOtherType: "stumbling",
    });
    expect(present.LossofMuscleCoordination).toBe(true);
    expect(present.LossofMuscleCoordinationOtherType).toBe("stumbling");
    expect(present.LossofMuscleCoordinationOtherBoolean).toBe(true);

    const absent = mapActiveWithdrawalFromApi({
      LossofMuscleCoordination: false,
    });
    expect(absent.LossofMuscleCoordinationOtherBoolean).toBe(false);
    expect(absent.LossofMuscleCoordinationOtherType).toBeUndefined();
  });

  it("returns the full expected shape for an empty / default call", () => {
    const result = mapActiveWithdrawalFromApi();

    // Derived booleans must always resolve to concrete false (never undefined).
    expect(result.VisualDisturbancesOtherBoolean).toBe(false);
    expect(result.LossofMuscleCoordinationOtherBoolean).toBe(false);

    // All declared keys should be present even with no input.
    expect(Object.keys(result).sort()).toEqual(
      [
        "noneReportedOrObserved",
        "Agitation",
        "Nausea",
        "Vomiting",
        "Headache",
        "TactileDisturbances",
        "Anxiety",
        "Tremors",
        "VisualDisturbances",
        "VisualDisturbancesOtherBoolean",
        "VisualDisturbancesOtherType",
        "Sweats",
        "Paranoia",
        "GooseBumps",
        "Runningnose",
        "BonePain",
        "Tearing",
        "Seizures",
        "LossofMuscleCoordination",
        "LossofMuscleCoordinationOtherBoolean",
        "LossofMuscleCoordinationOtherType",
      ].sort(),
    );
  });

  it("does not throw on undefined input and yields undefined pass-throughs", () => {
    const result = mapActiveWithdrawalFromApi(undefined);
    expect(result.Agitation).toBeUndefined();
    expect(result.VisualDisturbancesOtherType).toBeUndefined();
  });
});
