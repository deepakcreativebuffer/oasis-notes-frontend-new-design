/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { setupStore } from "@/test-utils";

import { useFacilities } from "./useFacilities";
import { facilityService } from "../services";

// Mock the service layer so the hook never hits the network.
vi.mock("../services", () => ({
  facilityService: { list: vi.fn() },
}));

const FACILITY = { _id: "fac-test-001", name: "Test Facility" };

function makeWrapper(store) {
  return function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe("useFacilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch facilities on mount when none are loaded and store the response", () => {
    const store = setupStore();
    renderHook(() => useFacilities(), { wrapper: makeWrapper(store) });

    expect(facilityService.list).toHaveBeenCalledTimes(1);

    // Drive the service's setResponse callback to simulate a resolved request.
    const { setResponse } = facilityService.list.mock.calls[0][0];
    act(() => {
      setResponse({ data: { data: [FACILITY] } });
    });

    expect(store.getState().facility.facilities).toEqual([FACILITY]);
  });

  it("should unwrap a response that returns the list directly on data", () => {
    const store = setupStore();
    renderHook(() => useFacilities(), { wrapper: makeWrapper(store) });

    const { setResponse } = facilityService.list.mock.calls[0][0];
    act(() => {
      setResponse({ data: [FACILITY] });
    });

    expect(store.getState().facility.facilities).toEqual([FACILITY]);
  });

  it("should not refetch when facilities are already in the store", () => {
    const store = setupStore({
      facility: {
        selectedFacilityId: null,
        selectedFacility: null,
        facilities: [FACILITY],
      },
    });

    const { result } = renderHook(() => useFacilities(), {
      wrapper: makeWrapper(store),
    });

    // WHY: avoid a redundant facility fetch on every mount once the list is
    // cached in Redux.
    expect(facilityService.list).not.toHaveBeenCalled();
    expect(result.current).toEqual([FACILITY]);
  });
});
