/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders, screen } from "@/test-utils";

import {
  AssessmentFormProvider,
  useAssessmentFormContext,
  useAssessmentFormContextOptional,
} from "./AssessmentFormContext";

// WHY: the provider derives its value from the real route resolver. We exercise
// it through real routes (no mock) so the test pins the wiring between
// useLocation -> resolveAssessmentContext -> context value. The resolver is
// unit-tested elsewhere; here we only assert the provider surfaces it correctly.

// Small consumer that prints the context fields it receives.
function ContextProbe() {
  const ctx = useAssessmentFormContext();
  return (
    <div>
      <span data-testid="mode">{ctx.mode}</span>
      <span data-testid="portal">{ctx.portal}</span>
      <span data-testid="isCreate">{String(ctx.isCreate)}</span>
      <span data-testid="isView">{String(ctx.isView)}</span>
      <span data-testid="isEdit">{String(ctx.isEdit)}</span>
      <span data-testid="isReadOnly">{String(ctx.isReadOnly)}</span>
    </div>
  );
}

// renderHook wrapper that only mounts MemoryRouter + provider (no redux/query
// needed by this context). Lets us read the hook return value directly.
const makeWrapper =
  (route, portal) =>
  ({ children }) => (
    <MemoryRouter initialEntries={[route]}>
      <AssessmentFormProvider portal={portal}>
        {children}
      </AssessmentFormProvider>
    </MemoryRouter>
  );

describe("AssessmentFormContext", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should resolve CREATE/employee for the create route", () => {
    renderWithProviders(
      <AssessmentFormProvider>
        <ContextProbe />
      </AssessmentFormProvider>,
      { route: "/initial-assessment" },
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("create");
    expect(screen.getByTestId("portal")).toHaveTextContent("employee");
    expect(screen.getByTestId("isCreate")).toHaveTextContent("true");
    expect(screen.getByTestId("isView")).toHaveTextContent("false");
    expect(screen.getByTestId("isReadOnly")).toHaveTextContent("false");
  });

  it("should resolve VIEW + read-only for the employee view route", () => {
    renderWithProviders(
      <AssessmentFormProvider>
        <ContextProbe />
      </AssessmentFormProvider>,
      { route: "/view-initial-assessment/res-test-001" },
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("view");
    expect(screen.getByTestId("isView")).toHaveTextContent("true");
    // WHY: view mode is the only one that flips isReadOnly on.
    expect(screen.getByTestId("isReadOnly")).toHaveTextContent("true");
  });

  it("should resolve EDIT for the employee edit route", () => {
    renderWithProviders(
      <AssessmentFormProvider>
        <ContextProbe />
      </AssessmentFormProvider>,
      { route: "/edit-initial-assessment/res-test-001" },
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("edit");
    expect(screen.getByTestId("isEdit")).toHaveTextContent("true");
    expect(screen.getByTestId("isReadOnly")).toHaveTextContent("false");
  });

  it("should resolve the resident portal from a resident route", () => {
    renderWithProviders(
      <AssessmentFormProvider>
        <ContextProbe />
      </AssessmentFormProvider>,
      { route: "/view-initial-assessment-resident/res-test-001" },
    );

    expect(screen.getByTestId("portal")).toHaveTextContent("resident");
    expect(screen.getByTestId("mode")).toHaveTextContent("view");
  });

  it("should let the portal override prop win over the route-derived portal", () => {
    // WHY: portalOverride is the escape hatch for embedding the form in a
    // different portal than the URL implies; it must take precedence.
    const { result } = renderHook(() => useAssessmentFormContext(), {
      wrapper: makeWrapper("/initial-assessment", "resident"),
    });

    expect(result.current.portal).toBe("resident");
    // Mode still comes from the route.
    expect(result.current.mode).toBe("create");
  });

  it("should throw when useAssessmentFormContext is used outside a provider", () => {
    // WHY: the required hook guards against silent undefined-context bugs.
    expect(() =>
      renderHook(() => useAssessmentFormContext(), {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      }),
    ).toThrow(/must be used within AssessmentFormProvider/);
  });

  it("should return null (not throw) from the optional hook when no provider", () => {
    const { result } = renderHook(() => useAssessmentFormContextOptional(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });
    expect(result.current).toBeNull();
  });

  it("should expose the context object via the optional hook inside a provider", () => {
    const { result } = renderHook(() => useAssessmentFormContextOptional(), {
      wrapper: makeWrapper("/initial-assessment", undefined),
    });
    expect(result.current).toMatchObject({
      mode: "create",
      portal: "employee",
      isCreate: true,
    });
  });
});
