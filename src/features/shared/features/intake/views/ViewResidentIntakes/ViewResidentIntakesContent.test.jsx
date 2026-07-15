/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ViewResidentIntakesContent from "./ViewResidentIntakesContent";

// NavWrapper pulls in InnerSidebars / router chrome that is irrelevant to this
// presentational view — stub it to a light header that just echoes the title.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <header data-testid="nav-wrapper">{title}</header>,
}));

// Draftinmodel is a portal-ish overlay; stub it so we can assert its presence
// and exercise the onClose wiring without its icon deps.
vi.mock("@/features/resident/components/Modal/Draftinmodel", () => ({
  default: ({ onClose }) => (
    <div data-testid="draft-modal">
      <button type="button" onClick={onClose}>
        close-draft
      </button>
    </div>
  ),
}));

// Minimal but complete-enough prop bag. The child Part components destructure
// dozens of props; undefined is fine for almost all of them, but a few must be
// callable (renderInlineSignatures) or shaped (getApiData) to avoid crashes.
const baseProps = (overrides = {}) => ({
  draftModel: false,
  setDraftModel: vi.fn(),
  Cpage: { page: 1 },
  setPage: vi.fn(),
  page: 1,
  componentRef9: { current: null },
  printRef: { current: null },
  submitHandler: vi.fn((e) => e?.preventDefault?.()),
  // Props consumed by the Part children:
  getApiData: {
    patientId: { firstName: "Test", lastName: "Patient" },
  },
  patientDetail: {
    userType: "Patient",
    firstName: "Test",
    lastName: "Patient",
  },
  companyName: "Test Facility",
  location: "/residentintakes-employee",
  legacySignatures: [],
  renderInlineSignatures: vi.fn(() => null),
  print: vi.fn(),
  handleNextPage: vi.fn(),
  handlePrevPage: vi.fn(),
  setiAgree: vi.fn(),
  setSigInModel1: vi.fn(),
  setSigInModel2: vi.fn(),
  setSigInModel3: vi.fn(),
  setSigInModel4: vi.fn(),
  setSigInModel6: vi.fn(),
  setSigInModel5: vi.fn(),
  setShowSignatureResident: vi.fn(),
  setPhotoVideoConsentConsentGiven: vi.fn(),
  setPhotoVideoConsentConsentWithdrawn: vi.fn(),
  setAdvanceDirectivesResidentGender: vi.fn(),
  setAdvanceDirectivesDeveloped: vi.fn(),
  setAdvanceDirectivesDevelopedComment: vi.fn(),
  setAdvanceDirectivesExecutedInRecord: vi.fn(),
  setAdvanceDirectivesExecutedInRecordComment: vi.fn(),
  setAdvanceDirectivesFilingStatusWishNotFiled: vi.fn(),
  setAdvanceDirectivesFilingStatusAskedForCopyNotProvided: vi.fn(),
  setAdvanceDirectivesFilingStatusOther: vi.fn(),
  setAdvanceDirectivesCoordinationOfCareCopySentToPCP: vi.fn(),
  setAdvanceDirectivesCoordinationOfCareActedOn: vi.fn(),
  setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified: vi.fn(),
  setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment:
    vi.fn(),
  ...overrides,
});

describe("ViewResidentIntakesContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the page-1 title and the general-consent form copy", () => {
    renderWithProviders(<ViewResidentIntakesContent {...baseProps()} />);

    // WHY: page 1 is the General Consent for Treatment intake form; the title
    // comes from the NavWrapper title prop derived from `page`.
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "General consent for treatment",
    );
    expect(
      screen.getByText(/I voluntarily apply for evaluation/i),
    ).toBeInTheDocument();
  });

  it("should not render the draft modal when draftModel is false", () => {
    renderWithProviders(<ViewResidentIntakesContent {...baseProps()} />);
    expect(screen.queryByTestId("draft-modal")).not.toBeInTheDocument();
  });

  it("should render the draft modal and wire onClose when draftModel is true", () => {
    const setDraftModel = vi.fn();
    renderWithProviders(
      <ViewResidentIntakesContent
        {...baseProps({ draftModel: true, setDraftModel })}
      />,
    );

    expect(screen.getByTestId("draft-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "close-draft" }));
    // WHY: closing the "saved as draft" overlay clears the draftModel flag so
    // the resident can keep editing the intake.
    expect(setDraftModel).toHaveBeenCalledWith(false);
  });

  it("should switch the title to the disclosure list on page 2", () => {
    renderWithProviders(
      <ViewResidentIntakesContent {...baseProps({ page: 2 })} />,
    );
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Internal Resident Disclosure List",
    );
  });

  it("should render insurance-information page 11 with patient-provided values", () => {
    renderWithProviders(
      <ViewResidentIntakesContent
        {...baseProps({
          page: 11,
          insuranceInformationPrimaryInsurancePolicyholderName:
            "Policy Holder Test",
          primaryInsurance: "Test Primary Plan",
        })}
      />,
    );

    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "INSURANCE INFORMATION",
    );
    // WHY: page 11 is a read-only view that surfaces the stored insurance
    // answers; the policyholder name and plan must render verbatim.
    expect(screen.getByText("Policy Holder Test")).toBeInTheDocument();
    expect(screen.getByText("Test Primary Plan")).toBeInTheDocument();
  });

  it("should render without crashing when optional data is missing", () => {
    // Strip the data props the children read so we exercise the empty-data path.
    renderWithProviders(
      <ViewResidentIntakesContent
        {...baseProps({
          getApiData: undefined,
          legacySignatures: undefined,
          patientDetail: undefined,
          companyName: undefined,
          page: 2,
        })}
      />,
    );

    // WHY: View* intake sections must degrade gracefully for partially-filled
    // residents rather than throwing on missing answers.
    expect(screen.getByTestId("nav-wrapper")).toBeInTheDocument();
  });

  it("should show the resident-only SAVED AND SIGNED action on the resident route", () => {
    renderWithProviders(
      <ViewResidentIntakesContent
        {...baseProps({ location: "/residentintakes-resident" })}
      />,
    );

    // WHY: the "SAVED AND SIGNED" button is gated to the resident-facing route;
    // staff/admin views hide it.
    expect(
      screen.getAllByRole("button", { name: "SAVED AND SIGNED" }).length,
    ).toBeGreaterThan(0);
  });

  it("should hide the SAVED AND SIGNED action off the resident route", () => {
    renderWithProviders(
      <ViewResidentIntakesContent
        {...baseProps({ location: "/residentintakes-employee" })}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "SAVED AND SIGNED" }),
    ).not.toBeInTheDocument();
  });
});
