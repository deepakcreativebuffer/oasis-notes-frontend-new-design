/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useResidentStrengths } from "./useResidentStrengths";
import { QUALITIES_OPTIONS } from "../config/assessmentFields";

// Helper to build a fake keyboard event the hook consumes. The hook mutates
// event.target.value (clears it), so we model target as a plain object.
const makeKeyEvent = (key, value) => ({ key, target: { value } });

describe("useResidentStrengths", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should default qualitiesOptions to the shared QUALITIES_OPTIONS config", () => {
    const { result } = renderHook(() => useResidentStrengths());
    // WHY: intake forms must offer the canonical strength list out of the box.
    expect(result.current.qualitiesOptions).toEqual(QUALITIES_OPTIONS);
    expect(result.current.residentStrengths).toEqual([]);
  });

  it("should accept caller-supplied initial options", () => {
    const initial = [{ label: "Custom", value: "Custom" }];
    const { result } = renderHook(() =>
      useResidentStrengths({ initialOptions: initial }),
    );
    expect(result.current.qualitiesOptions).toEqual(initial);
  });

  it("should expose the expected hook API", () => {
    const { result } = renderHook(() => useResidentStrengths());
    expect(typeof result.current.setResidentStrengths).toBe("function");
    expect(typeof result.current.handleKeyDownResidentStrength).toBe(
      "function",
    );
    expect(typeof result.current.handleSelectChange).toBe("function");
  });

  it("should add a new strength on Enter when the value is not already an option", () => {
    const { result } = renderHook(() =>
      useResidentStrengths({
        initialOptions: [{ label: "Loving", value: "Loving" }],
      }),
    );
    const event = makeKeyEvent("Enter", "  Resilient  ");

    act(() => {
      result.current.handleKeyDownResidentStrength(event);
    });

    const expected = { value: "Resilient", label: "Resilient" };
    // WHY: free-typed strengths are trimmed and appended to the option list.
    // The actual selection is managed by CustomMultiSelectInput's onChange.
    expect(result.current.qualitiesOptions).toContainEqual(expected);
  });

  it("should NOT duplicate an option that already exists (by value)", () => {
    const { result } = renderHook(() =>
      useResidentStrengths({
        initialOptions: [{ label: "Loving", value: "Loving" }],
      }),
    );

    act(() => {
      result.current.handleKeyDownResidentStrength(
        makeKeyEvent("Enter", "Loving"),
      );
    });

    // WHY: existing qualities must not be re-added; only the input is cleared.
    expect(result.current.qualitiesOptions).toHaveLength(1);
    expect(result.current.residentStrengths).toEqual([]);
  });

  it("should ignore non-Enter keys", () => {
    const { result } = renderHook(() =>
      useResidentStrengths({ initialOptions: [] }),
    );
    const event = makeKeyEvent("a", "Typing");

    act(() => {
      result.current.handleKeyDownResidentStrength(event);
    });

    expect(result.current.qualitiesOptions).toEqual([]);
    expect(result.current.residentStrengths).toEqual([]);
    // WHY: a non-commit keypress must leave the in-progress input untouched.
    expect(event.target.value).toBe("Typing");
  });

  it("should ignore Enter on an empty input", () => {
    const { result } = renderHook(() =>
      useResidentStrengths({ initialOptions: [] }),
    );

    act(() => {
      result.current.handleKeyDownResidentStrength(makeKeyEvent("Enter", ""));
    });

    expect(result.current.qualitiesOptions).toEqual([]);
    expect(result.current.residentStrengths).toEqual([]);
  });

  it("should append multiple distinct strengths across successive Enters", () => {
    const { result } = renderHook(() =>
      useResidentStrengths({ initialOptions: [] }),
    );

    act(() => {
      result.current.handleKeyDownResidentStrength(
        makeKeyEvent("Enter", "Calm"),
      );
    });
    act(() => {
      result.current.handleKeyDownResidentStrength(
        makeKeyEvent("Enter", "Focused"),
      );
    });

    expect(result.current.qualitiesOptions).toEqual([
      { value: "Calm", label: "Calm" },
      { value: "Focused", label: "Focused" },
    ]);
  });

  it("should replace residentStrengths via handleSelectChange", () => {
    const { result } = renderHook(() => useResidentStrengths());
    const selection = [
      { label: "Honesty", value: "Honesty" },
      { label: "Creative", value: "Creative" },
    ];

    act(() => {
      result.current.handleSelectChange(selection);
    });

    // WHY: react-select hands the full selected set; the hook stores it verbatim.
    expect(result.current.residentStrengths).toEqual(selection);
  });

  it("should let callers set residentStrengths directly via setter", () => {
    const { result } = renderHook(() => useResidentStrengths());
    const seeded = [{ label: "Patient", value: "Patient" }];

    act(() => {
      result.current.setResidentStrengths(seeded);
    });

    expect(result.current.residentStrengths).toEqual(seeded);
  });
});
