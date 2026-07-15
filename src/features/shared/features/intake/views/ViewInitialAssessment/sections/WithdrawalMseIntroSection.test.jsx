/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";

import WithdrawalMseIntroSection from "./WithdrawalMseIntroSection";

// Drive the section purely through the form context return value so we can
// control which withdrawal symptoms are flagged without mounting the heavy
// ViewInitialAssessment data-fetching provider.
const mockForm = vi.fn();
vi.mock("../formContext", () => ({
  useViewInitialAssessmentForm: () => mockForm(),
}));

// All boolean flags default to false plus their no-op setters; tests override
// the specific symptom flags they care about.
function makeForm(overrides = {}) {
  const setters = [
    "setNoneReportedOrObserved",
    "setVomiting",
    "setAnxiety",
    "setAgitation",
    "setHeadache",
    "setTremors",
    "setNausea",
    "setTactileDisturbances",
    "setVisualDisturbances",
    "setVisualDisturbancesOtherBoolean",
    "setSweats",
    "setGooseBumps",
    "setBonePain",
    "setSeizures",
    "setParanoia",
    "setRunningnose",
    "setTearing",
    "setLossofMuscleCoordination",
    "setLossofMuscleCoordinationBoolean",
  ];
  const base = {};
  setters.forEach((s) => (base[s] = vi.fn()));
  return { ...base, ...overrides };
}

describe("WithdrawalMseIntroSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render both withdrawal symptom section labels", () => {
    mockForm.mockReturnValue(makeForm());
    render(<WithdrawalMseIntroSection />);

    // WHY: this read-only MSE view always shows the two symptom group headers
    // (active + other) so clinicians can scan withdrawal status.
    expect(
      screen.getByText("Active Withdrawal Symptoms :"),
    ).toBeInTheDocument();
    expect(screen.getByText("Other Withdraw Symptoms:")).toBeInTheDocument();
  });

  it("should render without crashing when all flags are empty", () => {
    mockForm.mockReturnValue(makeForm());
    render(<WithdrawalMseIntroSection />);

    // WHY: an intake with no recorded symptoms must still render the grid
    // rather than throwing on undefined boolean props.
    expect(screen.getByText("None reported or observed")).toBeInTheDocument();
  });

  it("should reflect a checked active symptom from the form context", () => {
    mockForm.mockReturnValue(makeForm({ Anxiety: true }));
    render(<WithdrawalMseIntroSection />);

    // WHY: a flagged withdrawal symptom (Anxiety) must show as checked so the
    // printed/viewed assessment matches what the clinician recorded.
    const checkbox = document.getElementById("Anxiety");
    expect(checkbox).toBeChecked();
  });

  it("should leave an unflagged symptom unchecked", () => {
    mockForm.mockReturnValue(makeForm({ Anxiety: true }));
    render(<WithdrawalMseIntroSection />);

    expect(document.getElementById("Tremors")).not.toBeChecked();
  });

  it("should show the visual disturbances 'Other' free-text when its boolean is set", () => {
    mockForm.mockReturnValue(
      makeForm({
        VisualDisturbancesOtherBoolean: true,
        VisualDisturbancesOtherType: "Flashing lights",
      }),
    );
    render(<WithdrawalMseIntroSection />);

    // WHY: when the "Other" visual-disturbance box is checked the recorded
    // free-text detail must be surfaced in the view.
    expect(screen.getByText("Flashing lights")).toBeInTheDocument();
  });

  it("should hide the visual disturbances free-text when the boolean is unset", () => {
    mockForm.mockReturnValue(
      makeForm({
        VisualDisturbancesOtherBoolean: false,
        VisualDisturbancesOtherType: "Flashing lights",
      }),
    );
    render(<WithdrawalMseIntroSection />);

    expect(screen.queryByText("Flashing lights")).not.toBeInTheDocument();
  });

  it("should show the loss-of-coordination 'Other' free-text when its boolean is set", () => {
    mockForm.mockReturnValue(
      makeForm({
        LossofMuscleCoordinationOtherBoolean: true,
        LossofMuscleCoordinationOtherType: "Unsteady gait",
      }),
    );
    render(<WithdrawalMseIntroSection />);

    // WHY: the second symptom group has its own "Other" free-text that must
    // render the recorded detail when flagged.
    expect(screen.getByText("Unsteady gait")).toBeInTheDocument();
  });

  it("should render the 'Other' withdrawal symptom checkboxes", () => {
    mockForm.mockReturnValue(makeForm({ Seizures: true }));
    render(<WithdrawalMseIntroSection />);

    expect(screen.getByText("Goose Bumps")).toBeInTheDocument();
    expect(screen.getByText("Bone Pain")).toBeInTheDocument();
    // WHY: a flagged "other" symptom (Seizures) must reflect as checked too.
    expect(document.getElementById("Seizures")).toBeChecked();
  });
});
