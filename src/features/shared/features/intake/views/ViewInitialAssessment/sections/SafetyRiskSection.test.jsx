/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import SafetyRiskSection from "./SafetyRiskSection";

// Mock the form context hook so we can drive the read-only section with
// controlled "answers" instead of standing up the full intake form provider.
const mockUseForm = vi.fn();
vi.mock("../formContext", () => ({
  useViewInitialAssessmentForm: () => mockUseForm(),
}));

// Minimal shape the section reads. Every *YesNo flag defaults to undefined so
// rows are print-hidden unless a test opts in; arrays must exist (the component
// reads .length / .map without guarding those two).
function makeForm(overrides = {}) {
  return {
    riskYesNo: undefined,
    riskComment: "",
    setRiskYesNo: vi.fn(),
    PriorYesNo: undefined,
    PriorComment: "",
    setPriorYesNo: vi.fn(),
    AccessYesNo: undefined,
    AccessComment: "",
    setAccessYesNo: vi.fn(),
    SubstanceYesNo: undefined,
    SubstanceAbuseComment: "",
    setSubstanceYesNo: vi.fn(),
    abusingYesNo: undefined,
    abusingComment: "",
    setabusingYesNo: vi.fn(),
    RecentYesNo: undefined,
    RecentComment: "",
    setRecentYesNo: vi.fn(),
    behaviourYesNO: undefined,
    behaviorcuesDropDown: [],
    setBehaviourYesNo: vi.fn(),
    SymptomsYesNO: undefined,
    symptomsOfPsychosisDropDown: [],
    setSymptomsYesNo: vi.fn(),
    FamilyYesNO: undefined,
    Family: "",
    setFamilyYesNo: vi.fn(),
    TerminalYesNO: undefined,
    Terminal: "",
    setTerminalYesNo: vi.fn(),
    CurrentYesNO: undefined,
    Current: "",
    setCurrentYesNo: vi.fn(),
    ChronicYesNO: undefined,
    ChronicPain: "",
    setChronicYesNo: vi.fn(),
    riskFactorArray: [],
    ...overrides,
  };
}

describe("SafetyRiskSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseForm.mockReturnValue(makeForm());
  });

  it("should render the Risk Factors heading and table column headers", () => {
    render(<SafetyRiskSection />);

    // WHY: this read-only assessment view must always expose the risk-factor
    // table structure clinicians review during intake.
    expect(screen.getByText("Risk Factors")).toBeInTheDocument();
    expect(
      screen.getByText("Select risk factors that apply"),
    ).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
  });

  it("should render all the standard suicide-risk factor rows", () => {
    render(<SafetyRiskSection />);

    expect(screen.getByText("Prior suicide attempt")).toBeInTheDocument();
    expect(
      screen.getByText("Access to means (i.e. weapon)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Substance abuse")).toBeInTheDocument();
    expect(screen.getByText("Other self-abusing behavior")).toBeInTheDocument();
    expect(
      screen.getByText("Recent losses/lack of support"),
    ).toBeInTheDocument();
    expect(screen.getByText("Behavior cues")).toBeInTheDocument();
    expect(screen.getByText("Symptoms of psychosis")).toBeInTheDocument();
    expect(screen.getByText("Chronic pain")).toBeInTheDocument();
  });

  it("should not crash and renders no captured answers when all data is empty", () => {
    render(<SafetyRiskSection />);

    // WHY: a brand-new assessment has every flag undefined; the section must
    // still mount without throwing on the optional arrays/comments.
    expect(screen.getByText("Risk Factors")).toBeInTheDocument();
    // No checkbox should be checked when no answer has been recorded.
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
  });

  it("should reflect a recorded 'Yes' answer and its comment", () => {
    mockUseForm.mockReturnValue(
      makeForm({
        riskYesNo: true,
        riskComment: "Active ideation noted",
      }),
    );
    render(<SafetyRiskSection />);

    // WHY: when a risk factor is answered Yes, exactly the Yes checkbox for that
    // row is checked and the clinician's comment is displayed verbatim.
    expect(screen.getByText("Active ideation noted")).toBeInTheDocument();
    const checkedBoxes = screen
      .getAllByRole("checkbox")
      .filter((cb) => cb.checked);
    expect(checkedBoxes).toHaveLength(1);
  });

  it("should render behavior cue and psychosis symptom dropdown lists", () => {
    mockUseForm.mockReturnValue(
      makeForm({
        behaviourYesNO: true,
        behaviorcuesDropDown: [
          { label: "Withdrawal", value: "withdrawal" },
          { label: "Agitation", value: "agitation" },
        ],
        SymptomsYesNO: true,
        symptomsOfPsychosisDropDown: [
          { label: "Hallucinations", value: "hallucinations" },
        ],
      }),
    );
    render(<SafetyRiskSection />);

    // WHY: multi-select clinical findings are surfaced as a bulleted list so the
    // reviewer sees every selected cue/symptom label.
    expect(screen.getByText("Withdrawal")).toBeInTheDocument();
    expect(screen.getByText("Agitation")).toBeInTheDocument();
    expect(screen.getByText("Hallucinations")).toBeInTheDocument();
  });

  it("should render extra custom risk factors from riskFactorArray", () => {
    mockUseForm.mockReturnValue(
      makeForm({
        riskFactorArray: [
          {
            type: "Custom risk factor",
            yesNo: true,
            comment: "MRN-TEST-001 follow-up",
          },
        ],
      }),
    );
    render(<SafetyRiskSection />);

    // WHY: facility-specific custom risk factors appended to the assessment must
    // also render in the same review table.
    expect(screen.getByText("Custom risk factor")).toBeInTheDocument();
    expect(screen.getByText("MRN-TEST-001 follow-up")).toBeInTheDocument();
  });
});
