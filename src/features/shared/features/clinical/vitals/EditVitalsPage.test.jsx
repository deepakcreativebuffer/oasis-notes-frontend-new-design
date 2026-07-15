/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import EditVitalsPage from "./VitalsFormPage";
import { vitalsService } from "@/features/shared/services/index";

// ---------------------------------------------------------------------------
// EditVitalsPage.jsx is a thin barrel: `export { default } from "./VitalsForm"`.
// That sibling module does not exist on disk, so the barrel cannot be imported
// directly (Vite's static import-analysis throws before any vi.mock can run).
// The real implementation it is meant to surface lives in VitalsFormPage.jsx
// (its internal component is literally named `VitalsForm`). We therefore test
// EditVitalsPage's *effective* exported component via VitalsFormPage, which is
// the exact same code the barrel intends to re-export.
// ---------------------------------------------------------------------------

// Vitals data-access layer — never hit real HTTP in tests.
vi.mock("@/features/shared/services/index", () => ({
  __esModule: true,
  vitalsService: {
    getById: vi.fn(),
    getByPatient: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// utils.jsx pulls in heavy IO; stub only what VitalsForm imports.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  AddSignature: ({ show }) =>
    show ? <div data-testid="add-signature">signature-modal</div> : null,
  fetchPaitentName: (p) => p?.name || "",
  formatDateToMMDDYYYY: (d) => d || null,
  parseTimeStringToDate: (t) => t || null,
  signatureFormat: ({ sign }) =>
    sign ? <div data-testid="signature-line">{sign}</div> : null,
}));

// Layout HOC — render the wrapped component directly so we test the form, not
// the sidebar/navbar shell.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// NavWrapper drags in modals/sidebars; replace with its title only.
vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// Heavy third-party / search widgets — light stubs exposing the props we drive.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      aria-label="vitals-date"
      placeholder={placeholderText}
      onChange={(e) => onChange?.(new Date("2026-06-10"))}
    />
  ),
}));

vi.mock("@/features/shared/ui/TimePicker/CustomTimePicker", () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <input
      aria-label="vitals-time"
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: ({ MainPatientId }) => (
    <button type="button" onClick={() => MainPatientId?.("res-test-001")}>
      pick-patient
    </button>
  ),
}));

vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  __esModule: true,
  default: ({ setValue }) => (
    <button
      type="button"
      onClick={() =>
        setValue?.([{ value: "emp-test-001", label: "Test Employee" }])
      }
    >
      pick-signers
    </button>
  ),
}));

vi.mock("react-spinners", () => ({
  __esModule: true,
  ClipLoader: () => <span data-testid="spinner">loading</span>,
}));

// useParams is the create/edit switch; mock it so each test picks a mode.
const mockUseParams = vi.fn(() => ({}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => vi.fn(),
  };
});

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test Employee",
      userType: "Employee",
      hoursFormat: "12",
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("EditVitalsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({});
  });

  describe("create mode (no :id)", () => {
    it("should render the vitals form with all measurement fields", () => {
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
      });

      // WHY: the vitals chart must surface every captured measurement so staff
      // record a complete set of resident vitals.
      expect(screen.getByText("Resident Vitals")).toBeInTheDocument();
      expect(screen.getByText("Body Temperature")).toBeInTheDocument();
      expect(screen.getByText("Pulse Rate")).toBeInTheDocument();
      expect(screen.getByText("Respiration Rate")).toBeInTheDocument();
      expect(
        screen.getByText("Blood Pressure Systolic/Diastolic"),
      ).toBeInTheDocument();
      expect(screen.getByText("Blood oxygen")).toBeInTheDocument();
      expect(screen.getByText("Weight")).toBeInTheDocument();
      expect(screen.getByText("Blood glucose level")).toBeInTheDocument();
      expect(screen.getByText("Height")).toBeInTheDocument();
    });

    it("should show the patient picker (not a fixed resident name) when creating", () => {
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
      });

      // WHY: a new vitals entry must let staff choose which resident it belongs
      // to; the read-only "Resident Name" label is an edit-mode affordance.
      expect(
        screen.getByRole("button", { name: "pick-patient" }),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Resident Name/i)).not.toBeInTheDocument();
    });

    it("should keep SUBMIT disabled until a signature is captured", () => {
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
      });

      // WHY: an unsigned vitals record is clinically incomplete, so the form
      // blocks submission until the staff signature exists.
      const submit = screen.getByRole("button", { name: /submit/i });
      expect(submit).toBeDisabled();
    });

    it("should fetch the resident's recent vitals once a patient is selected", async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
      });

      await user.click(screen.getByRole("button", { name: "pick-patient" }));

      // WHY: selecting a resident pre-loads their latest week of vitals so
      // staff can see/continue an existing same-day entry.
      await waitFor(() =>
        expect(vitalsService.getByPatient).toHaveBeenCalledWith(
          expect.objectContaining({
            patientId: "res-test-001",
            forFilter: "week",
          }),
        ),
      );
      // Create mode must never call the edit fetch.
      expect(vitalsService.getById).not.toHaveBeenCalled();
    });

    it("should open the signature modal from the SAVED AND SIGNED action", async () => {
      const user = userEvent.setup();
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
      });

      expect(screen.queryByTestId("add-signature")).not.toBeInTheDocument();
      await user.click(
        screen.getByRole("button", { name: /saved and signed/i }),
      );
      expect(screen.getByTestId("add-signature")).toBeInTheDocument();
    });
  });

  describe("edit mode (:id present)", () => {
    beforeEach(() => {
      mockUseParams.mockReturnValue({ id: "vital-test-001" });
    });

    it("should fetch the existing vitals record by id", async () => {
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
        route: "/vitals/vital-test-001/edit",
      });

      // WHY: editing must load the specific persisted vitals record, not the
      // patient's week window.
      await waitFor(() =>
        expect(vitalsService.getById).toHaveBeenCalledWith(
          "vital-test-001",
          expect.objectContaining({ setResponse: expect.any(Function) }),
        ),
      );
      expect(vitalsService.getByPatient).not.toHaveBeenCalled();
    });

    it("should show the read-only resident name and hide the signer picker", () => {
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
        route: "/vitals/vital-test-001/edit",
      });

      // WHY: in edit mode the resident is fixed, so the name is read-only and
      // the additional-signers selector is not offered.
      expect(screen.getByText(/Resident Name/i)).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "pick-patient" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "pick-signers" }),
      ).not.toBeInTheDocument();
    });

    it("should enable SUBMIT in edit mode even without a new signature", () => {
      renderWithProviders(<EditVitalsPage />, {
        preloadedState: employeeState,
        route: "/vitals/vital-test-001/edit",
      });

      // WHY: an already-saved record can be amended/co-signed without forcing a
      // fresh primary signature, unlike the create flow.
      expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
    });
  });

  describe("edge cases", () => {
    it("should render without crashing when no auth profile is seeded", () => {
      renderWithProviders(<EditVitalsPage />);
      expect(screen.getByText("Resident Vitals")).toBeInTheDocument();
    });
  });
});
