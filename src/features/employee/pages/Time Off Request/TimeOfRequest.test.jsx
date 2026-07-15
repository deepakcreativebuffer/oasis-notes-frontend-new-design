/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TimeOfRequest from "./TimeOfRequest";

// ─── Hoisted mock fns referenced inside vi.mock factories ──────────────
const h = vi.hoisted(() => ({
  createRequest: vi.fn().mockResolvedValue({}),
  getData: vi.fn(),
  fetchPaitentName: vi.fn(() => "Fake Employee"),
  formatDateToMMDDYYYY: vi.fn((d) => d || null),
  signatureFormat: vi.fn(() => null),
}));

// HOC wraps the page in sidebar/navbar chrome — render the inner component bare.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// Services barrel: provide getData + timeOffService used by the page.
vi.mock("@/features/shared/services", () => ({
  getData: h.getData,
  timeOffService: { createRequest: h.createRequest },
}));

// utils: AddSignature (modal) + helpers.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) => (
    <div data-testid="add-signature">{String(show)}</div>
  ),
  fetchPaitentName: h.fetchPaitentName,
  formatDateToMMDDYYYY: h.formatDateToMMDDYYYY,
  signatureFormat: h.signatureFormat,
}));

vi.mock("@/utils/Makers", () => ({
  TextareaMaker: ({ label, value, setValue }) => (
    <label>
      {label}
      <textarea
        aria-label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  ),
}));

vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  default: ({ setValue }) => (
    <button
      type="button"
      data-testid="multi-employee"
      onClick={() => setValue([{ value: "emp-1", label: "Signer One" }])}
    >
      add-signer
    </button>
  ),
}));

vi.mock("@/features/shared/ui/Search/EmployeeComponent", () => ({
  default: ({ MainPatientId }) => (
    <button
      type="button"
      data-testid="employee-component"
      onClick={() => MainPatientId("emp-99")}
    >
      pick-employee
    </button>
  ),
}));

vi.mock("react-datepicker", () => ({
  default: ({ onChange, placeholderText }) => (
    <input
      placeholder={placeholderText}
      onChange={(e) => onChange(new Date("2026-06-15"))}
    />
  ),
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

const employeeState = (userType = "Employee") => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "user-1", userType, hoursFormat: "12" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("TimeOfRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLCanvasElement.prototype.getContext = vi.fn();
  });

  it("renders the request form with both request-type radios", () => {
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState(),
    });

    expect(screen.getByText("PTO REQUEST")).toBeInTheDocument();
    expect(screen.getByText("SICK TIME REQUEST")).toBeInTheDocument();
    expect(screen.getByText("Begin Date requested")).toBeInTheDocument();
    expect(screen.getByText("End Date requested")).toBeInTheDocument();
  });

  it("fetches the employee profile on mount", () => {
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState(),
    });

    // WHY: page loads the signed-in employee's profile via getData on mount.
    expect(h.getData).toHaveBeenCalledWith(
      expect.any(Function),
      "employee/getProfile",
    );
  });

  it("shows the read-only employee name field for non-admin users", () => {
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState("Employee"),
    });

    // Non-admin path renders the disabled name input, not the search component.
    expect(screen.getByText("Employee Name")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-component")).not.toBeInTheDocument();
    expect(h.fetchPaitentName).toHaveBeenCalled();
  });

  it("renders the employee search component for admin users", () => {
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState("Admin"),
    });

    // Admin path swaps the static field for the searchable EmployeeComponent.
    expect(screen.getByTestId("employee-component")).toBeInTheDocument();
    expect(screen.queryByText("Employee Name")).not.toBeInTheDocument();
  });

  it("disables SUBMIT until a signature exists", () => {
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState(),
    });

    // signature is empty initially -> submit button disabled.
    expect(screen.getByRole("button", { name: "SUBMIT" })).toBeDisabled();
  });

  it("opens the signature modal when SAVED AND SIGNED is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState(),
    });

    expect(screen.getByTestId("add-signature")).toHaveTextContent("false");
    await user.click(screen.getByRole("button", { name: /SAVED AND SIGNED/i }));
    expect(screen.getByTestId("add-signature")).toHaveTextContent("true");
  });

  it("toggles the request type radio to SICKTIME", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState(),
    });

    const sick = document.getElementById("SICKTIME");
    expect(sick).not.toBeChecked();
    await user.click(sick);
    expect(sick).toBeChecked();
  });

  it("submits via timeOffService.createRequest with the collected payload", async () => {
    renderWithProviders(<TimeOfRequest />, {
      preloadedState: employeeState(),
    });

    // Add a signer so payload mapping is exercised.
    fireEvent.click(screen.getByTestId("multi-employee"));

    fireEvent.submit(
      screen.getByRole("button", { name: "SUBMIT" }).closest("form"),
    );

    expect(h.createRequest).toHaveBeenCalledTimes(1);
    const [payload, options] = h.createRequest.mock.calls[0];
    expect(payload.requestType).toBe("PTO");
    expect(payload.signers).toEqual([
      expect.objectContaining({ signerId: "emp-1", name: "Signer One" }),
    ]);
    expect(options).toEqual(
      expect.objectContaining({ navigate: expect.any(Function) }),
    );
  });
});
