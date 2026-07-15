/** @format */

import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import AssessmentTypeHeader from "./AssessmentTypeHeader";

describe("AssessmentTypeHeader", () => {
  it("should render the Annual and Initial assessment options", () => {
    render(
      <AssessmentTypeHeader
        assessmentType="Initial Assessment"
        setAssessmentType={vi.fn()}
      />,
    );
    expect(screen.getByText("Annual Assessment")).toBeInTheDocument();
    expect(screen.getByText("Initial Assessment")).toBeInTheDocument();
  });

  it("should check the box matching the current assessment type", () => {
    render(
      <AssessmentTypeHeader
        assessmentType="Annual Assessment"
        setAssessmentType={vi.fn()}
      />,
    );
    // Markup order is [Annual, Initial]; labels aren't associated to inputs, so
    // query the checkbox group positionally.
    const [annual, initial] = screen.getAllByRole("checkbox");
    expect(annual).toBeChecked();
    expect(initial).not.toBeChecked();
  });

  it("should call setAssessmentType with the chosen type when a box is clicked", async () => {
    const user = userEvent.setup();
    const setAssessmentType = vi.fn();
    render(
      <AssessmentTypeHeader
        assessmentType="Annual Assessment"
        setAssessmentType={setAssessmentType}
      />,
    );

    const [, initial] = screen.getAllByRole("checkbox");
    await user.click(initial);

    // WHY: intake forms branch on assessment type (Annual vs Initial); the
    // selection must propagate up so the right form/schema renders.
    expect(setAssessmentType).toHaveBeenCalledWith("Initial Assessment");
  });

  it("should disable both options when disabled is true", () => {
    render(
      <AssessmentTypeHeader
        assessmentType="Initial Assessment"
        setAssessmentType={vi.fn()}
        disabled
      />,
    );
    screen
      .getAllByRole("checkbox")
      .forEach((box) => expect(box).toBeDisabled());
  });

  it("should render uppercase labels and the print title when requested", () => {
    render(
      <AssessmentTypeHeader
        assessmentType="Annual Assessment"
        setAssessmentType={vi.fn()}
        uppercaseLabels
        showPrintTitle
      />,
    );
    // Both the print-only heading and the uppercase label read "ANNUAL
    // ASSESSMENT", so there should be at least two matches.
    const headings = screen.getAllByText("ANNUAL ASSESSMENT");
    expect(headings.length).toBeGreaterThanOrEqual(2);
  });
});
