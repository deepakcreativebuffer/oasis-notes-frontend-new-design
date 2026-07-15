/** @format */

import { describe, it, expect } from "vitest";
import { createRequestController, isAbortError } from "./cancellation";

describe("createRequestController", () => {
  it("exposes a signal and toggles aborted on cancel", () => {
    const ctrl = createRequestController();
    expect(ctrl.signal).toBeInstanceOf(AbortSignal);
    expect(ctrl.isAborted()).toBe(false);
    ctrl.cancel("done");
    expect(ctrl.isAborted()).toBe(true);
  });
});

describe("isAbortError", () => {
  it("recognizes abort/cancel error shapes", () => {
    expect(isAbortError({ name: "AbortError" })).toBe(true);
    expect(isAbortError({ name: "CanceledError" })).toBe(true);
    expect(isAbortError({ code: "ERR_CANCELED" })).toBe(true);
  });

  it("returns false for unrelated errors", () => {
    expect(isAbortError({ name: "TypeError" })).toBe(false);
    expect(isAbortError(null)).toBe(false);
  });
});
