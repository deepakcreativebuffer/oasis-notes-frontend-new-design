/** @format */

import { describe, it, expect } from "vitest";
import { pickUiOptions, UI_OPTION_KEYS } from "./uiOptions";

describe("UI_OPTION_KEYS", () => {
  it("includes the known UI callback keys", () => {
    expect(UI_OPTION_KEYS.has("setLoading")).toBe(true);
    expect(UI_OPTION_KEYS.has("navigate")).toBe(true);
    expect(UI_OPTION_KEYS.has("notAKey")).toBe(false);
  });
});

describe("pickUiOptions", () => {
  it("splits UI callbacks from business params", () => {
    const setLoading = () => {};
    const { params, ui } = pickUiOptions({ id: 1, name: "x", setLoading });
    expect(params).toEqual({ id: 1, name: "x" });
    expect(ui).toEqual({ setLoading });
  });

  it("returns empty buckets for empty input", () => {
    expect(pickUiOptions()).toEqual({ params: {}, ui: {} });
  });
});
