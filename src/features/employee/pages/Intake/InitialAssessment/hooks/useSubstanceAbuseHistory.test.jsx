/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  useSubstanceAbuseHistory,
  EMPTY_OTHER_SUBSTANCE_DRAFT,
} from "./useSubstanceAbuseHistory";
import { SUBSTANCE_ABUSE_FIXED_ROWS } from "../config/substanceAbuseConfig";

// This hook is pure React state (no redux/router/react-query/IO), so it can be
// driven directly with renderHook + act and needs no provider wrapper or mocks.

describe("useSubstanceAbuseHistory", () => {
  beforeEach(() => vi.clearAllMocks());

  it("initialises with one empty row per fixed substance and no extras", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    // WHY: the assessment grid always renders the 14 canonical substance rows.
    expect(result.current.fixedRows).toHaveLength(
      SUBSTANCE_ABUSE_FIXED_ROWS.length,
    );
    expect(result.current.fixedRows[0]).toMatchObject({
      types: "Alcohol",
      ageOfFirstUse: "",
      lastUse: "",
      frequency: "",
      lengthOfSobriety: "",
    });
    expect(result.current.extraRows).toEqual([]);
    expect(result.current.otherDraft).toEqual(EMPTY_OTHER_SUBSTANCE_DRAFT);
  });

  it("updateFixedRow mutates only the targeted row/field immutably", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());
    const before = result.current.fixedRows;

    act(() => result.current.updateFixedRow(0, "ageOfFirstUse", "21"));

    expect(result.current.fixedRows[0].ageOfFirstUse).toBe("21");
    // WHY: other rows must stay untouched when editing a single cell.
    expect(result.current.fixedRows[1].ageOfFirstUse).toBe("");
    // WHY: state update returns a new array reference (no in-place mutation).
    expect(result.current.fixedRows).not.toBe(before);
  });

  it("loadFromApi hydrates history/denies strings and maps fixed + extra rows", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    // Provide one entry per fixed substance so positional fallback consumes
    // them all, leaving a genuine 15th unmatched row as an extra.
    const apiData = SUBSTANCE_ABUSE_FIXED_ROWS.map((row, i) =>
      i === 0
        ? { types: "Alcohol", ageOfFirstUse: "16", lastUse: "Yesterday" }
        : { types: row.types },
    );
    apiData.push({ types: "Unlisted Drug", ageOfFirstUse: "30" });

    act(() =>
      result.current.loadFromApi({
        substanceAbuseHistory: "Reported daily use",
        substanceAbuseDenies: "No",
        substanceAbuseHistoryData: apiData,
      }),
    );

    expect(result.current.legacy.substanceAbuseHistory).toBe(
      "Reported daily use",
    );
    expect(result.current.legacy.substanceAbuseDenies).toBe("No");
    // WHY: an api row matching a fixed substance fills that fixed row.
    expect(result.current.fixedRows[0].ageOfFirstUse).toBe("16");
    expect(result.current.fixedRows[0].lastUse).toEqual({
      label: "Yesterday",
      value: "Yesterday",
    });
    // WHY: api rows that don't match any fixed substance become extra rows.
    expect(result.current.extraRows).toEqual([
      { types: "Unlisted Drug", ageOfFirstUse: "30" },
    ]);
  });

  it("loadFromApi tolerates missing detail by resetting to defaults", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    act(() => result.current.updateFixedRow(0, "ageOfFirstUse", "99"));
    act(() => result.current.loadFromApi(undefined));

    expect(result.current.legacy.substanceAbuseHistory).toBe("");
    expect(result.current.legacy.substanceAbuseDenies).toBe("");
    expect(result.current.fixedRows[0].ageOfFirstUse).toBe("");
    expect(result.current.extraRows).toEqual([]);
  });

  it("appendOtherDraft adds a normalised extra row and resets the draft", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    act(() => {
      result.current.legacy.setOtherTypeOther("Kratom");
      result.current.legacy.setOtherAgeOfFirstUse("25");
    });
    act(() => {
      // option-object values get flattened to their .value on append.
      result.current.legacy.setOtherLastUse({
        value: "Last week",
        label: "Last week",
      });
    });
    act(() => result.current.appendOtherDraft());

    expect(result.current.extraRows).toEqual([
      {
        types: "Kratom",
        ageOfFirstUse: "25",
        lastUse: "Last week",
        frequency: "",
        lengthOfSobriety: "",
      },
    ]);
    // WHY: after committing, the draft inputs must clear for the next entry.
    expect(result.current.otherDraft).toEqual(EMPTY_OTHER_SUBSTANCE_DRAFT);
  });

  it("appendOtherDraft is a no-op when no substance type is entered", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    act(() => result.current.legacy.setOtherAgeOfFirstUse("40"));
    act(() => result.current.appendOtherDraft());

    // WHY: a row with no substance name is meaningless and must not be saved.
    expect(result.current.extraRows).toEqual([]);
  });

  it("removeExtraRow deletes the row at the given index", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    act(() =>
      result.current.setExtraRows([
        { types: "A" },
        { types: "B" },
        { types: "C" },
      ]),
    );
    act(() => result.current.removeExtraRow(1));

    expect(result.current.extraRows).toEqual([{ types: "A" }, { types: "C" }]);
  });

  it("legacy exposes generated flat setters that update the matching fixed row", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    // WHY: legacy section components call substance-keyed setters by name.
    expect(
      typeof result.current.legacy
        .setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    ).toBe("function");

    act(() =>
      result.current.legacy.setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol(
        "18",
      ),
    );

    expect(result.current.fixedRows[0].ageOfFirstUse).toBe("18");
  });

  it("legacy flat history/denies setters update the underlying state", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    act(() => result.current.legacy.setSubstanceAbuseHistory("Some history"));
    act(() => result.current.legacy.setSubstanceAbuseDenies("Denied"));

    expect(result.current.legacy.substanceAbuseHistory).toBe("Some history");
    expect(result.current.legacy.substanceAbuseDenies).toBe("Denied");
  });

  it("toSubmitSnapshot returns flat fixed-row keys plus history/denies/typeArray", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    act(() => result.current.updateFixedRow(0, "ageOfFirstUse", "16"));
    act(() => result.current.legacy.setSubstanceAbuseHistory("history text"));
    act(() => result.current.setExtraRows([{ types: "Kratom" }]));

    const snapshot = result.current.toSubmitSnapshot();

    expect(snapshot.substanceAbuseHistoryDataAgeOfFirstUseAlcohol).toBe("16");
    expect(snapshot.substanceAbuseHistory).toBe("history text");
    expect(snapshot.typeArray).toEqual([{ types: "Kratom" }]);
  });

  it("sectionProps merges select handlers with the legacy bindings", () => {
    const { result } = renderHook(() => useSubstanceAbuseHistory());

    // WHY: sectionProps is the single prop bag spread into the section UI; it
    // must carry both the legacy flat values and the creatable-select handlers.
    expect(result.current.sectionProps.substanceAbuseHistory).toBe("");
    expect(
      typeof result.current.sectionProps
        .setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    ).toBe("function");
    expect(typeof result.current.selectHandlers).toBe("object");
  });
});
