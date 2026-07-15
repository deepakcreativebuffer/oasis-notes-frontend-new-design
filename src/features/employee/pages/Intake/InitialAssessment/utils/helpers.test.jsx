/** @format */

import { describe, it, expect } from "vitest";
import {
  resolveAssessmentContext,
  mapSelectValuesToArray,
  getApiArrayData,
} from "./helpers";

// helpers.js is a barrel re-exporting the pure assessment-context utilities.
// These transforms drive form mode/portal resolution and select payload shaping,
// so we test their branches and edge cases thoroughly.

describe("helpers barrel re-exports", () => {
  it("re-exports all three utilities as functions", () => {
    expect(typeof resolveAssessmentContext).toBe("function");
    expect(typeof mapSelectValuesToArray).toBe("function");
    expect(typeof getApiArrayData).toBe("function");
  });
});

describe("resolveAssessmentContext", () => {
  it("defaults to CREATE/EMPLOYEE when pathname is missing", () => {
    // WHY: falsy pathname short-circuits to the create-mode default object
    expect(resolveAssessmentContext("")).toEqual({
      mode: "create",
      portal: "employee",
      isCreate: true,
      isView: false,
      isEdit: false,
      isReadOnly: false,
    });
    expect(resolveAssessmentContext(undefined)).toMatchObject({
      mode: "create",
      portal: "employee",
      isCreate: true,
    });
  });

  it("resolves the employee create route", () => {
    const ctx = resolveAssessmentContext("/initial-assessment");
    expect(ctx.mode).toBe("create");
    expect(ctx.portal).toBe("employee");
    expect(ctx.isCreate).toBe(true);
    expect(ctx.isReadOnly).toBe(false);
  });

  it("resolves the employee view route as VIEW + read-only", () => {
    const ctx = resolveAssessmentContext("/view-initial-assessment/abc-123");
    expect(ctx.mode).toBe("view");
    expect(ctx.portal).toBe("employee");
    expect(ctx.isView).toBe(true);
    expect(ctx.isReadOnly).toBe(true); // WHY: read-only is derived from view mode
    expect(ctx.isCreate).toBe(false);
    expect(ctx.isEdit).toBe(false);
  });

  it("resolves the employee edit route as EDIT", () => {
    const ctx = resolveAssessmentContext("/edit-initial-assessment/abc-123");
    expect(ctx.mode).toBe("edit");
    expect(ctx.portal).toBe("employee");
    expect(ctx.isEdit).toBe(true);
    expect(ctx.isReadOnly).toBe(false);
  });

  it("resolves the resident view route to the resident portal", () => {
    const ctx = resolveAssessmentContext(
      "/view-initial-assessment-resident/abc-123",
    );
    expect(ctx.portal).toBe("resident"); // WHY: pathname contains "resident"
    expect(ctx.mode).toBe("view");
    expect(ctx.isView).toBe(true);
    expect(ctx.isReadOnly).toBe(true);
  });

  it("resolves the resident edit route (mixed-case 'Assessment-resident') to resident edit", () => {
    const ctx = resolveAssessmentContext(
      "/edit-initial-Assessment-resident/abc-123",
    );
    expect(ctx.portal).toBe("resident");
    expect(ctx.mode).toBe("edit");
    expect(ctx.isEdit).toBe(true);
  });

  it("resolves the generic /initial-assessment/ id path as EDIT", () => {
    const ctx = resolveAssessmentContext("/initial-assessment/abc-123");
    expect(ctx.mode).toBe("edit");
    expect(ctx.isEdit).toBe(true);
  });

  it("defaults unknown pathnames to EDIT mode", () => {
    // WHY: mode starts at EDIT and only changes when a known prefix matches
    const ctx = resolveAssessmentContext("/something/else");
    expect(ctx.mode).toBe("edit");
    expect(ctx.portal).toBe("employee");
    expect(ctx.isEdit).toBe(true);
  });

  it("keeps the boolean flags mutually consistent with the resolved mode", () => {
    const ctx = resolveAssessmentContext("/view-initial-assessment/x");
    const flagsTrue = [ctx.isCreate, ctx.isView, ctx.isEdit].filter(Boolean);
    expect(flagsTrue.length).toBe(1); // exactly one of create/view/edit is true
  });
});

describe("mapSelectValuesToArray", () => {
  it("returns an empty array by default", () => {
    expect(mapSelectValuesToArray()).toEqual([]);
    expect(mapSelectValuesToArray([])).toEqual([]);
  });

  it("extracts the .value from select-style option objects", () => {
    const items = [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ];
    expect(mapSelectValuesToArray(items)).toEqual(["a", "b"]);
  });

  it("falls back to the item itself when there is no .value", () => {
    // WHY: item?.value ?? item — plain strings and value-less objects pass through
    expect(mapSelectValuesToArray(["x", "y"])).toEqual(["x", "y"]);
    expect(mapSelectValuesToArray([{ label: "no-value" }])).toEqual([
      { label: "no-value" },
    ]);
  });

  it("handles a mix of option objects and raw values", () => {
    expect(mapSelectValuesToArray([{ value: 1 }, 2, { value: 3 }])).toEqual([
      1, 2, 3,
    ]);
  });

  it("treats a falsy value (0) via nullish-coalescing, keeping 0", () => {
    // WHY: ?? only falls back on null/undefined, so value:0 stays 0
    expect(mapSelectValuesToArray([{ value: 0 }])).toEqual([0]);
  });
});

describe("getApiArrayData", () => {
  const source = ["a", "b", "c", "d"];

  it("returns the slice from startIndex up to arrayLength", () => {
    expect(getApiArrayData(1, 3, source)).toEqual(["b", "c"]);
  });

  it("returns the full effective range when start is 0", () => {
    expect(getApiArrayData(0, 4, source)).toEqual(["a", "b", "c", "d"]);
  });

  it("returns an empty array when arrayLength <= startIndex", () => {
    expect(getApiArrayData(3, 3, source)).toEqual([]);
    expect(getApiArrayData(5, 2, source)).toEqual([]);
  });

  it("returns a single element for a one-wide range", () => {
    expect(getApiArrayData(2, 3, source)).toEqual(["c"]);
  });
});
