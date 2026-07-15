/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useProtectiveFactors } from "./useProtectiveFactors";
import { PROTECTIVE_FACTORS_FIXED_ROWS } from "../config/dynamicFormGroups";
import { EMPTY_YES_NO_ROW_DRAFT } from "../utils/dynamicFormState";

// This hook is pure local state (no IO/redux/router), so renderHook with no
// wrapper is sufficient — there is nothing to mock.

describe("useProtectiveFactors", () => {
  beforeEach(() => vi.clearAllMocks());

  it("initialises with one default yes/no row per fixed protective-factor config", () => {
    const { result } = renderHook(() => useProtectiveFactors());
    // WHY: every protective-factor row from the schema must be present so the
    // intake form renders the full fixed table.
    expect(result.current.fixedRows).toHaveLength(
      PROTECTIVE_FACTORS_FIXED_ROWS.length,
    );
    expect(result.current.fixedRows.map((r) => r.type)).toEqual(
      PROTECTIVE_FACTORS_FIXED_ROWS.map((c) => c.type),
    );
    // WHY: defaults are an unanswered (null) yes/no with an empty comment.
    result.current.fixedRows.forEach((row) => {
      expect(row.yesNo).toBeNull();
      expect(row.comment).toBe("");
    });
    expect(result.current.extraRows).toEqual([]);
    expect(result.current.otherDraft).toEqual(EMPTY_YES_NO_ROW_DRAFT);
  });

  it("updateFixedRow mutates only the targeted field of the targeted row", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.updateFixedRow(0, "yesNo", true));
    act(() => result.current.updateFixedRow(0, "comment", "Strong family"));

    expect(result.current.fixedRows[0].yesNo).toBe(true);
    expect(result.current.fixedRows[0].comment).toBe("Strong family");
    // WHY: sibling rows must remain untouched when one row is edited.
    expect(result.current.fixedRows[1].yesNo).toBeNull();
    expect(result.current.fixedRows[1].comment).toBe("");
  });

  it("updateOtherDraft accumulates fields on the in-progress 'other' draft", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.updateOtherDraft("type", "Pet companionship"));
    act(() => result.current.updateOtherDraft("yesNo", true));
    act(() => result.current.updateOtherDraft("comment", "Has a dog"));

    expect(result.current.otherDraft).toEqual({
      type: "Pet companionship",
      yesNo: true,
      comment: "Has a dog",
    });
  });

  it("appendOtherDraft pushes a valid draft into extraRows and resets the draft", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.updateOtherDraft("type", "Pet companionship"));
    act(() => result.current.updateOtherDraft("yesNo", false));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([
      { type: "Pet companionship", yesNo: false, comment: "" },
    ]);
    // WHY: after appending, the draft is cleared so the next custom row starts blank.
    expect(result.current.otherDraft).toEqual(EMPTY_YES_NO_ROW_DRAFT);
  });

  it("appendOtherDraft accepts a draft that has only a type + comment (no yes/no)", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.updateOtherDraft("type", "Hobbies"));
    act(() => result.current.updateOtherDraft("comment", "Paints"));
    act(() => result.current.appendOtherDraft());

    // WHY: a comment alone is enough signal to keep a custom protective factor.
    expect(result.current.extraRows).toEqual([
      { type: "Hobbies", yesNo: undefined, comment: "Paints" },
    ]);
  });

  it("appendOtherDraft ignores a draft missing a type", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.updateOtherDraft("comment", "orphan comment"));
    act(() => result.current.appendOtherDraft());

    // WHY: a row without a type label is meaningless, so it must not be stored.
    expect(result.current.extraRows).toEqual([]);
  });

  it("appendOtherDraft ignores a draft with a type but no yes/no and no comment", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.updateOtherDraft("type", "Empty factor"));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([]);
  });

  it("removeExtraRow removes the extra row at the given index", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.loadFromApi([]));
    act(() => {
      result.current.updateOtherDraft("type", "A");
      result.current.updateOtherDraft("yesNo", true);
    });
    act(() => result.current.appendOtherDraft());
    act(() => {
      result.current.updateOtherDraft("type", "B");
      result.current.updateOtherDraft("yesNo", false);
    });
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toHaveLength(2);

    act(() => result.current.removeExtraRow(0));

    // WHY: removing index 0 should leave only the second custom row.
    expect(result.current.extraRows).toEqual([
      { type: "B", yesNo: false, comment: "" },
    ]);
  });

  it("loadFromApi hydrates fixed rows and splits extras beyond the fixed count", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    const apiArray = [
      { yesNo: true, comment: "fam" },
      { yesNo: false, comment: "spirit" },
      { yesNo: null, comment: "" },
      { yesNo: true, comment: "fear" },
      { yesNo: false, comment: "inter" },
      { yesNo: true, comment: "willing" },
      { type: "Extra factor", yesNo: true, comment: "custom" },
    ];

    act(() => result.current.loadFromApi(apiArray));

    expect(result.current.fixedRows).toHaveLength(
      PROTECTIVE_FACTORS_FIXED_ROWS.length,
    );
    expect(result.current.fixedRows[0]).toMatchObject({
      type: PROTECTIVE_FACTORS_FIXED_ROWS[0].type,
      yesNo: true,
      comment: "fam",
    });
    // WHY: entries beyond the 6 fixed rows become custom "extra" rows.
    expect(result.current.extraRows).toEqual([
      { type: "Extra factor", yesNo: true, comment: "custom" },
    ]);
  });

  it("loadFromApi tolerates an empty/undefined payload by resetting to defaults", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.loadFromApi(undefined));

    expect(result.current.fixedRows).toHaveLength(
      PROTECTIVE_FACTORS_FIXED_ROWS.length,
    );
    result.current.fixedRows.forEach((row) => expect(row.yesNo).toBeNull());
    expect(result.current.extraRows).toEqual([]);
  });

  it("toSubmitSnapshot maps fixed rows to legacy flat keys and includes the extras array", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    act(() => result.current.updateFixedRow(0, "yesNo", true));
    act(() => result.current.updateFixedRow(0, "comment", "supportive"));
    act(() => {
      result.current.updateOtherDraft("type", "Volunteering");
      result.current.updateOtherDraft("yesNo", true);
    });
    act(() => result.current.appendOtherDraft());

    const snapshot = result.current.toSubmitSnapshot();

    // WHY: payloadMapper consumes legacy flat names, so the first fixed row's
    // yes/no + comment must surface under its configured legacy keys.
    expect(snapshot.SupportsYesNo).toBe(true);
    expect(snapshot.SupportsComment).toBe("supportive");
    expect(snapshot.protectiveFactorsArray).toEqual([
      { type: "Volunteering", yesNo: true, comment: "" },
    ]);
  });

  it("legacy bindings expose setters that drive the corresponding fixed row", () => {
    const { result } = renderHook(() => useProtectiveFactors());

    // WHY: legacy view forms call setters by name; they must update state.
    expect(typeof result.current.legacy.setSupportsYesNo).toBe("function");

    act(() => result.current.legacy.setSupportsYesNo(true));
    expect(result.current.fixedRows[0].yesNo).toBe(true);

    act(() => result.current.legacy.setSupportsComment("via legacy setter"));
    expect(result.current.fixedRows[0].comment).toBe("via legacy setter");
  });
});
