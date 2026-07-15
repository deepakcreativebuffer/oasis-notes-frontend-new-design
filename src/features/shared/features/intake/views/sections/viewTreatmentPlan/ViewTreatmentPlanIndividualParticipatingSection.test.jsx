/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import { ViewTreatmentPlanFormProvider } from "../../context/ViewTreatmentPlanFormContext";
import ViewTreatmentPlanIndividualParticipatingSection from "./ViewTreatmentPlanIndividualParticipatingSection";

// This is a read-only "View*" section driven entirely by the treatment-plan
// form context. There is no service/IO to mock; we feed controlled context
// values and assert what the clinician sees on the printed/viewed plan.

const baseValue = {
  resident: "",
  guardian: "",
  staff: "",
  bpn: "",
  otherIndividual: "",
  commentIndividual: "",
  isReason: "",
  setIsReason: vi.fn(),
};

function renderSection(value = {}) {
  const merged = { ...baseValue, ...value };
  return {
    merged,
    ...render(
      <ViewTreatmentPlanFormProvider value={merged}>
        <ViewTreatmentPlanIndividualParticipatingSection />
      </ViewTreatmentPlanFormProvider>,
    ),
  };
}

describe("ViewTreatmentPlanIndividualParticipatingSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the section heading and agreement labels", () => {
    renderSection();

    // WHY: the section header and the resident/representative agreement block
    // are always present regardless of which participant fields are filled.
    expect(
      screen.getByText(
        "Individual Participating in Developing the Service Plan",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Resident / Representative :")).toBeInTheDocument();
  });

  it("should render each participant value that is provided", () => {
    renderSection({
      resident: "Test Patient",
      guardian: "Test Guardian",
      staff: "Test Staff",
      bpn: "Test BHP",
      otherIndividual: "Test Other",
      commentIndividual: "Test Comment",
    });

    // WHY: every participant captured during plan development must surface on
    // the viewed/printed treatment plan.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("Test Guardian")).toBeInTheDocument();
    expect(screen.getByText("Test Staff")).toBeInTheDocument();
    expect(screen.getByText("Test BHP")).toBeInTheDocument();
    expect(screen.getByText("Test Other")).toBeInTheDocument();
    expect(screen.getByText("Test Comment")).toBeInTheDocument();

    // Labels for the populated rows are rendered.
    expect(screen.getByText("Resident :")).toBeInTheDocument();
    expect(screen.getByText("Guardian :")).toBeInTheDocument();
    expect(screen.getByText("Staff :")).toBeInTheDocument();
    expect(screen.getByText("BHP :")).toBeInTheDocument();
    expect(screen.getByText("Other :")).toBeInTheDocument();
    expect(screen.getByText("Comment :")).toBeInTheDocument();
  });

  it("should not render participant rows when their values are empty", () => {
    renderSection();

    // WHY: empty participant fields are conditionally rendered, so an
    // incomplete plan does not show blank Resident/Guardian/etc. rows.
    expect(screen.queryByText("Resident :")).not.toBeInTheDocument();
    expect(screen.queryByText("Guardian :")).not.toBeInTheDocument();
    expect(screen.queryByText("Staff :")).not.toBeInTheDocument();
    expect(screen.queryByText("BHP :")).not.toBeInTheDocument();
    expect(screen.queryByText("Other :")).not.toBeInTheDocument();
    expect(screen.queryByText("Comment :")).not.toBeInTheDocument();
  });

  it("should reflect the 'yes' agreement selection via the checkbox checked state", () => {
    renderSection({ isReason: "yes" });

    const checkboxes = screen.getAllByRole("checkbox");
    // WHY: when the resident agrees, the "Yes" agreement checkbox is checked
    // and the "No" one is not.
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("should reflect the 'no' agreement selection via the checkbox checked state", () => {
    renderSection({ isReason: "no" });

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("should call setIsReason when the agreement checkbox is toggled", () => {
    const setIsReason = vi.fn();
    renderSection({ isReason: "", setIsReason });

    fireEvent.click(screen.getAllByRole("checkbox")[0]);

    // WHY: toggling the "Yes" agreement from an empty state should set it to
    // "yes" through the context setter.
    expect(setIsReason).toHaveBeenCalledWith("yes");
  });

  it("should render a partial plan with only some participants without crashing", () => {
    renderSection({ resident: "Test Patient", commentIndividual: "Note" });

    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    // Unfilled participants stay hidden.
    expect(screen.queryByText("Guardian :")).not.toBeInTheDocument();
  });
});
