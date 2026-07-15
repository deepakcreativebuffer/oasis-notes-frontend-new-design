/** @format */

import { describe, it, expect } from "vitest";
import reducer, {
  setResidents,
  setActiveResident,
  selectResidents,
  selectActiveResident,
} from "./residentSlice";

const INITIAL = { residents: [], activeResident: null };

// Fake patient records only — never realistic PHI.
const RESIDENTS = [
  { _id: "res-test-001", name: "Test Patient One", mrn: "MRN-TEST-001" },
  { _id: "res-test-002", name: "Test Patient Two", mrn: "MRN-TEST-002" },
];

describe("residentSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("should set the residents list", () => {
    const state = reducer(INITIAL, setResidents(RESIDENTS));
    expect(state.residents).toEqual(RESIDENTS);
  });

  it("should set the active resident", () => {
    const state = reducer(INITIAL, setActiveResident(RESIDENTS[0]));
    // WHY: the active resident scopes the chart view; selecting one must not
    // mutate the full roster.
    expect(state.activeResident).toEqual(RESIDENTS[0]);
    expect(state.residents).toEqual([]);
  });

  it("should select residents and the active resident", () => {
    const root = {
      resident: { residents: RESIDENTS, activeResident: RESIDENTS[1] },
    };
    expect(selectResidents(root)).toEqual(RESIDENTS);
    expect(selectActiveResident(root)).toEqual(RESIDENTS[1]);
  });
});
