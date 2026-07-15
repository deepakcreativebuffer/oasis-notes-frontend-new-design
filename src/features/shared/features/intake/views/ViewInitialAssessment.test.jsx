/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ViewInitialAssessment from "./ViewInitialAssessment";

// ---------------------------------------------------------------------------
// The container reads everything from useViewInitialAssessment(), which in turn
// fetches the assessment over HTTP, wires print refs, and exposes ~hundreds of
// setters. We mock the hook so each test can drive the read-only view through a
// controlled `form` object instead of mounting the entire intake data layer.
// ---------------------------------------------------------------------------
let mockForm;
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/useViewInitialAssessment",
  () => ({
    useViewInitialAssessment: () => mockForm,
  }),
);

// HOC normally wraps the page in Sidebar + Navbar chrome (extra redux/router
// reads we don't care about here). Stub it to render the inner component
// directly so the test focuses on ViewInitialAssessment's own markup.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function Stubbed() {
      return <Wcomponenet />;
    },
}));

// FormUpper / AssessmentTypeHeader is the assessment-type selector header; stub
// to a light marker exposing the assessmentType so we can assert it threads
// through without pulling in its radio/print internals.
vi.mock("@/features/shared/features/intake/FormsUpperbar", () => ({
  default: ({ assessmentType, disabled }) => (
    <div data-testid="form-upper" data-disabled={String(!!disabled)}>
      {assessmentType}
    </div>
  ),
}));

// AddSignature is the signature-pad modal (canvas-backed). Stub to a marker that
// reflects its `show` prop so we can assert the resident-signature branch.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) => (
    <div data-testid="add-signature" data-show={String(!!show)} />
  ),
}));

// The eight read-only section components are exercised by their own co-located
// tests; here we stub them to markers so we only assert the container assembles
// them in order and feeds them the form context.
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/PatientAdmissionSection",
  () => ({ default: () => <div data-testid="section-patient-admission" /> }),
);
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/MedicalHistorySection",
  () => ({ default: () => <div data-testid="section-medical-history" /> }),
);
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/SubstanceAbuseSection",
  () => ({ default: () => <div data-testid="section-substance-abuse" /> }),
);
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/WithdrawalMseIntroSection",
  () => ({ default: () => <div data-testid="section-withdrawal-mse" /> }),
);
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/MentalStatusExamSection",
  () => ({ default: () => <div data-testid="section-mental-status" /> }),
);
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/EmploymentLivingSection",
  () => ({ default: () => <div data-testid="section-employment-living" /> }),
);
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/SafetyRiskSection",
  () => ({ default: () => <div data-testid="section-safety-risk" /> }),
);
vi.mock(
  "@/features/shared/features/intake/views/ViewInitialAssessment/sections/DiagnosesSignaturesSection",
  () => ({ default: () => <div data-testid="section-diagnoses-signatures" /> }),
);

// Minimal valid form value. The container destructures these keys directly and
// renders the company/resident/date sentence, so they must always be present.
function buildForm(overrides = {}) {
  return {
    printRef: { current: null },
    componentRef: { current: null },
    showSignatureResident: false,
    setSignerSignature: vi.fn(),
    setSignerDate: vi.fn(),
    setSignerTime: vi.fn(),
    handleSubmit: vi.fn((e) => e?.preventDefault?.()),
    assessmentType: "Behavioral Health Assessment",
    setAssessmentType: vi.fn(),
    companyName: "Test Facility",
    residentName: "Test Patient",
    assessmentOn: "2026-06-10",
    navigate: vi.fn(),
    ...overrides,
  };
}

describe("ViewInitialAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockForm = buildForm();
  });

  it("should render the page title and back control", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: the heading anchors the printed intake document for clinicians.
    expect(screen.getByText("Initial Assessment")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("should render the notification sentence with company, resident, and date", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: the consent banner must name the facility, the resident, and the
    // assessment date so the printed record is attributable.
    expect(screen.getByText("Test Facility")).toBeInTheDocument();
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("2026-06-10")).toBeInTheDocument();
    expect(screen.getByText(/has notified/)).toBeInTheDocument();
  });

  it("should render all eight assessment sections in the form", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: a complete intake document must assemble every clinical section;
    // a missing section would silently drop required data from the record.
    expect(screen.getByTestId("section-patient-admission")).toBeInTheDocument();
    expect(screen.getByTestId("section-medical-history")).toBeInTheDocument();
    expect(screen.getByTestId("section-substance-abuse")).toBeInTheDocument();
    expect(screen.getByTestId("section-withdrawal-mse")).toBeInTheDocument();
    expect(screen.getByTestId("section-mental-status")).toBeInTheDocument();
    expect(screen.getByTestId("section-employment-living")).toBeInTheDocument();
    expect(screen.getByTestId("section-safety-risk")).toBeInTheDocument();
    expect(
      screen.getByTestId("section-diagnoses-signatures"),
    ).toBeInTheDocument();
  });

  it("should render the assessment-type header in disabled (read-only) mode", () => {
    renderWithProviders(<ViewInitialAssessment />);

    const header = screen.getByTestId("form-upper");
    // WHY: this is a read-only View*, so the type selector is locked and just
    // displays the captured assessment type.
    expect(header).toHaveAttribute("data-disabled", "true");
    expect(header).toHaveTextContent("Behavioral Health Assessment");
  });

  it("should keep the resident signature modal hidden until requested", () => {
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: the signature pad only opens when the resident is actively signing;
    // by default it stays closed.
    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "false",
    );
  });

  it("should pass showSignatureResident through to the signature modal", () => {
    mockForm = buildForm({ showSignatureResident: true });
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: when the hook flags the resident is signing, the modal must open.
    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "true",
    );
  });

  it("should navigate back when the back arrow is clicked", () => {
    const navigate = vi.fn();
    mockForm = buildForm({ navigate });
    renderWithProviders(<ViewInitialAssessment />);

    fireEvent.click(screen.getByAltText(""));
    // WHY: the back arrow returns the user to the resident's intake list
    // without saving (this is a read-only view).
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("should render without crashing when company/resident/date are empty", () => {
    mockForm = buildForm({
      companyName: "",
      residentName: "",
      assessmentOn: "",
    });
    renderWithProviders(<ViewInitialAssessment />);

    // WHY: a freshly created assessment may have no header data yet; the view
    // must still mount its static structure rather than throw.
    expect(screen.getByText("Initial Assessment")).toBeInTheDocument();
    expect(screen.getByTestId("section-patient-admission")).toBeInTheDocument();
  });
});
