/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, act, waitFor } from "@/test-utils";

import EditTimeOfRequest from "./EditTimeOfRequest";

// ─── Hoisted mock handles referenced inside vi.mock factories ──────────
const h = vi.hoisted(() => ({
  getData: vi.fn(),
  getRequestById: vi.fn(),
  requestsUpdate: vi.fn(),
  navigate: vi.fn(),
  params: { id: "to-req-001", employeeId: "emp-001" },
}));

// timeOffService + getData both come from the shared services barrel.
vi.mock("@/features/shared/services", () => ({
  getData: h.getData,
  timeOffService: {
    getRequestById: h.getRequestById,
    requests: { update: h.requestsUpdate },
  },
}));

// HOC just wraps the page in sidebar/navbar chrome — render the inner page.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// Light stubs for the signature widget + date picker (heavy/canvas libs).
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) => (
    <div data-testid="add-signature" data-show={String(!!show)} />
  ),
  fetchPaitentName: vi.fn((e) => (e ? "Jane Employee" : "")),
  formatDateToMMDDYYYY: vi.fn((d) => (d ? new Date("2026-01-02") : null)),
  signatureFormat: vi.fn(({ sign }) =>
    sign ? <div data-testid="signature-block">{sign}</div> : null,
  ),
}));

vi.mock("react-datepicker", () => ({
  default: ({ placeholderText, disabled }) => (
    <input
      data-testid="date-picker"
      placeholder={placeholderText}
      disabled={disabled}
      readOnly
    />
  ),
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => h.navigate,
    useParams: () => h.params,
  };
});

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-001", userType: "Employee" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const adminState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "admin-001", userType: "Admin" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

// Drive the getRequestById effect to populate `detail` via its setResponse cb.
function resolveDetail(data) {
  h.getRequestById.mockImplementation(({ setResponse }) => {
    setResponse({ data });
  });
}

const baseDetail = {
  requestType: "PTO",
  beginDate: "2026-01-01",
  endDate: "2026-01-05",
  normalShift: "Day",
  unPaidHrLeft: "4",
  vacationPersonTimeUsed: "8",
  sickTimeUsed: "0",
  notes: "Family trip",
  signature: "",
  signatureDate: "",
  signatureTime: "",
  adminSignature: "",
  adminDateSigned: "",
  adminSignedTime: "",
  signers: [],
  status: "Pending",
  employeeId: { _id: "emp-001", firstName: "Jane" },
  signatureSaveAsDraft: false,
};

describe("EditTimeOfRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.params = { id: "to-req-001", employeeId: "emp-001" };
    resolveDetail({ ...baseDetail });
  });

  it("renders the page header and the two request-type radios", () => {
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Time of Request",
    );
    expect(screen.getByText("PTO REQUEST")).toBeInTheDocument();
    expect(screen.getByText("SICK TIME REQUEST")).toBeInTheDocument();
  });

  it("loads the profile and the request detail on mount", () => {
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    // WHY: profile is fetched via getData, the record via timeOffService.
    expect(h.getData).toHaveBeenCalledWith(
      expect.any(Function),
      "employee/getProfile",
    );
    expect(h.getRequestById).toHaveBeenCalledWith(
      expect.objectContaining({ id: "to-req-001", employeeId: "emp-001" }),
    );
  });

  it("populates form fields from the fetched detail", () => {
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    // Disabled text controls reflect the detail payload values.
    expect(screen.getByDisplayValue("Day")).toBeInTheDocument(); // normalShift
    expect(screen.getByDisplayValue("Jane Employee")).toBeInTheDocument(); // employee name
  });

  it("hides the admin approve/deny radios for an Employee", () => {
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    expect(
      screen.queryByText("Time off request approved/denied"),
    ).not.toBeInTheDocument();
  });

  it("shows the admin approve/deny radios for an Admin", () => {
    renderWithProviders(<EditTimeOfRequest />, { preloadedState: adminState });

    expect(
      screen.getByText("Time off request approved/denied"),
    ).toBeInTheDocument();
  });

  it("opens the signature widget when SAVED AND SIGNED is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "false",
    );
    await user.click(screen.getByRole("button", { name: /saved and signed/i }));
    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "true",
    );
  });

  it("keeps SUBMIT disabled when the employee has not signed", () => {
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    expect(screen.getByRole("button", { name: "SUBMIT" })).toBeDisabled();
  });

  it("enables and submits for an Admin, forwarding an Approved/Denied status", async () => {
    const user = userEvent.setup();
    // status starts Pending -> timeOf null -> "Pending"; admin condition enables submit.
    renderWithProviders(<EditTimeOfRequest />, { preloadedState: adminState });

    const submit = screen.getByRole("button", { name: "SUBMIT" });
    await waitFor(() => expect(submit).not.toBeDisabled());

    await user.click(submit);

    // WHY: admin submit always carries a status field in the payload.
    expect(h.requestsUpdate).toHaveBeenCalledWith(
      "emp-001",
      expect.objectContaining({ status: expect.any(String) }),
      expect.objectContaining({ navigate: h.navigate }),
    );
  });

  it("renders an existing employee signature block", () => {
    resolveDetail({
      ...baseDetail,
      signature: "data:image/png;base64,SIGN",
      signatureDate: "2026-01-02",
      signatureTime: "10:00",
    });
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    expect(screen.getByTestId("signature-block")).toBeInTheDocument();
  });

  it("is resilient to a missing/empty detail payload", () => {
    h.getRequestById.mockImplementation(({ setResponse }) => {
      setResponse({ data: null });
    });
    expect(() =>
      renderWithProviders(<EditTimeOfRequest />, {
        preloadedState: employeeState,
      }),
    ).not.toThrow();
    expect(screen.getByText("PTO REQUEST")).toBeInTheDocument();
  });

  it("does not fetch the record when no route params are present", () => {
    h.params = {};
    renderWithProviders(<EditTimeOfRequest />, {
      preloadedState: employeeState,
    });

    expect(h.getRequestById).not.toHaveBeenCalled();
  });
});
