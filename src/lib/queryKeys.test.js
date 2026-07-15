/** @format */

import { describe, it, expect } from "vitest";
import { queryKeys } from "./queryKeys";

// The query-key factory is the cache contract: keys must be stable arrays so
// invalidation in mutations matches the keys used by queries.
describe("queryKeys", () => {
  it("should build patient keys with the [domain, scope, ...params] shape", () => {
    expect(queryKeys.patient.all()).toEqual(["patient"]);
    expect(queryKeys.patient.detail("res-test-001")).toEqual([
      "patient",
      "detail",
      "res-test-001",
    ]);
    expect(queryKeys.patient.list({ facility: "fac-1" })).toEqual([
      "patient",
      "list",
      { facility: "fac-1" },
    ]);
  });

  it("should build nested medication keys", () => {
    expect(queryKeys.medication.opioid.detail("m1")).toEqual([
      "medication",
      "opioid",
      "detail",
      "m1",
    ]);
    expect(queryKeys.vitals.byPatient("p1", { range: "7d" })).toEqual([
      "vitals",
      "byPatient",
      "p1",
      { range: "7d" },
    ]);
  });

  describe("therapyNotes.list overloads", () => {
    it("should include type and filters when both are given", () => {
      expect(queryKeys.therapyNotes.list("annual", { a: 1 })).toEqual([
        "therapyNotes",
        "annual",
        "list",
        { a: 1 },
      ]);
    });

    it("should include just the type when given a string only", () => {
      expect(queryKeys.therapyNotes.list("annual")).toEqual([
        "therapyNotes",
        "annual",
        "list",
      ]);
    });

    it("should treat a sole object argument as filters", () => {
      expect(queryKeys.therapyNotes.list({ a: 1 })).toEqual([
        "therapyNotes",
        "list",
        { a: 1 },
      ]);
    });
  });

  it("should expose simple list keys", () => {
    expect(queryKeys.facility.list()).toEqual(["facility", "list"]);
    expect(queryKeys.profile.current()).toEqual(["profile", "current"]);
  });
});
