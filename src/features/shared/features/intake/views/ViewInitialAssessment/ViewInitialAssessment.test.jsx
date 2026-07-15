/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import ViewInitialAssessment from "./ViewInitialAssessment";

// ViewInitialAssessment is a thin presentational shell: it pulls everything from
// the useViewInitialAssessment hook and renders a few header values plus eight
// heavy section sub-components. We mock the hook so we can drive the rendered
// header text deterministically, and stub every child/IO module so the test
// exercises ONLY this shell (no data-fetching, printing, signatures, or layout
// chrome). See house style in DeleteModal/UnauthorizedPage tests.

// --- Drive the component via a controllable hook return value -------------
const hookReturn = vi.fn();
vi.mock("./useViewInitialAssessment", () => ({
  useViewInitialAssessment: () => hookReturn(),
}));

// --- HOC wraps the component in Sidebar/Navbar layout chrome; render content
// only so we test the assessment shell in isolation.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

// --- Signature modal pulls in canvas/heavy utils; stub to a marker element.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) =>
    show ? <div data-testid="add-signature">signature-modal</div> : null,
}));

// --- The forms toolbar (print/type toggle); render a light stub exposing the
// disabled flag so we can assert read-only mode.
vi.mock("../../FormsUpperbar", () => ({
  default: ({ disabled }) => (
    <div data-testid="form-upper" data-disabled={String(!!disabled)}>
      forms-upperbar
    </div>
  ),
}));

// --- The eight section sub-components each read the form context; replace with
// markers so a render failure in a child cannot mask the shell behaviour.
vi.mock("./sections/PatientAdmissionSection", () => ({
  default: () => <div data-testid="section-patient-admission" />,
}));
vi.mock("./sections/MedicalHistorySection", () => ({
  default: () => <div data-testid="section-medical-history" />,
}));
vi.mock("./sections/SubstanceAbuseSection", () => ({
  default: () => <div data-testid="section-substance-abuse" />,
}));
vi.mock("./sections/WithdrawalMseIntroSection", () => ({
  default: () => <div data-testid="section-withdrawal-mse-intro" />,
}));
vi.mock("./sections/MentalStatusExamSection", () => ({
  default: () => <div data-testid="section-mental-status-exam" />,
}));
vi.mock("./sections/EmploymentLivingSection", () => ({
  default: () => <div data-testid="section-employment-living" />,
}));
vi.mock("./sections/SafetyRiskSection", () => ({
  default: () => <div data-testid="section-safety-risk" />,
}));
vi.mock("./sections/DiagnosesSignaturesSection", () => ({
  default: () => <div data-testid="section-diagnoses-signatures" />,
}));

const baseForm = (overrides = {}) => ({
  printRef: { current: null },
  componentRef: { current: null },
  showSignatureResident: false,
  setSignerSignature: vi.fn(),
  setSignerDate: vi.fn(),
  setSignerTime: vi.fn(),
  handleSubmit: vi.fn((e) => e?.preventDefault?.()),
  assessmentType: "",
  setAssessmentType: vi.fn(),
  companyName: "Test Facility",
  residentName: "Test Patient",
  assessmentOn: "06/10/2026",
  navigate: vi.fn(),
  ...overrides,
});

describe("ViewInitialAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookReturn.mockReturnValue(baseForm());
  });

  it("should render the Initial Assessment header", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: staff must see they are on the Initial Assessment view; the heading
    // is rendered by the shell itself, not a section.
    expect(screen.getByText("Initial Assessment")).toBeInTheDocument();
  });

  it("should render the notification summary with company, resident and date", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: the intro card surfaces the facility/resident/date the assessment was
    // requested for — core identifying context for the record.
    expect(screen.getByText("Test Facility")).toBeInTheDocument();
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("06/10/2026")).toBeInTheDocument();
  });

  it("should render the forms toolbar in disabled (read-only) mode", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: this is a View* screen — the toolbar must be disabled so a completed
    // assessment is not accidentally edited.
    const toolbar = screen.getByTestId("form-upper");
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute("data-disabled", "true");
  });

  it("should render all eight assessment sections", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: a clinical assessment is incomplete if any section is dropped from
    // the rendered/printed document.
    [
      "section-patient-admission",
      "section-medical-history",
      "section-substance-abuse",
      "section-withdrawal-mse-intro",
      "section-mental-status-exam",
      "section-employment-living",
      "section-safety-risk",
      "section-diagnoses-signatures",
    ].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
  });

  it("should hide the signature modal when showSignatureResident is false", () => {
    renderWithProviders(<ViewInitialAssessment />);

    expect(screen.queryByTestId("add-signature")).not.toBeInTheDocument();
  });

  it("should show the signature modal when showSignatureResident is true", () => {
    hookReturn.mockReturnValue(baseForm({ showSignatureResident: true }));
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: the resident signature capture is gated on the hook flag; the shell
    // must surface it when signing is in progress.
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
  });

  it("should render without crashing when header values are missing/empty", () => {
    hookReturn.mockReturnValue(
      baseForm({ companyName: "", residentName: "", assessmentOn: "" }),
    );
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: an in-progress or partially-hydrated record must still render the
    // shell rather than blanking the page.
    expect(screen.getByText("Initial Assessment")).toBeInTheDocument();
    expect(screen.getByTestId("section-patient-admission")).toBeInTheDocument();
  });
});
