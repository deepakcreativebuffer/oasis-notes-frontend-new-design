/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";
import { ViewTreatmentPlanFormProvider } from "../../context/ViewTreatmentPlanFormContext";

import ViewTreatmentPlanSignaturesPrintSection from "./ViewTreatmentPlanSignaturesPrintSection";

// Mock the heavy/IO-bound child components so this view test stays focused on
// the section's own rendering + branch logic. SignatureSection reads redux and
// lazy-loads a pad modal; ResidentPrintSignature currently renders null.
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureSection", () => ({
  default: ({ role, label, signature, signerNameOverride }) => (
    <div
      data-testid={`signature-section-${role}`}
      data-has-signature={signature ? "yes" : "no"}
      data-name-override={signerNameOverride || ""}
    >
      {label}
    </div>
  ),
}));

vi.mock(
  "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature",
  () => ({
    default: () => <div data-testid="resident-print-signature" />,
  }),
);

// Mock the two utils the component pulls from "@/utils/utils": signatureFormat
// (pure render helper) and AddSignature (redux-reading effect component).
vi.mock("@/utils/utils", () => ({
  signatureFormat: ({ sign }) =>
    sign ? (
      <p data-testid="signature-format">Digitally Signed by {sign}</p>
    ) : null,
  AddSignature: ({ show }) => (
    <div data-testid="add-signature" data-show={show ? "yes" : "no"} />
  ),
}));

// Build a full context value; individual tests override the fields they exercise.
const makeContext = (overrides = {}) => ({
  nameResident: "",
  verbalConsentResidentRepresentative: "",
  signatureBhp: "",
  dateBhp: "",
  timeBhp: "",
  hoursFormat: "h:mm A",
  adminSignature: "",
  adminSignatureDate: "",
  adminSignatureTime: "",
  signers: [],
  residentName: "",
  getApiData: { signatures: {}, data: {} },
  showSignatureResident: false,
  print: vi.fn(),
  setSignerSignature: vi.fn(),
  setSignerDate: vi.fn(),
  setSignerTime: vi.fn(),
  ...overrides,
});

const renderSection = (overrides = {}) =>
  renderWithProviders(
    <ViewTreatmentPlanFormProvider value={makeContext(overrides)}>
      <ViewTreatmentPlanSignaturesPrintSection />
    </ViewTreatmentPlanFormProvider>,
  );

describe("ViewTreatmentPlanSignaturesPrintSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the informed-consent heading and core sections", () => {
    renderSection();

    // WHY: this presentational view always shows the consent statement and the
    // resident + witness inline signature sections regardless of data.
    expect(
      screen.getByText(
        /Signature indicates participation and informed consent/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("signature-section-resident"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("signature-section-witness")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /PRINT THIS FORM/i }),
    ).toBeInTheDocument();
  });

  it("should render the resident name row only when nameResident is provided", () => {
    const { rerender, store, queryClient } = renderSection();
    // WHY: per client, the resident name label/row is suppressed when empty.
    expect(
      screen.queryByText(/Resident\/Representative First and Last Name/i),
    ).not.toBeInTheDocument();

    renderWithProviders(
      <ViewTreatmentPlanFormProvider
        value={makeContext({ nameResident: "Test Patient" })}
      >
        <ViewTreatmentPlanSignaturesPrintSection />
      </ViewTreatmentPlanFormProvider>,
      { store, queryClient },
    );
    expect(
      screen.getByText(/Resident\/Representative First and Last Name/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    // silence unused rerender warning
    void rerender;
  });

  it("should render the verbal consent row when a value is present", () => {
    renderSection({
      verbalConsentResidentRepresentative: "Consent over phone",
    });

    // WHY: verbal-consent capture is only displayed when the intake recorded one.
    expect(
      screen.getByText(/Verbal Consent given by resident\/representative/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Consent over phone")).toBeInTheDocument();
  });

  it("should render digitally-signed lines for bhp, admin and extra signers", () => {
    renderSection({
      signatureBhp: "BHP Signer",
      adminSignature: "Admin Signer",
      signers: [
        {
          signerId: "emp-test-001",
          signature: "Witness Signer",
          dateSigned: "",
          signedTime: "",
        },
        {
          signerId: "emp-test-002",
          signature: "",
          dateSigned: "",
          signedTime: "",
        },
      ],
    });

    const signed = screen.getAllByTestId("signature-format");
    // WHY: bhp + admin + one signer with a signature => 3 lines; the signer with
    // an empty signature is skipped.
    expect(signed).toHaveLength(3);
    expect(
      screen.getByText(/Digitally Signed by BHP Signer/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Digitally Signed by Admin Signer/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Digitally Signed by Witness Signer/),
    ).toBeInTheDocument();
  });

  it("should derive resident signer name from patientId when residentName is missing", () => {
    renderSection({
      residentName: "",
      getApiData: {
        signatures: {},
        data: { patientId: { firstName: "Test", lastName: "Patient" } },
      },
    });

    // WHY: the resident inline signature falls back to the patient record's
    // first/last name so a legacy signature without a captured name still prints.
    expect(screen.getByTestId("signature-section-resident")).toHaveAttribute(
      "data-name-override",
      "Test Patient",
    );
  });

  it("should pass the resident signature through to the resident section", () => {
    renderSection({
      getApiData: {
        signatures: {
          resident: { rawSignatureImage: "data:image/png;base64,xyz" },
        },
        data: {},
      },
    });

    expect(screen.getByTestId("signature-section-resident")).toHaveAttribute(
      "data-has-signature",
      "yes",
    );
  });

  it("should invoke the print handler when PRINT THIS FORM is clicked", async () => {
    const user = userEvent.setup();
    const print = vi.fn();
    renderSection({ print });

    await user.click(screen.getByRole("button", { name: /PRINT THIS FORM/i }));

    // WHY: the print button drives the form's print pipeline (hidePrint toggling
    // + window.print), so the wired handler must fire.
    expect(print).toHaveBeenCalledTimes(1);
  });

  it("should render without crashing on minimal/empty context", () => {
    renderSection();

    // WHY: view sections must tolerate missing answer data without throwing —
    // the AddSignature hidden helper and both inline sections still mount.
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
    expect(screen.getByTestId("resident-print-signature")).toBeInTheDocument();
    expect(screen.queryAllByTestId("signature-format")).toHaveLength(0);
  });
});
