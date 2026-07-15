/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useMentalStatusExam } from "./useMentalStatusExam";
import { MENTAL_STATUS_EXAM_FIELD_REGISTRY } from "../config/legacyFieldRegistries";
import { mapMentalStatusExamFromApi } from "../utils/mentalStatusExamMapper";

// WHY: This hook is a thin wrapper over useLegacyObjectForm bound to the Mental
// Status Exam registry + API mapper. No redux/router/react-query, so renderHook
// runs without a provider wrapper.
describe("useMentalStatusExam", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should expose the legacy object form contract", () => {
    const { result } = renderHook(() => useMentalStatusExam());
    // WHY: callers rely on this exact surface during the incremental migration.
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

  it("should initialize every registry field to its parsed default", () => {
    const { result } = renderHook(() => useMentalStatusExam());
    const { values } = result.current;
    // WHY: each registry field must be seeded so controlled inputs are never
    // undefined on first render (booleans default false, text defaults to "").
    MENTAL_STATUS_EXAM_FIELD_REGISTRY.forEach((field) => {
      expect(values).toHaveProperty(field.key);
    });
    // Spot-check the two default flavours present in the registry.
    expect(values.consistent).toBe(false); // boolean default
    expect(values.olderOther).toBe(""); // string default
  });

  it("should update a single field through setField without touching others", () => {
    const { result } = renderHook(() => useMentalStatusExam());
    act(() => {
      result.current.setField("consistent", true);
    });
    expect(result.current.values.consistent).toBe(true);
    // WHY: setField must be surgical — sibling fields keep their defaults.
    expect(result.current.values.younger).toBe(false);
  });

  it("should support functional updates in setField", () => {
    const { result } = renderHook(() => useMentalStatusExam());
    act(() => {
      result.current.setField("olderOther", () => "MRN-TEST-001");
    });
    expect(result.current.values.olderOther).toBe("MRN-TEST-001");
  });

  it("should expose flat legacy getters and setters per registry entry", () => {
    const { result } = renderHook(() => useMentalStatusExam());
    // WHY: legacy JSX still reads `consistent`/calls `setConsistent` directly.
    expect(result.current.legacy.consistent).toBe(false);
    expect(typeof result.current.legacy.setConsistent).toBe("function");

    act(() => {
      result.current.legacy.setConsistent(true);
    });
    // legacy bindings are recomputed from the new values snapshot.
    expect(result.current.legacy.consistent).toBe(true);
    expect(result.current.values.consistent).toBe(true);
  });

  it("should hydrate values from API data via the mental status exam mapper", () => {
    const api = {
      apparentAge: { consistent: true, otherComment: "looks older" },
      height: { short: true },
      AbilityToConcentration: { Intact: true, Other: "distractible" },
    };
    const { result } = renderHook(() => useMentalStatusExam());
    act(() => {
      result.current.loadFromApi(api);
    });
    const expected = mapMentalStatusExamFromApi(api);
    // WHY: loadFromApi must defer entirely to the shared mapper shape.
    expect(result.current.values).toEqual(expected);
    expect(result.current.values.consistent).toBe(true);
    expect(result.current.values.short).toBe(true);
    // mapper derives a boolean flag from the presence of a free-text comment.
    expect(result.current.values.olderOtherBoolean).toBe(true);
    expect(result.current.values.intactAbilityToConcentrationOtherBoolean).toBe(
      true,
    );
  });

  it("should return a defensive snapshot copy from toSubmitSnapshot", () => {
    const { result } = renderHook(() => useMentalStatusExam());
    act(() => {
      result.current.setField("consistent", true);
    });
    const snapshot = result.current.toSubmitSnapshot();
    expect(snapshot.consistent).toBe(true);
    // WHY: the snapshot is a shallow copy, not the live state object, so the
    // caller can mutate it before submitting without corrupting form state.
    expect(snapshot).not.toBe(result.current.values);
    snapshot.consistent = false;
    expect(result.current.values.consistent).toBe(true);
  });
});
