/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";
import userEvent from "@testing-library/user-event";

import VitalsFormPage from "./VitalsFormPage";
import { vitalsService } from "@/features/shared/services/index";

// --- Service layer: never hit real HTTP. vitalsService is the only IO. ---
vi.mock("@/features/shared/services/index", () => ({
  vitalsService: {
    getById: vi.fn(),
    getByPatient: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// --- HOC wraps the page in Sidebar/Navbar chrome we don't care about here.
// Render the inner component directly so the form is the unit under test. ---
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// --- NavWrapper: light stub exposing the title so we can assert the header. ---
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// --- utils.jsx pulls in date-fns + redux-bound signature widgets; stub the
// few helpers the page uses so behaviour is deterministic. ---
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) => (
    <div data-testid="add-signature">{show ? "signature-open" : ""}</div>
  ),
  fetchPaitentName: (p) => p?.name || "Test Patient",
  formatDateToMMDDYYYY: (d) => (d ? new Date("2026-06-10") : null),
  parseTimeStringToDate: (t) => (t ? new Date("2026-06-10") : null),
  signatureFormat: ({ sign }) =>
    sign ? <div data-testid="sig">{sign}</div> : null,
}));

// --- Heavy / canvas-bound third-party + child widgets: light stubs. ---
vi.mock("react-datepicker", () => ({
  default: ({ onChange, placeholderText }) => (
    <input
      aria-label="date-picker"
      placeholder={placeholderText}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

vi.mock("@/features/shared/ui/TimePicker/CustomTimePicker", () => ({
  default: ({ onChange }) => (
    <input
      aria-label="time-picker"
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  default: ({ MainPatientId }) => (
    <button type="button" onClick={() => MainPatientId("res-test-001")}>
      pick-patient
    </button>
  ),
}));

vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  default: ({ setValue }) => (
    <button
      type="button"
      onClick={() =>
        setValue([{ value: "emp-test-001", label: "Test Employee" }])
      }
    >
      pick-signers
    </button>
  ),
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

// --- Control route params: renderWithProviders mounts the bare component
// without a <Routes> match, so useParams() must be driven explicitly to
// exercise create vs. edit branches. ---
let mockParams = {};
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => mockParams,
    useNavigate: () => vi.fn(),
  };
});

const adminState = {
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      userType: "Admin",
      hoursFormat: "12",
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const renderPage = (preloadedState = adminState) =>
  renderWithProviders(<VitalsFormPage />, { preloadedState });

describe("VitalsFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = {};
  });

  it("should render the vitals form header and all vital input labels", () => {
    renderPage();

    // WHY: the EHR vitals chart must surface every measured field for a nurse.
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Resident Vitals",
    );
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

  it("should show the patient picker (not a name label) when creating", () => {
    renderPage();

    // WHY: a new vitals entry needs a resident selected; edit mode shows a name.
    expect(
      screen.getByRole("button", { name: "pick-patient" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Resident Name :")).not.toBeInTheDocument();
  });

  it("should fetch recent vitals for the patient once one is selected (create mode)", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "pick-patient" }));

    // WHY: selecting a resident pre-loads the week's vitals so duplicate
    // readings can be detected before saving.
    await waitFor(() =>
      expect(vitalsService.getByPatient).toHaveBeenCalledTimes(1),
    );
    expect(vitalsService.getByPatient).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: "res-test-001",
        forFilter: "week",
        isAdmin: true,
      }),
    );
    // create path must not call the edit fetch
    expect(vitalsService.getById).not.toHaveBeenCalled();
  });

  it("should keep SUBMIT disabled until a signature exists in create mode", () => {
    renderPage();

    // WHY: vitals are a signed clinical record — unsigned entries cannot submit.
    expect(screen.getByRole("button", { name: "SUBMIT" })).toBeDisabled();
  });

  it("should open the signature dialog when SAVED AND SIGNED is clicked", () => {
    renderPage();

    expect(screen.getByTestId("add-signature")).toHaveTextContent("");
    fireEvent.click(screen.getByRole("button", { name: /SAVED AND SIGNED/i }));
    expect(screen.getByTestId("add-signature")).toHaveTextContent(
      "signature-open",
    );
  });

  it("should let the user type a vital reading into a field", async () => {
    const user = userEvent.setup();
    renderPage();

    const temp = screen
      .getByText("Body Temperature")
      .parentElement.querySelector("input");
    await user.type(temp, "98.6");
    expect(temp).toHaveValue("98.6");
  });

  it("should call vitalsService.getById to hydrate an existing record in edit mode", async () => {
    mockParams = { id: "res-test-001" };
    renderPage();

    // WHY: editing an existing vitals entry must load it by id, not by patient.
    await waitFor(() => expect(vitalsService.getById).toHaveBeenCalledTimes(1));
    expect(vitalsService.getById).toHaveBeenCalledWith(
      "res-test-001",
      expect.objectContaining({}),
    );
    expect(vitalsService.getByPatient).not.toHaveBeenCalled();
  });

  it("should not render the patient picker or Signers selector in edit mode", () => {
    mockParams = { id: "res-test-001" };
    renderPage();

    // WHY: in edit mode the resident is fixed and signers come from the record.
    expect(
      screen.queryByRole("button", { name: "pick-patient" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "pick-signers" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Resident Name/)).toBeInTheDocument();
  });
});
