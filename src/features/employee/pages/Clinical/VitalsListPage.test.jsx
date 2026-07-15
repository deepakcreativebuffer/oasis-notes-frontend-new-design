/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import VitalsListPage from "./VitalsListPage";

// --- Hoisted mock handles (vi.mock factories are hoisted above imports) ---
const mocks = vi.hoisted(() => ({
  getByPatient: vi.fn(),
  // Captures the MainPatientId setter so a test can simulate picking a resident.
  lastSetId: null,
}));

// HOC wraps the page in Sidebar/Navbar shell (heavy, pulls layout context).
// Render the inner component directly so we test VitalsList in isolation.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// CreateNav uses router/redux internally; stub to a simple title bar.
vi.mock("@/utils/CreateNav", () => ({
  __esModule: true,
  default: ({ title, link }) => (
    <div data-testid="create-nav" data-link={link}>
      {title}
    </div>
  ),
}));

// PatientComponent does its own patient search/service IO. Stub it and expose
// a button that drives MainPatientId(id) so we can trigger the vitals fetch.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: ({ MainPatientId }) => {
    mocks.lastSetId = MainPatientId;
    return (
      <button
        type="button"
        data-testid="pick-patient"
        onClick={() => MainPatientId && MainPatientId("res-test-001")}
      >
        Select Resident
      </button>
    );
  },
}));

// Loader stub so the loading branch is trivially assertable.
vi.mock("@/features/shared/ui/Loader/Loader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Never hit real vitals IO.
vi.mock("@/features/shared/services/index", () => ({
  __esModule: true,
  vitalsService: { getByPatient: mocks.getByPatient },
}));

// Asset barrel has MANY exports consumed transitively by constants/index.js.
// Proxy returns a stub for any unknown export and a real resolver for the one
// the component calls.
vi.mock("@/assets", () => {
  const target = {
    __esModule: true,
    resolveVitalAssetPath: (p) => `stub:${p}`,
  };
  return new Proxy(target, {
    get: (t, p) => (p in t ? t[p] : "stub"),
    has: () => true,
  });
});

const adminState = {
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test Patient",
      userType: "Admin",
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test Patient",
      userType: "Employee",
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("VitalsListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.lastSetId = null;
  });

  it("should mount and render the title bar and date filters", () => {
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    // WHY: the page header must announce it is the Resident Vitals view.
    expect(screen.getByTestId("create-nav")).toHaveTextContent(
      "Resident Vitals",
    );
    expect(screen.getByTestId("create-nav")).toHaveAttribute(
      "data-link",
      "/create-vital",
    );
    // The three time-range filters are always present.
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Last Week")).toBeInTheDocument();
    expect(screen.getByText("Last month")).toBeInTheDocument();
  });

  it("should not fetch vitals until a resident is selected", () => {
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    // WHY: with no patientId the effect guards the call (id is falsy).
    expect(mocks.getByPatient).not.toHaveBeenCalled();
  });

  it("should default the active filter to Today", () => {
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    // WHY: initial state.type === "today" applies the active class to Today only.
    expect(screen.getByText("Today")).toHaveClass("active");
    expect(screen.getByText("Last Week")).not.toHaveClass("active");
  });

  it("should fetch vitals for the selected resident with today filter", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    await user.click(screen.getByTestId("pick-patient"));

    await waitFor(() => expect(mocks.getByPatient).toHaveBeenCalled());
    // WHY: fetch carries the chosen patient, the default range, and a date stamp.
    const arg = mocks.getByPatient.mock.calls[0][0];
    expect(arg).toEqual(
      expect.objectContaining({
        patientId: "res-test-001",
        forFilter: "today",
        isAdmin: false,
      }),
    );
    expect(arg.date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it("should mark isAdmin true when the profile is an Admin", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalsListPage />, { preloadedState: adminState });

    await user.click(screen.getByTestId("pick-patient"));

    await waitFor(() => expect(mocks.getByPatient).toHaveBeenCalled());
    // WHY: admins read vitals across facilities, so the service flag flips.
    expect(mocks.getByPatient.mock.calls[0][0].isAdmin).toBe(true);
  });

  it("should refetch with the new range when a different filter is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    await user.click(screen.getByTestId("pick-patient"));
    await waitFor(() => expect(mocks.getByPatient).toHaveBeenCalledTimes(1));

    await user.click(screen.getByText("Last Week"));

    // WHY: changing the time range re-runs the effect (deps include type).
    await waitFor(() => expect(mocks.getByPatient).toHaveBeenCalledTimes(2));
    expect(mocks.getByPatient.mock.calls[1][0].forFilter).toBe("week");
    expect(screen.getByText("Last Week")).toHaveClass("active");
  });

  it("should show the loader while a fetch is in flight", async () => {
    // Drive the component's loading state via setLoading passed to the service.
    mocks.getByPatient.mockImplementation(({ setLoading }) => {
      setLoading?.(true);
    });
    const user = userEvent.setup();
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    await user.click(screen.getByTestId("pick-patient"));

    // WHY: the Loader replaces the vital cards until results arrive.
    expect(await screen.findByTestId("loader")).toBeInTheDocument();
  });

  it("should render vital cards from the service response", async () => {
    mocks.getByPatient.mockImplementation(({ setResponse, setLoading }) => {
      setLoading?.(false);
      setResponse?.({
        data: [
          {
            bodyTemperature: 98,
            pulseRate: 72,
            respirationRate: 16,
            bloodPressure: "120/80",
            bloodOxygen: 99,
            weight: 150,
            height: "5/8",
            bloodGlucoseLevel: 90,
          },
        ],
      });
    });
    const user = userEvent.setup();
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    await user.click(screen.getByTestId("pick-patient"));

    // WHY: each vital tile reflects the fetched reading for the resident.
    expect(await screen.findByText(/98 °F/)).toBeInTheDocument();
    expect(screen.getByText(/72 bpm/)).toBeInTheDocument();
    expect(screen.getByText("Blood Oxygen")).toBeInTheDocument();
    expect(screen.getByText(/120\/80 mmHg/)).toBeInTheDocument();
  });

  it("should render no vital cards when the response is empty", async () => {
    mocks.getByPatient.mockImplementation(({ setResponse, setLoading }) => {
      setLoading?.(false);
      setResponse?.({ data: [] });
    });
    const user = userEvent.setup();
    renderWithProviders(<VitalsListPage />, { preloadedState: employeeState });

    await user.click(screen.getByTestId("pick-patient"));
    await waitFor(() => expect(mocks.getByPatient).toHaveBeenCalled());

    // WHY: with no readings the card grid stays empty (no Body Temp label).
    expect(screen.queryByText("Body Temp")).not.toBeInTheDocument();
  });
});
