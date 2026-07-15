/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";
import PatientInformationSection, {
  PATIENT_INFORMATION_SECTION_PROP_KEYS,
} from "./PatientInformationSection";

// PatientComponent pulls in real services/IO — stub it so render stays pure
// and we can assert it appears in the "new patient" (no id) branch.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="patient-component" />,
}));

// CustomMultiSelectInput wraps react-multi-select-component; stub to a light
// element that surfaces the value so we can assert it received props.
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: ({ value }) => (
    <div data-testid="multi-select">{JSON.stringify(value)}</div>
  ),
}));

vi.mock("@/features/shared/ui/Search/Search", () => ({
  __esModule: true,
  default: () => <div data-testid="search" />,
}));

// react-datepicker is heavy and not under test; render a simple input.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      data-testid="datepicker"
      placeholder={placeholderText}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

// Minimal valid prop set. Every setter is a no-op spy. Fake PHI only.
const makeProps = (overrides = {}) => {
  const setters = PATIENT_INFORMATION_SECTION_PROP_KEYS.filter((k) =>
    k.startsWith("set"),
  ).reduce((acc, k) => ({ ...acc, [k]: vi.fn() }), {});
  return {
    ...setters,
    VisualDisturbancesOtherBoolean: false,
    VisualDisturbancesOtherType: "",
    admissionStatus: [],
    ahcccsId: "",
    approvedBy: "",
    bhrfCriteria: [],
    bhrfCriteriaHandler: vi.fn(),
    currentBehavioralIssues: "",
    dateOfAssessment: "",
    diagnosis: "",
    dob: "",
    ethnicity: "",
    getApiData: undefined,
    guardianship: "",
    guardianshipPoaPubFidName: "",
    handleCheckboxAdmisionStatus: vi.fn(),
    handleKeyDownReasionForAdmission: vi.fn(),
    handleKeyDownResidentStrength: vi.fn(),
    handleSelectChange: vi.fn(),
    handleSelectChangeAdmission: vi.fn(),
    handleSelectChangeAdmissionReasonForAdmission: vi.fn(),
    id: "",
    option_value_Admission: [],
    option_value_ReasonForAdmission: [],
    powerOfAttorneyStatus: "",
    preferredLanguage: "",
    programLocation: "",
    qualitiesOptions: [],
    reasonForAdmission: [],
    residentGoals: "",
    residentLimitations: "",
    residentName: "",
    residentStrengths: [],
    sex: "",
    todayDate: "",
    ...overrides,
  };
};

describe("PatientInformationSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("exports the section component and its prop-key contract", () => {
    expect(typeof PatientInformationSection).toBe("function");
    // WHY: the parent assessment form spreads these exact keys; a drift here
    // silently drops fields, so the contract list is part of the API surface.
    expect(Array.isArray(PATIENT_INFORMATION_SECTION_PROP_KEYS)).toBe(true);
    expect(PATIENT_INFORMATION_SECTION_PROP_KEYS).toContain("ahcccsId");
    expect(PATIENT_INFORMATION_SECTION_PROP_KEYS).toContain("bhrfCriteria");
  });

  it("renders the SECTION I heading and core demographic labels", () => {
    renderWithProviders(<PatientInformationSection {...makeProps()} />);

    expect(screen.getByText("SECTION I")).toBeInTheDocument();
    expect(screen.getByText("AHCCCS ID")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("Admission Status")).toBeInTheDocument();
    expect(screen.getByText("BHRF Criteria")).toBeInTheDocument();
  });

  it("shows the PatientComponent search when no existing record id is present", () => {
    renderWithProviders(
      <PatientInformationSection {...makeProps({ id: "" })} />,
    );

    // WHY: new intakes must let staff pick a resident; without an id the
    // editable resident-name input is replaced by the patient search widget.
    expect(screen.getByTestId("patient-component")).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Resident's Full Name/i),
    ).not.toBeInTheDocument();
  });

  it("shows a read-only resident name field when an existing record id is present", () => {
    renderWithProviders(
      <PatientInformationSection
        {...makeProps({ id: "res-test-001", residentName: "Test Patient" })}
      />,
    );

    expect(screen.queryByTestId("patient-component")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Resident's Full Name/i)).toHaveValue(
      "Test Patient",
    );
  });

  it("reflects the selected gender via the radio checked state", () => {
    renderWithProviders(
      <PatientInformationSection {...makeProps({ sex: "Female" })} />,
    );

    // WHY: gender drives downstream clinical templates; the controlled radio
    // must mirror the prop rather than local UI state.
    expect(screen.getByLabelText("Female")).toBeChecked();
    expect(screen.getByLabelText("Male")).not.toBeChecked();
  });

  it("invokes handleCheckboxAdmisionStatus when an admission status box is toggled", () => {
    const props = makeProps();
    renderWithProviders(<PatientInformationSection {...props} />);

    fireEvent.click(screen.getByLabelText("Voluntary"));
    expect(props.handleCheckboxAdmisionStatus).toHaveBeenCalledWith(
      "Voluntary",
    );
  });

  it("invokes bhrfCriteriaHandler when a BHRF criterion is toggled", () => {
    const props = makeProps();
    renderWithProviders(<PatientInformationSection {...props} />);

    fireEvent.click(
      screen.getByLabelText(/Impulsivity with poor judgement\/insight/i),
    );
    expect(props.bhrfCriteriaHandler).toHaveBeenCalledWith(
      "impulsivityWithPoorJudgement",
    );
  });

  it("calls setPreferredLanguage as the controlled text field changes", () => {
    const props = makeProps();
    renderWithProviders(<PatientInformationSection {...props} />);

    const labels = screen.getAllByText("Preferred Language");
    // The label sits next to its input within the same Form.Group.
    const input = labels[0].parentElement.querySelector("input");
    fireEvent.change(input, { target: { value: "Spanish" } });
    expect(props.setPreferredLanguage).toHaveBeenCalledWith("Spanish");
  });

  it("renders without crashing when array/object props are empty or missing", () => {
    // WHY: partially-hydrated assessments arrive with undefined collections;
    // the section must degrade gracefully instead of throwing on .includes/.map.
    expect(() =>
      renderWithProviders(
        <PatientInformationSection
          {...makeProps({
            bhrfCriteria: undefined,
            reasonForAdmission: undefined,
            residentStrengths: undefined,
            getApiData: undefined,
          })}
        />,
      ),
    ).not.toThrow();
  });
});
