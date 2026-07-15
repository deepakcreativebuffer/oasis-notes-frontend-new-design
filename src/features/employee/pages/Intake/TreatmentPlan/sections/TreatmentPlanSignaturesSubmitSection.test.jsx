/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanSignaturesSubmitSection from "./TreatmentPlanSignaturesSubmitSection";

// WHY: the section reads everything off a large form context. Mock the hook so
// each test controls the field values and setters it asserts on.
const ctx = vi.hoisted(() => ({ current: {} }));
vi.mock("../context/TreatmentPlanFormContext", () => ({
  __esModule: true,
  useTreatmentPlanFormContext: () => ctx.current,
}));

// WHY: signatureFormat is a presentational util; stub so we can detect it was
// invoked with each role's sign/date payload without rendering real markup.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  signatureFormat: ({ sign }) =>
    sign ? <span data-testid="sig-format">{sign}</span> : null,
}));

// WHY: heavy shared signature/search UI — stub to light testids exposing the
// props the section wires (role/label + the onUpdate callback).
vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  __esModule: true,
  default: ({ value }) => (
    <div data-testid="multi-employee">{(value || []).length} signers</div>
  ),
}));
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureSection", () => ({
  __esModule: true,
  default: ({ role, label, onUpdate }) => (
    <button
      type="button"
      data-testid={`sig-section-${role}`}
      onClick={() => onUpdate && onUpdate(role, "name", "X")}
    >
      {label}
    </button>
  ),
}));
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureNamesPanel", () => ({
  __esModule: true,
  default: ({ signatures }) => (
    <div data-testid="sig-names-panel">{Object.keys(signatures).length}</div>
  ),
}));
vi.mock(
  "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature",
  () => ({
    __esModule: true,
    default: () => <div data-testid="resident-print-signature" />,
  }),
);
vi.mock("react-spinners", () => ({
  __esModule: true,
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

const makeCtx = (overrides = {}) => ({
  isReason: "",
  setIsReason: vi.fn(),
  nameResident: "",
  setNameResident: vi.fn(),
  verbalConsentResidentRepresentative: "",
  setVerbalConsentResidentRepresentative: vi.fn(),
  guardTyped: vi.fn((cb) => cb && cb()),
  setSignatureModel3: vi.fn(),
  saveAsDrafIsNotEditableWithoutSigner: false,
  signatureBhp: "",
  dateBhp: "",
  timeBhp: "",
  hoursFormat: "",
  adminSignature: "",
  adminSignatureDate: "",
  adminSignatureTime: "",
  signers: [],
  setSigners: vi.fn(),
  signatures: undefined,
  updateSignature: vi.fn(),
  hasTypedInForm: false,
  clearAllTyped: vi.fn(),
  residentName: "",
  id: "",
  handlePost: vi.fn(),
  witnessIncomplete: false,
  isSubmitEnabled: true,
  profileInfo: { userType: "Employee" },
  loading: false,
  ...overrides,
});

describe("TreatmentPlanSignaturesSubmitSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ctx.current = makeCtx();
  });

  it("renders the agreement checkboxes and consent fields", () => {
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    expect(screen.getByText("Resident / Representative")).toBeInTheDocument();
    // Two agreement checkboxes (yes / no).
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(
      screen.getByText("Verbal Consent given by resident/representative:"),
    ).toBeInTheDocument();
  });

  it("reflects isReason='yes' as a checked agreement box and fires setIsReason", () => {
    ctx.current = makeCtx({ isReason: "yes" });
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
    fireEvent.click(boxes[1]);
    expect(ctx.current.setIsReason).toHaveBeenCalledWith("no");
  });

  it("routes resident name typing through setNameResident", () => {
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    // First "Enter text" field is the resident name; second is verbal consent.
    const input = screen.getAllByPlaceholderText("Enter text")[0];
    fireEvent.change(input, { target: { value: "Jane Doe" } });
    expect(ctx.current.setNameResident).toHaveBeenCalledWith("Jane Doe");
  });

  it("renders the SAVED AND SIGNED button which fires guardTyped + setSignatureModel3", () => {
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    fireEvent.click(screen.getByRole("button", { name: "SAVED AND SIGNED" }));
    expect(ctx.current.guardTyped).toHaveBeenCalled();
    expect(ctx.current.setSignatureModel3).toHaveBeenCalledWith(true);
  });

  it("renders resident and witness signature sections (BHP/BHT/Admin disabled)", () => {
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    expect(screen.getByTestId("sig-section-resident")).toBeInTheDocument();
    expect(screen.getByTestId("sig-section-witness")).toBeInTheDocument();
    // WHY: BHP/BHT/Admin boxes are temp-disabled per client request.
    expect(screen.queryByTestId("sig-section-bhp")).toBeNull();
    expect(screen.queryByTestId("sig-section-bht")).toBeNull();
    expect(screen.queryByTestId("sig-section-admin")).toBeNull();
  });

  it("passes the default 5-key signatures map to the names panel when none provided", () => {
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    // DEFAULT_SIGNATURES has admin/bhp/bht/resident/witness.
    expect(screen.getByTestId("sig-names-panel")).toHaveTextContent("5");
  });

  it("renders the Signers MultiEmployee picker only when there is no id", () => {
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    expect(screen.getByTestId("multi-employee")).toBeInTheDocument();
  });

  it("hides the Signers picker when an id is present (edit mode)", () => {
    ctx.current = makeCtx({ id: "tp-1" });
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    expect(screen.queryByTestId("multi-employee")).toBeNull();
  });

  it("calls handlePost when the submit button is clicked", () => {
    // Employee with a BHP signature -> submit enabled.
    ctx.current = makeCtx({ signatureBhp: "sig-data" });
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    fireEvent.click(screen.getByRole("button", { name: /SUBMIT DETAILS/i }));
    expect(ctx.current.handlePost).toHaveBeenCalled();
  });

  it("disables submit when witnessIncomplete is true", () => {
    ctx.current = makeCtx({ witnessIncomplete: true });
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    expect(
      screen.getByRole("button", { name: /SUBMIT DETAILS/i }),
    ).toBeDisabled();
  });

  it("enables submit for an Admin even without a BHP signature", () => {
    ctx.current = makeCtx({ profileInfo: { userType: "Admin" } });
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    expect(
      screen.getByRole("button", { name: /SUBMIT DETAILS/i }),
    ).not.toBeDisabled();
  });

  it("shows the loading spinner instead of the label while loading", () => {
    ctx.current = makeCtx({ loading: true });
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    expect(screen.getByTestId("clip-loader")).toBeInTheDocument();
  });

  it("renders signature summaries via signatureFormat for signed signers", () => {
    ctx.current = makeCtx({
      signatureBhp: "bhp-sig",
      signers: [
        {
          signerId: "s1",
          signature: "signer-sig",
          dateSigned: "",
          signedTime: "",
        },
      ],
    });
    renderWithProviders(<TreatmentPlanSignaturesSubmitSection />);
    const formatted = screen
      .getAllByTestId("sig-format")
      .map((e) => e.textContent);
    expect(formatted).toContain("bhp-sig");
    expect(formatted).toContain("signer-sig");
  });

  it("renders without crashing when signers is missing", () => {
    ctx.current = makeCtx({ signers: undefined });
    expect(() =>
      renderWithProviders(<TreatmentPlanSignaturesSubmitSection />),
    ).not.toThrow();
  });
});
