/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

import useNavigateWithParams from "./useNavigateWithParams";

// Mutable location stand-in so each test can set the current query string.
const mockLocation = { search: "" };
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe("useNavigateWithParams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.search = "";
  });

  it("should expose the current search string", () => {
    mockLocation.search = "?applicationId=app-test-001";
    const { result } = renderHook(() => useNavigateWithParams());
    expect(result.current.searchParams).toBe("?applicationId=app-test-001");
  });

  it("should append the current query string when navigating", () => {
    mockLocation.search = "?applicationId=app-test-001";
    const { result } = renderHook(() => useNavigateWithParams());

    result.current.navigateWithParams("/employment/step-2");

    // WHY: multi-step flows (e.g. employment application) carry an id in the
    // query string; navigation must preserve it or the flow loses context.
    expect(mockNavigate).toHaveBeenCalledWith(
      "/employment/step-2?applicationId=app-test-001",
    );
  });

  it("should navigate to the bare url when there is no query string", () => {
    const { result } = renderHook(() => useNavigateWithParams());
    result.current.navigateWithParams("/home");
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
