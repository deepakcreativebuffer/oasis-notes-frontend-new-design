/** @format */

import { describe, it, expect } from "vitest";
import { mergeDynamicFormSnapshots } from "./formSnapshotBridge";

// mergeDynamicFormSnapshots flattens grouped section snapshots into the single
// flat object consumed by buildAssessmentPayload. The merge contract (later
// snapshots win, no mutation of inputs) is the load-bearing behavior here.
describe("mergeDynamicFormSnapshots", () => {
  it("returns an empty object when called with no arguments", () => {
    expect(mergeDynamicFormSnapshots()).toEqual({});
  });

  it("returns an empty object for an empty snapshots map", () => {
    expect(mergeDynamicFormSnapshots({})).toEqual({});
  });

  it("flattens a single group snapshot into a flat object", () => {
    const snapshots = {
      riskFactors: { suicideRisk: "low", fallRisk: "high" },
    };
    expect(mergeDynamicFormSnapshots(snapshots)).toEqual({
      suicideRisk: "low",
      fallRisk: "high",
    });
  });

  it("merges fields from multiple group snapshots", () => {
    const snapshots = {
      demographics: { mrn: "MRN-TEST-001", name: "Test Patient" },
      riskFactors: { fallRisk: "high" },
    };
    expect(mergeDynamicFormSnapshots(snapshots)).toEqual({
      mrn: "MRN-TEST-001",
      name: "Test Patient",
      fallRisk: "high",
    });
  });

  it("lets later snapshot values override earlier ones for the same key", () => {
    // Object.values iteration order follows insertion order, so groupB wins.
    const snapshots = {
      groupA: { status: "draft" },
      groupB: { status: "final" },
    };
    expect(mergeDynamicFormSnapshots(snapshots).status).toBe("final");
  });

  it("does not mutate the input snapshots", () => {
    const groupA = { a: 1 };
    const snapshots = { groupA };
    mergeDynamicFormSnapshots(snapshots);
    expect(groupA).toEqual({ a: 1 });
    expect(snapshots).toEqual({ groupA: { a: 1 } });
  });

  it("returns a new object distinct from any input snapshot", () => {
    const groupA = { a: 1 };
    const result = mergeDynamicFormSnapshots({ groupA });
    expect(result).not.toBe(groupA);
    expect(result).toEqual({ a: 1 });
  });

  it("preserves falsy and nested values from snapshots", () => {
    const nested = { details: { score: 0 } };
    const snapshots = {
      flags: { active: false, count: 0, note: "" },
      meta: nested,
    };
    const result = mergeDynamicFormSnapshots(snapshots);
    expect(result.active).toBe(false);
    expect(result.count).toBe(0);
    expect(result.note).toBe("");
    // Nested object references are carried over by spread (shallow merge).
    expect(result.details).toBe(nested.details);
  });
});
