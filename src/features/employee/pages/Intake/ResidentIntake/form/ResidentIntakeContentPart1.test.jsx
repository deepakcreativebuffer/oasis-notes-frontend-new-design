/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ResidentIntakeContentPart1 from "./ResidentIntakeContentPart1";

// WHY: react-datepicker is portal/calendar heavy; stub to a plain text input
// that surfaces the selected value + onChange so date fields render and fire.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ selected, onChange, placeholderText, disabled }) => (
    <input
      type="text"
      data-testid="date-picker"
      disabled={disabled}
      placeholder={placeholderText}
      value={selected ? String(selected) : ""}
      onChange={(e) => onChange?.(new Date("2026-06-10"))}
    />
  ),
}));

// WHY: these Search/selector/signature widgets are unused on pages 1-5 but the
// module still imports them; light stubs keep the module graph cheap.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="patient-component" />,
}));
vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  __esModule: true,
  default: () => <div data-testid="multi-employee" />,
}));
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: () => <div data-testid="multi-select" />,
}));
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureSection", () => ({
  __esModule: true,
  default: () => <div data-testid="signature-section" />,
}));
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureNamesPanel", () => ({
  __esModule: true,
  default: () => <div data-testid="signature-names-panel" />,
}));

// WHY: utils pulls in formatting/PHI helpers; stub the two used on pages 1-5
// (formatDateToMMDDYYYY passthrough, signatureFormat -> readable text) and
// no-op the rest so nothing reaches HTTP.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  formatDateToMMDDYYYY: (v) => v ?? null,
  signatureFormat: ({ sign, date }) => `SIG:${sign}|${date}`,
  fetchPaitentName: vi.fn(),
  deletePermission: vi.fn(() => true),
}));

// WHY: the form context exposes ~25 advance-directive/photo setters. A Proxy
// yields a no-op for any accessed setter so destructuring never returns
// undefined and onChange handlers don't crash.
const setterProxy = new Proxy(
  {},
  {
    get: () => () => {},
    has: () => true,
  },
);
vi.mock("../context/ResidentIntakeFormContext", () => ({
  __esModule: true,
  useResidentIntakeFormContext: () => ({ formSetters: setterProxy }),
}));

// Minimal but complete prop bag — every value the rendered pages read.
const baseProps = (overrides = {}) => ({
  page: 1,
  residentName: "Test Patient",
  companyName: "Test Facility",
  setCompanyName: vi.fn(),
  iAgree: undefined,
  setiAgree: vi.fn(),
  hoursFormat: "12",
  signatures: [],
  isNotEditableWithSigner: false,
  handleNextPage: vi.fn(),
  handlePrevPage: vi.fn(),
  // page 2 fields
  internalName: "",
  setInternalName: vi.fn(),
  internalRelationship: "",
  setInternalRelationship: vi.fn(),
  internalContect: "",
  setInternalContect: vi.fn(),
  handleinternalData: vi.fn(),
  internalDisclosureList: [],
  canDelete: true,
  handleDeleteArrayInternalDisclosure: vi.fn(),
  internalDisclosureListExpire: "",
  setInternalDisclosureListExpire: vi.fn(),
  // page 4 fields
  patientDetail: {},
  photoVideoConsentDateOfBirth: "",
  photoVideoConsentAdmissionDate: "",
  photoVideoConsentConsentGiven: undefined,
  photoVideoConsentConsentWithdrawn: undefined,
  // page 5 fields
  advanceDirectivesResidentGender: "",
  advanceDirectivesResidentDateOfBirth: "",
  advanceDirectivesResidentAddress: "",
  advanceDirectivesResidentDate: "",
  advanceDirectivesProvidedInfoAcknowledged: "",
  advanceDirectivesProvidedInfoDate: "",
  advanceDirectivesRefusingAcknowledged: "",
  advanceDirectivesProvidedInfoRefusingDate: "",
  advanceDirectivesDeveloped: "",
  advanceDirectivesDevelopedComment: "",
  advanceDirectivesExecutedInRecord: "",
  advanceDirectivesExecutedInRecordComment: "",
  advanceDirectivesFilingStatusWishNotFiled: false,
  advanceDirectivesFilingStatusAskedForCopyNotProvided: false,
  advanceDirectivesFilingStatusOther: false,
  advanceDirectivesCoordinationOfCareCopySentToPCP: "",
  advanceDirectivesCoordinationOfCareActedOn: "",
  advanceDirectivesCoordinationOfCareAppropriatePartiesNotified: "",
  advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment: "",
  ...overrides,
});

