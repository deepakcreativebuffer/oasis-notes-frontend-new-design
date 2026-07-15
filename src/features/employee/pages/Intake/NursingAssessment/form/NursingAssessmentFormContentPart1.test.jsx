/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import NursingAssessmentFormContentPart1 from "./NursingAssessmentFormContentPart1";

// WHY: react-datepicker is heavy/portal-based; stub to a plain input exposing
// the props (placeholder/onChange) this section relies on.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText, disabled }) => (
    <input
      aria-label="date-picker"
      placeholder={placeholderText}
      disabled={disabled}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

// Build a complete props bag. Setters/handlers default to spies so render never
// crashes and we can assert wiring. Field values are FAKE PHI only.
const baseProps = (overrides = {}) => {
  const setterNames = [
    "setAhcccsId",
    "setTodayDate",
    "setAdmissionDate",
    "setDateOfBirth",
    "setDiagnosis",
    "setAge",
    "setSex",
    "setLastTBScreeningDate",
    "setVitalsBloodPressure",
    "setVitalsPulse",
    "setVitalsRespiratoryRate",
    "setVitalsTemperature",
    "setVitalsOxygenLevel",
    "setVitalsWeight",
    "setVitalsHeightFeet",
    "setAllergies",
    "setReviewOfSystemsConstitutionalOther",
    "setReviewOfSystemsCardiovascularOther",
    "setReviewOfSystemsGastrointestinalOther",
    "setReviewOfSystemsGenitourinaryOther",
    "setReviewOfSystemsHematologyOncologyOther",
    "setReviewOfSystemsHeadNeckThroatOther",
    "setReviewOfSystemsIntegumentaryOther",
    "setReviewOfSystemsMusculoskeletalOther",
    "setReviewOfSystemsEndocrineOther",
    "handleCodeStatusChange",
    "handleMultiTbScreeningResults",
    "careProvidedPhysicalServicesHandler",
    "handlereviewOfSystemsConstitutional",
    "handlereviewOfSystemsCardiovascular",
    "handlereviewOfSystemsEndocrine",
    "handlereviewOfSystemsGastrointestinal",
    "handlereviewOfSystemsGenitourinary",
    "handlereviewOfSystemsHematologyOncology",
    "handlereviewOfSystemsHeadNeckThroat",
    "handlereviewOfSystemsIntegumentary",
  ];
  const spies = {};
  setterNames.forEach((n) => {
    spies[n] = vi.fn();
  });

  return {
    ...spies,
    ahcccsId: "AHCCCS-TEST-001",
    todayDate: "",
    admissionDate: "",
    dateOfBirth: "",
    diagnosis: "Test diagnosis",
    age: "42",
    sex: "Male",
    codeStatus: [],
    lastTBScreeningDate: "",
    tbScreeningResults: [],
    careProvidedPhysicalServices: [],
    vitalsBloodPressure: "120/80",
    vitalsPulse: "72",
    vitalsRespiratoryRate: "16",
    vitalsTemperature: "98",
    vitalsOxygenLevel: "99",
    vitalsWeight: "150",
    vitalsHeightFeet: "5",
    vitalsHeightInches: "10",
    allergies: "None",
    reviewOfSystemsConstitutional: [],
    reviewOfSystemsConstitutionalOther: "",
    reviewOfSystemsCardiovascular: [],
    reviewOfSystemsCardiovascularOther: "",
    reviewOfSystemsEndocrine: [],
    reviewOfSystemsEndocrineOther: "",
    reviewOfSystemsGastrointestinal: [],
    reviewOfSystemsGastrointestinalOther: "",
    reviewOfSystemsGenitourinary: [],
    reviewOfSystemsGenitourinaryOther: "",
    reviewOfSystemsHematologyOncology: [],
    reviewOfSystemsHematologyOncologyOther: "",
    reviewOfSystemsHeadNeckThroat: [],
    reviewOfSystemsHeadNeckThroatOther: "",
    reviewOfSystemsIntegumentary: [],
    reviewOfSystemsIntegumentaryOther: "",
    ...overrides,
  };
};

