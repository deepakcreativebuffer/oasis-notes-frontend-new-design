/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, render, screen } from "@testing-library/react";

import {
  ResidentIntakeFormProvider,
  useResidentIntakeFormContext,
} from "./ResidentIntakeFormContext";

// This module is a pure React context (no IO/services), so nothing to mock.

beforeEach(() => vi.clearAllMocks());

describe("ResidentIntakeFormContext", () => {
  it("exports the provider and hook", () => {
    expect(ResidentIntakeFormProvider).toBeTypeOf("function");
    expect(useResidentIntakeFormContext).toBeTypeOf("function");
  });

  it("provides the supplied value to consumers via the hook", () => {
    // FAKE PHI only.
    const value = {
      residentId: "res-test-001",
      formData: { firstName: "Test", lastName: "Patient", mrn: "MRN-TEST-001" },
      setFieldValue: vi.fn(),
      handleSubmit: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <ResidentIntakeFormProvider value={value}>
        {children}
      </ResidentIntakeFormProvider>
    );

    const { result } = renderHook(() => useResidentIntakeFormContext(), {
      wrapper,
    });

    // Hook returns the exact value object passed to the provider.
    expect(result.current).toBe(value);
    expect(result.current.residentId).toBe("res-test-001");
    expect(result.current.formData.mrn).toBe("MRN-TEST-001");
  });

  it("forwards setter calls through the provided value", () => {
    const setFieldValue = vi.fn();
    const wrapper = ({ children }) => (
      <ResidentIntakeFormProvider value={{ setFieldValue }}>
        {children}
      </ResidentIntakeFormProvider>
    );

    const { result } = renderHook(() => useResidentIntakeFormContext(), {
      wrapper,
    });

    result.current.setFieldValue("firstName", "Test");
    expect(setFieldValue).toHaveBeenCalledWith("firstName", "Test");
  });

  it("renders children inside the provider", () => {
    render(
      <ResidentIntakeFormProvider value={{}}>
        <div>intake-child</div>
      </ResidentIntakeFormProvider>,
    );
    expect(screen.getByText("intake-child")).toBeInTheDocument();
  });

  it("throws a descriptive error when the hook is used outside the provider", () => {
    // The hook guards against a null context by throwing.
    expect(() => renderHook(() => useResidentIntakeFormContext())).toThrow(
      "useResidentIntakeFormContext must be used within ResidentIntakeFormProvider",
    );
  });
});
