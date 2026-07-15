/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";

import PatientAdmissionSection from "./PatientAdmissionSection";
import { useViewInitialAssessmentForm } from "../formContext";

// WHY: PatientAdmissionSection is a read-only "View*" section that pulls every
// value from the form context hook. Mock the context module so we can drive the
// component with controlled, fake-PHI data instead of standing up the real
// provider + data-fetching pipeline.
vi.mock("../formContext", () => ({
  useViewInitialAssessmentForm: vi.fn(),
}));

// WHY: the date formatter is incidental IO-free logic; stub it to a stable
// marker so assertions don't depend on locale/timezone behaviour.
vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: vi.fn((d) => `FMT(${d})`),
}));

const makeForm = (overrides = {}) => ({
  residentName: "Test Patient",
  ahcccsId: "MRN-TEST-001",
  dob: "1990-01-01",
  userType: "Employee",
  sex: "Male",
  setSex: vi.fn(),
  dateOfAssessment: "2024-02-02",
  diagnosis: "Test Diagnosis",
  preferredLanguage: "English",
  ethnicity: "Test Ethnicity",
  programLocation: "Test Program Location",
  admissionStatus: ["Voluntary"],
  guardianship: "No",
  powerOfAttorneyStatus: "Active",
  todayDate: "2024-03-03",
  guardianshipPoaPubFidName: "Test Guardian",
  approvedBy: "emp-test-001",
  reasonForAdmission: [{ label: "Reason A" }, { label: "Reason B" }],
  residentStrengths: [{ label: "Strength A" }],
  bhrfCriteria: ["thoughtsBehaviorsOfSuicide", "maladaptivePhysical"],
  residentGoals: "Test Goals",
  residentLimitations: "Test Barriers",
  currentBehavioralIssues: "Test Issues",
  ...overrides,
});

describe("PatientAdmissionSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the provided patient admission data", () => {
    useViewInitialAssessmentForm.mockReturnValue(makeForm());
    render(<PatientAdmissionSection />);

    // WHY: core demographic values from the assessment must be surfaced.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("MRN-TEST-001")).toBeInTheDocument();
    expect(screen.getByText("Test Diagnosis")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("SECTION I")).toBeInTheDocument();
  });

  it("should format date fields through the date formatter", () => {
    useViewInitialAssessmentForm.mockReturnValue(makeForm());
    render(<PatientAdmissionSection />);

    // WHY: DOB/admit/today dates are rendered via formatDateToMMDDYYYY, so the
    // formatted marker (not the raw ISO string) must appear.
    expect(screen.getByText("FMT(1990-01-01)")).toBeInTheDocument();
    expect(screen.getByText("FMT(2024-02-02)")).toBeInTheDocument();
    expect(screen.getByText("FMT(2024-03-03)")).toBeInTheDocument();
  });

  it("should render list answers (reasons / strengths)", () => {
    useViewInitialAssessmentForm.mockReturnValue(makeForm());
    render(<PatientAdmissionSection />);

    expect(screen.getByText("Reason A")).toBeInTheDocument();
    expect(screen.getByText("Reason B")).toBeInTheDocument();
    expect(screen.getByText("Strength A")).toBeInTheDocument();
  });

  it("should reflect the selected gender via a single checked radio", () => {
    useViewInitialAssessmentForm.mockReturnValue(makeForm({ sex: "Female" }));
    render(<PatientAdmissionSection />);

    // WHY: the section visualises stored gender as read-only radios. The
    // component reuses a duplicate id for Female/Transgender, so we assert on
    // checked-state rather than accessible name: exactly one gender radio is
    // checked for the stored value.
    const genderMale = document.getElementById("maleRadio");
    expect(genderMale).not.toBeChecked();
    const checkedRadios = screen.getAllByRole("radio").filter((r) => r.checked);
    expect(checkedRadios).toHaveLength(1);
  });

  it("should reflect checked admission status and BHRF criteria checkboxes", () => {
    useViewInitialAssessmentForm.mockReturnValue(
      makeForm({ admissionStatus: ["Voluntary", "Court Ordered Treatment"] }),
    );
    render(<PatientAdmissionSection />);

    expect(screen.getByRole("checkbox", { name: "Voluntary" })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Court Ordered Treatment" }),
    ).toBeChecked();
    // WHY: only the BHRF criteria stored on the assessment should render checked.
    expect(
      screen.getByRole("checkbox", {
        name: /Thoughts or behaviors of suicide/i,
      }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", {
        name: /Anticipated stabilization cannot be achieved/i,
      }),
    ).not.toBeChecked();
  });

  it("should render gender radios as read-only for Patient role", () => {
    useViewInitialAssessmentForm.mockReturnValue(
      makeForm({ userType: "Patient", sex: "Male" }),
    );
    render(<PatientAdmissionSection />);

    // WHY: for the Patient view the gender radios are display-only (no onChange
    // wiring) but the stored value must still be reflected as checked.
    expect(document.getElementById("maleRadio")).toBeChecked();
  });

  it("should handle missing / empty data without crashing", () => {
    useViewInitialAssessmentForm.mockReturnValue({
      residentName: undefined,
      ahcccsId: undefined,
      dob: undefined,
      userType: "Employee",
      sex: undefined,
      setSex: vi.fn(),
      dateOfAssessment: undefined,
      diagnosis: undefined,
      preferredLanguage: undefined,
      ethnicity: undefined,
      programLocation: undefined,
      admissionStatus: [],
      guardianship: undefined,
      powerOfAttorneyStatus: undefined,
      todayDate: undefined,
      guardianshipPoaPubFidName: undefined,
      approvedBy: undefined,
      reasonForAdmission: [],
      residentStrengths: [],
      bhrfCriteria: [],
      residentGoals: undefined,
      residentLimitations: undefined,
      currentBehavioralIssues: undefined,
    });

    expect(() => render(<PatientAdmissionSection />)).not.toThrow();
    // WHY: static section labels still render even with no answer data.
    expect(screen.getByText("SECTION I")).toBeInTheDocument();
    expect(screen.getByText("BHRF Criteria")).toBeInTheDocument();
  });
});
