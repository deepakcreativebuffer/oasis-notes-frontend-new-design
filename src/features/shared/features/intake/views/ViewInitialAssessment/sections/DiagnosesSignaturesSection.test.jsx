/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";

import DiagnosesSignaturesSection from "./DiagnosesSignaturesSection";

// The form value object is supplied by useViewInitialAssessmentForm(). We mock
// the context hook so each test can drive the read-only view via a controlled
// `f` object instead of mounting the entire intake form provider tree.
let mockFormValue;
vi.mock("../formContext", () => ({
  useViewInitialAssessmentForm: () => mockFormValue,
}));

// Heavy / IO-ish children are stubbed to light markers so we only assert this
// section's own rendering, not the signature pad / print plumbing.
vi.mock(
  "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature",
  () => ({
    default: () => <div data-testid="resident-print-signature" />,
  }),
);
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureSection", () => ({
  default: ({ label, role }) => (
    <div data-testid="signature-section" data-role={role}>
      {label}
    </div>
  ),
}));
vi.mock("@/features/shared/ui/forms/AutoSize", () => ({
  default: ({ value, placeholder }) => (
    <input readOnly value={value || ""} placeholder={placeholder} />
  ),
}));

// signatureFormat renders typed/legacy signature lines; stub it to a plain
// string marker so we can assert the section wires it through without pulling
// in date/time formatting internals.
vi.mock("@/utils/utils", () => ({
  signatureFormat: ({ sign }) => (sign ? `SIG(${sign})` : null),
}));

// Minimal valid form value. The component calls .map() (non-optional) on
// psychiatricDiagnosesArray and medicalDiagnosesArray and reads Profile.userType
// directly, so those must always be present to avoid a render crash.
function buildForm(overrides = {}) {
  return {
    psychiatricDiagnosesArray: [],
    medicalDiagnosesArray: [],
    protectiveFactorsArray: [],
    signers: [],
    Profile: { userType: "Employee" },
    getApiData: { data: {}, signatures: {}, patientId: {} },
    treatmentRecommendations: [],
    hoursFormat: "12",
    print: vi.fn(),
    // setters (no-ops) referenced as onChange handlers
    setSupportsYesNo: vi.fn(),
    setSpiritualYesNo: vi.fn(),
    setReligiousYesNo: vi.fn(),
    setFearYesNo: vi.fn(),
    setInterventionYesNo: vi.fn(),
    setWillingYesNo: vi.fn(),
    setRiskLevel: vi.fn(),
    setAcceptResident: vi.fn(),
    ...overrides,
  };
}

