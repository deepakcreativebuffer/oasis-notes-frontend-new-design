/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import AppointmentScheduling from "./AppointmentScheduling";

// ─── Hoisted mock handles ──────────────────────────────────────────
// WHY: vi.mock factories are hoisted above imports; any referenced var
// must come from vi.hoisted so it exists at factory-eval time.
const h = vi.hoisted(() => ({
  getUpcomingAppointments: vi.fn(),
  getPastAppointments: vi.fn(),
}));

// Domain service is IO; never let it hit real HTTP. The component passes a
// React state setter as the sole arg, so our mock drives the setter.
vi.mock("@/features/shared/services", () => ({
  __esModule: true,
  residentService: {
    getUpcomingAppointments: h.getUpcomingAppointments,
    getPastAppointments: h.getPastAppointments,
  },
}));

// Asset barrel -> return a Proxy *directly* (not spread) so every imported
// name (nurse1, etc.) resolves to a stub string. Vitest 4 throws on access to
// an undefined named export, and spreading a Proxy copies no keys, so the
// factory must return the Proxy itself.
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

// HOC wraps the page in Sidebar/Navbar (heavy, Redux/Router-bound) AND the
// source calls HOC(Component) positionally while HOC destructures
// { Wcomponenet }, so the real HOC would never render the page. Stub it to
// render the wrapped component directly.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: (Wrapped) => () => <Wrapped />,
}));

// Light stub for the presentational card so we assert on the data the page
// forwards (date/slot/location), not bootstrap/react-icons internals.
vi.mock("../Cards/AppointmentsCard", () => ({
  __esModule: true,
  default: ({ date, slot, location }) => (
    <div data-testid="appointment-card">
      <span data-testid="card-date">{date}</span>
      <span data-testid="card-slot">{slot}</span>
      <span data-testid="card-location">{location}</span>
    </div>
  ),
}));

const upcomingPayload = {
  data: [
    {
      _id: "appt-test-001",
      date: "2026-06-11T00:00:00.000Z",
      time: "10:00 AM",
      adminId: { address: "1 Test Clinic Way", profilePic: "" },
    },
  ],
};

const pastPayload = {
  data: [
    {
      _id: "appt-test-002",
      date: "2026-06-01T00:00:00.000Z",
      time: "02:30 PM",
      adminId: { address: "2 Past Clinic Rd", profilePic: "pic.png" },
    },
  ],
};

describe("AppointmentScheduling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset implementations too: a mockImplementation that drives the setter
    // in one test would otherwise leak into later tests (clearMocks only wipes
    // call history), leaving stale appointment cards in the DOM.
    h.getUpcomingAppointments.mockReset();
    h.getPastAppointments.mockReset();
  });

  it("fetches upcoming and past appointments on mount", () => {
    renderWithProviders(<AppointmentScheduling />);

    // WHY: useEffect must trigger both service loads exactly once.
    expect(h.getUpcomingAppointments).toHaveBeenCalledTimes(1);
    expect(h.getPastAppointments).toHaveBeenCalledTimes(1);
    // Each is given a setter callback to receive the resolved data.
    expect(typeof h.getUpcomingAppointments.mock.calls[0][0]).toBe("function");
    expect(typeof h.getPastAppointments.mock.calls[0][0]).toBe("function");
  });

  it("renders the section headings", () => {
    renderWithProviders(<AppointmentScheduling />);

    expect(screen.getByText("Upcoming Appointments")).toBeInTheDocument();
    expect(screen.getByText("TODAY")).toBeInTheDocument();
    expect(screen.getByText("TOMORROW")).toBeInTheDocument();
  });

  it("renders nothing-but-headings when no appointment data resolves", () => {
    // Service mock never invokes the setter -> state stays "" -> no cards.
    renderWithProviders(<AppointmentScheduling />);

    expect(screen.queryByTestId("appointment-card")).not.toBeInTheDocument();
    // Headings remain so the layout is resilient to empty data.
    expect(screen.getByText("TODAY")).toBeInTheDocument();
  });

  it("renders a card per upcoming and past appointment once data resolves", async () => {
    // Drive the setter the component handed us with our fixtures.
    h.getUpcomingAppointments.mockImplementation((setter) =>
      setter(upcomingPayload),
    );
    h.getPastAppointments.mockImplementation((setter) => setter(pastPayload));

    renderWithProviders(<AppointmentScheduling />);

    await waitFor(() => {
      expect(screen.getAllByTestId("appointment-card")).toHaveLength(2);
    });

    // Forwarded fields surface on the cards.
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    expect(screen.getByText("02:30 PM")).toBeInTheDocument();
    expect(screen.getByText("1 Test Clinic Way")).toBeInTheDocument();
    expect(screen.getByText("2 Past Clinic Rd")).toBeInTheDocument();
  });

  it("formats the appointment date via toLocaleDateString", async () => {
    h.getUpcomingAppointments.mockImplementation((setter) =>
      setter(upcomingPayload),
    );

    renderWithProviders(<AppointmentScheduling />);

    const expected = new Date(
      upcomingPayload.data[0].date,
    ).toLocaleDateString();
    await waitFor(() => {
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  it("does not throw when an appointment is missing adminId/profilePic", async () => {
    // WHY: source optional-chains adminId; a sparse record must not crash and
    // should fall back to the nurse placeholder image.
    h.getUpcomingAppointments.mockImplementation((setter) =>
      setter({ data: [{ _id: "appt-x", date: "2026-06-11", time: "9 AM" }] }),
    );

    expect(() => renderWithProviders(<AppointmentScheduling />)).not.toThrow();

    await waitFor(() => {
      expect(screen.getByTestId("appointment-card")).toBeInTheDocument();
    });
    // location is undefined (no adminId) -> empty location span, slot present.
    expect(screen.getByText("9 AM")).toBeInTheDocument();
  });
});
