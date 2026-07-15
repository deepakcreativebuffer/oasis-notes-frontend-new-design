/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useActiveWithdrawalSymptoms } from "./useActiveWithdrawalSymptoms";
import { ACTIVE_WITHDRAWAL_FIELD_REGISTRY } from "../config/legacyFieldRegistries";

// WHY: this hook is a thin composition of useLegacyObjectForm with the active
// withdrawal field registry + API mapper. It has no redux/router/react-query
// dependencies, so it can be exercised directly via renderHook without providers.

describe("useActiveWithdrawalSymptoms", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should expose the legacy object form contract", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());

    // WHY: legacy JSX relies on this exact shape during incremental migration.
    expect(result.current).toEqual(
      expect.objectContaining({
        values: expect.any(Object),
        setValues: expect.any(Function),
        setField: expect.any(Function),
        legacy: expect.any(Object),
        loadFromApi: expect.any(Function),
        toSubmitSnapshot: expect.any(Function),
      }),
    );
  });

  it("should initialize boolean symptom flags to false and Other text fields to empty string", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());
    const { values } = result.current;

    // WHY: a fresh withdrawal assessment must default every symptom to unchecked.
    expect(values.noneReportedOrObserved).toBe(false);
    expect(values.Agitation).toBe(false);
    expect(values.Seizures).toBe(false);
    // WHY: the free-text "Other type" fields default to "" (parsed from '""').
    expect(values.VisualDisturbancesOtherType).toBe("");
    expect(values.LossofMuscleCoordinationOtherType).toBe("");
  });

  it("should seed every key declared in the registry", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());
    const valueKeys = Object.keys(result.current.values).sort();
    const registryKeys = ACTIVE_WITHDRAWAL_FIELD_REGISTRY.map(
      (f) => f.key,
    ).sort();

    // WHY: every registry field must produce an initial value or legacy binding breaks.
    expect(valueKeys).toEqual(registryKeys);
  });

  it("should update a single field via setField without touching others", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());

    act(() => {
      result.current.setField("Nausea", true);
    });

    // WHY: toggling one symptom must not mutate sibling symptom flags.
    expect(result.current.values.Nausea).toBe(true);
    expect(result.current.values.Vomiting).toBe(false);
  });

  it("should support functional updates through setField", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());

    act(() => {
      result.current.setField("Anxiety", (prev) => !prev);
    });

    expect(result.current.values.Anxiety).toBe(true);
  });

  it("should expose legacy flat getters and setters for each field", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());

    // WHY: existing JSX reads `legacy.Tremors` and calls `legacy.setTremors`.
    expect(result.current.legacy.Tremors).toBe(false);
    expect(typeof result.current.legacy.setTremors).toBe("function");

    act(() => {
      result.current.legacy.setTremors(true);
    });

    expect(result.current.values.Tremors).toBe(true);
    expect(result.current.legacy.Tremors).toBe(true);
  });

  it("should hydrate state from API data via loadFromApi", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());

    act(() => {
      result.current.loadFromApi({
        Agitation: true,
        Nausea: true,
        AuditoryDisturbances: "ringing",
        LossofMuscleCoordinationOtherType: "stumbling",
      });
    });

    expect(result.current.values.Agitation).toBe(true);
    expect(result.current.values.Nausea).toBe(true);
    // WHY: mapper derives the "Other" boolean from presence of the free-text type.
    expect(result.current.values.VisualDisturbancesOtherBoolean).toBe(true);
    expect(result.current.values.VisualDisturbancesOtherType).toBe("ringing");
    expect(result.current.values.LossofMuscleCoordinationOtherBoolean).toBe(
      true,
    );
    expect(result.current.values.LossofMuscleCoordinationOtherType).toBe(
      "stumbling",
    );
  });

  it("should derive Other booleans as false when the API omits the free-text type", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());

    act(() => {
      result.current.loadFromApi({ Agitation: true });
    });

    // WHY: absent free-text means the "Other" checkbox stays unchecked.
    expect(result.current.values.VisualDisturbancesOtherBoolean).toBe(false);
    expect(result.current.values.LossofMuscleCoordinationOtherBoolean).toBe(
      false,
    );
  });

  it("should return a fresh snapshot copy of current values via toSubmitSnapshot", () => {
    const { result } = renderHook(() => useActiveWithdrawalSymptoms());

    act(() => {
      result.current.setField("Sweats", true);
    });

    const snapshot = result.current.toSubmitSnapshot();
    expect(snapshot.Sweats).toBe(true);
    // WHY: snapshot must be a copy, not the live state object, to avoid mutation leaks.
    expect(snapshot).not.toBe(result.current.values);
    expect(snapshot).toEqual(result.current.values);
  });
});