describe("DiagnosesSignaturesSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormValue = buildForm();
  });

  it("should render the core read-only section headings without data", () => {
    render(<DiagnosesSignaturesSection />);

    // WHY: these static labels anchor the assessment's clinical sections and
    // must always print even when the underlying answers are empty.
    expect(screen.getByText("Protective factors")).toBeInTheDocument();
    expect(screen.getByText("Diagnoses")).toBeInTheDocument();
    // WHY: "Medical Diagnoses" appears both as the section label and the table
    // header, so we assert at least one occurrence rather than a unique match.
    expect(screen.getAllByText("Medical Diagnoses").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Psychosocial or Environmental Stressors"),
    ).toBeInTheDocument();
    expect(screen.getByText("Treatment Recommendations")).toBeInTheDocument();
  });

  it("should not crash with empty diagnosis/signer arrays and render child stubs", () => {
    render(<DiagnosesSignaturesSection />);

    // WHY: a brand-new assessment has no diagnoses/signers; the view must
    // tolerate empty arrays and still mount the signature widgets.
    expect(screen.getByTestId("resident-print-signature")).toBeInTheDocument();
    const sigSections = screen.getAllByTestId("signature-section");
    expect(sigSections.length).toBeGreaterThanOrEqual(2);
    expect(
      screen.getByText("Resident/Representative Signature"),
    ).toBeInTheDocument();
    expect(screen.getByText("Witness Signature")).toBeInTheDocument();
  });

  it("should render provided psychiatric and medical diagnosis values", () => {
    mockFormValue = buildForm({
      psychiatricPrimaryIcdCode: "F32.9",
      psychiatricPrimaryDescription: "Major depressive disorder",
      primaryIcdCode: "E11.9",
      primaryDescription: "Type 2 diabetes",
    });
    render(<DiagnosesSignaturesSection />);

    // WHY: clinicians rely on the printed assessment showing the exact ICD
    // codes and descriptions captured during intake.
    expect(screen.getByText("F32.9")).toBeInTheDocument();
    expect(screen.getByText("Major depressive disorder")).toBeInTheDocument();
    expect(screen.getByText("E11.9")).toBeInTheDocument();
    expect(screen.getByText("Type 2 diabetes")).toBeInTheDocument();
  });

  it("should render extra diagnosis rows from the dynamic arrays", () => {
    mockFormValue = buildForm({
      psychiatricDiagnosesArray: [
        {
          name: "Anxiety",
          icdCode: "F41.9",
          description: "Anxiety disorder",
        },
      ],
      medicalDiagnosesArray: [
        { name: "Asthma", icdCode: "J45.909", description: "Mild asthma" },
      ],
    });
    render(<DiagnosesSignaturesSection />);

    // WHY: additional diagnoses beyond the fixed primary/secondary slots are
    // stored in arrays and must each appear as their own row.
    expect(screen.getByText("F41.9")).toBeInTheDocument();
    expect(screen.getByText("Anxiety disorder")).toBeInTheDocument();
    expect(screen.getByText("J45.909")).toBeInTheDocument();
    expect(screen.getByText("Mild asthma")).toBeInTheDocument();
  });

  it("should render resident agreement text using the resident name", () => {
    mockFormValue = buildForm({ residentName: "Test Patient" });
    render(<DiagnosesSignaturesSection />);

    // WHY: the consent checkboxes must address the resident by name so the
    // printed agreement is legally attributable.
    expect(
      screen.getByText(/Yes, I Test Patient am in agreement/),
    ).toBeInTheDocument();
  });

  it("should disable consent checkboxes for non-Patient users", () => {
    mockFormValue = buildForm({ Profile: { userType: "Employee" } });
    render(<DiagnosesSignaturesSection />);

    // WHY: only the patient may accept/reject their own treatment plan; staff
    // viewing the form must see the consent checkboxes locked.
    const checkboxes = screen.getAllByRole("checkbox");
    const consent = checkboxes.filter((c) => c.disabled);
    expect(consent.length).toBeGreaterThanOrEqual(2);
  });

  it("should enable consent checkboxes for a Patient user", () => {
    mockFormValue = buildForm({
      Profile: { userType: "Patient" },
      residentName: "Test Patient",
    });
    render(<DiagnosesSignaturesSection />);

    // WHY: a logged-in patient is allowed to toggle their own agreement.
    const agree = screen.getByText(/Yes, I Test Patient am in agreement/);
    // The label text lives inside the checkbox's label; its input sibling
    // should not be disabled for a Patient.
    const input = agree.closest("label")?.previousSibling || agree;
    expect(screen.getByText(/No, I Test Patient disagree/)).toBeInTheDocument();
    // At least one enabled checkbox exists (the consent ones).
    const enabled = screen.getAllByRole("checkbox").filter((c) => !c.disabled);
    expect(enabled.length).toBeGreaterThan(0);
    expect(input).toBeTruthy();
  });

  it("should call print when the PRINT THIS FORM button is clicked", () => {
    const print = vi.fn();
    mockFormValue = buildForm({ print });
    render(<DiagnosesSignaturesSection />);

    screen.getByRole("button", { name: /print this form/i }).click();
    // WHY: the print action is the primary export path for the finalized
    // assessment.
    expect(print).toHaveBeenCalledTimes(1);
  });

  it("should render legacy typed signatures via signatureFormat", () => {
    mockFormValue = buildForm({ bhpSignature: "Dr. Test" });
    render(<DiagnosesSignaturesSection />);

    // WHY: legacy typed signatures still need to print on existing records.
    expect(screen.getByText("SIG(Dr. Test)")).toBeInTheDocument();
  });
});
