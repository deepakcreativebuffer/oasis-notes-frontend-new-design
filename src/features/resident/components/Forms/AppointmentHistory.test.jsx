/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import AppointmentHistory from "./AppointmentHistory";

// Hoisted mock state so the residentService factory can reference it.
const h = vi.hoisted(() => ({
  getUpcomingAppointments: vi.fn(),
  getPastAppointments: vi.fn(),
  deleteAppointment: vi.fn(),
  cancelAppointment: vi.fn(),
  getObjectUrlFromDownloadUrl: vi.fn((u) => `url:${u}`),
}));

// Mock the shared services barrel — never hit real HTTP.
vi.mock("@/features/shared/services", () => ({
  residentService: {
    getUpcomingAppointments: h.getUpcomingAppointments,
    getPastAppointments: h.getPastAppointments,
    deleteAppointment: h.deleteAppointment,
    cancelAppointment: h.cancelAppointment,
  },
  getObjectUrlFromDownloadUrl: h.getObjectUrlFromDownloadUrl,
}));

// HOC pulls in Sidebar/Navbar/redux selectors — render the wrapped component directly.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function Hoc() {
      return <Wcomponenet />;
    },
}));

// NavWrapper destructures isArrow and reaches into shared modals — stub it.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// Asset barrel -> return a Proxy directly so every named asset import (the
// shared constants barrel pulls ~37 of them) resolves to a stub string.
// Vitest 4 throws on access to an undefined named export, so a partial object
// mock breaks at module load.
vi.mock(
  "@/assets/index",
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

const renderPage = () =>
  renderWithProviders(<AppointmentHistory />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        userProfile: { _id: "res-test-001", userType: "Patient" },
      },
    },
  });

describe("AppointmentHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders both appointment section headings and the nav title", () => {
    renderPage();
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Appointment History",
    );
    expect(screen.getByText("Upcoming Appointments")).toBeInTheDocument();
    expect(screen.getByText("Past Appointments")).toBeInTheDocument();
  });

  it("fetches upcoming and past appointments on mount", () => {
    renderPage();
    // WHY: the effect kicks off both service calls, each passed a state setter.
    expect(h.getUpcomingAppointments).toHaveBeenCalledTimes(1);
    expect(h.getPastAppointments).toHaveBeenCalledTimes(1);
    expect(typeof h.getUpcomingAppointments.mock.calls[0][0]).toBe("function");
  });

  it("shows empty-state copy when no appointments are returned", () => {
    renderPage();
    expect(screen.getByText("No Upcoming Appointments")).toBeInTheDocument();
    expect(screen.getByText("No Past Appointments")).toBeInTheDocument();
  });

  it("renders appointment cards when the service setter resolves with data", async () => {
    // The service receives a setter; invoke it to populate state with fake data.
    h.getUpcomingAppointments.mockImplementation((setter) =>
      setter({
        data: [
          {
            _id: "appt-up-1",
            name: "Test Patient",
            date: "2026-06-15",
            reasonForVisit: "Checkup",
            patientId: "MRN-TEST-001",
            status: "Confirmed",
            address: "123 Test St",
          },
        ],
      }),
    );
    h.getPastAppointments.mockImplementation((setter) =>
      setter({
        data: [
          {
            _id: "appt-past-1",
            name: "Past Patient",
            date: "2026-01-01",
            reasonForVisit: "Follow up",
            patientId: "MRN-TEST-001",
            address: "456 Test Ave",
          },
        ],
      }),
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Test Patient")).toBeInTheDocument();
    });
    expect(screen.getByText("Past Patient")).toBeInTheDocument();
    // Empty-state copy should no longer render once data exists.
    expect(
      screen.queryByText("No Upcoming Appointments"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("No Past Appointments")).not.toBeInTheDocument();
  });
});
