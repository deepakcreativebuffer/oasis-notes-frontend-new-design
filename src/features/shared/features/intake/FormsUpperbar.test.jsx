/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import FormUpper from "./FormsUpperbar";

describe("FormsUpperbar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render both assessment-type checkboxes with uppercase labels", () => {
    render(<FormUpper assessmentType="" setAssessmentType={vi.fn()} />);

    // WHY: intake forms for Resident/Guardian must show ANNUAL vs INITIAL
    // toggle in uppercase (uppercaseLabels prop forwarded by the wrapper).
    // Query the <label> elements since the print <h1> also carries this text.
    const labels = screen.getAllByText((_, el) => el?.tagName === "LABEL");
    expect(labels.map((l) => l.textContent)).toEqual([
      "ANNUAL ASSESSMENT",
      "INITIAL ASSESSMENT",
    ]);
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("should render the hidden print title reflecting the selected type", () => {
    const { container } = render(
      <FormUpper
        assessmentType="Annual Assessment"
        setAssessmentType={vi.fn()}
      />,
    );

    // WHY: showPrintTitle is forced on by the wrapper so the PDF export of the
    // intake form carries the assessment type as a heading.
    const title = container.querySelector("h1.pdfTitle");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("ANNUAL ASSESSMENT");
  });

  it("should reflect the Annual selection as a checked checkbox", () => {
    render(
      <FormUpper
        assessmentType="Annual Assessment"
        setAssessmentType={vi.fn()}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // WHY: the Annual box is first; only it should be checked when Annual is
    // the active assessment type.
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should call setAssessmentType with the chosen type on click", () => {
    const setAssessmentType = vi.fn();
    render(
      <FormUpper assessmentType="" setAssessmentType={setAssessmentType} />,
    );

    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    // WHY: selecting the Initial box must commit "Initial Assessment" upstream.
    expect(setAssessmentType).toHaveBeenCalledWith("Initial Assessment");
  });

  it("should forward the disabled prop to both checkboxes", () => {
    render(
      <FormUpper assessmentType="" setAssessmentType={vi.fn()} disabled />,
    );

    // WHY: read-only/locked intake forms disable the toggle for all roles.
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
  });
});
