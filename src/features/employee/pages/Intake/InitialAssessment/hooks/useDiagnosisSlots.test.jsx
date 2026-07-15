/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useDiagnosisSlots } from "./useDiagnosisSlots";

// WHY: this hook is pure local state over the real diagnosisState utils (no IO,
// no redux/router/react-query), so we exercise it directly with renderHook and
// representative ICD slot config rather than mocking anything.

const slotConfig = [
  {
    name: "Primary",
    icdCodeKey: "primaryIcd",
    descriptionKey: "primaryDesc",
    setIcdCodeKey: "setPrimaryIcd",
    setDescriptionKey: "setPrimaryDesc",
  },
  {
    name: "Secondary",
    icdCodeKey: "secondaryIcd",
    descriptionKey: "secondaryDesc",
    setIcdCodeKey: "setSecondaryIcd",
    setDescriptionKey: "setSecondaryDesc",
  },
];

const options = { extraArrayKey: "additionalDiagnoses" };

const setup = () => renderHook(() => useDiagnosisSlots(slotConfig, options));

describe("useDiagnosisSlots", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should initialise one empty fixed slot per config entry and no extra rows", () => {
    const { result } = setup();

    expect(result.current.fixedSlots).toEqual([
      { name: "Primary", icdCode: "", description: "" },
      { name: "Secondary", icdCode: "", description: "" },
    ]);
    expect(result.current.extraRows).toEqual([]);
  });

  it("should update a single field of a fixed slot via updateSlot without touching siblings", () => {
    const { result } = setup();

    act(() => {
      result.current.updateSlot(0, "icdCode", "A00.1");
    });

    // WHY: editing the Primary ICD code must not leak into the Secondary slot.
    expect(result.current.fixedSlots[0]).toEqual({
      name: "Primary",
      icdCode: "A00.1",
      description: "",
    });
    expect(result.current.fixedSlots[1].icdCode).toBe("");
  });

  it("should expose legacy flat bindings keyed by config icdCode/description keys", () => {
    const { result } = setup();

    act(() => {
      result.current.updateSlot(0, "icdCode", "A00.1");
      result.current.updateSlot(1, "description", "Cholera");
    });

    // WHY: downstream legacy form fields read diagnoses through these flat keys.
    expect(result.current.legacy.primaryIcd).toBe("A00.1");
    expect(result.current.legacy.secondaryDesc).toBe("Cholera");
    expect(result.current.legacy.primaryDesc).toBe("");
  });

  it("should provide setter bindings that update the matching slot field", () => {
    const { result } = setup();

    act(() => {
      result.current.legacy.setPrimaryIcd("B01.9");
    });
    expect(result.current.fixedSlots[0].icdCode).toBe("B01.9");

    act(() => {
      result.current.legacy.setSecondaryDesc("Varicella");
    });
    expect(result.current.fixedSlots[1].description).toBe("Varicella");
  });

  it("should support functional updater values in setter bindings", () => {
    const { result } = setup();

    act(() => {
      result.current.legacy.setPrimaryIcd("C00");
    });
    act(() => {
      // WHY: legacy callers sometimes pass a fn(prev) updater like a React setter.
      result.current.legacy.setPrimaryIcd((prev) => `${prev}.1`);
    });

    expect(result.current.fixedSlots[0].icdCode).toBe("C00.1");
  });

  it("should expose the current extra rows under extraArrayKey in legacy", () => {
    const { result } = setup();

    act(() => {
      result.current.setExtraRows([{ icdCode: "X1", description: "extra" }]);
    });

    expect(result.current.legacy.additionalDiagnoses).toEqual([
      { icdCode: "X1", description: "extra" },
    ]);
  });

  it("should hydrate fixed slots and extras from an API array via loadFromApi", () => {
    const { result } = setup();

    const apiArray = [
      { icdCode: "P1", description: "primary api" },
      { icdCode: "S1", description: "secondary api" },
      { icdCode: "E1", description: "extra api" },
    ];

    act(() => {
      result.current.loadFromApi(apiArray);
    });

    // WHY: the first N entries map onto fixed slots; the remainder are extras.
    expect(result.current.fixedSlots).toEqual([
      { name: "Primary", icdCode: "P1", description: "primary api" },
      { name: "Secondary", icdCode: "S1", description: "secondary api" },
    ]);
    expect(result.current.extraRows).toEqual([
      { icdCode: "E1", description: "extra api" },
    ]);
  });

  it("should default missing API fields to empty strings and no extras", () => {
    const { result } = setup();

    act(() => {
      result.current.loadFromApi([{ icdCode: "P1" }]);
    });

    expect(result.current.fixedSlots).toEqual([
      { name: "Primary", icdCode: "P1", description: "" },
      { name: "Secondary", icdCode: "", description: "" },
    ]);
    expect(result.current.extraRows).toEqual([]);
  });

  it("should remove the extra row at the given index via removeExtraRow", () => {
    const { result } = setup();

    act(() => {
      result.current.setExtraRows([
        { icdCode: "X1" },
        { icdCode: "X2" },
        { icdCode: "X3" },
      ]);
    });
    act(() => {
      result.current.removeExtraRow(1);
    });

    expect(result.current.extraRows).toEqual([
      { icdCode: "X1" },
      { icdCode: "X3" },
    ]);
  });

  it("should produce a submit snapshot combining flat fixed slots and extras", () => {
    const { result } = setup();

    act(() => {
      result.current.updateSlot(0, "icdCode", "A00.1");
      result.current.setExtraRows([{ icdCode: "X1", description: "extra" }]);
    });

    const snapshot = result.current.toSubmitSnapshot();

    // WHY: the submit payload flattens fixed slots to legacy keys plus the
    // dynamic extras array, exactly what the assessment API expects.
    expect(snapshot).toEqual({
      primaryIcd: "A00.1",
      primaryDesc: "",
      secondaryIcd: "",
      secondaryDesc: "",
      additionalDiagnoses: [{ icdCode: "X1", description: "extra" }],
    });
  });
});
