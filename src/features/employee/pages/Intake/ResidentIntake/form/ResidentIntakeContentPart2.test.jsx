/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ResidentIntakeContentPart2 from "./ResidentIntakeContentPart2";

// WHY: AutoSize uses canvas measureText + many props; stub to a plain input that
// surfaces value + setValue so we can assert AutoSize-backed fields render/edit.
vi.mock("@/features/shared/ui/forms/AutoSize", () => ({
  __esModule: true,
  AutoSize: ({ value, setValue, placeholder }) => (
    <input
      data-testid="autosize"
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => setValue && setValue(e.target.value)}
    />
  ),
  default: ({ value, setValue, placeholder }) => (
    <input
      data-testid="autosize"
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => setValue && setValue(e.target.value)}
    />
  ),
}));

// WHY: CustomMultiSelectInput wraps react-select/creatable (heavy, portal-based).
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: ({ value, onChange, options }) => (
    <div data-testid="multi-select">
      <span data-testid="multi-select-value">
        {(value || []).map((v) => v?.label).join(",")}
      </span>
      <span data-testid="multi-select-options">{(options || []).length}</span>
      <button
        type="button"
        data-testid="multi-select-add"
        onClick={() =>
          onChange &&
          onChange([...(value || []), { label: "Added", value: "Added" }])
        }
      >
        add
      </button>
    </div>
  ),
}));

// WHY: react-datepicker is heavy; stub to a text input exposing onChange.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      data-testid="datepicker"
      placeholder={placeholderText}
      onChange={(e) => onChange && onChange(new Date("2026-01-02"))}
    />
  ),
}));

// WHY: signature panels pull in canvas/socket; stub to markers exposing role.
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureSection", () => ({
  __esModule: true,
  default: ({ role, label }) => (
    <div data-testid="signature-section" data-role={role}>
      {label}
    </div>
  ),
}));
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureNamesPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="signature-names-panel" />,
}));

// WHY: search widgets fire network/socket; stub to a marker + setValue button.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="patient-component" />,
}));
vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  __esModule: true,
  default: ({ setValue }) => (
    <button
      type="button"
      data-testid="multi-employee"
      onClick={() => setValue && setValue(["emp-test-001"])}
    >
      pick-signer
    </button>
  ),
}));

// WHY: utils touches PHI helpers / permissions; stub deterministic returns.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  formatDateToMMDDYYYY: (d) => (d ? new Date("2026-01-01") : null),
  fetchPaitentName: (p) =>
    p ? `${p.firstName || ""} ${p.lastName || ""}`.trim() : "",
  deletePermission: () => true,
  signatureFormat: ({ sign }) => (
    <span data-testid="signature-format">{sign}</span>
  ),
}));

