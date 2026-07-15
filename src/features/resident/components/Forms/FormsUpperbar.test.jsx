/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import FormsUpperbar from "./FormsUpperbar";

describe("FormsUpperbar (resident intake header)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render uppercase Annual/Initial assessment labels", () => {
    // WHY: resident barrel forwards uppercaseLabels=true into AssessmentTypeHeader
    renderWithProviders(
      <FormsUpperbar
        assessmentType="Initial Assessment"
        setAssessmentType={vi.fn()}
      />,
    );

    expect(screen.getByText("ANNUAL ASSESSMENT")).toBeInTheDocument();
    expect(
      screen.getAllByText("INITIAL ASSESSMENT").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("should show the hidden print title reflecting the selected assessment type", () => {
    // WHY: showPrintTitle=true is hard-wired by the resident wrapper
    const { container } = renderWithProviders(
      <FormsUpperbar
        assessmentType="Annual Assessment"
        setAssessmentType={vi.fn()}
      />,
    );

    const printTitle = container.querySelector(".pdfTitle");
    expect(printTitle).not.toBeNull();
    expect(printTitle).toHaveTextContent("ANNUAL ASSESSMENT");
  });

  it("should check the box matching the active assessment type", () => {
    renderWithProviders(
      <FormsUpperbar
        assessmentType="Initial Assessment"
        setAssessmentType={vi.fn()}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // First checkbox is Annual, second is Initial (per AssessmentTypeHeader order)
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("should invoke setAssessmentType when a label is toggled", async () => {
    const user = userEvent.setup();
    const setAssessmentType = vi.fn();
    renderWithProviders(
      <FormsUpperbar
        assessmentType="Initial Assessment"
        setAssessmentType={setAssessmentType}
      />,
    );

    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(setAssessmentType).toHaveBeenCalledWith("Annual Assessment");
  });

  it("should forward the disabled prop to the checkboxes", () => {
    renderWithProviders(
      <FormsUpperbar
        assessmentType="Initial Assessment"
        setAssessmentType={vi.fn()}
        disabled
      />,
    );

    screen.getAllByRole("checkbox").forEach((cb) => {
      expect(cb).toBeDisabled();
    });
  });
});
