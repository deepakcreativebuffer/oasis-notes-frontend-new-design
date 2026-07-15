/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import FileUpload from "./FileUpload";

// Mock the data layer so no real IO runs. The source calls four resident
// service methods on mount, each receiving a state setter callback.
const services = vi.hoisted(() => ({
  getUpcomingAppointments: vi.fn(),
  getPastAppointments: vi.fn(),
  getAllPatientMedication: vi.fn(),
  getTodayMedications: vi.fn(),
}));

vi.mock("@/features/shared/services", () => ({
  residentService: services,
}));

vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

// HOC pulls in the full Sidebar/Navbar/LayoutContext shell; stub it to render
// the wrapped component directly so we can exercise FileUpload's own markup.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// NavWrapper destructures from props in ways unrelated to this test.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

const patientState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "res-test-001", userType: "Patient" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("FileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the File Upload heading via NavWrapper", () => {
    renderWithProviders(<FileUpload />, { preloadedState: patientState });
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent("File Upload");
  });

  it("renders the file-type options and action controls", () => {
    renderWithProviders(<FileUpload />, { preloadedState: patientState });

    // WHY: the static select exposes the supported document formats.
    expect(screen.getByRole("option", { name: "PDF" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DOCX" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PNG" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Add Additinal Files/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Upload/i })).toBeInTheDocument();
  });

  it("fetches appointments and medications on mount", async () => {
    renderWithProviders(<FileUpload />, { preloadedState: patientState });

    // WHY: all four resident lookups are kicked off once when the page mounts.
    await waitFor(() => {
      expect(services.getUpcomingAppointments).toHaveBeenCalledTimes(1);
    });
    expect(services.getPastAppointments).toHaveBeenCalledTimes(1);
    expect(services.getAllPatientMedication).toHaveBeenCalledTimes(1);
    expect(services.getTodayMedications).toHaveBeenCalledTimes(1);
  });

  it("renders without crashing when no profile is present", () => {
    renderWithProviders(<FileUpload />, {
      preloadedState: { auth: { userProfile: null } },
    });
    expect(screen.getByTestId("nav-wrapper")).toBeInTheDocument();
  });
});
