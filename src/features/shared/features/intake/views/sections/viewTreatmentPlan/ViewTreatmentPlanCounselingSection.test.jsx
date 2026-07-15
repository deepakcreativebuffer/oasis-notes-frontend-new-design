/** @format */

import React from "react";
import { render, screen } from "@/test-utils";
import ViewTreatmentPlanCounselingSection from "./ViewTreatmentPlanCounselingSection";

// Mock the form context hook so we can drive the read-only view section with
// controlled return values instead of wiring a full provider tree.
const mockUseContext = vi.fn();
vi.mock("../../context/ViewTreatmentPlanFormContext", () => ({
  useViewTreatmentPlanFormContext: () => mockUseContext(),
}));

// Minimal default context value matching the shape the component reads.
function makeContext(overrides = {}) {
  return {
    minimumHoure: "",
    counselingOptions: [],
    counselingOptionsTextBoolean: false,
    counselingOptionsText: "",
    IndividualComment: "",
    handleCheckboxChangeCounsiling: vi.fn(),
    ...overrides,
  };
}

describe("ViewTreatmentPlanCounselingSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing when there are no counseling hours and no options selected", () => {
    // WHY: the entire section is gated behind minimumHoure || counselingOptions.length,
    // so an empty intake should render no counseling content in the printed plan.
    mockUseContext.mockReturnValue(makeContext());
    const { container } = render(<ViewTreatmentPlanCounselingSection />);
    expect(
      screen.queryByText("Counseling Frequency and Duration"),
    ).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the section heading and minimum hours when data is present", () => {
    mockUseContext.mockReturnValue(
      makeContext({ minimumHoure: "6", counselingOptions: ["Group"] }),
    );
    render(<ViewTreatmentPlanCounselingSection />);
    expect(
      screen.getByText("Counseling Frequency and Duration"),
    ).toBeInTheDocument();
    // WHY: the recorded minimum number of counseling hours must surface for review.
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("should check the counseling options that the resident has on file", () => {
    mockUseContext.mockReturnValue(
      makeContext({
        minimumHoure: "3",
        counselingOptions: ["Group", "Family Counseling"],
      }),
    );
    render(<ViewTreatmentPlanCounselingSection />);
    // WHY: a selected option must render as a checked box so the reviewer sees
    // exactly which counseling modalities were documented.
    expect(screen.getByRole("checkbox", { name: "Group" })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Family Counseling" }),
    ).toBeChecked();
    // An option not on file must remain unchecked.
    expect(screen.getByRole("checkbox", { name: "AA" })).not.toBeChecked();
  });

  it("should render the free-text 'Other' value when the Other flag is set", () => {
    mockUseContext.mockReturnValue(
      makeContext({
        minimumHoure: "2",
        counselingOptions: ["Other"],
        counselingOptionsTextBoolean: true,
        counselingOptionsText: "Test Patient custom counseling note",
      }),
    );
    render(<ViewTreatmentPlanCounselingSection />);
    // WHY: when "Other" is chosen the clinician's free-text detail must be shown.
    expect(
      screen.getByText("Test Patient custom counseling note"),
    ).toBeInTheDocument();
  });

  it("should render the Individual Therapy comment only when that option is selected", () => {
    mockUseContext.mockReturnValue(
      makeContext({
        minimumHoure: "1",
        counselingOptions: ["Individual Therapy: Please Specify"],
        IndividualComment: "Weekly trauma-focused therapy",
      }),
    );
    render(<ViewTreatmentPlanCounselingSection />);
    // WHY: the "Please Specify" branch reveals the documented therapy detail.
    expect(
      screen.getByText("Weekly trauma-focused therapy"),
    ).toBeInTheDocument();
  });

  it("should render the section based on options even when minimum hours are empty", () => {
    // WHY: the gate is an OR, so options alone (without minimumHoure) still
    // show the section in the view/print.
    mockUseContext.mockReturnValue(
      makeContext({ minimumHoure: "", counselingOptions: ["NA"] }),
    );
    render(<ViewTreatmentPlanCounselingSection />);
    expect(
      screen.getByText("Counseling Frequency and Duration"),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "NA" })).toBeChecked();
  });
});
