/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useIndependentLivingSkills } from "./useIndependentLivingSkills";
import { INDEPENDENT_LIVING_SKILLS_FIXED_ROWS } from "../config/dynamicFormGroups";

// This hook is a pure useState/useCallback state container (no redux/router/
// react-query/IO), so it can be exercised with a bare renderHook — no providers.

describe("useIndependentLivingSkills", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should initialize one fixed row per configured living skill, all empty", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    // WHY: every IADL row from the config must be seeded so the assessment table
    // renders the full fixed grid even before any API hydration.
    expect(result.current.fixedRows).toHaveLength(
      INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.length,
    );
    expect(result.current.fixedRows[0]).toEqual({
      type: "Bathing/Showering",
      good: false,
      fair: false,
      otherCurrentNotSoGood: false,
      needAssist: false,
      comments: "",
    });
    expect(result.current.extraRows).toEqual([]);
    expect(result.current.otherDraft).toEqual({
      type: "",
      good: false,
      fair: false,
      otherCurrentNotSoGood: false,
      needAssist: false,
      comments: "",
    });
    // WHY: the "Taking medications" sub-question (Independent10) defaults to shown.
    expect(result.current.showTakingMedications).toBe(true);
  });

  it("should update a single field of a fixed row immutably via updateFixedRow", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());
    const before = result.current.fixedRows;

    act(() => {
      result.current.updateFixedRow(2, "good", true);
    });

    expect(result.current.fixedRows[2].good).toBe(true);
    // WHY: untouched rows must keep their default values.
    expect(result.current.fixedRows[0].good).toBe(false);
    // WHY: state updates produce a new array reference (no in-place mutation).
    expect(result.current.fixedRows).not.toBe(before);
  });

  it("should hydrate fixed rows and extras from an API array via loadFromApi", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());
    const apiArray = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map((row, i) => ({
      good: i === 0,
      fair: false,
      otherCurrentNotSoGood: false,
      needAssist: false,
      comments: i === 0 ? "needs help" : "",
    }));
    apiArray.push({ type: "Custom skill", good: true, comments: "extra" });

    act(() => {
      result.current.loadFromApi(apiArray);
    });

    expect(result.current.fixedRows[0].good).toBe(true);
    expect(result.current.fixedRows[0].comments).toBe("needs help");
    // WHY: indices beyond the fixed count become free-form "other" extra rows.
    expect(result.current.extraRows).toEqual([
      { type: "Custom skill", good: true, comments: "extra" },
    ]);
  });

  it("should edit the other-skill draft via updateOtherDraft", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.updateOtherDraft("type", "Pet care");
    });
    act(() => {
      result.current.updateOtherDraft("good", true);
    });

    expect(result.current.otherDraft.type).toBe("Pet care");
    expect(result.current.otherDraft.good).toBe(true);
  });

  it("should append a valid draft to extraRows and reset the draft", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.updateOtherDraft("type", "Pet care");
    });
    act(() => {
      result.current.updateOtherDraft("comments", "manages well");
    });
    act(() => {
      result.current.appendOtherDraft();
    });

    expect(result.current.extraRows).toEqual([
      {
        type: "Pet care",
        good: false,
        fair: false,
        otherCurrentNotSoGood: false,
        needAssist: false,
        comments: "manages well",
      },
    ]);
    // WHY: after committing the draft, the input row is cleared for the next entry.
    expect(result.current.otherDraft.type).toBe("");
    expect(result.current.otherDraft.comments).toBe("");
  });

  it("should not append a draft that has a type but no rating/comment", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.updateOtherDraft("type", "Empty skill");
    });
    act(() => {
      result.current.appendOtherDraft();
    });

    // WHY: a row with only a label and no answer is meaningless — guard against it.
    expect(result.current.extraRows).toEqual([]);
    expect(result.current.otherDraft.type).toBe("Empty skill");
  });

  it("should not append a draft that has a rating but no type", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.updateOtherDraft("good", true);
    });
    act(() => {
      result.current.appendOtherDraft();
    });

    // WHY: an "other" row without a name cannot be saved meaningfully.
    expect(result.current.extraRows).toEqual([]);
  });

  it("should remove the targeted extra row by index via removeExtraRow", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.loadFromApi([
        ...INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map(() => ({})),
        { type: "A", good: true },
        { type: "B", good: true },
      ]);
    });
    expect(result.current.extraRows).toHaveLength(2);

    act(() => {
      result.current.removeExtraRow(0);
    });

    expect(result.current.extraRows).toEqual([{ type: "B", good: true }]);
  });

  it("should toggle showTakingMedications via its setter", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.setShowTakingMedications(false);
    });

    expect(result.current.showTakingMedications).toBe(false);
  });

  it("should produce a legacy-flat submit snapshot with extras and Independent10", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.updateFixedRow(0, "good", true);
      result.current.updateFixedRow(0, "comments", "ok");
    });
    act(() => {
      result.current.setShowTakingMedications(false);
    });

    const snapshot = result.current.toSubmitSnapshot();

    // WHY: payloadMapper consumes legacy flat names like BathingGood/BathingComments.
    expect(snapshot.BathingGood).toBe(true);
    expect(snapshot.BathingComments).toBe("ok");
    expect(snapshot.handleRiskFactorActivityArray).toEqual(
      result.current.extraRows,
    );
    // WHY: Independent10 carries the "Taking medications" visibility flag on submit.
    expect(snapshot.Independent10).toBe(false);
  });

  it("should expose legacy bindings with values and working setters", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    // Default flat value present.
    expect(result.current.legacy.BathingGood).toBe(false);
    expect(typeof result.current.legacy.setBathingGood).toBe("function");

    act(() => {
      result.current.legacy.setBathingGood(true);
    });

    // WHY: legacy setters bridge old view forms into the new array state.
    expect(result.current.fixedRows[0].good).toBe(true);
  });

  it("should support functional updaters through legacy setters", () => {
    const { result } = renderHook(() => useIndependentLivingSkills());

    act(() => {
      result.current.legacy.setBathingComments(() => "typed");
    });

    // WHY: legacy view forms sometimes pass an updater fn; resolveUpdaterValue
    // must apply it against the current row value.
    expect(result.current.fixedRows[0].comments).toBe("typed");
  });
});
