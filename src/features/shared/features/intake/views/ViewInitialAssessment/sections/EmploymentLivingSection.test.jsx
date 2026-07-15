/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";

import EmploymentLivingSection from "./EmploymentLivingSection";

// The section is a read-only "View*" presentational component. Everything it
// renders comes from the form context hook, so we mock the context module and
// drive the component with a controlled return value. This avoids needing the
// real provider/data-fetching wiring while still exercising the render logic.
const mockForm = vi.fn();
vi.mock("../formContext", () => ({
  useViewInitialAssessmentForm: () => mockForm(),
}));

// A minimal-but-complete form value. The component reads MANY keys directly off
// `f` and would crash on a bare {} (e.g. f.selectedValue.length). We start from
// safe defaults and let individual tests override only what they assert.
function makeForm(overrides = {}) {
  return {
    currentlyEmployed: undefined,
    employmentLocation: "",
    workHistory: "",
    militaryService: undefined,
    activeDuty: undefined,
    selectedValue: [],
    selectedValueMedical: [],
    selectedValueSpecialPrecautions: [],
    fallRisk: undefined,
    fallRiskExplanation: "",
    triggers: "",
    hobbiesLeisureActivities: "",
    currentThoughtsOfHarmingSelf: undefined,
    currentThoughtsOfHarmingOthers: undefined,
    suicidalIdeation: "",
    suicidalIdeationUrgency: undefined,
    suicidalIdeationSeverity: undefined,
    handleRiskFactorActivityArray: [],
    // Independent living skills are read directly; undefined is the empty state.
    BathingComments: "",
    GroomingComments: "",
    MobilityComments: "",
    HouseworkComments: "",
    ShoppingComments: "",
    ManagingComments: "",
    PreparingComments: "",
    EatingComments: "",
    ToiletingComments: "",
    TakingComments: "",
    // Setters referenced in onChange handlers — provide no-op spies.
    setCurrentlyEmployed: vi.fn(),
    setMilitaryService: vi.fn(),
    setActiveDuty: vi.fn(),
    setFallRisk: vi.fn(),
    setCurrentThoughtsOfHarmingSelf: vi.fn(),
    setCurrentThoughtsOfHarmingOthers: vi.fn(),
    setSuicidalIdeation: vi.fn(),
    setSuicidalIdeationUrgency: vi.fn(),
    setSuicidalIdeationSeverity: vi.fn(),
    setBathingGood: vi.fn(),
    setBathingFair: vi.fn(),
    setBathingNotSoGood: vi.fn(),
    setGroomingGood: vi.fn(),
    setGroomingFair: vi.fn(),
    setGroomingNotSoGood: vi.fn(),
    setMobilityGood: vi.fn(),
    setMobilityFair: vi.fn(),
    setMobilityNotSoGood: vi.fn(),
    setHouseworkGood: vi.fn(),
    setHouseworkFair: vi.fn(),
    setHouseworkNotSoGood: vi.fn(),
    setShoppingGood: vi.fn(),
    setShoppingFair: vi.fn(),
    setShoppingNotSoGood: vi.fn(),
    setManagingGood: vi.fn(),
    setManagingFair: vi.fn(),
    setManagingNotSoGood: vi.fn(),
    setPreparingGood: vi.fn(),
    setPreparingFair: vi.fn(),
    setPreparingNotSoGood: vi.fn(),
    setEatingGood: vi.fn(),
    setEatingFair: vi.fn(),
    setEatingNotSoGood: vi.fn(),
    setToiletingGood: vi.fn(),
    setToiletingFair: vi.fn(),
    setToiletingNotSoGood: vi.fn(),
    setTakingGood: vi.fn(),
    setTakingFair: vi.fn(),
    setTakingNotSoGood: vi.fn(),
    ...overrides,
  };
}

