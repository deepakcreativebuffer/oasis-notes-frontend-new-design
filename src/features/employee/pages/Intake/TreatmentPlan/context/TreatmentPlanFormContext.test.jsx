/** @format */

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, render, screen } from "@testing-library/react";

import {
  TreatmentPlanFormProvider,
  useTreatmentPlanFormContext,
} from "./TreatmentPlanFormContext";

// This is a tiny, pure React context module (no services / IO to mock).
// We exercise: the consumer hook reads the provided value, the provider
// passes children through, and the hook throws when used outside a provider.
describe("TreatmentPlanFormContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports a provider component and a consumer hook", () => {
    expect(typeof TreatmentPlanFormProvider).toBe("function");
    expect(typeof useTreatmentPlanFormContext).toBe("function");
  });

  it("provides the supplied context value to consumers", () => {
    // Mimic the real form context shape: controlled fields + many setters.
    const value = {
      residentId: "res-test-001",
      employeeId: "emp-test-001",
      formData: { problem: "Test Problem" },
      setFormData: vi.fn(),
      handleSave: vi.fn(),
    };

    const wrapper = ({ children }) => (
      <TreatmentPlanFormProvider value={value}>
        {children}
      </TreatmentPlanFormProvider>
    );

    const { result } = renderHook(() => useTreatmentPlanFormContext(), {
      wrapper,
    });

    // WHY: the hook must return the exact object reference passed to the provider.
    expect(result.current).toBe(value);
    expect(result.current.residentId).toBe("res-test-001");
    expect(result.current.formData.problem).toBe("Test Problem");
    expect(typeof result.current.setFormData).toBe("function");
  });

  it("renders provider children", () => {
    render(
      <TreatmentPlanFormProvider value={{ formData: {} }}>
        <span>child-content</span>
      </TreatmentPlanFormProvider>,
    );
    expect(screen.getByText("child-content")).toBeInTheDocument();
  });

  it("throws a descriptive error when used outside a provider", () => {
    // WHY: useContext returns null without a provider; the hook guards against
    // it. Silence the expected React error-boundary console noise.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTreatmentPlanFormContext())).toThrow(
      /must be used within TreatmentPlanFormProvider/,
    );
    spy.mockRestore();
  });
});
