/** @format */

import React from "react";
import { render, screen } from "@/test-utils";
import { ViewTreatmentPlanFormProvider } from "../../context/ViewTreatmentPlanFormContext";
import ViewTreatmentPlanSupportMedicationsSection from "./ViewTreatmentPlanSupportMedicationsSection";

// This presentational "View*" section reads ALL of its data from
// ViewTreatmentPlanFormContext. We drive it by wrapping in the real provider
// with controlled values rather than mocking the hook, so the component's
// conditional-render branches are exercised with realistic shaped data.

// Default context shaped so the component never throws (the component calls
// .includes / .length / .map on several fields without guarding their type).
function baseContext(overrides = {}) {
  return {
    supportSystem: [],
    supportSystemOtherText: "",
    supportSystemPhoneNumber: "",
    currentMedications: "",
    handleCheckboxChangeSupportSystem: () => {},
    religiousPreference: "",
    religiousPreferenceText: "",
    setreligiousPreference: () => {},
    nutritionAndWellnessPlanning: [],
    nutritionOptions: [],
    isRequiresAssistance: null,
    personalFinancesComment: "",
    isFallRisk: null,
    fallRiskComment: "",
    personalFinances: "",
    recommendationToExtendResidentialTreatment: "",
    setRecommendationToExtendResidentialTreatment: () => {},
    services: [],
    dischargePlanning: [],
    additionalComment: "",
    setDischargePlanning: () => {},
    isAdditionalDischargePlanningChecked: null,
    readinessDischarge: "",
    recommendationsForFurtherPrograms: [],
    recommendationsForFurtherProgramsOther: "",
    recommendationsForFurtherProgramsBoolean: false,
    handleCheckboxChangerecommendationsForFurtherPrograms: () => {},
    afterCareAndTransitionPlanning: [],
    handleCheckboxChangeafterCareAndTransitionPlanning: () => {},
    clinicalSummary: [],
    clientCareCoordinationTeam: "",
    treatmentPlanReviewDate: "",
    dischargePlanDate: "",
    ...overrides,
  };
}

function renderSection(overrides = {}) {
  return render(
    <ViewTreatmentPlanFormProvider value={baseContext(overrides)}>
      <ViewTreatmentPlanSupportMedicationsSection />
    </ViewTreatmentPlanFormProvider>,
  );
}

