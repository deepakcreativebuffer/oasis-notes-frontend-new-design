/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useRiskFactors } from "./useRiskFactors";
import { RISK_FACTORS_FIXED_ROWS } from "../config/dynamicFormGroups";

// WHY: this hook is pure state management (no redux/router/react-query/IO),
// so it can be exercised with a bare renderHook + act, no provider wrapper.

describe("useRiskFactors", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should seed 12 fixed rows from RISK_FACTORS_FIXED_ROWS with empty drafts", () => {
    const { result } = renderHook(() => useRiskFactors());

    // WHY: each suicide-risk factor in the assessment must render a row, so the
    // count must match the config exactly (12 fixed risk factors).
    expect(result.current.fixedRows).toHaveLength(
      RISK_FACTORS_FIXED_ROWS.length,
    );
    expect(result.current.fixedRows[0].type).toBe(
      RISK_FACTORS_FIXED_ROWS[0].type,
    );
    // WHY: yes/no factors start unanswered (null), not yes/no, so the clinician
    // must actively answer each one.
    expect(result.current.fixedRows[0].yesNo).toBeNull();
    expect(result.current.extraRows).toEqual([]);
    expect(result.current.otherDraft).toEqual({
      type: "",
      yesNo: undefined,
      comment: "",
    });
  });

  it("should give comment-type rows a comment string and comments-type rows a comments array", () => {
    const { result } = renderHook(() => useRiskFactors());

    // Row 0 (suicidal ideation) uses legacyKeys.comment -> comment field.
    expect(result.current.fixedRows[0]).toHaveProperty("comment", "");
    // Row 6 (behavior cues) uses legacyKeys.comments -> comments array field.
    const behaviorIdx = RISK_FACTORS_FIXED_ROWS.findIndex(
      (r) => r.legacyKeys.comments,
    );
    expect(result.current.fixedRows[behaviorIdx]).toHaveProperty("comments");
    expect(Array.isArray(result.current.fixedRows[behaviorIdx].comments)).toBe(
      true,
    );
  });

  it("should update a single fixed row field without mutating the others", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateFixedRow(0, "yesNo", true));

    expect(result.current.fixedRows[0].yesNo).toBe(true);
    // WHY: editing one risk factor must not bleed into adjacent factors.
    expect(result.current.fixedRows[1].yesNo).toBeNull();
  });

  it("should update the other-draft buffer field by field", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateOtherDraft("type", "Gambling"));
    act(() => result.current.updateOtherDraft("yesNo", true));

    expect(result.current.otherDraft.type).toBe("Gambling");
    expect(result.current.otherDraft.yesNo).toBe(true);
    expect(result.current.otherDraft.comment).toBe("");
  });

  it("should append a valid other-draft to extraRows and reset the draft", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateOtherDraft("type", "Gambling"));
    act(() => result.current.updateOtherDraft("yesNo", false));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([
      { type: "Gambling", yesNo: false, comment: "" },
    ]);
    // WHY: after committing a custom factor the draft must clear so the next
    // entry starts blank.
    expect(result.current.otherDraft).toEqual({
      type: "",
      yesNo: undefined,
      comment: "",
    });
  });

  it("should not append an other-draft that has no type", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateOtherDraft("comment", "some note"));
    act(() => result.current.appendOtherDraft());

    // WHY: a custom risk factor without a label is meaningless and must be
    // rejected.
    expect(result.current.extraRows).toEqual([]);
  });

  it("should not append an other-draft that has a type but no yesNo and no comment", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateOtherDraft("type", "Gambling"));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([]);
  });

  it("should append an other-draft with a type and only a comment", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateOtherDraft("type", "Gambling"));
    act(() => result.current.updateOtherDraft("comment", "weekly"));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([
      { type: "Gambling", yesNo: undefined, comment: "weekly" },
    ]);
  });

  it("should remove an extra row by index", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateOtherDraft("type", "A"));
    act(() => result.current.updateOtherDraft("yesNo", true));
    act(() => result.current.appendOtherDraft());
    act(() => result.current.updateOtherDraft("type", "B"));
    act(() => result.current.updateOtherDraft("yesNo", false));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toHaveLength(2);

    act(() => result.current.removeExtraRow(0));

    expect(result.current.extraRows).toEqual([
      { type: "B", yesNo: false, comment: "" },
    ]);
  });

  it("should hydrate fixed rows and extras from an API array via loadFromApi", () => {
    const { result } = renderHook(() => useRiskFactors());

    // 12 fixed entries + 1 extra (index 12) beyond the fixedCount.
    const apiArray = RISK_FACTORS_FIXED_ROWS.map((_, i) => ({
      yesNo: i === 0 ? true : null,
      comment: i === 0 ? "ideation note" : "",
      comments: [],
    }));
    apiArray.push({ type: "Custom", yesNo: false, comment: "extra" });

    act(() => result.current.loadFromApi(apiArray));

    expect(result.current.fixedRows[0].yesNo).toBe(true);
    expect(result.current.fixedRows[0].comment).toBe("ideation note");
    // WHY: anything past the 12 fixed rows is a user-added custom factor.
    expect(result.current.extraRows).toEqual([
      { type: "Custom", yesNo: false, comment: "extra" },
    ]);
  });

  it("should produce a legacy-flat submit snapshot keyed by config legacyKeys plus riskFactorArray", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.updateFixedRow(0, "yesNo", true));
    act(() => result.current.updateFixedRow(0, "comment", "note"));
    act(() => result.current.updateOtherDraft("type", "Custom"));
    act(() => result.current.updateOtherDraft("yesNo", true));
    act(() => result.current.appendOtherDraft());

    const snapshot = result.current.toSubmitSnapshot();

    // WHY: payloadMapper consumes the legacy flat names, so the snapshot must
    // expose them (riskYesNo/riskComment for row 0).
    expect(snapshot.riskYesNo).toBe(true);
    expect(snapshot.riskComment).toBe("note");
    expect(snapshot.riskFactorArray).toEqual([
      { type: "Custom", yesNo: true, comment: "" },
    ]);
  });

  it("should expose legacy bindings with flat values, setters, and the extra array key", () => {
    const { result } = renderHook(() => useRiskFactors());

    // WHY: view forms bind to the legacy setter names from config (setRiskYesNo).
    expect(typeof result.current.legacy.setRiskYesNo).toBe("function");
    expect(result.current.legacy).toHaveProperty("riskYesNo", null);
    expect(result.current.legacy.riskFactorArray).toEqual([]);

    act(() => result.current.legacy.setRiskYesNo(true));

    expect(result.current.fixedRows[0].yesNo).toBe(true);
  });

  it("should support functional updater values through legacy setters", () => {
    const { result } = renderHook(() => useRiskFactors());

    act(() => result.current.legacy.setRiskComment((prev) => `${prev ?? ""}x`));

    expect(result.current.fixedRows[0].comment).toBe("x");
  });
});
