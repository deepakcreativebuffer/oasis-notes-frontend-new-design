/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import ViewResidentIntakesContentPart2 from "./ViewResidentIntakesContentPart2";

// ViewResidentIntakesContentPart2 is a purely presentational, prop-driven
// View* section component (pages 6-11 of the resident intake packet). It reads
// no redux/router/react-query state and imports no service/IO modules, so a
// plain RTL render with controlled props is sufficient. Fake PHI only.

// Sentinel a parent normally injects to render pen-pad / inline signatures.
const renderInlineSignatures = vi.fn(() => (
  <div data-testid="inline-signatures">inline-sig</div>
));

// Minimal getApiData with the patient name the forms echo back to the signer.
const getApiData = {
  patientId: { firstName: "Test", lastName: "Patient" },
};

const baseProps = () => ({
  page: 6,
  printAllMode: false,
  getApiData,
  renderInlineSignatures,
  handleNextPage: vi.fn(),
  handlePrevPage: vi.fn(),
  print: vi.fn(),
  setSigInModel5: vi.fn(),
  setShowSignatureResident: vi.fn(),
  location: "",
  legacySignatures: [],
  hoursFormat: "h:mm A",
});

describe("ViewResidentIntakesContentPart2", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("page gating", () => {
    it("should render the complaint-process acknowledgement on page 6", () => {
      render(<ViewResidentIntakesContentPart2 {...baseProps()} page={6} />);

      // WHY: page 6 is the Acknowledgement of Complaint Process; the resident
      // must see the AZ Dept of Residential Licensing complaint instructions.
      expect(
        screen.getByText(/Bureau of Behavioral Health Facilities Licensing/i),
      ).toBeInTheDocument();
      // Patient name is interpolated into the legal "I, <name>" statement.
      expect(screen.getByText(/Test Patient/)).toBeInTheDocument();
    });

    it("should render nothing for a page outside this part's 6-11 range", () => {
      const { container } = render(
        <ViewResidentIntakesContentPart2 {...baseProps()} page={1} />,
      );

      // WHY: each part owns a slice of the packet; page 1 belongs to Part1, so
      // Part2 must not leak any of its sections into the DOM.
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("orientation section (page 7)", () => {
    it("should split the comma-separated orientation list into bullet items", () => {
      render(
        <ViewResidentIntakesContentPart2
          {...baseProps()}
          page={7}
          ORIENTATIONDropDown="Fire safety, Meal times, Visiting hours"
        />,
      );

      // WHY: orientation topics arrive as one CSV string and must be rendered
      // as discrete acknowledged items, not a single run-on line.
      expect(screen.getByText("Fire safety")).toBeInTheDocument();
      expect(screen.getByText("Meal times")).toBeInTheDocument();
      expect(screen.getByText("Visiting hours")).toBeInTheDocument();
    });

    it("should render without crashing when orientation list is missing", () => {
      // WHY: a partially-completed intake may have no orientation topics yet;
      // the section must still display rather than throw on undefined.
      render(<ViewResidentIntakesContentPart2 {...baseProps()} page={7} />);
      expect(screen.getByText(/received an orientation/i)).toBeInTheDocument();
    });
  });

  describe("house rules section (page 9)", () => {
    it("should list house-rule options by value or label", () => {
      render(
        <ViewResidentIntakesContentPart2
          {...baseProps()}
          page={9}
          houseRulesDropDown={[
            { value: "No smoking indoors" },
            { label: "Quiet hours after 10pm" },
          ]}
        />,
      );

      expect(screen.getByText("No smoking indoors")).toBeInTheDocument();
      expect(screen.getByText("Quiet hours after 10pm")).toBeInTheDocument();
    });

    it("should prefer an explicit acknowledgement name over the API patient name", () => {
      render(
        <ViewResidentIntakesContentPart2
          {...baseProps()}
          page={9}
          houseRulesAcknowledgementName="Override Name"
        />,
      );

      // WHY: the house-rules form can capture the signer's name independently
      // of the patient record; the explicit name must win when provided.
      expect(screen.getByText(/Override Name/)).toBeInTheDocument();
    });
  });

  describe("lock box section (page 10)", () => {
    it("should show the resident name, address and re-key charge", () => {
      render(
        <ViewResidentIntakesContentPart2
          {...baseProps()}
          page={10}
          lockBoxKeyIssueReturnAddress="123 Test St"
          lockBoxKeyIssueReturnCharged="25"
          patientDetail={{
            userType: "Patient",
            firstName: "Test",
            lastName: "Patient",
            companyName: "Test Facility",
          }}
        />,
      );

      expect(screen.getByText("123 Test St")).toBeInTheDocument();
      // Re-key fee amount must be visible so the resident knows the liability.
      expect(screen.getByText("25")).toBeInTheDocument();
      expect(screen.getByText("Test Facility")).toBeInTheDocument();
    });
  });

  describe("insurance section (page 11)", () => {
    it("should render primary and secondary insurance values", () => {
      render(
        <ViewResidentIntakesContentPart2
          {...baseProps()}
          page={11}
          primaryInsurance="Aetna"
          insuranceInformationPrimaryInsurancePolicyholderName="Primary Holder"
          insuranceInformationPrimaryInsuranceSubscriberNumber="SUB-PRIM-1"
          insuranceInformationSecondaryInsuranceSubscriberNumber="SUB-SEC-1"
          verbalConsentResidentRepresentative="Yes"
        />,
      );

      expect(screen.getByText("Aetna")).toBeInTheDocument();
      expect(screen.getByText("Primary Holder")).toBeInTheDocument();
      expect(screen.getByText("SUB-PRIM-1")).toBeInTheDocument();
      expect(screen.getByText("SUB-SEC-1")).toBeInTheDocument();
      // WHY: ASSIGNMENT OF BENEFITS / verbal-consent capture is a billing
      // authorization that must always be shown on the insurance page.
      expect(screen.getByText(/ASSIGNMENT OF BENEFITS/i)).toBeInTheDocument();
    });
  });

  describe("printAllMode", () => {
    it("should render every section at once when printing the full packet", () => {
      render(
        <ViewResidentIntakesContentPart2
          {...baseProps()}
          page={6}
          printAllMode={true}
          ORIENTATIONDropDown="Fire safety"
          primaryInsurance="Aetna"
        />,
      );

      // WHY: print-all must flatten all pages of this part into one document
      // regardless of the active page, so sections from 6, 7 and 11 coexist.
      expect(
        screen.getByText(/Bureau of Behavioral Health Facilities Licensing/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Fire safety")).toBeInTheDocument();
      expect(screen.getByText("Aetna")).toBeInTheDocument();
    });
  });

  describe("navigation and signing actions", () => {
    it("should call print when PRINT THIS FORM is clicked", () => {
      const props = baseProps();
      render(<ViewResidentIntakesContentPart2 {...props} page={6} />);

      fireEvent.click(screen.getByRole("button", { name: /print this form/i }));
      expect(props.print).toHaveBeenCalledTimes(1);
    });

    it("should navigate to the next page via Next Page", () => {
      const props = baseProps();
      render(<ViewResidentIntakesContentPart2 {...props} page={6} />);

      fireEvent.click(screen.getByRole("button", { name: /next page/i }));
      expect(props.handleNextPage).toHaveBeenCalledTimes(1);
    });

    it("should expose the resident save-and-sign action only on the resident route", () => {
      const props = baseProps();
      render(
        <ViewResidentIntakesContentPart2
          {...props}
          page={6}
          location="/residentintakes-resident"
        />,
      );

      // WHY: SAVED AND SIGNED captures the resident's e-signature and must only
      // appear when the resident themselves is filling the intake.
      fireEvent.click(
        screen.getByRole("button", { name: /saved and signed/i }),
      );
      expect(props.setSigInModel5).toHaveBeenCalledWith(true);
    });

    it("should hide the resident save-and-sign action off the resident route", () => {
      render(
        <ViewResidentIntakesContentPart2
          {...baseProps()}
          page={6}
          location="/residentintakes-staff"
        />,
      );

      expect(
        screen.queryByRole("button", { name: /saved and signed/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("inline signatures", () => {
    it("should render the inline signature block supplied by the parent", () => {
      render(<ViewResidentIntakesContentPart2 {...baseProps()} page={6} />);

      // WHY: signature capture is delegated to the parent; the section must
      // invoke renderInlineSignatures so e-signatures appear on the form.
      expect(renderInlineSignatures).toHaveBeenCalled();
      expect(screen.getAllByTestId("inline-signatures").length).toBeGreaterThan(
        0,
      );
    });
  });
});
