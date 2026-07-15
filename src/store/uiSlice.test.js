/** @format */

import { describe, it, expect } from "vitest";
import reducer, {
  setSidebarOpen,
  toggleSidebar,
  setActiveModal,
  setFilters,
  clearFilters,
  selectSidebarOpen,
  selectActiveModal,
  selectFilters,
} from "./uiSlice";

const INITIAL = { sidebarOpen: false, activeModal: null, filters: {} };

describe("uiSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("should set the sidebar open flag explicitly", () => {
    expect(reducer(INITIAL, setSidebarOpen(true)).sidebarOpen).toBe(true);
  });

  it("should toggle the sidebar from its current value", () => {
    const opened = reducer(INITIAL, toggleSidebar());
    expect(opened.sidebarOpen).toBe(true);
    expect(reducer(opened, toggleSidebar()).sidebarOpen).toBe(false);
  });

  it("should set the active modal", () => {
    expect(reducer(INITIAL, setActiveModal("addResident")).activeModal).toBe(
      "addResident",
    );
  });

  describe("filters", () => {
    it("should merge new filters into existing ones", () => {
      const withFilters = { ...INITIAL, filters: { facility: "fac-1" } };
      const state = reducer(withFilters, setFilters({ status: "active" }));
      // WHY: filters merge so adding a status filter keeps the facility filter.
      expect(state.filters).toEqual({ facility: "fac-1", status: "active" });
    });

    it("should clear all filters", () => {
      const withFilters = { ...INITIAL, filters: { facility: "fac-1" } };
      expect(reducer(withFilters, clearFilters()).filters).toEqual({});
    });
  });

  it("should expose sidebar, modal, and filter selectors", () => {
    const root = {
      ui: { sidebarOpen: true, activeModal: "m", filters: { a: 1 } },
    };
    expect(selectSidebarOpen(root)).toBe(true);
    expect(selectActiveModal(root)).toBe("m");
    expect(selectFilters(root)).toEqual({ a: 1 });
  });
});
