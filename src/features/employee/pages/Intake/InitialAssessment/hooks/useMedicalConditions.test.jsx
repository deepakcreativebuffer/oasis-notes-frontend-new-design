/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  useMedicalConditions,
  EMPTY_OTHER_CONDITION_DRAFT,
} from "./useMedicalConditions";
import {
  MEDICAL_CONDITIONS_FIXED_ROWS,
  MEDICAL_CONDITIONS_FIXED_COUNT,
} from "../config/medicalConditionsConfig";

// WHY: This hook is pure local state (useState/useMemo/useCallback) with no
// redux/router/react-query and no service IO, so renderHook needs no wrapper
// and there is nothing to vi.mock.

describe("useMedicalConditions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should initialise with default fixed rows, empty extras, and an empty draft", () => {
    const { result } = renderHook(() => useMedicalConditions());

    // WHY: one fixed row per configured medical/psychiatric condition.
    expect(result.current.fixedRows).toHaveLength(
      MEDICAL_CONDITIONS_FIXED_COUNT,
    );
    expect(result.current.fixedRows.every((row) => row.yes === undefined)).toBe(
      true,
    );
    expect(result.current.extraRows).toEqual([]);
    expect(result.current.otherDraft).toEqual(EMPTY_OTHER_CONDITION_DRAFT);
  });

  it("should seed multiselect rows with an array comment and text rows with a string comment", () => {
    const { result } = renderHook(() => useMedicalConditions());

    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((config, index) => {
      const row = result.current.fixedRows[index];
      expect(row.condition).toBe(config.condition);
      if (config.fieldType === "multiselect") {
        expect(Array.isArray(row.comment)).toBe(true);
      } else {
        expect(row.comment).toBe("");
      }
    });
  });

  it("should update a single field on a fixed row via updateFixedRow", () => {
    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.updateFixedRow(0, "yes", true));
    act(() => result.current.updateFixedRow(0, "comment", "Type 2"));

    expect(result.current.fixedRows[0].yes).toBe(true);
    expect(result.current.fixedRows[0].comment).toBe("Type 2");
    // WHY: updating one row must not mutate its neighbours.
    expect(result.current.fixedRows[1].yes).toBeUndefined();
  });

  it("should load fixed rows and extras from an API array (extras beyond the fixed count)", () => {
    const extraRow = {
      condition: "Custom condition",
      yes: true,
      comments: "n",
    };
    const apiArray = new Array(MEDICAL_CONDITIONS_FIXED_COUNT).fill(null);
    apiArray[0] = { yes: true, comment: "diabetes note" };
    apiArray.push(extraRow);

    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.loadFromApi(apiArray));

    expect(result.current.fixedRows[0].yes).toBe(true);
    expect(result.current.fixedRows[0].comment).toBe("diabetes note");
    // WHY: anything past the fixed condition slots is a free-form "other" row.
    expect(result.current.extraRows).toEqual([extraRow]);
  });

  it("should append a valid other-condition draft and then reset the draft", () => {
    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.legacy.setOtherConditionOther("Gout"));
    act(() => result.current.legacy.setOtherConditionYesNo(true));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([
      { condition: "Gout", yes: true, comments: "" },
    ]);
    // WHY: a successful append clears the draft so the input row is ready again.
    expect(result.current.otherDraft).toEqual(EMPTY_OTHER_CONDITION_DRAFT);
  });

  it("should NOT append when the draft has no condition label", () => {
    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.legacy.setOtherConditionYesNo(true));
    act(() => result.current.appendOtherDraft());

    // WHY: an other-condition with no name is meaningless and must be ignored.
    expect(result.current.extraRows).toEqual([]);
  });

  it("should NOT append when a labelled draft has neither a yes/no nor comments", () => {
    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.legacy.setOtherConditionOther("Something"));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([]);
  });

  it("should remove an extra row by index", () => {
    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.legacy.setOtherConditionOther("A"));
    act(() => result.current.legacy.setOtherConditionDiscription("desc a"));
    act(() => result.current.appendOtherDraft());
    act(() => result.current.legacy.setOtherConditionOther("B"));
    act(() => result.current.legacy.setOtherConditionDiscription("desc b"));
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toHaveLength(2);

    act(() => result.current.removeExtraRow(0));

    expect(result.current.extraRows).toHaveLength(1);
    expect(result.current.extraRows[0].condition).toBe("B");
  });

  it("should expose legacy flat bindings whose yesNo setter updates the matching fixed row", () => {
    const { result } = renderHook(() => useMedicalConditions());

    const config = MEDICAL_CONDITIONS_FIXED_ROWS[0];
    // WHY: legacy section components consume per-condition setter names.
    expect(typeof result.current.legacy[config.setters.yesNo]).toBe("function");

    act(() => result.current.legacy[config.setters.yesNo](true));

    expect(result.current.fixedRows[0].yes).toBe(true);
    expect(result.current.legacy[config.legacyKeys.yesNo]).toBe(true);
  });

  it("should support functional updater values through the legacy yesNo setter", () => {
    const { result } = renderHook(() => useMedicalConditions());
    const config = MEDICAL_CONDITIONS_FIXED_ROWS[0];

    act(() => result.current.legacy[config.setters.yesNo](true));
    act(() => result.current.legacy[config.setters.yesNo]((prev) => !prev));

    // WHY: setters mirror useState's functional-update contract.
    expect(result.current.fixedRows[0].yes).toBe(false);
  });

  it("should route a multiselect comments setter to the row's comment field", () => {
    const { result } = renderHook(() => useMedicalConditions());
    const msIndex = MEDICAL_CONDITIONS_FIXED_ROWS.findIndex(
      (c) => c.fieldType === "multiselect",
    );
    const config = MEDICAL_CONDITIONS_FIXED_ROWS[msIndex];
    const selection = [{ label: "Hypo", value: "Hypo" }];

    act(() => result.current.legacy[config.setters.comments](selection));

    expect(result.current.fixedRows[msIndex].comment).toEqual(selection);
    expect(result.current.legacy[config.legacyKeys.comments]).toEqual(
      selection,
    );
  });

  it("should mirror the other-condition draft fields into legacy bindings", () => {
    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.legacy.setOtherConditionOther("Migraine"));
    act(() => result.current.legacy.setOtherConditionDiscription("frequent"));

    expect(result.current.legacy.OtherConditionOther).toBe("Migraine");
    expect(result.current.legacy.otherConditionDiscription).toBe("frequent");
    expect(result.current.legacy.otherConditionArray).toEqual(
      result.current.extraRows,
    );
  });

  it("should produce a submit snapshot with flat keys plus the otherConditionArray", () => {
    const { result } = renderHook(() => useMedicalConditions());

    act(() => result.current.updateFixedRow(0, "yes", false));
    act(() => result.current.legacy.setOtherConditionOther("X"));
    act(() => result.current.legacy.setOtherConditionYesNo(false));
    act(() => result.current.appendOtherDraft());

    const snapshot = result.current.toSubmitSnapshot();

    // WHY: the snapshot feeds payloadMapper which keys off legacy flat names.
    expect(snapshot[MEDICAL_CONDITIONS_FIXED_ROWS[0].legacyKeys.yesNo]).toBe(
      false,
    );
    expect(snapshot.otherConditionArray).toEqual([
      { condition: "X", yes: false, comments: "" },
    ]);
  });
});