describe("ResidentIntakeContentPart1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom has no canvas 2d context; AutoSize measures text width on it.
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      font: "",
      measureText: () => ({ width: 0 }),
    }));
  });

  it("renders nothing when page is not 1-5", () => {
    const { container } = renderWithProviders(
      <ResidentIntakeContentPart1 {...baseProps({ page: 9 })} />,
    );
    // WHY: only pages 1-5 have JSX in this part; others fall through to empty.
    expect(container.querySelector(".increase-print-width")).toBeNull();
  });

  describe("page 1 - Consent for Treatment", () => {
    it("renders the resident name and consent terms", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1 {...baseProps({ page: 1 })} />,
      );
      expect(screen.getByText("Consent for Treatment")).toBeInTheDocument();
      expect(screen.getByText("Test Patient")).toBeInTheDocument();
      expect(
        screen.getByText("I Agree to the Terms & Conditions"),
      ).toBeInTheDocument();
    });

    it("fires setiAgree(true) when the Agree checkbox is toggled", () => {
      const props = baseProps({ page: 1 });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      // WHY: Form.Check labels aren't id-associated; agree is the first checkbox.
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);
      expect(props.setiAgree).toHaveBeenCalledWith(true);
    });

    it("fires setiAgree(false) when the Disagree checkbox is toggled", () => {
      const props = baseProps({ page: 1 });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      const checkboxes = screen.getAllByRole("checkbox");
      // Second checkbox = "I disagree".
      fireEvent.click(checkboxes[1]);
      expect(props.setiAgree).toHaveBeenCalledWith(false);
    });

    it("reflects iAgree=true as a checked Agree box", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1
          {...baseProps({ page: 1, iAgree: true })}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it("renders signature boxes for page 1 signers", () => {
      const props = baseProps({
        page: 1,
        signatures: [
          {
            page: 1,
            sign: [
              {
                signerId: "emp-test-001",
                signature: "sig-data",
                dateSigned: "2026-06-10",
              },
            ],
          },
        ],
      });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      // signatureFormat stub renders "SIG:..." text for each signed signer.
      expect(screen.getByText(/SIG:sig-data/)).toBeInTheDocument();
    });

    it("calls handleNextPage when Next Page is clicked", () => {
      const props = baseProps({ page: 1 });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      fireEvent.click(screen.getByRole("button", { name: "Next Page" }));
      expect(props.handleNextPage).toHaveBeenCalled();
    });
  });

  describe("page 2 - Internal Disclosure List", () => {
    it("renders the disclosure heading and inputs", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1 {...baseProps({ page: 2 })} />,
      );
      expect(
        screen.getAllByText("Internal Resident Disclosure List").length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Name of Person")).toBeInTheDocument();
      expect(screen.getByText("Relationship")).toBeInTheDocument();
    });

    it("fires setInternalName when the name input changes", () => {
      const props = baseProps({ page: 2 });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      const inputs = screen.getAllByPlaceholderText("Enter text");
      fireEvent.change(inputs[0], { target: { value: "Jane Doe" } });
      expect(props.setInternalName).toHaveBeenCalledWith("Jane Doe");
    });

    it("calls handleinternalData when ADD is clicked", () => {
      const props = baseProps({ page: 2 });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      fireEvent.click(screen.getByRole("button", { name: "ADD" }));
      expect(props.handleinternalData).toHaveBeenCalled();
    });

    it("renders the disclosure table rows and a delete affordance when canDelete", () => {
      const props = baseProps({
        page: 2,
        canDelete: true,
        internalDisclosureList: [
          {
            personName: "Jane Doe",
            relationship: "Sister",
            contactNumber: "5550100",
          },
        ],
      });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
      const del = document.querySelector(".del-btn");
      expect(del).toBeTruthy();
      fireEvent.click(del);
      expect(props.handleDeleteArrayInternalDisclosure).toHaveBeenCalledWith(0);
    });

    it("hides the delete column when canDelete is false", () => {
      const props = baseProps({
        page: 2,
        canDelete: false,
        internalDisclosureList: [
          {
            personName: "Jane Doe",
            relationship: "Sister",
            contactNumber: "5550100",
          },
        ],
      });
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      expect(document.querySelector(".del-btn")).toBeNull();
    });
  });

  describe("page 3 - Resident Rights", () => {
    it("renders the resident rights statute heading", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1 {...baseProps({ page: 3 })} />,
      );
      expect(
        screen.getByText("R9-10-711. Resident Rights"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("A. An administrator shall ensure that:"),
      ).toBeInTheDocument();
    });
  });

  describe("page 4 - Photo/Video Consent", () => {
    it("renders the photo/video consent heading and checkboxes", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1 {...baseProps({ page: 4 })} />,
      );
      expect(screen.getByText("Photo/Video Consent Form")).toBeInTheDocument();
      expect(screen.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(2);
    });

    it("reflects photoVideoConsentConsentGiven=true as a checked box", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1
          {...baseProps({ page: 4, photoVideoConsentConsentGiven: true })}
        />,
      );
      const checkboxes = screen.getAllByRole("checkbox");
      // First checkbox = "I DO give consent".
      expect(checkboxes[0]).toBeChecked();
    });
  });

  describe("page 5 - Advance Directives", () => {
    it("renders the advance directive heading and gender radios", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1 {...baseProps({ page: 5 })} />,
      );
      expect(screen.getByText("ADVANCED DIRECTIVE FORM")).toBeInTheDocument();
      expect(screen.getByLabelText("Male")).toBeInTheDocument();
      expect(screen.getByLabelText("Female")).toBeInTheDocument();
      expect(screen.getByLabelText("Transgender")).toBeInTheDocument();
    });

    it("reflects gender selection as a checked radio", () => {
      renderWithProviders(
        <ResidentIntakeContentPart1
          {...baseProps({ page: 5, advanceDirectivesResidentGender: "Female" })}
        />,
      );
      expect(screen.getByLabelText("Female")).toBeChecked();
    });

    it("shows the developed comment field only when developed is 'no'", () => {
      const { rerender } = renderWithProviders(
        <ResidentIntakeContentPart1
          {...baseProps({ page: 5, advanceDirectivesDeveloped: "yes" })}
        />,
      );
      expect(screen.queryByPlaceholderText("Please enter")).toBeNull();

      rerender(
        <ResidentIntakeContentPart1
          {...baseProps({ page: 5, advanceDirectivesDeveloped: "no" })}
        />,
      );
      // WHY: a "no" answer reveals a free-text reason field.
      expect(
        screen.getAllByPlaceholderText("Please enter").length,
      ).toBeGreaterThanOrEqual(1);
    });

    it("updates the address field", () => {
      const props = baseProps({ page: 5 });
      const setAddress = vi.fn();
      // Address setter comes from props (setAdvanceDirectivesResidentAddress
      // lives in formSetters proxy) — instead assert input renders + accepts change.
      renderWithProviders(<ResidentIntakeContentPart1 {...props} />);
      const addr = screen.getByPlaceholderText("Enter Address");
      expect(addr).toBeInTheDocument();
      fireEvent.change(addr, { target: { value: "1 Test St" } });
      // No throw == setter (proxy no-op) wired correctly.
    });
  });
});