describe("EmploymentLivingSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the static section structure with empty data", () => {
    mockForm.mockReturnValue(makeForm());
    render(<EmploymentLivingSection />);

    // WHY: clinicians always see the labelled sections of the assessment even
    // when no answers were captured — the view must not crash on empty data.
    expect(screen.getByText("Employment history")).toBeInTheDocument();
    expect(
      screen.getByText("f.Current Independent Living Skills"),
    ).toBeInTheDocument();
    expect(screen.getByText("Safety and Risk Assessment")).toBeInTheDocument();
  });

  it("should render the independent living skills table headers", () => {
    mockForm.mockReturnValue(makeForm());
    render(<EmploymentLivingSection />);

    // WHY: the living-skills grid is the core matrix of this section; its column
    // headers must always be present for the rating to be interpretable.
    expect(screen.getByText("Type of Activity")).toBeInTheDocument();
    expect(screen.getByText("Need assist")).toBeInTheDocument();
    expect(screen.getByText("Bathing/Showering")).toBeInTheDocument();
    expect(screen.getByText("Taking medications")).toBeInTheDocument();
  });

  it("should render captured free-text employment and history answers", () => {
    mockForm.mockReturnValue(
      makeForm({
        employmentLocation: "Test Clinic FT",
        workHistory: "Test work history barriers",
        triggers: "Test trigger note",
        hobbiesLeisureActivities: "Reading",
        fallRiskExplanation: "Test fall explanation",
      }),
    );
    render(<EmploymentLivingSection />);

    // WHY: these free-text intake answers must surface verbatim in the read-only
    // view so reviewing staff see exactly what was recorded.
    expect(screen.getByText("Test Clinic FT")).toBeInTheDocument();
    expect(screen.getByText("Test work history barriers")).toBeInTheDocument();
    expect(screen.getByText("Reading")).toBeInTheDocument();
    expect(screen.getByText("Test fall explanation")).toBeInTheDocument();
  });

  it("should check the Yes boxes for affirmative boolean answers", () => {
    mockForm.mockReturnValue(
      makeForm({
        currentlyEmployed: true,
        militaryService: true,
        fallRisk: true,
        currentThoughtsOfHarmingSelf: true,
      }),
    );
    render(<EmploymentLivingSection />);

    // WHY: yes/no intake booleans are rendered as checked checkboxes; a true
    // value must drive the "Yes" box checked so the printout reflects the answer.
    expect(document.getElementById("currentlyEmployed")).toBeChecked();
    expect(document.getElementById("militaryService")).toBeChecked();
    expect(document.getElementById("fallRisk")).toBeChecked();
    expect(
      document.getElementById("currentThoughtsOfHarmingSelf"),
    ).toBeChecked();
    // And the corresponding "No" boxes stay unchecked.
    expect(document.getElementById("currentlyEmployedno")).not.toBeChecked();
  });

  it("should render the criminal justice and medical list items", () => {
    mockForm.mockReturnValue(
      makeForm({
        selectedValue: [{ label: "Probation", value: "probation" }],
        selectedValueMedical: [{ label: "Wheelchair", value: "wheelchair" }],
        selectedValueSpecialPrecautions: [
          { label: "Fall Precautions", value: "fall" },
        ],
      }),
    );
    render(<EmploymentLivingSection />);

    // WHY: multi-select clinical lists (legal history, equipment, precautions)
    // are rendered as bullet lists of their labels for the reviewer.
    expect(screen.getByText("Probation")).toBeInTheDocument();
    expect(screen.getByText("Wheelchair")).toBeInTheDocument();
    expect(screen.getByText("Fall Precautions")).toBeInTheDocument();
  });

  it("should render dynamic risk-factor activity rows", () => {
    mockForm.mockReturnValue(
      makeForm({
        handleRiskFactorActivityArray: [
          {
            type: "Custom Activity",
            good: true,
            fair: false,
            otherCurrentNotSoGood: false,
            needAssist: true,
            comments: "Test comment",
          },
        ],
      }),
    );
    render(<EmploymentLivingSection />);

    // WHY: assessors can add custom risk-factor activities beyond the fixed
    // rows; those must appear in the living-skills table with their comments.
    expect(screen.getByText("Custom Activity")).toBeInTheDocument();
    expect(screen.getByText("Test comment")).toBeInTheDocument();
  });
});
