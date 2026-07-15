/** @format */

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import MedicalHistorySection from "./MedicalHistorySection";
import { ViewInitialAssessmentFormContext } from "../formContext";

// MedicalHistorySection is a presentational "View*" section that reads all of
// its data from the ViewInitialAssessment form context. We drive it through the
// real context provider with controlled values rather than mocking the hook, so
// the component's actual consumption of the context is exercised.
function renderSection(formOverrides = {}) {
  const setters = {
    setYesDiabetes: vi.fn(),
    setYesHeart: vi.fn(),
    setYesHistory: vi.fn(),
    setYesHigh: vi.fn(),
    setYesLung: vi.fn(),
    setYesSeizures: vi.fn(),
    setYesCancer: vi.fn(),
    setYesLiver: vi.fn(),
    setYesThyroid: vi.fn(),
    setYesInjury: vi.fn(),
    setYesChronic: vi.fn(),
    setAllergiesYes: vi.fn(),
    setSurgeriessYes: vi.fn(),
    setPregnanciesYes: vi.fn(),
    setSubstanceYes: vi.fn(),
    setDepressionYes: vi.fn(),
    setAnxietyYes: vi.fn(),
    setInsomniaYes: vi.fn(),
    setBipolarYes: vi.fn(),
    setSchizophreniaYes: vi.fn(),
    setObsessiveYes: vi.fn(),
    setPersonalityYes: vi.fn(),
    setPhobiasYes: vi.fn(),
    setHealthConditionsYes: vi.fn(),
    setInfectionYes: vi.fn(),
    setOtherConditionYesNo: vi.fn(),
    handleAddCondition: vi.fn(),
  };

  // Default to the minimum shape the component iterates over so .map/.length
  // never throws. Individual tests override the bits they assert on.
  const value = {
    ...setters,
    typeOfServiceArray: [],
    ...formOverrides,
  };

  const utils = render(
    <ViewInitialAssessmentFormContext.Provider value={value}>
      <MedicalHistorySection />
    </ViewInitialAssessmentFormContext.Provider>,
  );
  return { ...utils, setters };
}

describe("MedicalHistorySection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the section header and static condition rows with empty data", () => {
    renderSection();

    // WHY: SECTION II is the medical-history section title that must always
    // print on the intake assessment regardless of which answers exist.
    expect(screen.getByText("SECTION II")).toBeInTheDocument();
    // Static condition labels are always rendered (rows are only print-hidden
    // via CSS class, not unmounted), so they appear in the DOM even with no
    // answers selected.
    expect(screen.getByText("Diabetes")).toBeInTheDocument();
    expect(
      screen.getByText("Heart disease / heart attack"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancer")).toBeInTheDocument();
  });

  it("should render without crashing when optional array fields are missing", () => {
    // No thyroidDisorder / infectionDiseases / otherConditionArray /
    // SignificantFamilyMedicalPsychiatricHistory supplied -> optional chaining
    // must guard the .map calls.
    expect(() => renderSection()).not.toThrow();
    expect(screen.getByText("SECTION II")).toBeInTheDocument();
  });

  it("should check the Yes box and reflect the comment when a condition is answered Yes", () => {
    renderSection({ yesDiabetes: true, commentDiabety: "Type 2, controlled" });

    // The diabetes Yes checkbox is wired to checked={yesDiabetes === true}.
    expect(document.getElementById("diabetes")).toBeChecked();
    expect(document.getElementById("diabetesno")).not.toBeChecked();
    // WHY: the clinician's free-text comment for a positive finding must be
    // surfaced in the read-only view.
    expect(screen.getByText("Type 2, controlled")).toBeInTheDocument();
  });

  it("should check the No box when a condition is answered No", () => {
    renderSection({ yesHeart: false });

    expect(document.getElementById("yesHeartno")).toBeChecked();
    expect(document.getElementById("yesHeart")).not.toBeChecked();
  });

  it("should invoke the matching setter when a checkbox is toggled", () => {
    const { setters } = renderSection({ yesDiabetes: false });

    fireEvent.click(document.getElementById("diabetes"));
    // WHY: toggling Yes on diabetes drives setYesDiabetes(true) so the answer
    // persists to the assessment form state.
    expect(setters.setYesDiabetes).toHaveBeenCalledWith(true);
  });

  it("should render thyroid disorder detail list items from the provided array", () => {
    renderSection({
      yesThyroid: true,
      thyroidDisorder: [
        { label: "Hypothyroidism", value: "hypo" },
        { label: "Hyperthyroidism", value: "hyper" },
      ],
    });

    expect(screen.getByText("Hypothyroidism")).toBeInTheDocument();
    expect(screen.getByText("Hyperthyroidism")).toBeInTheDocument();
  });

  it("should render the mental health treatment history table when services exist", () => {
    renderSection({
      typeOfServiceArray: [
        {
          typeOfService: [{ label: "Inpatient", value: "inpatient" }],
          where: "Test Clinic",
          dates: "2024-01-01",
          diagnosisReason: [{ label: "Depression", value: "dep" }],
        },
      ],
    });

    // WHY: the treatment-history table only renders when there is at least one
    // service entry; its column headers and row data confirm prior care is shown.
    expect(screen.getByText("Type of Services")).toBeInTheDocument();
    expect(screen.getByText("Inpatient")).toBeInTheDocument();
    expect(screen.getByText("Test Clinic")).toBeInTheDocument();
  });

  it("should not render the treatment history table when there are no services", () => {
    renderSection({ typeOfServiceArray: [] });

    expect(screen.queryByText("Type of Services")).not.toBeInTheDocument();
  });

  it("should render significant family history list items", () => {
    renderSection({
      SignificantFamilyMedicalPsychiatricHistory: [
        { label: "Family history of bipolar disorder", value: "bp" },
      ],
    });

    expect(
      screen.getByText("Family history of bipolar disorder"),
    ).toBeInTheDocument();
  });
});
