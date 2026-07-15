/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import NursingAssessmentFormContentPart2 from "./NursingAssessmentFormContentPart2";

// WHY: barrel of image assets — return a Proxy so any named import resolves
// to a harmless stub string instead of touching the real asset pipeline.
vi.mock("@/assets/index", () => ({
  __esModule: true,
  ...new Proxy(
    { __esModule: true },
    { get: (t, p) => (p in t ? t[p] : "stub-asset"), has: () => true },
  ),
}));

// WHY: PatientComponent / MultiEmployee are search widgets that fire network IO.
// Stub them to light placeholders exposing only what we assert.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="patient-component" />,
}));
vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  __esModule: true,
  default: ({ value }) => (
    <div data-testid="multi-employee" data-count={(value || []).length} />
  ),
}));

// WHY: react-datepicker is heavy/portal-based; not exercised by these assertions.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: (props) => <input data-testid="date-picker" {...props} />,
}));

// WHY: spinner just needs to render a marker so the loading branch is observable.
vi.mock("react-spinners", () => ({
  __esModule: true,
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

// WHY: utils pulls in app-wide helpers; only signatureFormat is consumed here.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  signatureFormat: ({ sign }) =>
    sign ? <span data-testid="signature-format">{sign}</span> : null,
  deletePermission: () => true,
  formatDateToMMDDYYYY: (d) => d,
}));

// WHY: constants barrel re-exports many modules; only ROLES.ADMIN is read.
vi.mock("@/features/shared/constants/index", () => ({
  __esModule: true,
  ROLES: { ADMIN: "Admin" },
  ACCOUNT_TYPES: {},
}));

// Build representative props. Arrays default empty; setters are spies.
const baseProps = (overrides = {}) => ({
  reviewOfSystemsMusculoskeletal: [],
  reviewOfSystemsPsychiatric: [],
  reviewOfSystemsNeurologic: [],
  reviewOfSystemsRespiratory: [],
  reviewOfSystemsAllergicImmunologic: [],
  behavioralSymptoms: [],
  physicalSymptoms: [],
  psychosocialSymptoms: [],
  nutritionDiet: [],
  reviewOfSystemsMusculoskeletalOther: "",
  reviewOfSystemsPsychiatricOther: "",
  reviewOfSystemsNeurologicOther: "",
  reviewOfSystemsRespiratoryOther: "",
  reviewOfSystemsAllergicImmunologicOther: "",
  reviewOfSuicidalRiskAssessmentOther: "",
  reviewOfBehavioralSymptomsOther: "",
  reviewOfPhysicalSymptomsOther: "",
  reviewOfPsychosocialSymptomsOther: "",
  reviewOfCurrentMedicationsOther: "",
  reviewOfNutritionDietOther: "",
  reviewOfNutritionFluidRestrictionsOther: "",
  reviewOfSkinCheckOther: "",
  suicidalRiskAssessmentDeniesSymptomsBellow: false,
  currentMedications: false,
  nutritionFluidRestrictions: null,
  skinCheck: false,
  safetyPlanComment: "",
  commentFigure: "",
  imagesPair: [],
  signers: [],
  rnSignature: "",
  rnTime: "",
  rnDate: "",
  adminSignature: "",
  adminSignatureDate: "",
  adminSignatureTime: "",
  hoursFormat: "12",
  loading: false,
  id: null,
  isSubmitEnabled: false,
  saveAsDrafIsNotEditableWithoutSigner: false,
  profileInfo: { userType: "Employee" },
  // setters / handlers
  handlereviewOfSystemsMusculoskeletal: vi.fn(),
  handlereviewOfSystemsPsychiatric: vi.fn(),
  handlereviewOfSystemsNeurologic: vi.fn(),
  handlereviewOfSystemsRespiratory: vi.fn(),
  handlereviewOfSystemsAllergicImmunologic: vi.fn(),
  handlebehavioralSymptoms: vi.fn(),
  handlephysicalSymptoms: vi.fn(),
  handlerepsychosocialSymptoms: vi.fn(),
  handleMultiNutritionDiet: vi.fn(),
  setReviewOfSystemsMusculoskeletalOther: vi.fn(),
  setReviewOfSystemsPsychiatricOther: vi.fn(),
  setReviewOfSystemsNeurologicOther: vi.fn(),
  setReviewOfSystemsRespiratoryOther: vi.fn(),
  setReviewOfSystemsAllergicImmunologicOther: vi.fn(),
  setSuicidalRiskAssessmentDeniesSymptomsBellow: vi.fn(),
  setReviewOfSuicidalRiskAssessmentOther: vi.fn(),
  setReviewOfBehavioralSymptomsOther: vi.fn(),
  setReviewOfPhysicalSymptomsOther: vi.fn(),
  setReviewOfPsychosocialSymptomsOther: vi.fn(),
  setReviewOfCurrentMedicationsOther: vi.fn(),
  setReviewOfNutritionDietOther: vi.fn(),
  setReviewOfNutritionFluidRestrictionsOther: vi.fn(),
  setReviewOfSkinCheckOther: vi.fn(),
  setCurrentMedications: vi.fn(),
  setNutritionFluidRestrictions: vi.fn(),
  setSkinCheck: vi.fn(),
  setSafetyPlanComment: vi.fn(),
  setCommentFigure: vi.fn(),
  setShowSingInTwo: vi.fn(),
  setSigners: vi.fn(),
  ...overrides,
});

