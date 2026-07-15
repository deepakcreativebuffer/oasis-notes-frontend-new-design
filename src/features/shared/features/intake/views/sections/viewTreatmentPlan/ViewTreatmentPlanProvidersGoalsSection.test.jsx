/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@/test-utils";

import ViewTreatmentPlanProvidersGoalsSection from "./ViewTreatmentPlanProvidersGoalsSection";
import { ViewTreatmentPlanFormProvider } from "../../context/ViewTreatmentPlanFormContext";

// This is a read-only "View*" section that pulls all its data from
// ViewTreatmentPlanFormContext. We drive it through the real provider with
// controlled values rather than mocking the context hook.
function renderSection(value = {}) {
  return render(
    <ViewTreatmentPlanFormProvider value={value}>
      <ViewTreatmentPlanProvidersGoalsSection />
    </ViewTreatmentPlanFormProvider>,
  );
}

describe("ViewTreatmentPlanProvidersGoalsSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the static treatment-frequency label even with no data", () => {
    // WHY: the standing-care instruction must always print on the treatment
    // plan regardless of whether goals/allergies were captured.
    renderSection({});
    expect(
      screen.getByText(/Residents receive treatment/i),
    ).toBeInTheDocument();
  });

  it("should not crash and shows no goal/allergy values when context is empty", () => {
    renderSection({});
    expect(screen.queryByText(/Resident Goals/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Allergies/i)).not.toBeInTheDocument();
  });

  it("should render the resident goal when provided", () => {
    renderSection({ residentGoal: "Improve sleep hygiene" });
    expect(screen.getByText(/Resident Goals/i)).toBeInTheDocument();
    expect(screen.getByText("Improve sleep hygiene")).toBeInTheDocument();
  });

  it("should render allergies and triggers when provided", () => {
    renderSection({ allergies: "Penicillin", Triggers: "Loud noises" });
    // WHY: allergies/triggers are clinically critical and must surface on the
    // printed plan when present.
    expect(screen.getByText("Penicillin")).toBeInTheDocument();
    expect(screen.getByText("Loud noises")).toBeInTheDocument();
  });

  it("should render the strengths list items by label", () => {
    renderSection({
      strengths: [
        { label: "Motivated", value: "motivated" },
        { label: "Family support", value: "family" },
      ],
    });
    expect(screen.getByText("Motivated")).toBeInTheDocument();
    expect(screen.getByText("Family support")).toBeInTheDocument();
  });

  it("should not render the strengths section for an empty strengths array", () => {
    renderSection({ strengths: [] });
    expect(screen.queryByText(/Strengths/i)).not.toBeInTheDocument();
  });

  it("should render the barriers checklist and check the selected barriers", () => {
    renderSection({ Barriers: ["cognitive", "financial"] });
    // WHY: barriers drive the care team's intervention plan; the right boxes
    // must reflect what was recorded and others stay unchecked.
    const cognitive = screen.getByLabelText("Cognitive");
    const financial = screen.getByLabelText("Financial");
    const racial = screen.getByLabelText("Racial");
    expect(cognitive).toBeChecked();
    expect(financial).toBeChecked();
    expect(racial).not.toBeChecked();
  });

  it("should render the 'Other' barrier free text when barriersBoolean is set", () => {
    renderSection({
      Barriers: ["Other"],
      barriersBoolean: true,
      barriersOther: "Transportation issues",
    });
    expect(screen.getByText("Transportation issues")).toBeInTheDocument();
  });

  it("should render the barriers comment text when provided", () => {
    renderSection({
      Barriers: ["cognitive"],
      barriersText: "Needs ongoing follow-up",
    });
    expect(screen.getByText("Needs ongoing follow-up")).toBeInTheDocument();
  });

  it("should not render the barriers checklist when Barriers is empty", () => {
    renderSection({ Barriers: [] });
    expect(screen.queryByLabelText("Cognitive")).not.toBeInTheDocument();
  });
});
