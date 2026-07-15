/** @format */

import { describe, it, expect } from "vitest";
import reducer, {
  setTheme,
  setUserPreferences,
  selectTheme,
  selectUserPreferences,
} from "./settingsSlice";

const INITIAL = { theme: "light", userPreferences: {} };

describe("settingsSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("should set the theme", () => {
    const state = reducer(INITIAL, setTheme("dark"));
    expect(state.theme).toBe("dark");
  });

  it("should merge user preferences rather than replacing them", () => {
    const withPrefs = { ...INITIAL, userPreferences: { density: "compact" } };
    const state = reducer(withPrefs, setUserPreferences({ fontSize: "lg" }));
    // WHY: preferences merge so setting one key doesn't wipe unrelated ones.
    expect(state.userPreferences).toEqual({
      density: "compact",
      fontSize: "lg",
    });
  });

  it("should override an existing preference key on merge", () => {
    const withPrefs = { ...INITIAL, userPreferences: { density: "compact" } };
    const state = reducer(withPrefs, setUserPreferences({ density: "cozy" }));
    expect(state.userPreferences.density).toBe("cozy");
  });

  it("should select theme and preferences", () => {
    const root = { settings: { theme: "dark", userPreferences: { a: 1 } } };
    expect(selectTheme(root)).toBe("dark");
    expect(selectUserPreferences(root)).toEqual({ a: 1 });
  });
});
