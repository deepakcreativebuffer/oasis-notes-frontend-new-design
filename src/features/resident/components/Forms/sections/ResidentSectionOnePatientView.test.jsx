/** @format */

import { renderWithProviders, screen } from "@/test-utils";
import ResidentSectionOnePatientView from "./ResidentSectionOnePatientView";

// Mock the form context hook so we can drive every field value directly.
// vi.hoisted so the mock holder is available inside the vi.mock factory.
const ctx = vi.hoisted(() => ({ value: {} }));

vi.mock(
  "../../../pages/Intake/InitialAssessment/context/ResidentInitialAssessmentFormContext",
  () => ({
    useResidentInitialAssessmentFormContext: () => ctx.value,
  }),
);

// A complete context value covering every field the section reads so render
// never crashes on undefined .includes/.map/.length access.
function makeCtx(overrides = {}) {
  return {
    residentName: "Test Patient",
    ahcccsId: "MRN-TEST-001",
    dob: "1990-01-15",
    diagnosis: "Test Diagnosis (new)",
    userType: "Employee",
    sex: "Male",
    setSex: () => {},
    dateOfAssessment: "2026-01-02",
    preferredLanguage: "English",
    ethnicity: "Hispanic",
    admissionStatus: ["Voluntary"],
    programLocation: "Test Program Location",
    guardianship: "No",
    powerOfAttorneyStatus: "None",
    todayDate: "2026-06-10",
    guardianshipPoaPubFidName: "Test Guardian",
    approvedBy: "Dr. Test",
    reasonForAdmission: [{ label: "Crisis Stabilization" }],
    bhrfCriteria: ["thoughtsBehaviorsOfSuicide", "maladaptivePhysical"],
    residentGoals: "Improve coping skills",
    residentStrengths: [{ label: "Motivated" }, { label: "Supportive Family" }],
    residentLimitations: "Limited mobility",
    currentBehavioralIssues: "Reported anxiety",
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  ctx.value = makeCtx();
});

describe("ResidentSectionOnePatientView", () => {
  it("renders the SECTION I header and core resident data", () => {
    renderWithProviders(<ResidentSectionOnePatientView />);

    expect(screen.getByText("SECTION I")).toBeInTheDocument();
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("MRN-TEST-001")).toBeInTheDocument();
    expect(screen.getByText("Test Diagnosis (new)")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Hispanic")).toBeInTheDocument();
  });

  it("renders mapped label arrays for reason-for-admission and strengths", () => {
    renderWithProviders(<ResidentSectionOnePatientView />);

    // reasonForAdmission/residentStrengths are arrays of {label} joined by ", "
    expect(screen.getByText("Crisis Stabilization")).toBeInTheDocument();
    expect(
      screen.getByText("Motivated, Supportive Family"),
    ).toBeInTheDocument();
  });

  it("checks the BHRF criteria checkboxes that are present in context", () => {
    renderWithProviders(<ResidentSectionOnePatientView />);

    // bhrfCriteria includes thoughtsBehaviorsOfSuicide -> that checkbox checked
    const suicide = screen.getByLabelText(
      "Thoughts or behaviors of suicide, homicide, or harm to self or others",
    );
    expect(suicide).toBeChecked();

    // a criterion NOT in the array remains unchecked
    const behavioralHealth = screen.getByLabelText(
      "Anticipated stabilization cannot be achieved in a less restrictive setting",
    );
    expect(behavioralHealth).not.toBeChecked();
  });

  it("reflects the selected gender radio for the Employee view", () => {
    renderWithProviders(<ResidentSectionOnePatientView />);

    expect(screen.getByLabelText("Male")).toBeChecked();
    expect(screen.getByLabelText("Female")).not.toBeChecked();
  });

  it("renders the read-only (Patient) gender branch without setters", () => {
    // userType === Patient renders the second branch (no onChange handlers)
    ctx.value = makeCtx({ userType: "Patient", sex: "Female" });
    renderWithProviders(<ResidentSectionOnePatientView />);

    expect(screen.getByLabelText("Female")).toBeChecked();
    expect(screen.getByLabelText("Male")).not.toBeChecked();
  });

  it("is resilient to empty / missing optional data", () => {
    // Empty strings and empty arrays must not crash (.includes/.map/.length used)
    ctx.value = makeCtx({
      residentName: "",
      ahcccsId: "",
      diagnosis: "",
      preferredLanguage: "",
      ethnicity: "",
      admissionStatus: [],
      programLocation: "",
      guardianship: "",
      powerOfAttorneyStatus: "",
      reasonForAdmission: [],
      bhrfCriteria: [],
      residentGoals: "",
      residentStrengths: [],
      residentLimitations: "",
      currentBehavioralIssues: "",
      dob: undefined,
      dateOfAssessment: undefined,
      todayDate: undefined,
    });

    renderWithProviders(<ResidentSectionOnePatientView />);
    // Header still renders even with no field data.
    expect(screen.getByText("SECTION I")).toBeInTheDocument();
  });
});
