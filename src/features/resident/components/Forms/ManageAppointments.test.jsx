/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import ManageAppointments from "./ManageAppointments";
import { residentService } from "@/features/shared/services";

// Service is the only IO the component touches: getUpcomingAppointments is
// invoked with the state setter as a callback. We capture that call to drive
// the component's local state from the test.
const services = vi.hoisted(() => ({
  getUpcomingAppointments: vi.fn(),
  getObjectUrlFromDownloadUrl: vi.fn((u) => `obj:${u}`),
}));

vi.mock("@/features/shared/services", () => ({
  residentService: {
    getUpcomingAppointments: services.getUpcomingAppointments,
    cancelAppointment: vi.fn(),
    deleteAppointment: vi.fn(),
  },
  getObjectUrlFromDownloadUrl: services.getObjectUrlFromDownloadUrl,
}));

// Asset barrel -> Proxy so any imported asset name resolves to a stub string.
vi.mock("@/assets/index", () => ({
  __esModule: true,
  NurseImg: "nurse.png",
  default: new Proxy(
    { __esModule: true },
    { get: (t, p) => (p in t ? t[p] : "stub"), has: () => true },
  ),
}));

// HOC just wraps content in sidebar/navbar chrome (Redux + router heavy);
// render the inner component directly.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

vi.mock("./AppointmentCardView", () => ({
  __esModule: true,
  default: ({ show }) => (
    <div data-testid="appointment-card-view" data-show={String(!!show)} />
  ),
}));

// HistoryCard: expose the props the parent maps so we can assert wiring.
vi.mock("../Cards/HistoryCards", () => ({
  __esModule: true,
  default: ({ name, visit, status, imageUrl, address }) => (
    <div
      data-testid="history-card"
      data-name={name}
      data-visit={visit}
      data-status={status || ""}
      data-image={imageUrl}
      data-address={address || ""}
    />
  ),
}));

const renderComponent = () =>
  renderWithProviders(<ManageAppointments />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        userProfile: { _id: "res-test-001", userType: "Patient" },
      },
    },
  });

describe("ManageAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the cancel-appointment header and nav title", () => {
    renderComponent();

    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Manage Appointment",
    );
    // WHY: the danger Alert is the always-present instruction block.
    expect(screen.getByText(/Cancel Appointment/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Upcoming Appointments you want to Cancel/i),
    ).toBeInTheDocument();
  });

  it("fetches upcoming appointments on mount via the resident service", () => {
    renderComponent();

    // WHY: useEffect calls the service once, passing the state setter callback.
    expect(residentService.getUpcomingAppointments).toHaveBeenCalledTimes(1);
    expect(
      typeof residentService.getUpcomingAppointments.mock.calls[0][0],
    ).toBe("function");
  });

  it("renders no history cards when there is no appointment data", () => {
    renderComponent();

    expect(screen.queryAllByTestId("history-card")).toHaveLength(0);
  });

  it("renders a HistoryCard per upcoming appointment once the service resolves", async () => {
    const appointments = {
      data: [
        {
          _id: "appt-1",
          name: "Test Patient",
          date: "2026-06-12",
          reasonForVisit: "Checkup",
          patientId: "MRN-TEST-001",
          status: "confirmed",
          address: "123 Test St",
          adminId: { profilePic: "pic-key" },
        },
        {
          _id: "appt-2",
          name: "Second Patient",
          date: "2026-06-13",
          reasonForVisit: "Follow up",
          patientId: "MRN-TEST-002",
          status: null,
          address: "456 Test Ave",
        },
      ],
    };

    // Drive component state by invoking the captured setter callback.
    residentService.getUpcomingAppointments.mockImplementation((setter) => {
      setter(appointments);
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByTestId("history-card")).toHaveLength(2);
    });

    const cards = screen.getAllByTestId("history-card");
    expect(
      cards.some((c) => c.getAttribute("data-name") === "Test Patient"),
    ).toBe(true);
    // WHY: appointment with a profilePic resolves its image through the URL
    // helper; the one without falls back to NurseImg.
    expect(services.getObjectUrlFromDownloadUrl).toHaveBeenCalledWith(
      "pic-key",
    );
    expect(
      cards.some((c) => c.getAttribute("data-image") === "obj:pic-key"),
    ).toBe(true);
    expect(
      cards.some((c) => c.getAttribute("data-image") === "nurse.png"),
    ).toBe(true);
  });

  it("always renders the appointment-card-view modal (initially hidden)", () => {
    renderComponent();

    const view = screen.getByTestId("appointment-card-view");
    expect(view).toBeInTheDocument();
    expect(view).toHaveAttribute("data-show", "false");
  });
});
