/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import SignaturesSubmitSection from "./SignaturesSubmitSection";

// WHY: the component reads everything from this form context. Mock the hook so
// each test can drive controlled values and assert the setters it calls,
// without standing up the real provider/form state.
const h = vi.hoisted(() => ({ ctx: { current: null } }));
vi.mock("../context/InitialAssessmentFormContext", () => ({
  __esModule: true,
  useInitialAssessmentFormContext: () => h.ctx.current,
}));

// Light stubs for heavy child components (signature pads / portal-based search).
// Each surfaces just the props we assert on.
vi.mock(
  "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature",
  () => ({
    __esModule: true,
    default: () => <div data-testid="resident-print-signature" />,
  }),
);
vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  __esModule: true,
  default: ({ setValue, value }) => (
    <button
      type="button"
      data-testid="multi-employee"
      onClick={() => setValue([...(value || []), { signerId: "emp-test-001" }])}
    >
      multi-employee
    </button>
  ),
}));
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureNamesPanel", () => ({
  __esModule: true,
  default: ({ signatures }) => (
    <div data-testid="signature-names-panel">
      {signatures ? "has-signatures" : "no-signatures"}
    </div>
  ),
}));
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureSection", () => ({
  __esModule: true,
  default: ({ role, label }) => (
    <div data-testid={`signature-section-${role}`}>{label}</div>
  ),
}));

// Proxy-backed context: any unknown setX/handleX key resolves to a no-op fn so
// render never crashes; explicit overrides supply the controlled values we read.
const makeCtx = (overrides = {}) => {
  const base = {
    residentRepresentative: "",
    saveAsDrafIsNotEditableWithoutSigner: false,
    guardTyped: (cb) => cb(),
    setSigInModel7: vi.fn(),
    bhpSignature: "",
    bhpTime: "",
    bhpDate: "",
    hoursFormat: "12",
    adminSignature: "",
    adminSignatureDate: "",
    adminSignatureTime: "",
    signers: [],
    signatures: { resident: null, witness: null },
    residentName: "Test Patient",
    hasTypedInForm: false,
    id: null,
    witnessIncomplete: false,
    isSubmitEnabled: true,
    profileInfo: { userType: "Employee" },
    loading: false,
    ...overrides,
  };
  return new Proxy(base, {
    get: (t, p) => {
      if (p in t) return t[p];
      if (typeof p === "string" && /^(set|handle|update|clear)/.test(p)) {
        return () => {};
      }
      return undefined;
    },
    has: () => true,
  });
};

const renderSection = (overrides = {}) => {
  h.ctx.current = makeCtx(overrides);
  return renderWithProviders(<SignaturesSubmitSection />);
};

describe("SignaturesSubmitSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the consent label and signature child sections", () => {
    renderSection();
    expect(
      screen.getByText(/Signature indicates participation/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Resident\/Representative First and Last Name/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("resident-print-signature")).toBeInTheDocument();
    expect(screen.getByTestId("signature-names-panel")).toBeInTheDocument();
    // Only resident + witness SignatureSections are active (bhp/bht/admin disabled).
    expect(
      screen.getByTestId("signature-section-resident"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("signature-section-witness")).toBeInTheDocument();
    expect(
      screen.queryByTestId("signature-section-bhp"),
    ).not.toBeInTheDocument();
  });

  it("reflects the controlled residentRepresentative value", () => {
    renderSection({ residentRepresentative: "Test Patient" });
    expect(screen.getByDisplayValue("Test Patient")).toBeInTheDocument();
  });

  it("calls setResidentRepresentative on input change", () => {
    const setResidentRepresentative = vi.fn();
    renderSection({ setResidentRepresentative });
    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "MRN-TEST-001" } });
    expect(setResidentRepresentative).toHaveBeenCalledWith("MRN-TEST-001");
  });

  it("opens the signed model through guardTyped when SAVED AND SIGNED is clicked", () => {
    const setSigInModel7 = vi.fn();
    // guardTyped passes the callback straight through (default impl).
    renderSection({ setSigInModel7 });
    fireEvent.click(screen.getByRole("button", { name: /SAVED AND SIGNED/i }));
    expect(setSigInModel7).toHaveBeenCalledWith(true);
  });

  it("renders the Signers MultiEmployee block only when there is no id", () => {
    renderSection({ id: null });
    expect(screen.getByTestId("multi-employee")).toBeInTheDocument();
    expect(screen.getByText("Signers")).toBeInTheDocument();
  });

  it("hides the Signers MultiEmployee block when editing an existing record (id set)", () => {
    renderSection({ id: "ia-test-001" });
    expect(screen.queryByTestId("multi-employee")).not.toBeInTheDocument();
  });

  it("routes MultiEmployee changes through setSigners", () => {
    const setSigners = vi.fn();
    renderSection({ setSigners, signers: [] });
    fireEvent.click(screen.getByTestId("multi-employee"));
    expect(setSigners).toHaveBeenCalledWith([{ signerId: "emp-test-001" }]);
  });

  it("renders existing signer signature lines", () => {
    renderSection({
      signers: [
        {
          signerId: "emp-test-001",
          signature: "Test Signer",
          dateSigned: "2026-06-10",
          signedTime: "10:00",
        },
      ],
    });
    // signatureFormat outputs "Digitally Signed by <name>".
    expect(
      screen.getByText(/Digitally Signed by Test Signer/i),
    ).toBeInTheDocument();
  });

  it("shows the submit button label when not loading", () => {
    renderSection({ loading: false });
    expect(screen.getByText(/SUBMIT DETAILS/i)).toBeInTheDocument();
  });

  it("shows a spinner instead of the submit label when loading", () => {
    renderSection({ loading: true });
    expect(screen.queryByText(/SUBMIT DETAILS/i)).not.toBeInTheDocument();
  });

  it("disables submit when witnessIncomplete is true", () => {
    renderSection({ witnessIncomplete: true });
    const submit = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("type") === "submit");
    expect(submit).toBeDisabled();
  });

  it("enables submit for Admin users on a new record", () => {
    // No id, Admin userType => disabled === false branch.
    renderSection({
      id: null,
      witnessIncomplete: false,
      profileInfo: { userType: "Admin" },
    });
    const submit = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("type") === "submit");
    expect(submit).not.toBeDisabled();
  });

  it("renders without crashing when optional collections are missing", () => {
    // signers undefined, signatures only partially populated.
    h.ctx.current = makeCtx({ signers: undefined });
    expect(() =>
      renderWithProviders(<SignaturesSubmitSection />),
    ).not.toThrow();
  });
});