describe("NursingAssessmentFormContentPart1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the patient/vitals/review-of-systems section headings", () => {
    renderWithProviders(<NursingAssessmentFormContentPart1 {...baseProps()} />);

    expect(screen.getByText("AHCCCS ID")).toBeInTheDocument();
    expect(screen.getByText("Code Status")).toBeInTheDocument();
    expect(screen.getByText("Vitals")).toBeInTheDocument();
    expect(screen.getByText("Review Of Systems")).toBeInTheDocument();
    // Each review-of-systems subsection heading.
    expect(screen.getByText("Constitutional")).toBeInTheDocument();
    expect(screen.getByText("Cardiovascular")).toBeInTheDocument();
    expect(screen.getByText("Endocrine")).toBeInTheDocument();
    expect(screen.getByText("Gastrointestinal")).toBeInTheDocument();
    expect(screen.getByText("Genitourinary")).toBeInTheDocument();
    expect(screen.getByText("Hematology/Oncology")).toBeInTheDocument();
    expect(screen.getByText("Integumentary")).toBeInTheDocument();
  });

  it("reflects provided field values in their inputs", () => {
    renderWithProviders(<NursingAssessmentFormContentPart1 {...baseProps()} />);

    // AHCCCS ID input shows the seeded value.
    expect(screen.getByDisplayValue("AHCCCS-TEST-001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test diagnosis")).toBeInTheDocument();
    expect(screen.getByDisplayValue("120/80")).toBeInTheDocument();
    expect(screen.getByDisplayValue("None")).toBeInTheDocument();
  });

  it("checks the gender box matching the sex prop", () => {
    renderWithProviders(
      <NursingAssessmentFormContentPart1 {...baseProps({ sex: "Female" })} />,
    );
    // WHY: Gender is a checkbox group; the matching label is checked.
    const female = screen.getByLabelText("Female");
    expect(female).toBeChecked();
    expect(screen.getByLabelText("Male")).not.toBeChecked();
  });

  it("invokes handleCodeStatusChange when a code-status box is toggled", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart1 {...props} />);

    fireEvent.click(screen.getByLabelText("Full Code"));
    expect(props.handleCodeStatusChange).toHaveBeenCalledWith("Full Code");
  });

  it("reflects a selected code-status value as checked", () => {
    renderWithProviders(
      <NursingAssessmentFormContentPart1
        {...baseProps({ codeStatus: ["DNR"] })}
      />,
    );
    expect(screen.getByLabelText("DNR")).toBeChecked();
    expect(screen.getByLabelText("Full Code")).not.toBeChecked();
  });

  it("routes TB screening result toggles through handleMultiTbScreeningResults", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart1 {...props} />);

    fireEvent.click(screen.getByLabelText("Positive"));
    expect(props.handleMultiTbScreeningResults).toHaveBeenCalledWith(
      "Positive",
    );
  });

  it("routes care-provided toggles through careProvidedPhysicalServicesHandler", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart1 {...props} />);

    fireEvent.click(screen.getByLabelText("Physical Services"));
    expect(props.careProvidedPhysicalServicesHandler).toHaveBeenCalledWith(
      "PhysicalServices",
    );
  });

  it("calls setVitalsBloodPressure when the blood pressure field changes", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart1 {...props} />);

    const bp = screen.getByDisplayValue("120/80");
    fireEvent.change(bp, { target: { value: "130/85" } });
    expect(props.setVitalsBloodPressure).toHaveBeenCalledWith("130/85");
  });

  it("calls setAge when the age field changes", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart1 {...props} />);

    const age = screen.getByPlaceholderText("Enter Age");
    fireEvent.change(age, { target: { value: "50" } });
    expect(props.setAge).toHaveBeenCalledWith("50");
  });

  it("routes review-of-systems Constitutional toggles to its handler", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContentPart1 {...props} />);

    fireEvent.click(screen.getByLabelText("Fever"));
    expect(props.handlereviewOfSystemsConstitutional).toHaveBeenCalledWith(
      "Fever",
    );
  });

  it("reflects checked review-of-systems values", () => {
    renderWithProviders(
      <NursingAssessmentFormContentPart1
        {...baseProps({ reviewOfSystemsCardiovascular: ["Chest pain"] })}
      />,
    );
    expect(screen.getByLabelText("Chest pain")).toBeChecked();
  });

  it("renders multiple date pickers (created/admit/dob/TB)", () => {
    renderWithProviders(<NursingAssessmentFormContentPart1 {...baseProps()} />);
    // WHY: four DatePicker instances drive the date fields in this section.
    expect(screen.getAllByLabelText("date-picker").length).toBe(4);
  });

  it("does not crash when array-valued props are empty/missing", () => {
    // WHY: arrays default to []; missing optional Other strings must not throw.
    expect(() =>
      renderWithProviders(
        <NursingAssessmentFormContentPart1
          {...baseProps({
            ahcccsId: "",
            diagnosis: "",
            age: "",
            allergies: "",
            vitalsBloodPressure: "",
          })}
        />,
      ),
    ).not.toThrow();
    expect(screen.getByText("Vitals")).toBeInTheDocument();
  });
});