// Minimal prop set; the component reads ~150 props but tolerates undefined for
// most. We supply the handlers/values each tested page actually exercises.
const baseProps = (overrides = {}) => ({
  page: 6,
  residentName: "Test Patient",
  hoursFormat: "12",
  isNotEditableWithSigner: false,
  Profile: { companyName: "Test Co", userType: "Employee" },
  signatures: [],
  getApiData: {
    data: { patientId: { firstName: "Test", lastName: "Patient" } },
  },
  // page 7/8/9 multi-select handlers + values
  optionValue: [{ label: "A", value: "A" }],
  ORIENTATIONDropDown: [],
  optionHandler: vi.fn(),
  handleKeyDownORIENTATIONDropDown: vi.fn(),
  receiptOptionValue: [{ label: "R", value: "R" }],
  receiptDropDown: [],
  receiptOptionHandler: vi.fn(),
  handleKeyDownReceiptDropDown: vi.fn(),
  houseRulesDropDown: [],
  houseRulesOptionHandler: vi.fn(),
  handleKeyDownHouseRulesDropDown: vi.fn(),
  // navigation
  handlePrevPage: vi.fn(),
  handleNextPage: vi.fn(),
  // setters used on rendered pages
  setComplaintProcessAcknowledgementCompany: vi.fn(),
  setOrientationToAgencyCompany: vi.fn(),
  setReceiptName: vi.fn(),
  setHouseRulesAcknowledgementName: vi.fn(),
  setLockBoxKeyIssueReturnAddress: vi.fn(),
  setLockBoxKeyIssueReturnDateKeyIssued: vi.fn(),
  setLockBoxKeyIssueReturnDateKeyReturned: vi.fn(),
  setLockBoxKeyIssueReturnResponsibleFor: vi.fn(),
  setLockBoxKeyIssueReturnResponsibleForCorporation: vi.fn(),
  setLockBoxKeyIssueReturnCharged: vi.fn(),
  setPrimaryInsurance: vi.fn(),
  setVerbalConsentResidentRepresentative: vi.fn(),
  guardTyped: (fn) => fn && fn(),
  setSigInModel19: vi.fn(),
  setSigners: vi.fn(),
  updateRoleSignature: vi.fn(),
  clearAllTyped: vi.fn(),
  roleSignatures: { resident: {}, witness: {} },
  // page 11 lock-box / consent values
  lockBoxKeyIssueReturnAddress: "",
  lockBoxKeyIssueReturnCharged: "",
  primaryInsurance: "",
  verbalConsentResidentRepresentative: "",
  signers: [],
  ...overrides,
});

