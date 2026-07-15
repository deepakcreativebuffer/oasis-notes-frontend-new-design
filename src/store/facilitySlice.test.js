/** @format */

import { describe, it, expect } from "vitest";
import reducer, {
  setSelectedFacilityId,
  setSelectedFacility,
  setFacilities,
  selectSelectedFacilityId,
  selectSelectedFacility,
  selectFacilities,
} from "./facilitySlice";

const INITIAL = {
  selectedFacilityId: null,
  selectedFacility: null,
  facilities: [],
};

const FACILITY = { _id: "fac-test-001", name: "Test Facility" };

describe("facilitySlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(INITIAL);
  });

  it("should set the selected facility id", () => {
    const state = reducer(INITIAL, setSelectedFacilityId("fac-test-001"));
    expect(state.selectedFacilityId).toBe("fac-test-001");
  });

  it("should set the selected facility object", () => {
    const state = reducer(INITIAL, setSelectedFacility(FACILITY));
    expect(state.selectedFacility).toEqual(FACILITY);
  });

  it("should set the facilities list", () => {
    const state = reducer(INITIAL, setFacilities([FACILITY]));
    expect(state.facilities).toEqual([FACILITY]);
  });

  it("should expose all three selectors", () => {
    const root = {
      facility: {
        selectedFacilityId: "fac-test-001",
        selectedFacility: FACILITY,
        facilities: [FACILITY],
      },
    };
    expect(selectSelectedFacilityId(root)).toBe("fac-test-001");
    expect(selectSelectedFacility(root)).toEqual(FACILITY);
    expect(selectFacilities(root)).toEqual([FACILITY]);
  });
});
