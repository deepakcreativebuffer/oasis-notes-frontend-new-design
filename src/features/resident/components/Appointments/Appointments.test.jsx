/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import Appointments from "./Appointments";

// ---- hoisted mock handles (vi.mock factories run before module init) ----
const h = vi.hoisted(() => ({
  navigate: vi.fn(),
  getUpcomingAppointments: vi.fn(),
  getApiResident: vi.fn(),
  uploadDocument: vi.fn(),
  deleteDocument: vi.fn(),
}));

// HOC wraps the page in Sidebar/Navbar; render the inner component directly.
vi.mock("@/features/shared/layout/Outer/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// Service layer — never hit real HTTP.
vi.mock("@/features/shared/services", () => ({
  residentService: {
    getUpcomingAppointments: h.getUpcomingAppointments,
    getApiResident: h.getApiResident,
    uploadDocument: h.uploadDocument,
    deleteDocument: h.deleteDocument,
  },
  COMMON_APIS: { GET_USER_DOCUMENTS: "/documents" },
}));

// Vitals panel pulls in clinical IO; stub to a marker div.
vi.mock(
  "@/features/shared/features/clinical/vitals/VitalResidentPanel",
  () => ({ default: () => <div data-testid="vital-panel" /> }),
);

// File-upload hook returns a controlled file handle.
vi.mock("@shared/hooks", () => ({
  useFileUpload: () => ({ file: null, onSelectFile: vi.fn() }),
}));

// CustomSelect — light stub exposing only onChange.
vi.mock("@/features/shared/ui/selectors/CustomSelect", () => ({
  default: ({ onChange }) => (
    <select
      data-testid="custom-select"
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      <option value="Progress Note">Progress Note</option>
    </select>
  ),
}));

// The shared constants barrel imports ~37 named assets from this module, and
// Vitest 4 throws on access to any undefined named export. Return a Proxy
// directly so every imported asset name resolves to a stub string.
vi.mock(
  "@/assets",
  () =>
    new Proxy(
      { __esModule: true },
      {
        get: (target, prop) =>
          prop === "__esModule" ? true : `stub-${String(prop)}`,
        has: () => true,
      },
    ),
);

vi.mock("@/features/shared/config/env", () => ({
  default: { CLOUDFRONT_URL: "https://cdn.test/" },
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

const patientState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "res-test-001", userType: "Patient" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const guardianState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "res-test-001", userType: "Guardian" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("Appointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockReset();
  });

  it("renders welcome header and fetches upcoming appointments on mount", () => {
    renderWithProviders(<Appointments />, { preloadedState: patientState });

    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    // Exact match: a loose /Upcoming Appointments/i regex also hits the
    // "No Upcoming Appointments" empty-state card, yielding two matches.
    expect(screen.getByText("Upcoming Appointments")).toBeInTheDocument();
    // WHY: mount effect kicks off the appointments fetch through the service.
    expect(h.getUpcomingAppointments).toHaveBeenCalledTimes(1);
  });

  it("shows the empty-state card when there are no upcoming appointments", () => {
    renderWithProviders(<Appointments />, { preloadedState: patientState });
    expect(screen.getByText("No Upcoming Appointments")).toBeInTheDocument();
  });

  it("renders the Vitals panel and Upload Document section for a Patient", () => {
    renderWithProviders(<Appointments />, { preloadedState: patientState });
    expect(screen.getByTestId("vital-panel")).toBeInTheDocument();
    expect(screen.getByText("Upload Document")).toBeInTheDocument();
  });

  it("hides Vitals panel and Upload section for a Guardian", () => {
    renderWithProviders(<Appointments />, { preloadedState: guardianState });
    expect(screen.queryByTestId("vital-panel")).not.toBeInTheDocument();
    expect(screen.queryByText("Upload Document")).not.toBeInTheDocument();
  });

  it("navigates to the patient booking route for a Patient", () => {
    renderWithProviders(<Appointments />, { preloadedState: patientState });
    fireEvent.click(
      screen.getByRole("button", { name: /Book New Appointment/i }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/booknewappointment");
  });

  it("navigates to the resident booking route for a Guardian", () => {
    renderWithProviders(<Appointments />, { preloadedState: guardianState });
    fireEvent.click(
      screen.getByRole("button", { name: /Book New Appointment/i }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/bookappointment-resident");
  });

  it("navigates to history and manage routes from their buttons", () => {
    renderWithProviders(<Appointments />, { preloadedState: patientState });
    fireEvent.click(
      screen.getByRole("button", { name: /Appointment History/i }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/appointmenthistory");

    fireEvent.click(
      screen.getByRole("button", { name: /Manage Appointment/i }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/manageappointment");
  });

  it("opens the document upload modal when File Upload is clicked", async () => {
    renderWithProviders(<Appointments />, { preloadedState: patientState });

    fireEvent.click(screen.getByRole("button", { name: /File Upload/i }));

    // WHY: opening the modal triggers a document fetch (no patient id passed).
    // Assert a modal-only label ("File Name") rather than /File Upload/i, which
    // matches both the trigger button and the modal header.
    await screen.findByText("File Name");
    expect(h.getApiResident).toHaveBeenCalled();
  });
});
