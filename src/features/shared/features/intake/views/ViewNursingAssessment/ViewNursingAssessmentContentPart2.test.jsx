/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import ViewNursingAssessmentContentPart2 from "./ViewNursingAssessmentContentPart2";

describe("ViewNursingAssessmentContentPart2", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render without crashing when given no props", () => {
    // WHY: this read-only intake section is reused across residents whose
    // assessment answers may be entirely empty; it must not throw on undefined.
    const { container } = render(<ViewNursingAssessmentContentPart2 />);
    expect(container).toBeTruthy();
    // The always-rendered Skin Check section anchors a smoke check.
    expect(
      screen.getByText(/Areas requiring treatment marked and labeled/i),
    ).toBeInTheDocument();
  });

  it("should render the print button and invoke print on click", () => {
    const print = vi.fn();
    render(<ViewNursingAssessmentContentPart2 print={print} />);

    const printBtn = screen.getByRole("button", { name: /print this form/i });
    fireEvent.click(printBtn);
    // WHY: clinicians print the completed nursing assessment for the chart.
    expect(print).toHaveBeenCalledTimes(1);
  });

  it("should render the Psychiatric review section with checked symptoms", () => {
    render(
      <ViewNursingAssessmentContentPart2
        reviewOfSystemsPsychiatric={["Anxiety", "Depression"]}
        reviewOfSystemsPsychiatricOther="History of panic"
      />,
    );

    expect(screen.getByText("Psychiatric :")).toBeInTheDocument();
    // WHY: a documented symptom must surface as a checked box so the reviewer
    // sees exactly what was reported. Boxes are keyed by stable id attributes.
    expect(document.getElementById("anxiety")).toBeChecked();
    expect(document.getElementById("depression")).toBeChecked();
    expect(document.getElementById("insomnia")).not.toBeChecked();
    expect(screen.getByText("History of panic")).toBeInTheDocument();
  });

  it("should not render symptom sections when their arrays are empty", () => {
    render(
      <ViewNursingAssessmentContentPart2
        reviewOfSystemsPsychiatric={[]}
        reviewOfSystemsNeurologic={[]}
        reviewOfSystemsRespiratory={[]}
        reviewOfSystemsAllergicImmunologic={[]}
      />,
    );

    // WHY: collapsing empty review-of-systems blocks keeps the printed chart
    // free of irrelevant sections.
    expect(screen.queryByText("Psychiatric :")).not.toBeInTheDocument();
    expect(screen.queryByText("Neurologic :")).not.toBeInTheDocument();
    expect(screen.queryByText("Respiratory :")).not.toBeInTheDocument();
    expect(screen.queryByText(/Allergic\/Immunologic/)).not.toBeInTheDocument();
  });

  it("should render the suicidal risk assessment block when flagged", () => {
    render(
      <ViewNursingAssessmentContentPart2
        suicidalRiskAssessmentDeniesSymptomsBellow={true}
        reviewOfSuicidalRiskAssessmentOther="Denies ideation"
      />,
    );

    expect(screen.getByText("Suicidal Risk Assessment :")).toBeInTheDocument();
    expect(screen.getByLabelText("Denies symptoms below")).toBeChecked();
    expect(screen.getByText("Denies ideation")).toBeInTheDocument();
  });

  it("should reflect nutrition diet and fluid restriction selections", () => {
    render(
      <ViewNursingAssessmentContentPart2
        nutritionDiet="Special diet"
        nutritionFluidRestrictions={true}
        setNutritionFluidRestrictions={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Special diet ordered")).toBeChecked();
    expect(screen.getByLabelText("As tolerated")).not.toBeChecked();
    // WHY: fluid-restriction Yes/No is a clinically significant nursing order.
    expect(screen.getByLabelText("Yes")).toBeChecked();
    expect(screen.getByLabelText("No")).not.toBeChecked();
  });

  it("should toggle current medications via the provided setter", () => {
    const setCurrentMedications = vi.fn();
    render(
      <ViewNursingAssessmentContentPart2
        currentMedications={true}
        setCurrentMedications={setCurrentMedications}
      />,
    );

    // The bootstrap label text is rendered but not wired via htmlFor, so locate
    // the checkbox by walking from its label text to the sibling control.
    expect(
      screen.getByText(/Verified that a list of current medications/i),
    ).toBeInTheDocument();
    const medCheck = screen
      .getByText(/Verified that a list of current medications/i)
      .closest(".form-check")
      .querySelector('input[type="checkbox"]');
    expect(medCheck).toBeChecked();
    fireEvent.click(medCheck);
    // WHY: the controlled checkbox flips the parent state, not local state.
    expect(setCurrentMedications).toHaveBeenCalledWith(false);
  });

  it("should render all eight body diagram images and the skin check comment", () => {
    const { container } = render(
      <ViewNursingAssessmentContentPart2
        skinCheck={true}
        reviewOfSkinCheckOther="Bruise on left forearm"
        commentFigure="Marked area A"
        setLegRight={vi.fn()}
      />,
    );

    // WHY: each body view (front/back/sides/legs) maps to a marked diagram the
    // reviewer must see; all eight illustrations should be present. The imgs use
    // empty alt (decorative), so query the DOM directly rather than by role.
    const images = container.querySelectorAll("img.img-nursing");
    expect(images).toHaveLength(8);
    expect(
      screen.getByText("Resident denies skin concerns"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bruise on left forearm")).toBeInTheDocument();
    expect(screen.getByText("Marked area A")).toBeInTheDocument();
  });

  it("should render digitally signed signatures from RN and admin", () => {
    render(
      <ViewNursingAssessmentContentPart2
        rnSignature="Test RN"
        adminSignature="Test Admin"
      />,
    );

    // WHY: signature attestation lines are required on the finalized chart.
    expect(screen.getByText(/Digitally Signed by Test RN/)).toBeInTheDocument();
    expect(
      screen.getByText(/Digitally Signed by Test Admin/),
    ).toBeInTheDocument();
  });

  it("should render additional signer signatures from the signers list", () => {
    render(
      <ViewNursingAssessmentContentPart2
        signers={[
          { signerId: "emp-test-001", signature: "Test Signer" },
          { signerId: "emp-test-002", signature: "" },
        ]}
      />,
    );

    // WHY: only signers who actually signed render; blank entries are skipped.
    expect(
      screen.getByText(/Digitally Signed by Test Signer/),
    ).toBeInTheDocument();
  });
});