describe("ViewTreatmentPlanSupportMedicationsSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the static treatment-plan note even with empty data", () => {
    renderSection();
    // WHY: the closing "Note" row is always rendered regardless of data, so it
    // is a reliable signal the section mounted without crashing on empty props.
    expect(
      screen.getByText(/Earlier review may be performed/i),
    ).toBeInTheDocument();
  });

  it("should not render the Support System block when there is no support data", () => {
    renderSection();
    // WHY: support system header is gated behind supportSystem.length / otherText.
    expect(screen.queryByText(/Support System :/i)).not.toBeInTheDocument();
  });

  it("should render the Support System block and check selected systems", () => {
    renderSection({
      supportSystem: ["Family", "Guardian"],
      supportSystemPhoneNumber: "555-0100",
      currentMedications: "Ibuprofen 200mg",
    });
    expect(screen.getByText(/Support System :/i)).toBeInTheDocument();
    // WHY: a checkbox for a selected support system must reflect checked state
    // (read-only view mirrors the resident's recorded answers).
    expect(screen.getByRole("checkbox", { name: "Family" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Guardian" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Friends" })).not.toBeChecked();
    // Phone number and current medications surface their recorded values.
    expect(screen.getByText("555-0100")).toBeInTheDocument();
    expect(screen.getByText("Ibuprofen 200mg")).toBeInTheDocument();
  });

  it("should show the 'Other' free-text for support system when provided", () => {
    renderSection({
      supportSystem: ["Other"],
      supportSystemOtherText: "Neighbor",
    });
    expect(screen.getByText("Neighbor")).toBeInTheDocument();
  });

  it("should render religious preference selection and free text for Other", () => {
    renderSection({
      religiousPreference: "Other",
      religiousPreferenceText: "Agnostic",
    });
    expect(
      screen.getByText(/Religious\/Cultural Preference :/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Agnostic")).toBeInTheDocument();
  });

  it("should render nutrition and wellness options as a list", () => {
    renderSection({
      nutritionOptions: [{ label: "Balanced diet" }, { label: "Hydration" }],
    });
    expect(screen.getByText("Balanced diet")).toBeInTheDocument();
    expect(screen.getByText("Hydration")).toBeInTheDocument();
  });

  it("should render Yes/No for personal finances assistance and fall risk", () => {
    renderSection({
      isRequiresAssistance: true,
      personalFinancesComment: "Needs help budgeting",
      isFallRisk: false,
      fallRiskComment: "Stable gait",
    });
    // WHY: boolean clinical flags must render as human-readable Yes/No labels.
    expect(screen.getByText(/Fall Risk :/i)).toBeInTheDocument();
    expect(screen.getByText("Needs help budgeting")).toBeInTheDocument();
    expect(screen.getByText("Stable gait")).toBeInTheDocument();
  });

  it("should render the services table rows when services exist", () => {
    renderSection({
      services: [
        {
          serviceProvided: "Therapy",
          daily: [{ label: "Check-in" }],
          weekly: [{ label: "Group" }],
          monthly: [],
          asNeeded: [],
          additionalNotes: "Per care plan",
        },
      ],
    });
    expect(screen.getByText("Services Provided")).toBeInTheDocument();
    expect(screen.getByText("Check-in")).toBeInTheDocument();
    expect(screen.getByText("Group")).toBeInTheDocument();
    expect(screen.getByText("Per care plan")).toBeInTheDocument();
  });

  it("should render discharge planning selections and additional comment", () => {
    renderSection({
      dischargePlanning: ["Follow-up Medical appointments upon discharge"],
      isAdditionalDischargePlanningChecked: true,
      additionalComment: "Coordinate transport",
      readinessDischarge: "Ready",
    });
    expect(
      screen.getByText(/Discharge planning and After care planning :/i),
    ).toBeInTheDocument();
    // WHY: the recorded discharge step must show as a checked read-only box.
    expect(
      screen.getByRole("checkbox", {
        name: /Follow-up Medical appointments upon discharge/i,
      }),
    ).toBeChecked();
    expect(screen.getByText("Coordinate transport")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("should render further-program recommendations with Other free text", () => {
    renderSection({
      recommendationsForFurtherPrograms: ["PHP", "Other"],
      recommendationsForFurtherProgramsBoolean: true,
      recommendationsForFurtherProgramsOther: "Vocational rehab",
    });
    expect(screen.getByRole("checkbox", { name: "PHP" })).toBeChecked();
    expect(screen.getByText("Vocational rehab")).toBeInTheDocument();
  });

  it("should render aftercare community resources when present", () => {
    renderSection({
      afterCareAndTransitionPlanning: ["Emergency care 911"],
    });
    expect(
      screen.getByText(/After care and Transition planning/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Emergency care 911" }),
    ).toBeChecked();
  });

  it("should render clinical summary, care team and formatted dates", () => {
    renderSection({
      clinicalSummary: [{ label: "Continue therapy" }],
      clientCareCoordinationTeam: "Team A",
      treatmentPlanReviewDate: "2026-01-15",
      dischargePlanDate: "2026-02-20",
    });
    expect(screen.getByText("Continue therapy")).toBeInTheDocument();
    expect(screen.getByText("Team A")).toBeInTheDocument();
    // WHY: dates are formatted to MM/DD/YYYY for clinician readability.
    expect(screen.getByText("01/15/2026")).toBeInTheDocument();
    expect(screen.getByText("02/20/2026")).toBeInTheDocument();
  });
});
