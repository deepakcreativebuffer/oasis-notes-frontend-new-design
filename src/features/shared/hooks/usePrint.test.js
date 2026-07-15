/** @format */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import usePrint from "./usePrint";

describe("usePrint", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should return a trigger function", () => {
    const printRef = { current: document.createElement("div") };
    const { result } = renderHook(() => usePrint(printRef, vi.fn()));
    expect(typeof result.current).toBe("function");
  });

  it("should run the print handler and prevent default on Ctrl+P when a target exists", () => {
    const handlePrint2 = vi.fn();
    const printRef = { current: document.createElement("button") };
    renderHook(() => usePrint(printRef, handlePrint2));

    const event = new KeyboardEvent("keydown", {
      key: "p",
      ctrlKey: true,
      cancelable: true,
    });
    act(() => {
      window.dispatchEvent(event);
    });

    // WHY: the app intercepts Ctrl+P so clinical documents print through the
    // controlled print target rather than the raw browser view.
    expect(handlePrint2).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("should ignore Ctrl+P when there is no print target", () => {
    const handlePrint2 = vi.fn();
    const printRef = { current: null };
    renderHook(() => usePrint(printRef, handlePrint2));

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "p", ctrlKey: true }),
      );
    });

    expect(handlePrint2).not.toHaveBeenCalled();
  });

  it("should keep focus on the print target via the interval after triggering", () => {
    const handlePrint2 = vi.fn();
    const el = document.createElement("button");
    const focusSpy = vi.spyOn(el, "focus");
    const printRef = { current: el };
    const { result } = renderHook(() => usePrint(printRef, handlePrint2));

    act(() => {
      result.current();
    });
    expect(handlePrint2).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // WHY: the print region must stay focused so the OS print dialog captures
    // the right content while it's open.
    expect(focusSpy).toHaveBeenCalled();
  });
});
