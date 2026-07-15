/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";
import userEvent from "@testing-library/user-event";

import ViewTimeOfRequest from "./ViewTimeOfRequest";

// Hoisted mock handles so the vi.mock factories can reference them safely.
const h = vi.hoisted(() => ({
  getRequestById: vi.fn(),
  downloadReport: vi.fn(),
  handlePrint: vi.fn(),
  usePrint: vi.fn(),
  useReactToPrint: vi.fn(),
}));

// timeOffService is the only IO module the component touches.
vi.mock("@/features/shared/services", () => ({
  timeOffService: { getRequestById: h.getRequestById },
}));

// HOC wraps the page with Navbar + sidebar (heavy tree). The real default is a
// factory returning a component, so mirror that: return a function component
// that renders the wrapped page directly.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function Mocked() {
      return <Wcomponenet />;
    },
}));

// NavWrapper just renders the page heading bar.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

vi.mock("@/features/shared/ui/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Pure formatting/display utils — stub with deterministic outputs we can assert.
vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (emp) => (emp ? "Jane Employee" : ""),
  formatDateToMMDDYYYY: (d) => `MMDD-${d}`,
  signatureFormat: ({ sign }) => (sign ? `sig:${sign}` : ""),
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => document.createElement("div")),
  printDocumentTitleExceptFirstPage: vi.fn(() => "Doc Title"),
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => h.handlePrint,
}));

vi.mock("@/utils", () => ({
  downloadReport: h.downloadReport,
}));

vi.mock("@shared/hooks", () => ({
  usePrint: (...args) => h.usePrint(...args),
}));

const SAMPLE = {
  data: {
    employeeId: "emp-001",
    requestType: "Vacation",
    beginDate: "2026-06-01",
    endDate: "2026-06-05",
    normalShift: "Day",
    unPaidHrLeft: "8",
    vacationPersonTimeUsed: "16",
    sickTimeUsed: "4",
    status: "Approved",
    notes: "Family trip",
    signature: "emp-sign",
    signers: [
      { signerId: "s1", signature: "signer-1-sign", dateSigned: "2026-06-02" },
    ],
  },
};

const route = "/time-off/req-1/emp-001";

const preloadedState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "u1", userType: "Employee", hoursFormat: "12" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("ViewTimeOfRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom has no canvas 2d context; some print helpers may touch it.
    HTMLCanvasElement.prototype.getContext = vi.fn();
    // Default: service resolves with sample data and clears loading.
    h.getRequestById.mockImplementation(({ setResponse, setLoading }) => {
      setLoading?.(false);
      setResponse?.(SAMPLE);
    });
    // usePrint returns the click handler the PRINT button uses.
    h.usePrint.mockReturnValue(vi.fn());
  });

  it("fetches the request on mount, forwarding the state setters", () => {
    renderWithProviders(<ViewTimeOfRequest />, { preloadedState, route });
    // WHY: the effect wires the response/loading setters into the service so it
    // can populate component state. (id/employeeId derive from useParams, which
    // needs a matched <Route>; the setter contract is what matters here.)
    expect(h.getRequestById).toHaveBeenCalledTimes(1);
    expect(h.getRequestById).toHaveBeenCalledWith(
      expect.objectContaining({
        setResponse: expect.any(Function),
        setLoading: expect.any(Function),
      }),
    );
  });

  it("renders the nav title and fetched field values", async () => {
    renderWithProviders(<ViewTimeOfRequest />, { preloadedState, route });

    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Time of Request",
    );
    await screen.findByText("Vacation");
    expect(screen.getByText("Jane Employee")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Family trip")).toBeInTheDocument();
    // WHY: dates pass through formatDateToMMDDYYYY only when present.
    expect(screen.getByText("MMDD-2026-06-01")).toBeInTheDocument();
    expect(screen.getByText("MMDD-2026-06-05")).toBeInTheDocument();
  });

  it("renders signature output for signers with a signature", async () => {
    renderWithProviders(<ViewTimeOfRequest />, { preloadedState, route });
    await screen.findByText("sig:emp-sign");
    expect(screen.getByText("sig:signer-1-sign")).toBeInTheDocument();
  });

  it("shows the loader while loading and no data fields", () => {
    h.getRequestById.mockImplementation(({ setLoading }) => {
      setLoading?.(true);
    });
    renderWithProviders(<ViewTimeOfRequest />, { preloadedState, route });
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByText("Vacation")).not.toBeInTheDocument();
  });

  it("renders resiliently when the response has no data payload", async () => {
    h.getRequestById.mockImplementation(({ setResponse, setLoading }) => {
      setLoading?.(false);
      setResponse?.({});
    });
    renderWithProviders(<ViewTimeOfRequest />, { preloadedState, route });
    // Static labels still present; no crash on missing fields.
    expect(screen.getByText(/Time of Request :/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /print report/i }),
    ).toBeInTheDocument();
  });

  it("invokes the usePrint handler when PRINT REPORT is clicked", async () => {
    const onPrint = vi.fn();
    h.usePrint.mockReturnValue(onPrint);
    renderWithProviders(<ViewTimeOfRequest />, { preloadedState, route });

    const btn = screen.getByRole("button", { name: /print report/i });
    fireEvent.click(btn);
    // WHY: the button's onClick is the value returned by usePrint().
    expect(onPrint).toHaveBeenCalled();
  });
});
