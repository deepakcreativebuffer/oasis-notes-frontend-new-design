/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";
import ViewResidentIntakesContentPart1 from "./ViewResidentIntakesContentPart1";

// Pure formatting/signature helpers — stub so rendered output is deterministic
// and independent of locale/date math. The component only renders their return
// values, so light stubs are sufficient.
vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: (d) => (d ? `MMDDYYYY(${d})` : ""),
  signatureFormat: ({ sign, date }) => `SIG[${sign}|${date}]`,
}));

// Build a full prop bag with no-op setters/handlers. Individual tests override
// just the fields they assert on.
const makeProps = (overrides = {}) => ({
  page: 1,
  printAllMode: false,
  companyName: "Test Facility",
  location: "/residentintakes-employee",
  iAgree: true,
  hoursFormat: "12",
  internalDisclosureList: [],
  internalDisclosureListExpire: "MMDDYYYY-EXP",
  legacySignatures: [],
  // patient/resident identity (FAKE PHI only)
  getApiData: {
    patientId: { firstName: "Test", lastName: "Patient" },
  },
  patientDetail: { userType: "Patient" },
  // signature modal toggles
  signInModel1: false,
  signInModel2: false,
  signInModel3: false,
  signInModel4: false,
  signInModel6: false,
  // page-4 photo/video consent
  photoVideoConsentConsentGiven: false,
  photoVideoConsentConsentWithdrawn: false,
  photoVideoConsentDateOfBirth: "1990-01-01",
  photoVideoConsentAdmissionDate: "2024-01-01",
  // page-5 advance directives
  advanceDirectivesResidentGender: "Male",
  advanceDirectivesResidentDate: "2024-02-02",
  advanceDirectivesResidentDateOfBirth: "1990-01-01",
  advanceDirectivesResidentAddress: "123 Test St",
  advanceDirectivesDeveloped: "yes",
  advanceDirectivesProvidedInfoAcknowledged: "yes",
  advanceDirectivesProvidedInfoDate: "2024-03-03",
  advanceDirectivesRefusingAcknowledged: "no",
  advanceDirectivesProvidedInfoRefusingDate: "2024-04-04",
  advanceDirectivesExecutedInRecord: "yes",
  advanceDirectivesFilingStatusWishNotFiled: false,
  advanceDirectivesFilingStatusAskedForCopyNotProvided: false,
  advanceDirectivesFilingStatusOther: false,
  advanceDirectivesCoordinationOfCareCopySentToPCP: "yes",
  advanceDirectivesCoordinationOfCareActedOn: "yes",
  advanceDirectivesCoordinationOfCareAppropriatePartiesNotified: "yes",
  advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment: "",
  // refs (the component attaches them to plain divs)
  componentRef1: { current: null },
  componentRef2: { current: null },
  componentRef3: { current: null },
  componentRef4: { current: null },
  componentRefNew3: { current: null },
  // function props
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

describe("ViewResidentIntakesContentPart1", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("page 1 - General Consent for Treatment", () => {
    it("should render the consent body interpolating the company name", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 1, companyName: "Test Facility" })}
        />,
      );

      expect(
        screen.getByText(/General Consent for Treatment/i),
      ).toBeInTheDocument();
      // WHY: the consent legally names the treating facility; it must reflect
      // the facility passed in, not a hard-coded value.
      expect(
        screen.getByText(/I voluntarily apply for evaluation/i),
      ).toHaveTextContent("Test Facility");
    });

    it("should reflect iAgree=true by checking the Agree box and not the Disagree box", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 1, iAgree: true })}
        />,
      );

      // Bootstrap's inline Form.Check does not wire label-for, so resolve each
      // checkbox via its label's sibling input.
      const agree = screen
        .getByText(/I Agree to the Terms & Conditions/i)
        .closest(".form-check")
        .querySelector("input");
      const disagree = screen
        .getByText(/I disagree to the Terms & Conditions/i)
        .closest(".form-check")
        .querySelector("input");
      // WHY: this read-only view must faithfully show the resident's recorded
      // consent decision; flipping it would misrepresent the signed record.
      expect(agree).toBeChecked();
      expect(disagree).not.toBeChecked();
    });

    it("should invoke print when PRINT THIS FORM is clicked", () => {
      const props = makeProps({ page: 1 });
      renderWithProviders(<ViewResidentIntakesContentPart1 {...props} />);

      fireEvent.click(screen.getByRole("button", { name: /print this form/i }));
      expect(props.print).toHaveBeenCalledTimes(1);
    });

    it("should hide SAVED AND SIGNED unless on the resident-facing route", () => {
      const { rerender } = renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 1, location: "/residentintakes-employee" })}
        />,
      );
      expect(
        screen.queryByRole("button", { name: /saved and signed/i }),
      ).not.toBeInTheDocument();

      // WHY: only the resident's own intake flow exposes the sign action;
      // staff-facing views are read-only.
      rerender(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 1, location: "/residentintakes-resident" })}
        />,
      );
      expect(
        screen.getByRole("button", { name: /saved and signed/i }),
      ).toBeInTheDocument();
    });

    it("should show Next Page but not Prev Page on the first page", () => {
      const props = makeProps({ page: 1 });
      renderWithProviders(<ViewResidentIntakesContentPart1 {...props} />);

      expect(
        screen.queryByRole("button", { name: /prev page/i }),
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /next page/i }));
      expect(props.handleNextPage).toHaveBeenCalledTimes(1);
    });

    it("should render legacy signatures for the active page", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({
            page: 1,
            legacySignatures: [
              {
                page: 1,
                sign: [
                  {
                    signerId: "emp-test-001",
                    signature: "Test Signer",
                    dateSigned: "2024-05-05",
                  },
                ],
              },
            ],
          })}
        />,
      );
      // WHY: previously-captured signatures must surface so the record shows who
      // already signed each consent page.
      expect(
        screen.getByText(/SIG\[Test Signer\|2024-05-05\]/),
      ).toBeInTheDocument();
    });
  });

  describe("page 2 - Internal Resident Disclosure List", () => {
    it("should render disclosure rows when entries exist", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({
            page: 2,
            internalDisclosureList: [
              {
                personName: "Test Relative",
                relationship: "Sibling",
                contactNumber: "555-0100",
              },
            ],
          })}
        />,
      );

      expect(
        screen.getByText(/Internal Resident Disclosure List/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Test Relative/)).toBeInTheDocument();
      expect(screen.getByText(/Sibling/)).toBeInTheDocument();
      expect(screen.getByText(/555-0100/)).toBeInTheDocument();
    });

    it("should not render the disclosure table when the list is empty", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 2, internalDisclosureList: [] })}
        />,
      );
      // WHY: an empty authorization list must not render a phantom table
      // implying disclosures were authorized when none were.
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("page 4 - Photo/Video Consent", () => {
    it("should render the resident name from getApiData", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({
            page: 4,
            getApiData: {
              patientId: { firstName: "Test", lastName: "Patient" },
            },
          })}
        />,
      );
      expect(
        screen.getByText(/PHOTO\/VIDEO CONSENT FORM/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Test Patient")).toBeInTheDocument();
    });

    it("should disable the consent checkboxes for staff (Employee/Admin) viewers", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 4, patientDetail: { userType: "Employee" } })}
        />,
      );
      // WHY: staff viewing a resident's consent cannot alter the resident's
      // recorded photo/video decision — the inputs are locked.
      expect(
        screen.getByLabelText(/I DO give consent to appear/i),
      ).toBeDisabled();
    });

    it("should allow toggling consent for a Patient viewer", () => {
      const props = makeProps({
        page: 4,
        patientDetail: { userType: "Patient" },
      });
      renderWithProviders(<ViewResidentIntakesContentPart1 {...props} />);

      const giveConsent = screen.getByLabelText(/I DO give consent to appear/i);
      expect(giveConsent).not.toBeDisabled();
      fireEvent.click(giveConsent);
      expect(props.setPhotoVideoConsentConsentGiven).toHaveBeenCalledTimes(1);
    });
  });

  describe("page 5 - Advance Directives", () => {
    it("should reflect the recorded resident gender selection", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 5, advanceDirectivesResidentGender: "Female" })}
        />,
      );
      expect(
        screen.getByText(/Advance Directives Information/i),
      ).toBeInTheDocument();
      // WHY: gender radios are a read-only mirror of the stored record.
      expect(screen.getByLabelText("Female")).toBeChecked();
      expect(screen.getByLabelText("Male")).not.toBeChecked();
    });

    it("should show the developed-comment input only when developed === 'no'", () => {
      const { rerender } = renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 5, advanceDirectivesDeveloped: "yes" })}
        />,
      );
      expect(
        screen.queryByPlaceholderText("Please enter"),
      ).not.toBeInTheDocument();

      rerender(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 5, advanceDirectivesDeveloped: "no" })}
        />,
      );
      // WHY: the explanatory free-text only applies when no directive was
      // developed, so it must appear precisely in that branch.
      expect(
        screen.getAllByPlaceholderText("Please enter").length,
      ).toBeGreaterThan(0);
    });
  });

  describe("empty / missing data resilience", () => {
    it("should render page 1 without crashing when optional collections are missing", () => {
      // No legacySignatures / disclosure list provided at all.
      const props = makeProps({
        page: 1,
        legacySignatures: undefined,
        internalDisclosureList: undefined,
      });
      renderWithProviders(<ViewResidentIntakesContentPart1 {...props} />);
      expect(
        screen.getByText(/General Consent for Treatment/i),
      ).toBeInTheDocument();
    });
  });

  describe("printAllMode", () => {
    it("should render every consent section at once regardless of page", () => {
      renderWithProviders(
        <ViewResidentIntakesContentPart1
          {...makeProps({ page: 1, printAllMode: true })}
        />,
      );
      // WHY: bulk print/export must include all consent pages in one render.
      // page 1 is shown both because page===1 and because printAllMode is on,
      // so use getAllByText for that heading.
      expect(
        screen.getAllByText(/General Consent for Treatment/i).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getByText(/Internal Resident Disclosure List/i),
      ).toBeInTheDocument();
      // "Resident Rights" can appear more than once in print-all mode.
      expect(screen.getAllByText(/Resident Rights/i).length).toBeGreaterThan(0);
      expect(
        screen.getByText(/PHOTO\/VIDEO CONSENT FORM/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Advance Directives Form/i)).toBeInTheDocument();
    });
  });
});
