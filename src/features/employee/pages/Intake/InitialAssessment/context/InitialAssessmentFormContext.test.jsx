/** @format */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  InitialAssessmentFormProvider,
  useInitialAssessmentFormContext,
} from "./InitialAssessmentFormContext";

// This context is the shared form bus for the Initial Assessment sections:
// a Provider that passes a `value` straight through and a guarded consumer
// hook that throws when used outside the Provider.
describe("InitialAssessmentFormContext", () => {
  it("returns the exact value object provided by the Provider", () => {
    const formValue = {
      patientId: "res-test-001",
      setNeed: vi.fn(),
      admissionStatus: ["BHRF"],
    };
    const wrapper = ({ children }) => (
      <InitialAssessmentFormProvider value={formValue}>
        {children}
      </InitialAssessmentFormProvider>
    );

    const { result } = renderHook(() => useInitialAssessmentFormContext(), {
      wrapper,
    });

    // WHY: sections read this object directly; identity must be preserved so
    // setters/state shared via context are the same references the form owns.
    expect(result.current).toBe(formValue);
    expect(result.current.patientId).toBe("res-test-001");
    expect(result.current.admissionStatus).toEqual(["BHRF"]);
    result.current.setNeed("x");
    expect(formValue.setNeed).toHaveBeenCalledWith("x");
  });

  it("throws a descriptive error when used outside the Provider", () => {
    // WHY: a missing Provider is a wiring bug; the guard surfaces it loudly
    // instead of letting consumers read undefined context.
    expect(() => renderHook(() => useInitialAssessmentFormContext())).toThrow(
      "useInitialAssessmentFormContext must be used within InitialAssessmentFormProvider",
    );
  });

  it("throws when the Provider value is explicitly null", () => {
    const wrapper = ({ children }) => (
      <InitialAssessmentFormProvider value={null}>
        {children}
      </InitialAssessmentFormProvider>
    );
    // WHY: the hook guards on falsy context (default is null), so a null value
    // is treated the same as no Provider.
    expect(() =>
      renderHook(() => useInitialAssessmentFormContext(), { wrapper }),
    ).toThrow(/must be used within InitialAssessmentFormProvider/);
  });

  it("exposes the Provider component and consumer hook as functions", () => {
    // WHY: barrel-style smoke check that the public API surface stays stable.
    expect(typeof InitialAssessmentFormProvider).toBe("function");
    expect(typeof useInitialAssessmentFormContext).toBe("function");
  });
});
