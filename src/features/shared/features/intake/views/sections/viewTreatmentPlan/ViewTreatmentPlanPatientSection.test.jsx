/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import ViewTreatmentPlanPatientSection from "./ViewTreatmentPlanPatientSection";
import { ViewTreatmentPlanFormProvider } from "../../context/ViewTreatmentPlanFormContext";

// This is a read-only "View*" presentational section. It reads ALL of its data
// from ViewTreatmentPlanFormContext via useViewTreatmentPlanFormContext(), so we
// drive it by wrapping in the real provider and supplying a controlled `value`.
// No services/sockets are imported, so nothing to vi.mock beyond clearing.

const baseValue = {
  residentName: "",
  ahcccsId: "",
  dob: "",
  diagnosis: "",
  date: "",
  admitDate: "",
  physicalService: "",
  behavior: "",
  medicationAdministation: "",
  medicationAssistance: "",
  presentingPrice: [],
  mendelHealth: "",
  mentelText: "",
  mind: "",
  mindText: "",
  adls: "",
  adlsText: "",
  BHealth: "",
  Btext: "",
  primaryCare: "",
  psychiatricProvider: "",
  // setters/handlers are wired to onChange of disabled (pe-none) checkboxes;
  // provide no-ops so the component never throws if React invokes them.
  setPhysicalService: vi.fn(),
  setBehavior: vi.fn(),
  setMedicationAdministation: vi.fn(),
  setMedicationAssistence: vi.fn(),
  handleCheckboxChangeMentalHealth: vi.fn(),
  handleCheckboxChangeMind: vi.fn(),
  setAdls: vi.fn(),
  setBHealth: vi.fn(),
};

const renderSection = (overrides = {}) =>
  renderWithProviders(
    <ViewTreatmentPlanFormProvider value={{ ...baseValue, ...overrides }}>
      <ViewTreatmentPlanPatientSection />
    </ViewTreatmentPlanFormProvider>,
  );

describe("ViewTreatmentPlanPatientSection", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("rendering provided data", () => {
    it("should render the patient demographic values from context", () => {
      renderSection({
        residentName: "Test Patient",
        ahcccsId: "MRN-TEST-001",
        diagnosis: "Continuing diagnosis note",
        primaryCare: "Dr Test Primary",
        psychiatricProvider: "Dr Test Psych",
      });

      // WHY: the static labels are always present; the section is the read-only
      // mirror of the treatment plan, so each demographic value must surface.
      expect(screen.getByText(/Resident Name :/i)).toBeInTheDocument();
      expect(screen.getByText("Test Patient")).toBeInTheDocument();
      expect(screen.getByText("MRN-TEST-001")).toBeInTheDocument();
      expect(screen.getByText("Continuing diagnosis note")).toBeInTheDocument();
      expect(screen.getByText("Dr Test Primary")).toBeInTheDocument();
      expect(screen.getByText("Dr Test Psych")).toBeInTheDocument();
    });

    it("should format date fields as MM/DD/YYYY", () => {
      renderSection({
        dob: "1990-04-15",
        date: "2026-06-10",
        admitDate: "2026-01-02",
      });

      // WHY: dates are passed through formatDateToMMDDYYYY; EHR records display
      // US-format dates, not raw ISO strings.
      expect(screen.getByText("04/15/1990")).toBeInTheDocument();
      expect(screen.getByText("06/10/2026")).toBeInTheDocument();
      expect(screen.getByText("01/02/2026")).toBeInTheDocument();
    });

    it("should render presenting problems as a list when provided", () => {
      renderSection({
        presentingPrice: [{ label: "Problem One" }, { label: "Problem Two" }],
      });

      expect(screen.getByText(/Presenting Problems :/i)).toBeInTheDocument();
      expect(screen.getByText("Problem One")).toBeInTheDocument();
      expect(screen.getByText("Problem Two")).toBeInTheDocument();
    });
  });

  describe("checkbox / radio branches", () => {
    it("should check the Care services that match the stored values", () => {
      renderSection({
        physicalService: "f.physicalService",
        behavior: "f.behavior",
      });

      // WHY: these read-only checkboxes reflect the plan's selected services;
      // they must show as checked so reviewers see the actual care selections.
      expect(
        screen.getByRole("checkbox", { name: /Physical Services/i }),
      ).toBeChecked();
      expect(
        screen.getByRole("checkbox", { name: /Behavioral Services/i }),
      ).toBeChecked();
    });

    it("should render Mental Status section only when mental data exists", () => {
      renderSection({
        mendelHealth: ["oriented", "other"],
        mentelText: "Some note",
      });

      expect(screen.getByText(/Mental Status :/i)).toBeInTheDocument();
      // WHY: exact name avoids "Oriented" also matching "Disoriented".
      expect(screen.getByRole("checkbox", { name: "Oriented" })).toBeChecked();
      // WHY: the free-text "Other" detail only shows when "other" is selected.
      expect(screen.getByText("Some note")).toBeInTheDocument();
    });

    it("should reflect Mood Level selections from context", () => {
      renderSection({ mind: ["Normal", "Anxious"] });

      expect(screen.getByText(/Mood Level :/i)).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: /Normal/i })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /Anxious/i })).toBeChecked();
      expect(
        screen.getByRole("checkbox", { name: /Depressed/i }),
      ).not.toBeChecked();
    });
  });

  describe("missing / empty data", () => {
    it("should render without crashing when all values are empty", () => {
      renderSection();

      // WHY: an incomplete intake must still render the labelled shell rather
      // than throwing, so staff can open partially-filled plans.
      expect(screen.getByText(/Resident Name :/i)).toBeInTheDocument();
      expect(screen.getByText(/AHCCCS ID :/i)).toBeInTheDocument();
      expect(screen.getByText(/DOB :/i)).toBeInTheDocument();
    });

    it("should not render the Presenting Problems block when the list is empty", () => {
      renderSection({ presentingPrice: [] });

      expect(
        screen.queryByText(/Presenting Problems :/i),
      ).not.toBeInTheDocument();
    });
  });
});