describe("NursingAssessmentFormContentPart2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all the review-of-systems section headings", () => {
    renderWithProviders(<NursingAssessmentFormContentPart2 {...baseProps()} />);

    expect(screen.getByText(/Musculoskeletal:/)).toBeInTheDocument();
    expect(screen.getByText(/Psychiatric:/)).toBeInTheDocument();
    expect(screen.getByText(/Neurologic:/)).toBeInTheDocument();
    expect(screen.getByText(/Respiratory:/)).toBeInTheDocument();
    expect(screen.getByText(/Allergic\/Immunologic:/)).toBeInTheDocument();
    expect(screen.getByText("Suicidal Risk Assessment")).toBeInTheDocument();
    expect(screen.getByText(/Behavioral symptoms:/)).toBeInTheDocument();
    expect(screen.getByText("Physical symptoms")).toBeInTheDocument();
    expect(screen.getByText("Psychosocial symptoms")).toBeInTheDocument();
    expect(screen.getByText("Current Medications")).toBeInTheDocument();
    expect(screen.getByText(/Nutrition Diet:/)).toBeInTheDocument();
  });

  it("calls handlereviewOfSystemsMusculoskeletal when a musculoskeletal box is toggled", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    // WHY: the DENIES box for musculoskeletal has a stable id.
    fireEvent.click(document.getElementById("deniesMusculoskeletal"));
    expect(props.handlereviewOfSystemsMusculoskeletal).toHaveBeenCalledWith(
      "DENIES",
    );
  });

  it("reflects an already-checked option from the provided array value", () => {
    const props = baseProps({ reviewOfSystemsPsychiatric: ["Anxiety"] });
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    expect(document.getElementById("anxiety")).toBeChecked();
    // A sibling option not in the array stays unchecked.
    expect(document.getElementById("insomnia")).not.toBeChecked();
  });

  it("toggles the suicidal-risk denies checkbox via its setter", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    fireEvent.click(
      document.getElementById("suicidalRiskAssessmentDeniesSymptomsBellow"),
    );
    expect(
      props.setSuicidalRiskAssessmentDeniesSymptomsBellow,
    ).toHaveBeenCalledWith(true);
  });

  it("toggles the current-medications checkbox via its setter", () => {
    const props = baseProps({ currentMedications: false });
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    fireEvent.click(document.getElementById("currentMedications"));
    expect(props.setCurrentMedications).toHaveBeenCalledWith(true);
  });

  it("sets fluid restrictions to true / false via the Yes/No boxes", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    fireEvent.click(document.getElementById("nutritionFluidRestrictions"));
    expect(props.setNutritionFluidRestrictions).toHaveBeenCalledWith(true);

    fireEvent.click(document.getElementById("nutritionFluidRestrictionsno"));
    expect(props.setNutritionFluidRestrictions).toHaveBeenCalledWith(false);
  });

  it("updates the musculoskeletal comment textarea through its setter", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    const textarea = document.getElementById("programlocation&address");
    await user.type(textarea, "x");
    expect(props.setReviewOfSystemsMusculoskeletalOther).toHaveBeenCalledWith(
      "x",
    );
  });

  it("renders the SAVED AND SIGNED button and fires its handler", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    const btn = screen.getByRole("button", { name: "SAVED AND SIGNED" });
    fireEvent.click(btn);
    expect(props.setShowSingInTwo).toHaveBeenCalledWith(true);
  });

  it("renders provided imagesPair figures", () => {
    const setValue = vi.fn();
    const props = baseProps({
      imagesPair: [
        { title: "front", img: "front.png", value: false, setValue },
      ],
    });
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    // CheckBoxMaker renders a checkbox with id === title.
    expect(document.getElementById("front")).toBeInTheDocument();
  });

  it("shows the Signers MultiEmployee picker only when creating a new record (no id)", () => {
    const { rerender } = renderWithProviders(
      <NursingAssessmentFormContentPart2 {...baseProps({ id: null })} />,
    );
    expect(screen.getByTestId("multi-employee")).toBeInTheDocument();

    rerender(<NursingAssessmentFormContentPart2 {...baseProps({ id: "x" })} />);
    expect(screen.queryByTestId("multi-employee")).not.toBeInTheDocument();
  });

  it("renders a signature block when an rnSignature is present", () => {
    const props = baseProps({ rnSignature: "RN Signature" });
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    expect(screen.getAllByTestId("signature-format").length).toBeGreaterThan(0);
  });

  it("disables the submit button for a non-admin without an RN signature on a new record", () => {
    const props = baseProps({
      id: null,
      rnSignature: "",
      profileInfo: { userType: "Employee" },
    });
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    expect(
      screen.getByRole("button", { name: "SUBMIT DETAILS" }),
    ).toBeDisabled();
  });

  it("enables the submit button for an admin on a new record", () => {
    const props = baseProps({
      id: null,
      rnSignature: "",
      profileInfo: { userType: "Admin" },
    });
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    expect(
      screen.getByRole("button", { name: "SUBMIT DETAILS" }),
    ).not.toBeDisabled();
  });

  it("shows the spinner instead of the submit label while loading", () => {
    const props = baseProps({ loading: true });
    renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />);

    expect(screen.getByTestId("clip-loader")).toBeInTheDocument();
  });

  it("renders without crashing when array props are undefined", () => {
    const props = baseProps({
      reviewOfSystemsMusculoskeletal: undefined,
      reviewOfSystemsPsychiatric: undefined,
      behavioralSymptoms: undefined,
      nutritionDiet: undefined,
      imagesPair: undefined,
      signers: undefined,
    });
    expect(() =>
      renderWithProviders(<NursingAssessmentFormContentPart2 {...props} />),
    ).not.toThrow();
  });
});
