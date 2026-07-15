/** @format */

import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import {
  AssessmentFormRoute,
  EmployeeAssessmentRoute,
  ResidentAssessmentRoute,
} from "./AssessmentFormRoute";
import { useAssessmentFormContext } from "../context/AssessmentFormContext";
import { ASSESSMENT_PORTALS, ASSESSMENT_MODES } from "../utils/constants";

// Lightweight consumer that surfaces the resolved context so tests can assert
// what each route wrapper provides without depending on a real form section.
function ContextProbe() {
  const ctx = useAssessmentFormContext();
  return (
    <div>
      <span data-testid="portal">{ctx.portal}</span>
      <span data-testid="mode">{ctx.mode}</span>
      <span data-testid="readonly">{String(ctx.isReadOnly)}</span>
    </div>
  );
}

describe("AssessmentFormRoute", () => {
  describe("AssessmentFormRoute", () => {
    it("should render its children inside the form provider", () => {
      renderWithProviders(
        <AssessmentFormRoute portal={ASSESSMENT_PORTALS.EMPLOYEE}>
          <div data-testid="child">hello</div>
        </AssessmentFormRoute>,
      );

      expect(screen.getByTestId("child")).toHaveTextContent("hello");
    });

    it("should override the portal with the explicit prop", () => {
      // WHY: the route is on an employee-looking path, but the explicit
      // RESIDENT portal prop must win so the API source is chosen correctly.
      renderWithProviders(
        <AssessmentFormRoute portal={ASSESSMENT_PORTALS.RESIDENT}>
          <ContextProbe />
        </AssessmentFormRoute>,
        { route: "/initial-assessment" },
      );

      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.RESIDENT,
      );
    });
  });

  describe("EmployeeAssessmentRoute", () => {
    it("should provide the employee portal and create mode on the create route", () => {
      renderWithProviders(
        <EmployeeAssessmentRoute>
          <ContextProbe />
        </EmployeeAssessmentRoute>,
        { route: "/initial-assessment" },
      );

      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.EMPLOYEE,
      );
      expect(screen.getByTestId("mode")).toHaveTextContent(
        ASSESSMENT_MODES.CREATE,
      );
    });

    it("should resolve view mode (read-only) from a view route", () => {
      // WHY: view routes must mark the context read-only so sections render
      // disabled inputs for staff reviewing a submitted assessment.
      renderWithProviders(
        <EmployeeAssessmentRoute>
          <ContextProbe />
        </EmployeeAssessmentRoute>,
        { route: "/view-initial-assessment/res-test-001" },
      );

      expect(screen.getByTestId("mode")).toHaveTextContent(
        ASSESSMENT_MODES.VIEW,
      );
      expect(screen.getByTestId("readonly")).toHaveTextContent("true");
    });
  });

  describe("ResidentAssessmentRoute", () => {
    it("should provide the resident portal", () => {
      renderWithProviders(
        <ResidentAssessmentRoute>
          <ContextProbe />
        </ResidentAssessmentRoute>,
        { route: "/view-initial-assessment-resident/res-test-001" },
      );

      expect(screen.getByTestId("portal")).toHaveTextContent(
        ASSESSMENT_PORTALS.RESIDENT,
      );
    });
  });
});
