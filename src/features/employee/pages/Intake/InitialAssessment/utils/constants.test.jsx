/** @format */

import { describe, it, expect } from "vitest";
import {
  ASSESSMENT_MODES,
  ASSESSMENT_PORTALS,
  EMPLOYEE_ROUTES,
  RESIDENT_ROUTES,
  PRINT_PAGE_STYLE,
} from "./constants";

// This module is a barrel re-export of the shared assessment constants.
// The contract here is that every symbol is re-exported with the correct
// shape/value, since routing + mode logic across the Intake feature depends
// on these exact string values.
describe("InitialAssessment/utils/constants barrel", () => {
  it("re-exports ASSESSMENT_MODES with the create/edit/view/print modes", () => {
    expect(ASSESSMENT_MODES).toEqual({
      CREATE: "create",
      EDIT: "edit",
      VIEW: "view",
      PRINT: "print",
    });
  });

  it("re-exports ASSESSMENT_PORTALS for employee and resident sources", () => {
    expect(ASSESSMENT_PORTALS).toEqual({
      EMPLOYEE: "employee",
      RESIDENT: "resident",
    });
  });

  it("re-exports EMPLOYEE_ROUTES with create/edit/view/list paths", () => {
    expect(EMPLOYEE_ROUTES).toEqual({
      CREATE: "/initial-assessment",
      EDIT_PREFIX: "/edit-initial-assessment/",
      VIEW_PREFIX: "/view-initial-assessment/",
      LIST: "/initial-assessment-list",
    });
    // Prefix routes must end with a slash so an id can be appended directly.
    expect(EMPLOYEE_ROUTES.EDIT_PREFIX.endsWith("/")).toBe(true);
    expect(EMPLOYEE_ROUTES.VIEW_PREFIX.endsWith("/")).toBe(true);
  });

  it("re-exports RESIDENT_ROUTES with edit/view prefixes that accept an id", () => {
    expect(RESIDENT_ROUTES).toEqual({
      EDIT_PREFIX: "/edit-initial-Assessment-resident/",
      VIEW_PREFIX: "/view-initial-assessment-resident/",
    });
    expect(RESIDENT_ROUTES.EDIT_PREFIX.endsWith("/")).toBe(true);
    expect(RESIDENT_ROUTES.VIEW_PREFIX.endsWith("/")).toBe(true);
  });

  it("re-exports PRINT_PAGE_STYLE as a non-empty CSS string with print rules", () => {
    expect(typeof PRINT_PAGE_STYLE).toBe("string");
    expect(PRINT_PAGE_STYLE.length).toBeGreaterThan(0);
    // The print stylesheet drives react-to-print; these rules are load-bearing.
    expect(PRINT_PAGE_STYLE).toContain("@page");
    expect(PRINT_PAGE_STYLE).toContain("page-break-inside: avoid");
    expect(PRINT_PAGE_STYLE).toContain("table-row-hinde-print");
  });

  it("keeps mode and portal values distinct (no accidental collisions)", () => {
    const modeValues = Object.values(ASSESSMENT_MODES);
    expect(new Set(modeValues).size).toBe(modeValues.length);

    const portalValues = Object.values(ASSESSMENT_PORTALS);
    expect(new Set(portalValues).size).toBe(portalValues.length);
  });
});
