/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import {
  AssessmentFormRoute,
  EmployeeAssessmentRoute,
  ResidentAssessmentRoute,
} from "./AssessmentFormRoutes";
import { useAssessmentFormContext } from "@/features/employee/pages/Intake/InitialAssessment/context/AssessmentFormContext";
import {
  ASSESSMENT_PORTALS,
  ASSESSMENT_MODES,
} from "@/features/shared/intake/assessmentConstants";

// Probe consumer: surfaces the resolved assessment context so we can assert the
// portal/mode the route wrappers inject, without reaching into internal state.
function ContextProbe() {
  const { portal, mode } = useAssessmentFormContext();
  return (
    <div>
      <span data-testid="portal">{portal}</span>
      <span data-testid="mode">{mode}</span>
      <span>probe-child</span>
    </div>
  );
}

describe("AssessmentFormRoutes", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("AssessmentFormRoute", () => {
    it("should render its children inside the form context provider", () => {
      renderWithProviders(
        <AssessmentFormRoute portal={ASSESSMENT_PORTALS.EMPLOYEE}>
          <ContextProbe />
        </AssessmentFormRoute>,
      );

      // WHY: assessment route wrappers must pass through their children so the
      // actual assessment form still renders under the portal context.
      expect(screen.getByText("probe-child")).toBeInTheDocument();
    });

    it("should override the portal value with the explicit portal prop", () => {
      // Route says "employee" but we force the resident portal explicitly.
      renderWithProviders(
        <AssessmentFormRoute portal={ASSESSMENT_PORTALS.RESIDENT}>
          <ContextProbe />
        </AssessmentFormRoute>,
        { route: "/initial-assessment" },
      );

      // WHY: API source / routing differ per portal, so an explicit portal
      // override must win over whatever the pathname would imply.
      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.RESIDENT,
      );
    });
  });

  describe("EmployeeAssessmentRoute", () => {
    it("should provide the employee portal to its children", () => {
      renderWithProviders(
        <EmployeeAssessmentRoute>
          <ContextProbe />
        </EmployeeAssessmentRoute>,
        { route: "/initial-assessment" },
      );

      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.EMPLOYEE,
      );
      // WHY: /initial-assessment is the employee create route, so mode should
      // resolve to CREATE — confirms route-derived context still flows through.
      expect(screen.getByTestId("mode")).toHaveTextContent(
        ASSESSMENT_MODES.CREATE,
      );
    });

    it("should keep the employee portal even on a resident-looking path", () => {
      // Pathname contains "resident" but the Employee wrapper forces employee.
      renderWithProviders(
        <EmployeeAssessmentRoute>
          <ContextProbe />
        </EmployeeAssessmentRoute>,
        { route: "/view-initial-assessment-resident/res-test-001" },
      );

      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.EMPLOYEE,
      );
    });
  });

  describe("ResidentAssessmentRoute", () => {
    it("should provide the resident portal to its children", () => {
      renderWithProviders(
        <ResidentAssessmentRoute>
          <ContextProbe />
        </ResidentAssessmentRoute>,
        { route: "/view-initial-assessment-resident/res-test-001" },
      );

      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.RESIDENT,
      );
      // WHY: a /view-* path is read-only; mode must resolve to VIEW so the
      // resident-facing form opens non-editable.
      expect(screen.getByTestId("mode")).toHaveTextContent(
        ASSESSMENT_MODES.VIEW,
      );
    });

    it("should force the resident portal even on an employee-style path", () => {
      renderWithProviders(
        <ResidentAssessmentRoute>
          <ContextProbe />
        </ResidentAssessmentRoute>,
        { route: "/initial-assessment" },
      );

      // WHY: the Resident wrapper is an explicit override; an employee-shaped
      // pathname must not leak the employee portal to a resident user.
      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.RESIDENT,
      );
    });
  });
});