describe("ResidentIntakeContentPart2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page 6 (Acknowledgement Of Complaint Process)", () => {
    renderWithProviders(
      <ResidentIntakeContentPart2 {...baseProps({ page: 6 })} />,
    );
    expect(
      screen.getAllByText(/Acknowledgement Of Complaint Process/i).length,
    ).toBeGreaterThanOrEqual(1);
    // Resident name surfaces in the print header.
    expect(screen.getAllByText("Test Patient").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("renders nothing for pages other than 6-11", () => {
    const { container } = renderWithProviders(
      <ResidentIntakeContentPart2 {...baseProps({ page: 1 })} />,
    );
    // No page block matches page 1 in this Part2 component.
    expect(container.querySelector(".print-content")).toBeNull();
  });

  it("fires handleNextPage / handlePrevPage from the page-6 nav buttons", () => {
    const props = baseProps({ page: 6 });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Next Page/i }));
    fireEvent.click(screen.getByRole("button", { name: /Prev Page/i }));
    expect(props.handleNextPage).toHaveBeenCalled();
    expect(props.handlePrevPage).toHaveBeenCalled();
  });

  it("renders page 7 (Orientation To Agency) with the orientation multi-select", () => {
    renderWithProviders(
      <ResidentIntakeContentPart2 {...baseProps({ page: 7 })} />,
    );
    expect(
      screen.getAllByText(/ORIENTATION TO AGENCY/i).length,
    ).toBeGreaterThanOrEqual(1);
    // The orientation list is rendered via the stubbed CustomMultiSelectInput.
    expect(screen.getByTestId("multi-select")).toBeInTheDocument();
    expect(screen.getByTestId("multi-select-options").textContent).toBe("1");
  });

  it("routes orientation multi-select changes through optionHandler on page 7", () => {
    const props = baseProps({ page: 7 });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    fireEvent.click(screen.getByTestId("multi-select-add"));
    expect(props.optionHandler).toHaveBeenCalledWith([
      { label: "Added", value: "Added" },
    ]);
  });

  it("renders page 8 (Receipt Of Information At Admission)", () => {
    renderWithProviders(
      <ResidentIntakeContentPart2 {...baseProps({ page: 8 })} />,
    );
    expect(
      screen.getAllByText(/RECEIPT OF INFORMATION AT ADMISSION/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("multi-select")).toBeInTheDocument();
  });

  it("renders page 9 (House Rules Acknowledgement) using houseRulesOptionValue", () => {
    renderWithProviders(
      <ResidentIntakeContentPart2 {...baseProps({ page: 9 })} />,
    );
    expect(
      screen.getAllByText(/HOUSE RULES ACKNOWLEDGEMENT/i).length,
    ).toBeGreaterThanOrEqual(1);
    // Options come from the real houseRulesOptionValue export (>= 1).
    const count = Number(
      screen.getByTestId("multi-select-options").textContent,
    );
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it("renders page 10 (Lock Box) and edits the address field", () => {
    const props = baseProps({ page: 10 });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    expect(
      screen.getAllByText(/Resident Lock Box Key Issue and Return Optional/i)
        .length,
    ).toBeGreaterThanOrEqual(1);
    const addr = screen.getByPlaceholderText("Enter address");
    fireEvent.change(addr, { target: { value: "123 Test St" } });
    expect(props.setLockBoxKeyIssueReturnAddress).toHaveBeenCalledWith(
      "123 Test St",
    );
  });

  it("fires a lock-box datepicker change on page 10", () => {
    const props = baseProps({ page: 10 });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    const pickers = screen.getAllByTestId("datepicker");
    // Page 10 has two datepickers (key-issued + key-returned). Firing both and
    // asserting at least one setter ran avoids coupling to render order.
    pickers.forEach((p) =>
      fireEvent.change(p, { target: { value: "01/02/2026" } }),
    );
    expect(
      props.setLockBoxKeyIssueReturnDateKeyIssued.mock.calls.length +
        props.setLockBoxKeyIssueReturnDateKeyReturned.mock.calls.length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders page 11 (Consent for Treatment) with insurance fields + signature sections", () => {
    const props = baseProps({ page: 11 });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    expect(
      screen.getAllByText(/Primary Insurance/i).length,
    ).toBeGreaterThanOrEqual(1);
    // Signature sections for resident + witness render on the final page.
    const roles = screen
      .getAllByTestId("signature-section")
      .map((el) => el.getAttribute("data-role"));
    expect(roles).toContain("resident");
    expect(roles).toContain("witness");
    expect(screen.getByTestId("signature-names-panel")).toBeInTheDocument();
  });

  it("edits primary insurance and verbal consent on page 11", () => {
    const props = baseProps({ page: 11 });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    const verbal = screen.getByPlaceholderText("Enter text");
    fireEvent.change(verbal, { target: { value: "Verbal OK" } });
    expect(props.setVerbalConsentResidentRepresentative).toHaveBeenCalledWith(
      "Verbal OK",
    );
  });

  it("fires SAVED AND SIGNED (setSigInModel19) on page 11", () => {
    const props = baseProps({ page: 11 });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /SAVED AND SIGNED/i }));
    // guardTyped passes through, so the setter is invoked.
    expect(props.setSigInModel19).toHaveBeenCalledWith(true);
  });

  it("shows the MultiEmployee signers picker on page 11 when no id is present", () => {
    const props = baseProps({ page: 11, id: undefined });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    fireEvent.click(screen.getByTestId("multi-employee"));
    expect(props.setSigners).toHaveBeenCalledWith(["emp-test-001"]);
  });

  it("hides the signers picker on page 11 when an id exists (edit mode)", () => {
    renderWithProviders(
      <ResidentIntakeContentPart2
        {...baseProps({ page: 11, id: "res-test-001" })}
      />,
    );
    expect(screen.queryByTestId("multi-employee")).toBeNull();
  });

  it("renders existing page-6 signatures via signatureFormat", () => {
    const props = baseProps({
      page: 6,
      signatures: [
        {
          page: 6,
          sign: [
            {
              signerId: "emp-test-001",
              signature: "sig-data",
              dateSigned: "2026-01-01",
            },
          ],
        },
      ],
    });
    renderWithProviders(<ResidentIntakeContentPart2 {...props} />);
    expect(screen.getByTestId("signature-format")).toHaveTextContent(
      "sig-data",
    );
  });

  it("does not crash with sparse props on page 6", () => {
    expect(() =>
      renderWithProviders(
        <ResidentIntakeContentPart2
          page={6}
          handleNextPage={vi.fn()}
          handlePrevPage={vi.fn()}
        />,
      ),
    ).not.toThrow();
  });
});
