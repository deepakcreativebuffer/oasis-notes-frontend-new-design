/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import UpdateIncidentReportEmployeePage from "./UpdateIncidentReportEmployeePage";

// ---------------------------------------------------------------------------
// UpdateIncidentReportEmployeePage renders an Incident Report edit form gated
// by the authenticated user's role/account-type, and submit-enablement is
// driven by signature state. Every IO/heavy widget is stubbed so we can drive
// the form purely through the mocked `getById` -> setResponse callback.
// ---------------------------------------------------------------------------

// Data-access layer: getById hydrates the form via setResponse; update submits.
const mockGetById = vi.hoisted(() => vi.fn());
const mockUpdate = vi.hoisted(() => vi.fn());
const mockGetData = vi.hoisted(() => vi.fn());

vi.mock("@/features/shared/services/index", () => ({
  __esModule: true,
  getData: (...args) => mockGetData(...args),
  patientChartService: {
    incidentReport: {
      getById: (...args) => mockGetById(...args),
      update: (...args) => mockUpdate(...args),
    },
  },
}));

// Constants used for option lists + role gating — keep the real role values.
vi.mock("@/features/shared/constants", async () => {
  const actual = await vi.importActual("@/features/shared/constants");
  return { ...actual, incidentOptions: [], levelSeverityOptions: [] };
});
vi.mock("@/features/shared/constants/index", async () => {
  const actual = await vi.importActual("@/features/shared/constants/index");
  return actual;
});

// utils.jsx pulls heavy IO; stub only what this page imports.
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

// Makers wrap react-multi-select-component / bootstrap helpers — light stubs.
vi.mock("@/utils/Makers", () => ({
  __esModule: true,
  MultiSelect: ({ value }) => (
    <div data-testid="multi-select">{(value || []).length}</div>
  ),
  CheckBoxMaker: ({ label, checked, setValue, value }) => (
    <label>
      <input
        type="checkbox"
        aria-label={label}
        checked={!!checked}
        onChange={() => setValue?.(value)}
      />
      {label}
    </label>
  ),
  BorderlessInput: ({ value, setState }) => (
    <input
      data-testid="borderless-input"
      value={value || ""}
      onChange={(e) => setState?.(e.target.value)}
    />
  ),
}));

// Layout HOC — render the wrapped component directly (skip sidebar/navbar shell).
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// NavWrapper drags in modals/sidebars; replace with its title only.
vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// MultiPatients is a resident search widget hitting services.
vi.mock("@/features/shared/ui/Search/MultiPatients", () => ({
  __esModule: true,
  default: () => <div data-testid="multi-patients">patients</div>,
}));

// react-datepicker / CustomTimePicker — light inputs.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      placeholder={placeholderText}
      onChange={(e) => onChange?.(new Date("2026-06-10"))}
    />
  ),
}));
vi.mock("@/features/shared/ui/TimePicker/CustomTimePicker", () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <input
      data-testid="time-picker"
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

vi.mock("react-spinners", () => ({
  __esModule: true,
  ClipLoader: () => <span data-testid="spinner">loading</span>,
}));

// useParams drives which report id is loaded.
const mockUseParams = vi.fn(() => ({ id: "inr-test-001" }));
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => mockNavigate,
  };
});

const stateForProfile = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test User",
      userType: "Employee",
      accountType: "regular",
      hoursFormat: "12",
      ...overrides,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

// Minimal detail payload the page hydrates from getById's setResponse callback.
const detailData = (overrides = {}) => ({
  data: {
    _id: "inr-test-001",
    patientId: { _id: "res-test-001", name: "Test Patient" },
    employeeId: "emp-test-001",
    dateOfIncident: "Mon Jun 09 2026",
    signers: [],
    savedSignedPartA: "",
    saveAsDraft: false,
    ...overrides,
  },
});

describe("UpdateIncidentReportEmployeePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: "inr-test-001" });
    // Default: getById hydrates with a basic report owned by this employee.
    mockGetById.mockImplementation((id, { setResponse }) => {
      setResponse?.(detailData());
    });
  });

  it("should fetch the incident report by route id on mount", async () => {
    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    // WHY: edit pages must load the existing record so staff amend real data,
    // not start from a blank form.
    await waitFor(() =>
      expect(mockGetById).toHaveBeenCalledWith(
        "inr-test-001",
        expect.objectContaining({ setResponse: expect.any(Function) }),
      ),
    );
  });

  it("should load the employee directory once for the involved-staff picker", async () => {
    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    // WHY: the form lets staff tag colleagues involved in the incident; that
    // list comes from the employee endpoint.
    await waitFor(() =>
      expect(mockGetData).toHaveBeenCalledWith(
        expect.any(Function),
        "employee/getEmployee",
      ),
    );
  });

  it("should render the incident report form titled for staff", () => {
    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    // WHY: NavWrapper title orients the user to the correct EHR form.
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Incident Report Form",
    );
    expect(screen.getByText("Date of Incident")).toBeInTheDocument();
    expect(screen.getByText("Medication Errors")).toBeInTheDocument();
  });

  it("should display the loaded resident's name read-only", async () => {
    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    // WHY: an incident report is anchored to a specific resident; the name must
    // surface from the loaded record (here via mocked fetchPaitentName).
    await screen.findByText("Resident Name :");
    expect(screen.getAllByText("Test Patient").length).toBeGreaterThan(0);
  });

  it("should enable SUBMIT for the owning employee once a Part-A signature exists", async () => {
    mockGetById.mockImplementation((id, { setResponse }) => {
      setResponse?.(
        detailData({
          employeeId: "emp-test-001",
          savedSignedPartA: "sig-data",
        }),
      );
    });

    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    // WHY: the originating employee can only submit a signed report; the saved
    // Part-A signature is what unlocks SUBMIT.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled(),
    );
  });

  it("should keep SUBMIT disabled when the report is unsigned for a non-owner employee", async () => {
    mockGetById.mockImplementation((id, { setResponse }) => {
      setResponse?.(
        detailData({
          employeeId: "other-emp",
          savedSignedPartA: "",
          signers: [],
        }),
      );
    });

    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    // WHY: a clinician who is neither the author nor a valid signer must not be
    // able to submit an unsigned incident report.
    await screen.findByTestId("nav-wrapper");
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("should always enable SUBMIT for an Admin reviewer", async () => {
    mockGetById.mockImplementation((id, { setResponse }) => {
      setResponse?.(
        detailData({ employeeId: "other-emp", savedSignedPartA: "" }),
      );
    });

    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile({ userType: "Admin" }),
    });

    // WHY: administrators review/finalize reports, so submission is never gated
    // by author-signature for them.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled(),
    );
  });

  it("should render the admin investigation section only for Admin/administrator", async () => {
    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile({ userType: "Admin" }),
    });

    // WHY: investigation/recommendation/follow-up are administrator-only fields;
    // a regular employee should not see them.
    await screen.findByText("Investigation of Incident");
    expect(screen.getByText("Recommendation & Actions")).toBeInTheDocument();
    expect(screen.getByText("Follow Up")).toBeInTheDocument();
  });

  it("should hide the admin investigation section from a regular employee", () => {
    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    // WHY: scope of edit is role-bound; regular staff complete the incident
    // details but not the administrative investigation.
    expect(
      screen.queryByText("Investigation of Incident"),
    ).not.toBeInTheDocument();
  });

  it("should open the signature modal when SAVED AND SIGNED is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    expect(screen.queryByTestId("add-signature")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /saved and signed/i }));

    // WHY: capturing the staff signature is the gating action before a report
    // can be submitted.
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
  });

  it("should submit the update with the route id when the owning employee submits", async () => {
    const user = userEvent.setup();
    mockGetById.mockImplementation((id, { setResponse }) => {
      setResponse?.(
        detailData({
          employeeId: "emp-test-001",
          savedSignedPartA: "sig-data",
        }),
      );
    });

    renderWithProviders(<UpdateIncidentReportEmployeePage />, {
      preloadedState: stateForProfile(),
    });

    const submit = await waitFor(() => {
      const btn = screen.getByRole("button", { name: /submit/i });
      expect(btn).toBeEnabled();
      return btn;
    });
    await user.click(submit);

    // WHY: the report is persisted server-side against its id via the update
    // service, carrying the assembled payload.
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(
        "inr-test-001",
        expect.objectContaining({ patientId: "res-test-001" }),
        expect.objectContaining({ navigate: mockNavigate }),
      ),
    );
  });
});
