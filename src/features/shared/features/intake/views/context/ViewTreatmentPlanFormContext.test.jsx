/** @format */

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, render, screen } from "@testing-library/react";

import {
  ViewTreatmentPlanFormProvider,
  useViewTreatmentPlanFormContext,
} from "./ViewTreatmentPlanFormContext";

describe("ViewTreatmentPlanFormContext", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should expose the provided value to consumers inside the provider", () => {
    const value = {
      patient: { name: "Test Patient", mrn: "MRN-TEST-001" },
      answers: { goal: "Improve mobility" },
    };
    const wrapper = ({ children }) => (
      <ViewTreatmentPlanFormProvider value={value}>
        {children}
      </ViewTreatmentPlanFormProvider>
    );

    const { result } = renderHook(() => useViewTreatmentPlanFormContext(), {
      wrapper,
    });

    // WHY: the read-only treatment-plan view reads patient/answers via context;
    // the same object reference must reach consumers without mutation.
    expect(result.current).toBe(value);
    expect(result.current.patient.mrn).toBe("MRN-TEST-001");
  });

  it("should render children passed to the provider", () => {
    render(
      <ViewTreatmentPlanFormProvider value={{}}>
        <span>plan content</span>
      </ViewTreatmentPlanFormProvider>,
    );
    expect(screen.getByText("plan content")).toBeInTheDocument();
  });

  it("should let a real consumer component read context fields", () => {
    function Consumer() {
      const ctx = useViewTreatmentPlanFormContext();
      return <div>{ctx.patient.name}</div>;
    }

    render(
      <ViewTreatmentPlanFormProvider
        value={{ patient: { name: "Test Patient" } }}
      >
        <Consumer />
      </ViewTreatmentPlanFormProvider>,
    );

    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should throw a descriptive error when used outside the provider", () => {
    // WHY: guards against rendering treatment-plan sections without their data
    // provider, which would otherwise surface as a confusing null-read crash.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useViewTreatmentPlanFormContext())).toThrow(
      "useViewTreatmentPlanFormContext must be used within ViewTreatmentPlanFormProvider",
    );
    spy.mockRestore();
  });

  it("should propagate updated context values on re-render", () => {
    function Consumer() {
      const ctx = useViewTreatmentPlanFormContext();
      return <div>{ctx.answers.goal}</div>;
    }

    const { rerender } = render(
      <ViewTreatmentPlanFormProvider value={{ answers: { goal: "first" } }}>
        <Consumer />
      </ViewTreatmentPlanFormProvider>,
    );
    expect(screen.getByText("first")).toBeInTheDocument();

    rerender(
      <ViewTreatmentPlanFormProvider value={{ answers: { goal: "second" } }}>
        <Consumer />
      </ViewTreatmentPlanFormProvider>,
    );
    // WHY: when the underlying treatment-plan answers change, consumers must
    // re-render with the latest values rather than stale data.
    expect(screen.getByText("second")).toBeInTheDocument();
  });
});
